// /app.js


const req = new XMLHttpRequest()

req.onload = function() {
    console.log('成功！！')
    const data = JSON.parse(this.responseText)
    console.log(data.name, data.height)
}

req.onerror = function() {
    console.log('エラー！！')
    console.log(this)
}

// req.open('GET', 'https://swapi.dev/api/people/1/')
req.open('GET', 'https://swapi.info/api/people/1')
req.send()