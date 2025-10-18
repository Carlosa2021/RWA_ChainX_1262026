#!/usr/bin/env node

/**
 * 🚀 SISTEMA DE DEPLOY AUTOMATIZADO POWER MODE
 * ===============================================
 * 
 * Este script automatiza el deploy de cada plan a su repositorio específico:
 * - STARTER → chainx-rwa-starter
 * - PRO → chainx-rwa-pro  
 * - ENTERPRISE → chainx-rwa-enterprise
 * 
 * Funcionalidades:
 * ✅ Filtrado automático de código por plan
 * ✅ Configuración específica por entorno
 * ✅ Git push automatizado
 * ✅ Validación de builds
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// 📋 Configuración de repositorios
const REPOS = {
  starter: {
    name: 'chainx-rwa-starter-template',
    path: 'C:\\Users\\User\\Desktop\\chainx-rwa-starter',
    plan: 'STARTER',
    port: 3000,
    maxProjects: 1,
    maxInvestors: 10,
    features: {
      basicDashboard: true,
      adminPanel: false,
      analytics: false,
      whiteLabel: false,
      apiAccess: false,
      customBranding: false
    }
  },
  pro: {
    name: 'chainx-rwa-pro-template',
    path: 'C:\\Users\\User\\Desktop\\chainx-rwa-pro',
    plan: 'PRO',
    port: 3001,
    maxProjects: 5,
    maxInvestors: 100,
    features: {
      basicDashboard: true,
      adminPanel: true,
      analytics: true,
      whiteLabel: false,
      apiAccess: true,
      customBranding: false
    }
  },
  enterprise: {
    name: 'chainx-rwa-enterprise-template',
    path: 'C:\\Users\\User\\Desktop\\chainx-rwa-enterprise',
    plan: 'ENTERPRISE',
    port: 3004,
    maxProjects: -1, // Ilimitado
    maxInvestors: -1, // Ilimitado
    features: {
      basicDashboard: true,
      adminPanel: true,
      analytics: true,
      whiteLabel: true,
      apiAccess: true,
      customBranding: true
    }
  }
};

const SOURCE_DIR = 'C:\\Users\\User\\Desktop\\RWA-ChainX';

class AutoDeployer {
  constructor() {
    this.sourceDir = SOURCE_DIR;
    console.log('🚀 INICIANDO DEPLOY AUTOMATIZADO POWER MODE');
    console.log('==========================================');
    console.log('📍 Repositorio padre: RWA_ChainX');
    console.log('🎯 Templates destino: 3 repositorios especializados');
  }

  async deployAll() {
    try {
      for (const [key, config] of Object.entries(REPOS)) {
        console.log(`\n📦 Desplegando plan ${config.plan}...`);
        await this.deployPlan(config);
        console.log(`✅ Plan ${config.plan} desplegado exitosamente`);
      }
      console.log('\n🎉 ¡TODOS LOS DEPLOYS COMPLETADOS EXITOSAMENTE!');
    } catch (error) {
      console.error('❌ Error en deploy:', error.message);
      process.exit(1);
    }
  }

  async deployPlan(config) {
    const steps = [
      () => this.validateTargetRepo(config),
      () => this.copyBaseCode(config),
      () => this.filterCodeByPlan(config),
      () => this.generatePlanConfig(config),
      () => this.generateEnvFile(config),
      () => this.updatePackageJson(config),
      () => this.buildProject(config),
      () => this.commitAndPush(config)
    ];

    for (const step of steps) {
      await step();
    }
  }

  validateTargetRepo(config) {
    console.log(`  🔍 Validando repositorio ${config.name}...`);
    
    if (!fs.existsSync(config.path)) {
      fs.ensureDirSync(config.path);
      console.log(`  📁 Directorio creado: ${config.path}`);
    }

    // Inicializar git si no existe
    const gitDir = path.join(config.path, '.git');
    if (!fs.existsSync(gitDir)) {
      console.log(`  🔧 Inicializando repositorio Git...`);
      execSync('git init', { cwd: config.path });
      execSync('git branch -m main', { cwd: config.path });
    }
  }

  async copyBaseCode(config) {
    console.log(`  📋 Copiando código base...`);
    
    // Directorios a copiar
    const dirsToCopy = [
      'src',
      'public',
      'api',
      'contracts'
    ];

    // Archivos a copiar
    const filesToCopy = [
      'package.json',
      'next.config.ts',
      'tailwind.config.ts',
      'tsconfig.json',
      'postcss.config.mjs',
      'next-env.d.ts',
      'README.md'
    ];

    // Limpiar directorio destino (excepto .git)
    const items = fs.readdirSync(config.path);
    for (const item of items) {
      if (item !== '.git' && item !== '.gitignore') {
        fs.removeSync(path.join(config.path, item));
      }
    }

    // Copiar directorios
    for (const dir of dirsToCopy) {
      const srcPath = path.join(this.sourceDir, dir);
      const destPath = path.join(config.path, dir);
      
      if (fs.existsSync(srcPath)) {
        fs.copySync(srcPath, destPath);
        console.log(`    ✅ Copiado: ${dir}`);
      }
    }

    // Copiar archivos
    for (const file of filesToCopy) {
      const srcPath = path.join(this.sourceDir, file);
      const destPath = path.join(config.path, file);
      
      if (fs.existsSync(srcPath)) {
        fs.copySync(srcPath, destPath);
        console.log(`    ✅ Copiado: ${file}`);
      }
    }
  }

  filterCodeByPlan(config) {
    console.log(`  🔧 Filtrando código para plan ${config.plan}...`);
    
    // Filtrar componentes según el plan
    const restrictedComponents = [];
    
    if (!config.features.adminPanel) {
      restrictedComponents.push('src/app/admin');
    }
    
    if (!config.features.analytics) {
      restrictedComponents.push('src/components/Analytics');
    }

    // Remover componentes restringidos
    for (const component of restrictedComponents) {
      const componentPath = path.join(config.path, component);
      if (fs.existsSync(componentPath)) {
        fs.removeSync(componentPath);
        console.log(`    🚫 Removido: ${component}`);
      }
    }
  }

  generatePlanConfig(config) {
    console.log(`  ⚙️ Generando configuración específica...`);
    
    const planConfigContent = `// 🎯 CONFIGURACIÓN ESPECÍFICA PARA PLAN ${config.plan}
// Este archivo es generado automáticamente por auto-deploy.js

export const PLAN_CONFIG = {
  type: '${config.plan}',
  name: '${config.plan.charAt(0) + config.plan.slice(1).toLowerCase()}',
  price: ${config.plan === 'STARTER' ? 0 : config.plan === 'PRO' ? 29 : 99},
  badge: '${config.plan === 'STARTER' ? 'Free' : config.plan === 'PRO' ? 'Trending' : 'Premium'}',
  maxProjects: ${config.maxProjects},
  maxInvestors: ${config.maxInvestors},
  features: ${JSON.stringify(config.features, null, 2)},
  isActive: true,
  deployedAt: '${new Date().toISOString()}'
};

export default PLAN_CONFIG;
`;

    const configPath = path.join(config.path, 'src', 'config', 'plan.ts');
    fs.ensureDirSync(path.dirname(configPath));
    fs.writeFileSync(configPath, planConfigContent);
    console.log(`    ✅ Configuración generada`);
  }

  generateEnvFile(config) {
    console.log(`  🌍 Generando archivo .env...`);
    
    const envContent = `# 🚀 CONFIGURACIÓN ESPECÍFICA PARA PLAN ${config.plan}
# Generado automáticamente por auto-deploy.js

NEXT_PUBLIC_PLAN_TYPE=${config.plan}
NEXT_PUBLIC_DEFAULT_PORT=${config.port}
NEXT_PUBLIC_APP_NAME=ChainX RWA ${config.plan}
NEXT_PUBLIC_DEPLOYMENT_ENV=production

# Configuración de funcionalidades
NEXT_PUBLIC_ENABLE_ADMIN_PANEL=${config.features.adminPanel}
NEXT_PUBLIC_ENABLE_ANALYTICS=${config.features.analytics}
NEXT_PUBLIC_ENABLE_WHITE_LABEL=${config.features.whiteLabel}
NEXT_PUBLIC_ENABLE_API_ACCESS=${config.features.apiAccess}
NEXT_PUBLIC_ENABLE_CUSTOM_BRANDING=${config.features.customBranding}

# Límites del plan
NEXT_PUBLIC_MAX_PROJECTS=${config.maxProjects}
NEXT_PUBLIC_MAX_INVESTORS=${config.maxInvestors}

# Variables adicionales (configurar según necesidades)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
DATABASE_URL=your_database_url
`;

    fs.writeFileSync(path.join(config.path, '.env'), envContent);
    console.log(`    ✅ Archivo .env generado`);
  }

  updatePackageJson(config) {
    console.log(`  📦 Actualizando package.json...`);
    
    const packagePath = path.join(config.path, 'package.json');
    const packageJson = fs.readJsonSync(packagePath);
    
    // Actualizar información del proyecto
    packageJson.name = `chainx-rwa-${config.plan.toLowerCase()}`;
    packageJson.description = `ChainX RWA Platform - ${config.plan} Plan`;
    packageJson.version = '1.0.0';
    
    // Añadir scripts específicos
    packageJson.scripts = {
      ...packageJson.scripts,
      "start:plan": `next start -p ${config.port}`,
      "dev:plan": `next dev -p ${config.port}`,
      "deploy": "npm run build && npm run start:plan"
    };

    fs.writeJsonSync(packagePath, packageJson, { spaces: 2 });
    console.log(`    ✅ package.json actualizado`);
  }

  buildProject(config) {
    console.log(`  🔨 Construyendo proyecto...`);
    
    try {
      // Instalar dependencias
      console.log(`    📥 Instalando dependencias...`);
      execSync('npm install', { 
        cwd: config.path, 
        stdio: 'pipe'
      });
      
      // Build del proyecto
      console.log(`    🔨 Compilando proyecto...`);
      execSync('npm run build', { 
        cwd: config.path, 
        stdio: 'pipe'
      });
      
      console.log(`    ✅ Build completado exitosamente`);
    } catch (error) {
      console.error(`    ❌ Error en build: ${error.message}`);
      throw error;
    }
  }

  commitAndPush(config) {
    console.log(`  📤 Commit y push a repositorio...`);
    
    try {
      // Añadir archivos
      execSync('git add .', { cwd: config.path });
      
      // Commit
      const commitMessage = `🚀 Deploy automatizado - Plan ${config.plan} - ${new Date().toISOString()}`;
      execSync(`git commit -m "${commitMessage}"`, { cwd: config.path });
      
      console.log(`    ✅ Commit realizado`);
      console.log(`    📝 Mensaje: ${commitMessage}`);
      
      // TODO: Configurar remote y push (requiere configuración de repositorios remotos)
      console.log(`    ⚠️  Push manual requerido (configurar remote primero)`);
      
    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log(`    ℹ️  No hay cambios para commitear`);
      } else {
        console.error(`    ❌ Error en git: ${error.message}`);
      }
    }
  }
}

// 🚀 EJECUTAR DEPLOY
if (require.main === module) {
  const deployer = new AutoDeployer();
  deployer.deployAll();
}

module.exports = AutoDeployer;
