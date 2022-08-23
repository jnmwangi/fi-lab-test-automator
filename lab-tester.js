
const { spawn } = require('child_process');
const path = require('path');

module.exports = (repoLink, ws) => {

    const basePath = path.resolve(__dirname);
    const script = `${basePath}/run-lab.sh`;

    const spnw = spawn('bash', [script, repoLink, basePath + '/repos']);
    // let response = '';
    spnw.stdin.setDefaultEncoding("utf-8");
    let interval = setInterval(()=>ws.send(''), 1000);
    spnw.stdout.on('data', data => {
        const txtDecode = new TextDecoder("utf-8");
        const responseText = txtDecode.decode(data);
        
        ws.send(responseText);
    });
    spnw.stdout.on('end', data => {
        // res.send(response);
        ws.send('the-very-end-of-it');
        clearInterval(interval);
        interval = null;
    })
    spnw.stderr.on('error', error => {
        // res.text(error);
        ws.send(error);
    });
}