# 🔐 API KYC - ChainX® RWA Platform

Backend API para gestión de KYC (Know Your Customer)

## 🚀 Instalación

```bash
cd api
npm install
```

## ▶️ Ejecutar

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

## 📡 Endpoints

### Health Check
```
GET /health
```

### Usuario: Subir documentos KYC
```
POST /kyc/upload
Content-Type: multipart/form-data

Body:
- walletAddress: string (required)
- documentType: string (dni|passport|driver_license)
- documentFront: file (required)
- documentBack: file (optional)
- proofOfAddress: file (required)
```

### Usuario: Consultar estado
```
GET /kyc/status/:walletAddress
```

### Admin: Listar pendientes
```
GET /kyc/pending
Headers:
- x-admin-address: 0xYourAdminAddress
```

### Admin: Listar todas
```
GET /kyc/all
Headers:
- x-admin-address: 0xYourAdminAddress
```

### Admin: Ver documentos
```
GET /kyc/documents/:walletAddress
Headers:
- x-admin-address: 0xYourAdminAddress
```

### Admin: Aprobar KYC
```
POST /kyc/approve/:walletAddress
Headers:
- x-admin-address: 0xYourAdminAddress
```

### Admin: Rechazar KYC
```
POST /kyc/reject/:walletAddress
Headers:
- x-admin-address: 0xYourAdminAddress
Body:
- reason: string (optional)
```

## 🗄️ Base de Datos

SQLite con tabla:

```sql
kyc_submissions (
  id, 
  wallet_address UNIQUE, 
  document_front, 
  document_back, 
  proof_of_address, 
  document_type,
  status (pending|approved|rejected),
  submitted_at,
  reviewed_at,
  reviewed_by,
  rejection_reason
)
```

## 📁 Estructura

```
api/
├── server.js          # Servidor Express principal
├── database.js        # Configuración SQLite
├── package.json       # Dependencias
├── .env              # Variables de entorno
├── kyc.db            # Base de datos SQLite (generado)
└── uploads/          # Documentos subidos (generado)
    └── 0xWalletAddress/
        ├── documentFront_timestamp.jpg
        ├── documentBack_timestamp.jpg
        └── proofOfAddress_timestamp.pdf
```

## 🔒 Seguridad

- Solo admin puede aprobar/rechazar
- Validación de admin por wallet address
- Archivos limitados a 10MB
- Solo JPG, PNG, PDF permitidos
- Documentos guardados por wallet address

## 🌐 CORS

CORS habilitado para todos los orígenes en desarrollo.
Para producción, configurar en `server.js`:

```javascript
app.use(cors({
  origin: 'https://tu-dominio.com'
}));
```
