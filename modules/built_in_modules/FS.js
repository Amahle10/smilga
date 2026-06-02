
// syncronous approach
const  {readFileSync, writeFileSync} = require('fs');

const first = readFileSync('./content/first.txt', 'utf8');
const second = readFileSync('./content/second.txt', 'utf8');
console.log(first, second);

writeFileSync('./content/result.txt', `Here is the result: ${first}, ${second}`, {flag: 'a'});  


// asyncronous approach
const  {readFile, writeFile} = require('fs');

readFile('./content/first.txt', 'utf8', (err, result) => {
    if (err) {
        console.error(err);
        return;
    }
    const first = result;
    readFile('./content/second.txt', 'utf8', (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        const second = result;
        writeFile('./content/result.txt', `Here is the result: ${first}, ${second}`, {flag: 'a'}, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Files written successfully.');
        });
    });
});