const fs = require('fs');
const filePath = 'c:/Users/Edson/Downloads/automatiza1-main/src/pages/Checkout.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = 'itens: enrichedItems,';
const replacement = 'itens: enrichedItems,\n                                 subtotal: itemsSubtotal,\n                                 frete: actualShippingCost,\n                                 desconto: couponDiscount,';

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('SUCCESS');
} else {
    console.log('TARGET NOT FOUND');
}
