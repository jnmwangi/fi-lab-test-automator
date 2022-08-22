var express = require('express');
var router = express.Router();
// const util = require('util');
// const exec = util.promisify(require('child_process').exec);
const { spawn } = require('child_process');
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FI Phase 1 Lab Test Automator' });
});

router.post('/', function(req, res, next){
  
  const repoLink = req.body.repolink;
  const basePath = path.resolve(__dirname).replace('/routes', '');
  const script = `${basePath}/run-lab.sh`;

  const spnw = spawn('bash', [script, repoLink, basePath+'/repos']);
  let response = '';
  spnw.stdin.setDefaultEncoding("utf-8");
  spnw.stdout.on('data', data=>{
    const txtDecode = new TextDecoder("utf-8");
    const responseText = txtDecode.decode(data);
    response += responseText;
    /* if(responseText.indexOf('--watchAll') > -1){
      // writing to the child process to quet
      console.log("Quiting..");
      spnw.stdin.write('q\n');
      spnw.stdin.end();
    } */
    console.log(responseText);
  });
  spnw.stdout.on('end', data=>{
    res.json({data: response});
  })
  spnw.stderr.on('error', error=>{
    res.json({error});
  });

  /* exec(`bash ${script} ${repoLink} ${basePath}/lab-automator/repos`)
  .then(resp=>{
    console.log(resp);
    res.json({data:resp});
  })
  .catch(e=>{
    console.log(e.message);
    res.json({error:e.message});
  }); */

  /* (new Promise((rs, rj)=>{
    
    execFile(script, [repoLink, basePath], function(error, stdout, stderr){
      if(error){
        rj(error);
      }
      console.log(stdout);
    });


  })).then(resp=>{
    console.log(resp);
    res.send(resp);
  })
  .catch(e=>{
    console.log(e);
    res.send(e.message);
  }); */

});

module.exports = router;
