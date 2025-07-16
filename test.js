const fs = require('fs');
const path = require('path');

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
    
    if (content.includes('Trang Web Đầu Tiên')) {
        console.log('✅ HTML content is correct');
        return true;
    } else {
        console.log('❌ HTML content is invalid');
        return false;
    }
}

// Chạy tests
console.log('🧪 Running tests...');
const test1 = testHTMLExists();
const test2 = testHTMLContent();

if (test1 && test2) {
    console.log('✅ All tests passed!');
    process.exit(0);
} else {
    console.log('❌ Some tests failed!');
    process.exit(1);
}
