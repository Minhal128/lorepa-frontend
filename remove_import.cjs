const fs = require('fs');

const headers = [
  'src/components/user/Header.jsx',
  'src/components/admin/Header.jsx',
  'src/components/buyer/Header.jsx'
];

headers.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/import Logo from '\.\.\/\.\.\/assets\/logo\.svg';\r?\n?/g, '');
    fs.writeFileSync(file, content);
  }
});
