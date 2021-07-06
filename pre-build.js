const fs = require('fs');
console.log('Removing current build..');
fs.rmdirSync('dist', { recursive: true });
console.log('Current build removed.');