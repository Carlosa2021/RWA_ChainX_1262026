# ChainX RWA Multi-Tier Repository Structure

Este directorio contiene herramientas para generar y gestionar múltiples repositorios basados en planes de suscripción.

## 📋 Estructura de Planes

### 🟢 STARTER (€49/mes)
- **Límites**: 1 propiedad, 50 inversores, 1K tokens
- **Funciones**: Solo funcionalidades básicas
- **Personalización**: Sin branding personalizado
- **Target**: Testing y proyectos pequeños

### 🟡 PRO (€499/mes)
- **Límites**: 10 propiedades, 1K inversores, 10K tokens  
- **Funciones**: AI, Pay, Bridge (sin Vault)
- **Personalización**: Branding parcial
- **Target**: Empresas en crecimiento

### 🔵 ENTERPRISE (€4,999/mes)
- **Límites**: Ilimitado
- **Funciones**: Stack completo incluyendo Vault
- **Personalización**: White-label completo
- **Target**: Corporaciones grandes

## 🛠️ Herramientas

### Templates de Configuración
- `templates/.env.starter` - Configuración plan Starter
- `templates/.env.pro` - Configuración plan Pro  
- `templates/.env.enterprise` - Configuración plan Enterprise

### Script de Generación
- `generate-repos.sh` - Script automatizado para crear repositorios

## 🚀 Uso del Script

### Generar todos los repositorios
```bash
./deployment/generate-repos.sh all
```

### Generar repositorio específico
```bash
./deployment/generate-repos.sh starter
./deployment/generate-repos.sh pro
./deployment/generate-repos.sh enterprise
```

### Generar repositorio para cliente específico
```bash
./deployment/generate-repos.sh client pro "Acme Corp" acme_001
```

## 📁 Repositorios Generados

Cada plan genera un repositorio independiente:

```
../chainx-rwa-starter/     # Repositorio plan Starter
../chainx-rwa-pro/         # Repositorio plan Pro
../chainx-rwa-enterprise/  # Repositorio plan Enterprise
```

### Repositorios por Cliente
```
../chainx-rwa-pro-acme_001/      # Cliente específico Pro
../chainx-rwa-enterprise-corp_002/ # Cliente específico Enterprise
```

## 🔑 Sistema de Licencias

Cada repositorio incluye:
- **License Key único** por cliente
- **Configuración específica** del plan
- **Limitaciones automáticas** por funcionalidad
- **Branding personalizado** (según plan)

### Formato de License Key
```
PLAN_CLIENTID_HASH
Ejemplo: PRO_CLIENT001_A1B2C3D4
```

## 🌐 Deployment Automático

### Vercel
1. Conectar repositorio a Vercel
2. Variables de entorno preconfiguradas
3. Deploy automático en push a main

### Variables importantes
```bash
NEXT_PUBLIC_PLAN=PRO
NEXT_PUBLIC_LICENSE_KEY=PRO_CLIENT001_HASH
NEXT_PUBLIC_CLIENT_NAME="Client Name"
```

## 📊 Monitoreo y Analytics

### Por Plan
- **Starter**: Analytics básicos
- **Pro**: Analytics avanzados + reportes
- **Enterprise**: Analytics completos + predictivos

### Métricas de Uso
- Número de propiedades activas
- Inversores registrados
- Volumen de transacciones
- Uso de funcionalidades premium

## 🔐 Seguridad por Plan

### Starter
- Autenticación básica
- Testnet únicamente

### Pro  
- 2FA habilitado
- Whitelist de IPs
- Audit logs

### Enterprise
- Seguridad máxima
- Compliance SOC2/GDPR
- Encriptación at-rest
- Monitoreo avanzado

## 🎯 Próximos Pasos

1. **Ejecutar script** para generar repositorios base
2. **Configurar GitHub** con repositorios privados
3. **Conectar Vercel** para deploy automático
4. **Implementar sistema de pagos** (Stripe)
5. **Dashboard de gestión** de clientes

## 📞 Soporte por Plan

### Starter
- 📧 Email (48h respuesta)
- 📚 Documentación básica

### Pro
- 📧 Email prioritario (24h)
- 💬 Chat support
- 📚 Documentación completa

### Enterprise
- 📞 Manager dedicado
- 💬 Slack channel
- 🛠️ Desarrollo personalizado
- 📚 Documentación white-label

---

*Este sistema permite escalar de 1 a 1000+ clientes de forma automática y eficiente.*