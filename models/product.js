const mongoose = require("mongoose");
const Schema  = mongoose.Schema

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema)

// const fs = require("fs")
// const path = require("path")
// const { getDB } = require("../util/database")
// const customizePath = require('../util/path')


// const Cart = require("./cart")
// // const p = path.join(customizePath, 'data', 'products.json')
// const {ObjectId} = require('mongodb')
// const getProductsFromFile = cb => {
    
//     fs.readFile(p, (err, fileContent) => {
//         if(err) {
//             cb([])
//         }

//         cb(JSON.parse(fileContent))
//     })

// }

// // const products = []
// module.exports = class Product {
//     constructor(id, title, description, imageUrl, price, user) {
        
//         this.title = title
//         this.description = description
//         this.imageUrl = imageUrl
//         this.price = price
//         if(id) this._id = new ObjectId(id)
//         this.user = user
//     }

//     save() {
//         const db = getDB()
//         let dbOperation
//         if(this._id) {
//             dbOperation = db.collection('products').updateOne({_id: this._id}, {$set: this})
//         }else {
//             dbOperation = db.collection('products').insertOne(this)
//         }
//         return dbOperation.then(result => console.log(result)).catch(err => console.log(err))
//         // products.push(this)
//     }

//     static fetchAll(cb) {
//         const db = getDB()
//         return db.collection('products').find().toArray().then(products => {
//             console.log(products);
//             return products
//         }).catch(err => {
//             console.log(err)
//         })
       
//     }

//     static findById(id, cb) {
//         const db = getDB()
        
//         return db.collection('products').find({_id: new ObjectId(id)}).next().then(product => {
//             console.log(product)
//             return product
//         }).catch(err => {
//             console.log(err)
//         })
//     }

//     static deleteProduct(id) {
//         const db = getDB()
//         return db.collection('products').deleteOne({_id: new ObjectId(id)}).then(result => console.log('Deleted')).catch(err => console.log(err))
//     }
// }