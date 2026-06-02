const os  = require('os');
const path = require('path');

console.log(os.hostname());

console.log(os.userInfo());

const currentOS={
    name: os.type(),
    release: os.release(),
    totalMem: os.totalmem(),
    freeMem: os.freemem()
}

console.log(path.sep);

function changePathSep (){
    nnewpath = path.sep = '/';
    console.log(nnewpath);
    return nnewpath;
}
changePathSep()
console.log(currentOS);

const filePath = path.join('/content', 'subfolder', 'test.txt');
console.log(filePath);

linux_type_seperator = changePathSep();
const linuxFilePath = path.join('/content', 'subfolder', 'test.txt');
console.log(linuxFilePath);