# 📸 Guía para Agregar Fotos Reales del Inmueble

## 📁 Estructura de Carpetas

```
public/
└── images/
    └── projects/
        └── alzira-reyes-catolicos/
            ├── fachada-exterior.jpg
            ├── salon-principal.jpg
            ├── cocina-actual.jpg
            ├── dormitorio-1.jpg
            ├── dormitorio-2.jpg
            ├── bano-principal.jpg
            ├── bano-secundario.jpg
            ├── patio-cubierto.jpg
            ├── terraza-solarium.jpg
            ├── plano-distribucion.jpg
            ├── plano-reforma.jpg
            ├── render-salon-futuro.jpg
            ├── render-cocina-futuro.jpg
            ├── calle-reyes-catolicos.jpg
            └── centro-alzira.jpg
```

## 🖼️ Tipos de Imágenes Recomendadas

### **Fotos Actuales del Inmueble:**
- **fachada-exterior.jpg** - Vista frontal del edificio
- **salon-principal.jpg** - Salón principal con ventanas
- **cocina-actual.jpg** - Cocina en estado actual
- **dormitorio-1.jpg** - Dormitorio principal 
- **dormitorio-2.jpg** - Segundo dormitorio
- **bano-principal.jpg** - Baño principal
- **bano-secundario.jpg** - Segundo baño
- **patio-cubierto.jpg** - Patio cubierto central
- **terraza-solarium.jpg** - Terraza/solarium

### **Planos y Renders de Renovación:**
- **plano-distribucion.jpg** - Plano actual de distribución
- **plano-reforma.jpg** - Plano de reforma propuesta
- **render-salon-futuro.jpg** - Render del salón renovado
- **render-cocina-futuro.jpg** - Render de la cocina renovada

### **Fotos de Ubicación:**
- **calle-reyes-catolicos.jpg** - Vista de la calle
- **centro-alzira.jpg** - Centro histórico de Alzira

## 📐 Especificaciones Técnicas

- **Formato:** JPG o PNG
- **Resolución mínima:** 800x600px
- **Resolución recomendada:** 1200x800px
- **Tamaño máximo:** 2MB por imagen
- **Aspecto:** Preferiblemente horizontal (4:3 o 16:9)

## 🔄 Cómo Actualizar las Imágenes

1. **Copia tus fotos** en la carpeta `public/images/projects/alzira-reyes-catolicos/`
2. **Usa los nombres exactos** listados arriba
3. **Actualiza el código** en `src/hooks/useProjects.ts` (línea ~70-80)
4. **Recarga la página** - las imágenes aparecerán automáticamente

## 🛠️ Código a Actualizar

En `src/hooks/useProjects.ts`, cambia esta sección:

```javascript
images: [
  "/images/projects/alzira-reyes-catolicos/fachada-exterior.jpg",
  "/images/projects/alzira-reyes-catolicos/salon-principal.jpg", 
  "/images/projects/alzira-reyes-catolicos/cocina-actual.jpg",
  "/images/projects/alzira-reyes-catolicos/dormitorio-1.jpg",
  "/images/projects/alzira-reyes-catolicos/bano-principal.jpg",
  "/images/projects/alzira-reyes-catolicos/patio-cubierto.jpg",
  "/images/projects/alzira-reyes-catolicos/plano-distribucion.jpg",
  "/images/projects/alzira-reyes-catolicos/render-salon-futuro.jpg"
]
```

¡Listo! Tus fotos reales aparecerán en la galería. 📸✨
