remove = document.getElementById('js-remove');

if (remove){
    remove.addEventListener('click', onremove)
}

function onremove(ev) {
    const node = ev.target;
    const id = node.dataset.id;

    fetch('/' + id, {method: 'delete'})
        .then(onresponse)
        .then(onload, onfail)

    function onresponse(res) {
        return res.json()
    }
    function onload() {
        window.location = '/'
    }
    function onfail() {
        throw new Error('Could not delete!')
    }
}
