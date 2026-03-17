const fs = require('fs');

const sidebars = [
  'H:/Development/lorepa/lorepa-frontend/src/components/user/sidebar/Sidebar.jsx',
  'H:/Development/lorepa/lorepa-frontend/src/components/admin/sidebar/Sidebar.jsx',
  'H:/Development/lorepa/lorepa-frontend/src/components/buyer/sidebar/Sidebar.jsx'
];

sidebars.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/import Logo from '\.\.\/\.\.\/\.\.\/assets\/logo\.svg'/g, "import Logo from '../../../assets/logo.png'");
    content = content.replace(/className=\"h-10 filter brightness-0 invert\"/g, 'className=\"h-10\"');
    content = content.replace(/className=\"h-9 filter brightness-0 invert\"/g, 'className=\"h-9\"');
    fs.writeFileSync(file, content);
    console.log('Updated sidebar: ' + file);
  } else {
    console.log('missing ' + file);
  }
});
