/**
 * Sistema de logging controlado para ChainX RWA Platform
 * 
 * En producción: Todos los logs están deshabilitados
 * En desarrollo: Activa con NEXT_PUBLIC_DEBUG_MODE=true
 * 
 * Uso:
 * import { logger } from '@/lib/logger';
 * logger.info('Mensaje');
 * logger.warn('Advertencia');
 * logger.error('Error'); // Siempre se muestra
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

// Solo mostrar logs en desarrollo Y con debug activado
const SHOULD_LOG = !IS_PRODUCTION && DEBUG_MODE;

export const logger = {
  log: (...args: unknown[]) => {
    if (SHOULD_LOG) console.log(...args);
  },
  
  info: (...args: unknown[]) => {
    if (SHOULD_LOG) console.log(...args);
  },
  
  warn: (...args: unknown[]) => {
    if (SHOULD_LOG) console.warn(...args);
  },
  
  // Errores críticos SIEMPRE se muestran (para debugging de producción)
  error: (...args: unknown[]) => {
    console.error(...args);
  },
  
  // Logging de seguridad sensible (NUNCA en producción)
  security: (...args: unknown[]) => {
    if (!IS_PRODUCTION && DEBUG_MODE) {
      console.log('🔐 [SECURITY]', ...args);
    }
  }
};

// Helper para desarrollo
if (SHOULD_LOG) {
  console.log('🐛 Debug mode enabled');
}
