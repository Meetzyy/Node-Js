const http = require("http")
const https = require("https")

const server = http.createServer((req, res) => {

    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" })
        res.end(`
            <h1>Welcome to Our Node.js Project</h1>
            <p>This is the Home Page</p>
            <a href="/products">View Products</a>
        `)
    }

    else if (req.url === "/products" && req.method === "GET") {

        https.get("https://fakestoreapi.com/products", (apiRes) => {

            let data = ""

            apiRes.on("data", (chunk) => {
                data += chunk
            })

            apiRes.on("end", () => {
                const products = JSON.parse(data)

                res.writeHead(200, { "Content-Type": "text/html" })

                let html = `<h1>Products</h1>`

                products.forEach(product => {
                    html += `
                        <div style="border:1px solid #ccc; padding:10px; margin:10px">
                            <h3>${product.title}</h3>
                            <p>Price: $${product.price}</p>
                            <img src="${product.image}" width="100" />
                        </div>
                    `
                })

                res.end(html)
            })
        })
    }

    else {
        res.writeHead(404, { "Content-Type": "text/plain" })
        res.end("404 Not Found")
    }
})

server.listen(1815, () => {
    console.log("server running on port no 1815...")
})
