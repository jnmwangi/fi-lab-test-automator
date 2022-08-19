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
    .then(r=>r.json())
    .then(resp=>{
        if(resp.error){
            throw new Error(resp.error);
        }
        document.getElementById('output').innerHTML = resp.data.replace(/\n/g, "<br />");
        console.log(resp);
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