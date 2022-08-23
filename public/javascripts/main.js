let ws;
connectWs();
let wsStatus = 'open';
let output;
function runtest(evt) {
    evt.preventDefault();
    const form = evt.target;
    const link = form.repolink.value;

    document.getElementById('submitButton').disabled = true;
    document.getElementById('output').innerHTML = 'Requesting test, please wait...';
    fetch('/', {
        method:'POST', 
        body: `{"repolink":"${link}"}`,
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then(r=>r.text())
    .then(resp=>{
        const output = document.getElementById('output');
        output.innerHTML = resp.replace(/\n/g, "<br />");
        output.scrollTop = output.scrollHeight;
    })
    .catch(e=>{
        console.log(e.message);
        document.getElementById('output').innerHTML = `${e.message}`;
    })
    .finally(()=>{
        document.getElementById('submitButton').disabled = false;
    });
}

function test(evt) {
    console.log('testing it')
    evt.preventDefault();
    const form = evt.target;
    const link = form.repolink.value;

    document.getElementById('submitButton').disabled = true;
    document.getElementById('output').innerHTML = '';

    if(wsStatus == 'closed'){
        connectWs(()=>ws.send(JSON.stringify({ repolink: link })));
    }
    else ws.send(JSON.stringify({ repolink: link }));
}

function connectWs(callback){
    ws = new WebSocket(location.origin.replace(/^http/, 'ws'));

    if(callback){
        ws.onopen = callback;
    }

    ws.onmessage = (evt) => {
        if (evt.data) {
            if(evt.data === 'the-very-end-of-it'){
                document.getElementById('submitButton').disabled = false;
                return;
            }
            output.innerHTML += evt.data.replace(/\n/g, "<br />");
            output.scrollTop = output.scrollHeight;
            // console.log(evt.data);
        }
    }
    
    ws.onclose = (evt)=>{
        wsStatus = 'closed';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    output = document.getElementById('output');
    // console.log("Content is ready")
});