#!/usr/bin/env node

/**
 * Script para gerar rotas e documentação Swagger usando tsoa
 * Execute este script antes de iniciar a aplicação
 */

const { execSync } = require('child_process');

console.log('🔧 Gerando especificação Swagger...');
execSync('npm run tsoa:spec', { stdio: 'inherit' });

console.log('🔧 Gerando rotas Express...');
execSync('npm run tsoa:routes', { stdio: 'inherit' });

console.log('✅ Rotas e documentação geradas com sucesso!');
