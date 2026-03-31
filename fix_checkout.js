const fs = require('fs');
const path = 'c:/Users/Edson/Downloads/automatiza1-main/src/pages/Checkout.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = 'total: finalTotal,';
const replacement = 'subtotal: itemsSubtotal,\n                                 frete: actualShippingCost,\n                                 desconto: couponDiscount,\n                                 total: finalTotal,';

if (content.indexOf(target) !== -1) {
    content = content.replace(target, replacement);
    fs.writeFileSync(path, content);
    console.log('Successfully updated');
} else {
    console.log('Target not found');
}
