// const { ObjectId } = require("mongodb")
// const { getDB } = require("../util/database")

// class User {
//     constructor(email, username, cart, id) {
//         this.email = email
//         this.username = username 
//         this.cart = cart
//         if(id) this._id = id
//     }
 
//     save() {
//         const db = getDB()
//         return db.collection('users').insertOne(this).then(() => console.log("User created")).catch((err) => console.log(err))
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString()
//         })

//         let newQuantity = 1
//         const updatedCartItems = [...this.cart.items]
//         if(cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1
//             updatedCartItems[cartProductIndex].quantity = newQuantity
//         } else {
//             updatedCartItems.push({
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity
//             })
//         }
//         const updatedCart = {items: updatedCartItems}
//         const db = getDB()
//         return db.collection('users').updateOne({_id: this._id}, {$set: {cart: updatedCart}}).then(() => console.log("Cart Added")).catch((err) => console.log(err))
//     }

//     deleteCart(productId) {
//         const updatedCartItems = this.cart.items.filter(i => {
//             return i.productId.toString() !== productId.toString()
//         })
//         const updatedCart = {items: updatedCartItems}

//         const db = getDB()
//         return db.collection('users').updateOne({_id: this._id}, {$set: {cart: updatedCart}}).then(() => console.log("Item Deleted")).catch((err) => console.log(err))

//     }

//     addToOrder() {
//         const db = getDB()
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new ObjectId(this._id),
//                     username: this.username
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         }).then(() => {
//             this.cart = {items: []}
//             return db.collection('users').updateOne({_id: this._id}, {$set: {cart: {items: []}}})
//         })
//     }

//     getOrder() {
//         const db = getDB()
//         return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray()
//     }

//     getCart() {
//         const db = getDB()
//         const productsId = this.cart.items.map(prod => prod.productId)
//         console.log('inside', productsId, this.cart.items)
//         return db.collection('products').find({_id: {$in: productsId}}).toArray().then(products => {
//             console.log('jjj',products)
//             return products.map(prod => {
//                 return {
//                     ...prod,
//                     quantity: this.cart.items.find(o => {
//                         return o.productId.toString() === prod._id.toString()
//                     }).quantity
//                 }
//             })
//         })
//     }

//     static findById(userId) {
//         const db = getDB()
//         return db.collection('users').find({_id: new ObjectId(userId)}).next().then(user => {
//             console.log(user)
//             return user
//         }).catch(err => {
//             console.log(err)
//         })
//     } 
// }


// module.exports = User