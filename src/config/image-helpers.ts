// Helper para gestionar imágenes de proyectos
import { ALZIRA_PROJECT_IMAGES, ALZIRA_TEMP_IMAGES } from './project-images';

/**
 * Verifica si una imagen local existe y devuelve la URL apropiada
 */
export function getProjectImages(projectName: string): string[] {
  switch (projectName) {
    case "Inmueble Reyes Católicos Alzira":
      // Por ahora usar imágenes temporales hasta que se suban las reales
      // TODO: Cambiar a ALZIRA_PROJECT_IMAGES.current cuando estén las fotos reales
      return ALZIRA_TEMP_IMAGES;
    
    default:
      return ["/api/placeholder/400/300"];
  }
}

/**
 * Combina fotos actuales, planos y ubicación para un proyecto completo
 */
export function getAllProjectImages(projectName: string): string[] {
  switch (projectName) {
    case "Inmueble Reyes Católicos Alzira":
      return [
        ...ALZIRA_PROJECT_IMAGES.current,
        ...ALZIRA_PROJECT_IMAGES.plans,
        ...ALZIRA_PROJECT_IMAGES.location
      ];
    
    default:
      return ["/api/placeholder/400/300"];
  }
}

/**
 * Para usar cuando tengas las fotos reales:
 * 1. Sube las fotos a public/images/projects/alzira-reyes-catolicos/
 * 2. Cambia ALZIRA_TEMP_IMAGES por ALZIRA_PROJECT_IMAGES.current en getProjectImages()
 * 3. ¡Listo! Las fotos reales aparecerán automáticamente
 */