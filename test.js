const fs = require('fs');
const path = require('path');
const http = require('http');

// Test cơ bản kiểm tra file HTML
function testHTMLExists() {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    if (fs.existsSync(htmlPath)) {
        console.log('✅ HTML file exists');
        return true;
    } else {
        console.log('❌ HTML file not found');
        return false;
    }
}

function testHTMLContent() {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    const checks = [
        { test: content.includes('Trang Web Đầu Tiên'), name: 'Title check' },
        { test: content.includes('CI/CD'), name: 'CI/CD content check' },
        { test: content.includes('Docker'), name: 'Docker content check' },
        { test: content.includes('<!DOCTYPE html>'), name: 'HTML structure check' },
        { test: content.includes('</html>'), name: 'HTML closing tag check' }
    ];
    
    let passed = 0;
    checks.forEach(check => {
        if (check.test) {
            console.log(`✅ ${check.name}`);
            passed++;
        } else {
            console.log(`❌ ${check.name}`);
        }
    });
    
    return passed === checks.length;
}

function testDockerfile() {
    const dockerfilePath = path.join(__dirname, '..', 'Dockerfile');
    if (fs.existsSync(dockerfilePath)) {
        const content = fs.readFileSync(dockerfilePath, 'utf8');
        if (content.includes('FROM nginx') && content.includes('COPY index.html')) {
            console.log('✅ Dockerfile is valid');
            return true;
        }
    }
    console.log('❌ Dockerfile is invalid');
    return false;
}

function testDockerCompose() {
    const composePath = path.join(__dirname, '..', 'docker-compose.yml');
    if (fs.existsSync(composePath)) {
        const content = fs.readFileSync(composePath, 'utf8');
        if (content.includes('webapp') && content.includes('nginx')) {
            console.log('✅ Docker Compose file is valid');
            return true;
        }
    }
    console.log('❌ Docker Compose file is invalid');
    return false;
}

// Chạy tests
console.log('🧪 Running automated tests...');
console.log('================================');

const tests = [
    testHTMLExists,
    testHTMLContent,
    testDockerfile,
    testDockerCompose
];

let passedTests = 0;
tests.forEach((test, index) => {
    console.log(`\n📋 Test ${index + 1}:`);
    if (test()) {
        passedTests++;
    }
});

console.log('\n================================');
console.log(`📊 Results: ${passedTests}/${tests.length} tests passed`);

if (passedTests === tests.length) {
    console.log('🎉 All tests passed!');
    process.exit(0);
} else {
    console.log('❌ Some tests failed!');
    process.exit(1);
}
