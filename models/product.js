const fs = require("fs")
const path = require("path")
const customizePath = require('../util/path')
const Cart = require("./cart")
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
    constructor(id, title, description, imageUrl, price) {
        this.id = id
        this.title = title
        this.description = description
        this.imageUrl = imageUrl
        this.price = price
    }

    save() {
        
        getProductsFromFile((products) => {
            if(this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id)
                const updatedProducts = [...products]
                updatedProducts[existingProductIndex] = this
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err)
                })
            } else {
                this.id = Math.random() + ""
                products.push(this)
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err)
                })
            }
            
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

    static deleteProduct(id) {
        getProductsFromFile(products => {
            const prod = products.find(prod => prod.id === id)
            const prods = products.filter(prod => prod.id !== id)
            fs.writeFile(p, JSON.stringify(prods), (err) => {
                console.log(err)
                if(!err) {
                    Cart.deleteProduct(id, prod.price)
                }
            })
        })
    }
}