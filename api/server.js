require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS?.toLowerCase();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Crear carpeta de uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar multer para almacenar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const walletAddress = req.body.walletAddress || 'unknown';
    const userDir = path.join(uploadsDir, walletAddress);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}_${timestamp}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimeType || file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten archivos JPG, PNG o PDF'));
  }
});

// ==================== RUTAS ====================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API KYC funcionando correctamente' });
});

// Subir documentos KYC
app.post('/kyc/upload', upload.fields([
  { name: 'documentFront', maxCount: 1 },
  { name: 'documentBack', maxCount: 1 },
  { name: 'proofOfAddress', maxCount: 1 }
]), (req, res) => {
  try {
    const { walletAddress, documentType } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address es requerida' });
    }

    if (!req.files || !req.files.documentFront || !req.files.proofOfAddress) {
      return res.status(400).json({ error: 'Faltan documentos requeridos' });
    }

    const documentFrontPath = req.files.documentFront[0].filename;
    const documentBackPath = req.files.documentBack ? req.files.documentBack[0].filename : null;
    const proofOfAddressPath = req.files.proofOfAddress[0].filename;

    // Insertar o actualizar en la base de datos
    const submission = db.upsert({
      wallet_address: walletAddress.toLowerCase(),
      document_front: documentFrontPath,
      document_back: documentBackPath,
      proof_of_address: proofOfAddressPath,
      document_type: documentType || 'dni',
      status: 'pending',
      reviewed_at: null,
      reviewed_by: null,
      rejection_reason: null
    });

    res.json({
      success: true,
      message: 'Documentos subidos correctamente',
      status: 'pending',
      submissionId: submission.id
    });
  } catch (error) {
    console.error('Error al subir documentos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener estado del KYC
app.get('/kyc/status/:walletAddress', (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const submission = db.getByAddress(walletAddress);
    
    if (!submission) {
      return res.json({ 
        status: 'not_submitted',
        message: 'No hay solicitud de KYC'
      });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error al obtener estado:', error);
    res.status(500).json({ error: error.message });
  }
});

// Listar todas las solicitudes pendientes (solo admin)
app.get('/kyc/pending', (req, res) => {
  try {
    const adminAddress = req.headers['x-admin-address']?.toLowerCase();
    
    if (adminAddress !== ADMIN_ADDRESS) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const submissions = db.getAll({ status: 'pending' });
    res.json(submissions);
  } catch (error) {
    console.error('Error al listar pendientes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Listar TODAS las solicitudes (solo admin)
app.get('/kyc/all', (req, res) => {
  try {
    const adminAddress = req.headers['x-admin-address']?.toLowerCase();
    
    if (adminAddress !== ADMIN_ADDRESS) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const submissions = db.getAll();
    res.json(submissions);
  } catch (error) {
    console.error('Error al listar todas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener documentos de una solicitud (solo admin)
app.get('/kyc/documents/:walletAddress', (req, res) => {
  try {
    const adminAddress = req.headers['x-admin-address']?.toLowerCase();
    const { walletAddress } = req.params;
    
    if (adminAddress !== ADMIN_ADDRESS) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const submission = db.getByAddress(walletAddress);
    
    if (!submission) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Leer archivos y convertir a base64
    const userDir = path.join(uploadsDir, walletAddress);
    const documents = {
      documentFront: null,
      documentBack: null,
      proofOfAddress: null
    };

    if (submission.document_front) {
      const frontPath = path.join(userDir, submission.document_front);
      if (fs.existsSync(frontPath)) {
        documents.documentFront = `data:image/jpeg;base64,${fs.readFileSync(frontPath).toString('base64')}`;
      }
    }

    if (submission.document_back) {
      const backPath = path.join(userDir, submission.document_back);
      if (fs.existsSync(backPath)) {
        documents.documentBack = `data:image/jpeg;base64,${fs.readFileSync(backPath).toString('base64')}`;
      }
    }

    if (submission.proof_of_address) {
      const proofPath = path.join(userDir, submission.proof_of_address);
      if (fs.existsSync(proofPath)) {
        documents.proofOfAddress = `data:image/jpeg;base64,${fs.readFileSync(proofPath).toString('base64')}`;
      }
    }

    res.json(documents);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Aprobar KYC (solo admin)
app.post('/kyc/approve/:walletAddress', (req, res) => {
  try {
    const adminAddress = req.headers['x-admin-address']?.toLowerCase();
    const { walletAddress } = req.params;
    
    if (adminAddress !== ADMIN_ADDRESS) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const submission = db.updateStatus(walletAddress, 'approved', adminAddress);
    
    if (!submission) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json({
      success: true,
      message: 'KYC aprobado correctamente',
      walletAddress: walletAddress.toLowerCase()
    });
  } catch (error) {
    console.error('Error al aprobar KYC:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rechazar KYC (solo admin)
app.post('/kyc/reject/:walletAddress', (req, res) => {
  try {
    const adminAddress = req.headers['x-admin-address']?.toLowerCase();
    const { walletAddress } = req.params;
    const { reason } = req.body;
    
    if (adminAddress !== ADMIN_ADDRESS) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const submission = db.updateStatus(
      walletAddress, 
      'rejected', 
      adminAddress, 
      reason || 'Sin razón especificada'
    );
    
    if (!submission) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json({
      success: true,
      message: 'KYC rechazado',
      walletAddress: walletAddress.toLowerCase(),
      reason
    });
  } catch (error) {
    console.error('Error al rechazar KYC:', error);
    res.status(500).json({ error: error.message });
  }
});

// Manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: error.message });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║   🚀 API KYC RWA InmoToken                    ║
  ║   📍 http://localhost:${PORT}                    ║
  ║   ✅ Database: SQLite (kyc.db)                ║
  ║   👤 Admin: ${ADMIN_ADDRESS?.slice(0, 10)}...  ║
  ╚═══════════════════════════════════════════════╝
  `);
});

module.exports = app;
