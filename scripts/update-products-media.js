const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'products.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Add videoUrl to acessorio products
content = content.replace(/category: "acessorio"\n  \}/g, 'category: "acessorio",\n    videoUrl: PRODUCT_VIDEO,\n  }');

// Add videoUrl to consumivel products
content = content.replace(/category: "consumivel"\n  \}/g, 'category: "consumivel",\n    videoUrl: PRODUCT_VIDEO,\n  }');

fs.writeFileSync(filePath, content);
const count = (content.match(/videoUrl/g) || []).length;
console.log('Done! videoUrl count:', count);
