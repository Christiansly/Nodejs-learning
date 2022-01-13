const fs = require("fs")
const path = require("path")
const { getDB } = require("../util/database")
const customizePath = require('../util/path')


const Cart = require("./cart")
// const p = path.join(customizePath, 'data', 'products.json')
const {ObjectId} = require('mongodb')
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
        
        this.title = title
        this.description = description
        this.imageUrl = imageUrl
        this.price = price
        if(id) this._id = new ObjectId(id)
    }

    save() {
        const db = getDB()
        let dbOperation
        if(this._id) {
            dbOperation = db.collection('products').updateOne({_id: this._id}, {$set: this})
        }else {
            dbOperation = db.collection('products').insertOne(this)
        }
        return dbOperation.then(result => console.log(result)).catch(err => console.log(err))
        // products.push(this)
    }

    static fetchAll(cb) {
        const db = getDB()
        return db.collection('products').find().toArray().then(products => {
            console.log(products);
            return products
        }).catch(err => {
            console.log(err)
        })
       
    }

    static findById(id, cb) {
        const db = getDB()
        
        return db.collection('products').find({_id: new ObjectId(id)}).next().then(product => {
            console.log(product)
            return product
        }).catch(err => {
            console.log(err)
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