const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up SphereDev Network...');

// Создаем структуру папок
const folders = [
    'server/routes',
    'server/utils', 
    'client/src/components',
    'client/public',
    'virtual-projects'
];

folders.forEach(folder => {
    fs.mkdirSync(path.join(__dirname, folder), { recursive: true });
    console.log(`✅ Created folder: ${folder}`);
});

console.log('📦 Installing dependencies...');
execSync('npm run install-all', { stdio: 'inherit' });

console.log('🎉 Setup complete! Run: npm run dev');