const fs = require('fs');

const headers = [
  'src/components/user/Header.jsx',
  'src/components/admin/Header.jsx',
  'src/components/buyer/Header.jsx'
];

headers.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<img src=\{Logo\}.*sm:hidden.*navigate.*\/>\r?\n?\s*/g, '');
    let check = content.includes('lorepa-frontend') ? true : false;
    fs.writeFileSync(file, content);
    console.log('Cleaned header: ' + file);
  }
});

const sidebars = [
  'src/components/user/sidebar/Sidebar.jsx',
  'src/components/admin/sidebar/Sidebar.jsx',
  'src/components/buyer/sidebar/Sidebar.jsx'
];

sidebars.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/import Logo from '\.\.\/\.\.\/\.\.\/assets\/lorepa\.png'/g, "import Logo from '../../../assets/logo.svg'");
    content = content.replace(/import Logo from "\.\.\/\.\.\/\.\.\/assets\/lorepa\.png"/g, "import Logo from '../../../assets/logo.svg'");
    
    // For good measure, let's remove filter brightness-0 invert so the logo svg is in full color, since LOREPA original text was white! The new logo image should likely be displayed with its original logo icon colors! Wait, the logo SVG is completely black (#000000). So it still needs the invert to be white, or NO? If the logo has colors, #000000 is black, meaning on a dark blue background, black is invisible unless it's inverted to white!
    
    fs.writeFileSync(file, content);
    console.log('Updated sidebar: ' + file);
  } else {
    console.log('missing ' + file);
  }
});
