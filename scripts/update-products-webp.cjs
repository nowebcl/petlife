const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'src', 'data', 'products.ts');
let content = fs.readFileSync(productsFilePath, 'utf8');

const regex = /\/productos\/([^"']+)\.jpeg/g;
const matches = content.match(regex);
console.log('Matches found:', matches ? matches.length : 0);

if (matches && matches.length > 0) {
  content = content.replace(regex, '/productos/$1.webp');
  fs.writeFileSync(productsFilePath, content, 'utf8');
  console.log('Successfully updated src/data/products.ts to use .webp images!');
}
