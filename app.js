const keys = Object.freeze({
    store: 'store'
})

const appendLink = ({ name, href, label }) => () => {
    const a = document.createElement('a');
    const li = document.createElement('li');

    a.href = href
    a.target = '_blank';
    a.appendChild(document.createTextNode(name));

    document.querySelector('.stage-items').appendChild(li).appendChild(a);
}

const addLink = (store, form) => (e) => {
    const { value: name } = form.querySelector('[data-link-name]')
    const { value: href } = form.querySelector('[data-link-href]')
    const { value: label } = form.querySelector('[data-link-label]')

    // prevent reload
    e.preventDefault()
    // clear form
    form.reset()

    const value = { name, href, label }
    const newStore = [...store, value]

    chrome.storage.sync.set( { [keys.store]: newStore} , appendLink(value));
}

const createLinks = ( store ) => {
    store.forEach(linkItem => appendLink(linkItem)() )
}

(function(){
    // Get store
    chrome.storage.sync.get(keys.store, function(result){
        const store = result[keys.store] || []

        // store is not empty
        if(store.length)
            createLinks(store)

        // add form submit event
        const form = document.getElementById('link-form');
        form.addEventListener('submit', addLink(store, form))
    });
})()