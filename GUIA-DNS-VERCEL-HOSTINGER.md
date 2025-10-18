# 🌐 Guía Completa: Configurar dapp.chainx.es en Vercel con DNS de Hostinger

## 📋 Registros DNS Necesarios

### ✅ Configuración Correcta:

| Tipo | Nombre | Contenido | TTL | Acción |
|------|--------|-----------|-----|--------|
| **CNAME** | `dapp` | `5ba7697fe81bcc85.vercel-dns-016.com` | 60 | ✅ Ya existe |
| **TXT** | `_vercel.chainx.es` | `vc-domain-verify=dapp.chainx.es,709c03dc19bbdb45cdd7` | 60 | ⚠️ **CREAR NUEVO** |

### ❌ Registros a NO Tocar (son para email y otros servicios):

- MX records (mx1.hostinger.es, mx2.hostinger.es)
- CNAME autodiscover
- CNAME autoconfig
- CAA records
- TXT SPF record

---

## 🛠️ Pasos en Hostinger:

### 1. **Editar el CNAME `dapp` (ya existe)**

- ✅ **Ya lo tienes correcto**, solo reduce el TTL:
- Tipo: `CNAME`
- Nombre: `dapp`
- Objetivo: `5ba7697fe81bcc85.vercel-dns-016.com`
- TTL: Cambiar a **60** (para propagación rápida)

### 2. **Agregar NUEVO Registro TXT para Verificación**

⚠️ **CUIDADO**: No edites el TXT existente `_vercel`, crea uno NUEVO.

**Opción A**: Si Hostinger permite subdominios en TXT:
```
Tipo: TXT
Nombre: _vercel.chainx.es
Contenido: vc-domain-verify=dapp.chainx.es,709c03dc19bbdb45cdd7
TTL: 60
```

**Opción B**: Si Hostinger solo acepta nombres cortos:
```
Tipo: TXT
Nombre: _vercel
Contenido: vc-domain-verify=dapp.chainx.es,709c03dc19bbdb45cdd7
TTL: 60
```

**Opción C**: Si nada funciona, prueba SIN el guion bajo:
```
Tipo: TXT
Nombre: vercel
Contenido: vc-domain-verify=dapp.chainx.es,709c03dc19bbdb45cdd7
TTL: 60
```

### 3. **Guardar y Esperar**

- Click **"Actualizar"** o **"Guardar"**
- Espera **2-5 minutos** (con TTL de 60 segundos)

---

## 🔍 Verificación (PowerShell):

### Verifica el CNAME:
```powershell
nslookup -type=CNAME dapp.chainx.es
```

**Resultado esperado:**
```
dapp.chainx.es
canonical name = 5ba7697fe81bcc85.vercel-dns-016.com
```

### Verifica el TXT (prueba las 3 opciones):
```powershell
nslookup -type=TXT _vercel.chainx.es
nslookup -type=TXT vercel.chainx.es
nslookup -type=TXT chainx.es
```

**Resultado esperado** (en alguna de las 3):
```
text = "vc-domain-verify=dapp.chainx.es,709c03dc19bbdb45cdd7"
```

---

## 🚨 Si NADA Funciona: Plan B

### Opción: Usar Registro A en lugar de CNAME

Algunos proveedores DNS tienen problemas con CNAME. Prueba esto:

1. **BORRAR** el CNAME `dapp`
2. **AGREGAR** registro A:
   ```
   Tipo: A
   Nombre: dapp
   Contenido: 76.76.21.21
   TTL: 60
   ```

76.76.21.21 es la IP Anycast de Vercel que funciona globalmente.

---

## ✅ Verificación en Vercel:

1. Ve a: https://vercel.com/carlosa2021s-projects/rwa-inmo-token/settings/domains
2. Click **"Refresh"** junto a `dapp.chainx.es`
3. Debería cambiar de ⚠️ "Verification Needed" a ✅ "Valid Configuration"

---

## 🎯 Checklist Final:

- [ ] CNAME `dapp` apunta a `5ba7697fe81bcc85.vercel-dns-016.com`
- [ ] TTL reducido a 60 segundos
- [ ] TXT `_vercel.chainx.es` con el código de verificación
- [ ] Esperado 5 minutos
- [ ] Ejecutado `nslookup` y confirma que resuelve
- [ ] Click "Refresh" en Vercel
- [ ] Dominio muestra ✅ "Valid Configuration"
- [ ] `https://dapp.chainx.es` carga la aplicación

---

## 📞 Si Sigue Sin Funcionar:

### Causa 1: Hostinger no soporta subdominios en TXT
**Solución**: Contacta soporte de Hostinger y pide que agreguen:
```
_vercel.chainx.es TXT "vc-domain-verify=dapp.chainx.es,709c03dc19bbdb45cdd7"
```

### Causa 2: El dominio está "locked" en otra cuenta Vercel
**Solución**: Ve a la otra cuenta y elimina el dominio, o contacta soporte de Vercel.

### Causa 3: CAA records bloqueando Let's Encrypt
**Solución**: Verifica que tengas este CAA record:
```
CAA @ 0 issue "letsencrypt.org"
```
✅ Ya lo tienes en tu lista actual.

---

## 🎬 Después de que Funcione:

1. **Aumenta el TTL** de vuelta a 14400 (4 horas)
2. **Prueba el dominio** en incógnito: https://dapp.chainx.es
3. **Verifica SSL**: Debe mostrar 🔒 en el navegador
4. **Actualiza links** en tu proyecto para usar el dominio real

---

## 📊 Estado Actual (12 Oct 2025):

- ✅ Proyecto desplegado en Vercel: `rwa-inmo-token.vercel.app`
- ⚠️ Dominio personalizado: `dapp.chainx.es` (pending verification)
- ✅ DNS CNAME configurado en Hostinger
- ❌ TXT verification record no detectado por Vercel
- 🎯 Siguiente paso: Agregar TXT `_vercel.chainx.es`

---

## 💡 Tips:

- Usa **modo incógnito** para probar (evita caché)
- **No uses VPN** al probar (puede causar DNS cache)
- **Espera 5 minutos** entre cambios DNS
- **Verifica con `nslookup`** antes de probar en navegador
- Si funciona en `nslookup` pero no en navegador, limpia DNS cache:
  ```powershell
  ipconfig /flushdns
  ```
