const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'kyc.json');

// Inicializar archivo JSON si no existe
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ submissions: [] }, null, 2));
}

// Leer base de datos
function readDB() {
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

// Escribir base de datos
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// API simplificada
const db = {
  // Insertar o actualizar submission
  upsert: (submission) => {
    const data = readDB();
    const index = data.submissions.findIndex(
      s => s.wallet_address.toLowerCase() === submission.wallet_address.toLowerCase()
    );
    
    if (index >= 0) {
      data.submissions[index] = { ...data.submissions[index], ...submission };
    } else {
      submission.id = data.submissions.length + 1;
      submission.submitted_at = new Date().toISOString();
      data.submissions.push(submission);
    }
    
    writeDB(data);
    return submission;
  },

  // Obtener por wallet address
  getByAddress: (walletAddress) => {
    const data = readDB();
    return data.submissions.find(
      s => s.wallet_address.toLowerCase() === walletAddress.toLowerCase()
    );
  },

  // Obtener todas con filtro
  getAll: (filter = {}) => {
    const data = readDB();
    let results = data.submissions;
    
    if (filter.status) {
      results = results.filter(s => s.status === filter.status);
    }
    
    return results.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
  },

  // Actualizar estado
  updateStatus: (walletAddress, status, reviewedBy, reason = null) => {
    const data = readDB();
    const submission = data.submissions.find(
      s => s.wallet_address.toLowerCase() === walletAddress.toLowerCase()
    );
    
    if (!submission) return null;
    
    submission.status = status;
    submission.reviewed_at = new Date().toISOString();
    submission.reviewed_by = reviewedBy;
    if (reason) submission.rejection_reason = reason;
    
    writeDB(data);
    return submission;
  }
};

console.log('✅ Database initialized successfully (JSON)');

module.exports = db;
