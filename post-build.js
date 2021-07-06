var fs = require("fs-extra");

console.log("Copying images to build...");
fs.copy('public/images', 'dist/production/images', function (err) {
    if (err){
        console.log('An error occurred while copying images.')
        return console.error(err)
    }
    console.log('Build complete!')
});