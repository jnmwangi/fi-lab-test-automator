function runtest(evt){
    evt.preventDefault();
    const form = evt.target;
    const link = form.repolink.value;

    document.getElementById('submitButton').disabled = true;
    document.getElementById('output').innerHTML = 'Running the tests, please wait...';
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

document.addEventListener("DOMContentLoaded", ()=>{
    console.log("Content is ready")
});