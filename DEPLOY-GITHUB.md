# 🚀 Guía de Deployment a GitHub

## 📋 Comandos para Subir el Proyecto

### 1️⃣ Inicializar Git (si no está inicializado)
```powershell
cd <PROJECT_ROOT>
git init
```

### 2️⃣ Añadir Remote (tu repositorio de GitHub)
```powershell
git remote add origin https://github.com/Carlosa2021/RWA_ChainX.git
```

### 3️⃣ Verificar archivos a subir
```powershell
git status
```

### 4️⃣ Añadir todos los archivos
```powershell
git add .
```

### 5️⃣ Commit con mensaje descriptivo
```powershell
git commit -m "🎉 Initial commit: ChainX® RWA Platform v1.0

✨ Features:
- ERC-3643 compliant security tokens
- KYC verification system with document upload
- Admin panel with investor management
- Investment flow with USDC + Chainlink oracle
- Dark/Light theme with Tailwind v4
- Responsive design with premium UI/UX
- 7 wallet connection methods (thirdweb v5)

🔧 Tech Stack:
- Next.js 15.5.4 + React 19 + TypeScript
- Solidity 0.8.20 + Hardhat + OpenZeppelin 5.4
- thirdweb SDK v5 + Polygon Mainnet
- Tailwind CSS v4 + Lucide Icons

📄 Pages:
- Dashboard with project cards
- Admin panel (KYC approval, analytics)
- KYC verification (ID + proof of address)
- Portfolio/Wallet management
- User profile & settings
- Withdrawal requests

🚀 Deployed to Polygon Mainnet"
```

### 6️⃣ Subir a GitHub
```powershell
git push -u origin main
```

**Si el branch es `master` en vez de `main`:**
```powershell
git push -u origin master
```

**O cambiar a `main`:**
```powershell
git branch -M main
git push -u origin main
```

---

## ⚠️ Si el Repositorio Ya Existe en GitHub

Si ya tienes contenido en GitHub y quieres sobreescribir:

```powershell
# Forzar push (¡CUIDADO! Esto sobrescribe todo)
git push -f origin main
```

---

## 🔄 Para Futuros Updates

Después del primer push, los siguientes cambios:

```powershell
# Ver cambios
git status

# Añadir archivos modificados
git add .

# Commit
git commit -m "feat: descripción del cambio"

# Push
git push
```

---

## 📝 Convenciones de Commit

Usa estos prefijos:

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato (no código)
- `refactor:` - Refactorización de código
- `test:` - Añadir tests
- `chore:` - Tareas de mantenimiento

**Ejemplos:**
```bash
git commit -m "feat: añadir página de retiros con historial"
git commit -m "fix: corregir error de hidratación en ProjectCard"
git commit -m "docs: actualizar README con screenshots"
git commit -m "style: aplicar dark mode a todas las páginas"
```

---

## 🔐 Archivos Excluidos (.gitignore)

Estos archivos NO se subirán (ya configurado):

- ✅ `node_modules/`
- ✅ `.next/`
- ✅ `.env` (variables secretas)
- ✅ `*.log`
- ✅ `.DS_Store`
- ✅ `artifacts/` (Hardhat)
- ✅ `cache/`

---

## 🎯 Checklist Final

Antes de subir, verifica:

- [ ] `.env` no está incluido en git
- [ ] `node_modules/` está en .gitignore
- [ ] README.md actualizado
- [ ] Todos los archivos compilados excluidos
- [ ] Commit message descriptivo
- [ ] Remote correcto configurado

---

## 🚀 Deploy a Vercel (Opcional)

Si quieres deployar el frontend:

```bash
npm i -g vercel
vercel
```

O conecta tu repo en [vercel.com](https://vercel.com)

---

**¡Listo para GitHub! 🎉**
