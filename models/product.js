const fs = require("fs")
const path = require("path")
const customizePath = require('../util/path')
const p = path.join(customizePath, 'data', 'products.json')
const getProductsFromFile = cb => {
    
    fs.readFile(p, (err, fileContent) => {
        if(err) {
            cb([])
        }

        cb(JSON.parse(fileContent))
    })

}

// const products = []
module.exports = class Product {
    constructor(title, description, imageUrl, price) {
        this.title = title
        this.description = description
        this.imageUrl = imageUrl
        this.price = price
    }

    save() {
        this.id = Math.random() + ""
        getProductsFromFile((products) => {
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err)
            })
        })
        // products.push(this)
    }

    static fetchAll(cb) {
       
        const p = path.join(customizePath, 'data', 'products.json')
       getProductsFromFile(cb)
       
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const prod = products.find(p => p.id === id)
            cb(prod)
        })
    }
}