fetch('/get-username').then(((res) => res.json())).then((res) => document.querySelector('h1').innerHTML += "  " + res.username)

fetch('/products').then((res) => res.json()).then

const button = document.getElementById("logout").addEventListener("click", () => {
    fetch('/logout', {
        method:"POST"
    })
})

const text = document.getElementById('text')
const count = document.getElementById('price')
const add = document.getElementById('add')
const ul = document.getElementById('products')

function render(){
    ul.innerHTML = ""
    fetch('/products').then((res) => res.json()).then((res) => {
         res.map((r) => ul.innerHTML += `<li>${r.text} Price: ${r.price}</li>`)
    })
}
render()

add.addEventListener('click', () => {
    fetch("/products", {
        method: "POST",
        headers: {
            "content-type" : "application/json"
        },
        body: JSON.stringify({
            text : text.value,
            price: count.value
        })
    }).then(() => render())
})

