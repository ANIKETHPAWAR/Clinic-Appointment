const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Testing build process...');
console.log('='.repeat(50));

try {
  // Change to backend directory
  process.chdir(path.join(__dirname, 'backend'));
  
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if dist/main.js exists
  const mainJsPath = path.join(__dirname, 'backend', 'dist', 'main.js');
  if (fs.existsSync(mainJsPath)) {
    console.log('✅ Build successful! dist/main.js exists');
    console.log('📁 dist directory contents:');
    const distPath = path.join(__dirname, 'backend', 'dist');
    const files = fs.readdirSync(distPath);
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
  } else {
    console.log('❌ Build failed! dist/main.js not found');
    process.exit(1);
  }
  
  console.log('🎉 Build test completed successfully!');
  
} catch (error) {
  console.error('❌ Build test failed:', error.message);
  process.exit(1);
} 