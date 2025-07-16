// test.js
const fs = require('fs');
const assert = require('assert');

// Test kiểm tra file HTML tồn tại
describe('Website Tests', () => {
    it('should have index.html file', () => {
        assert(fs.existsSync('index.html'));
    });
    
    it('should contain correct title', () => {
        const html = fs.readFileSync('index.html', 'utf8');
        assert(html.includes('Trang Web Đầu Tiên'));
    });
});
