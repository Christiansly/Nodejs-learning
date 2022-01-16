const { ObjectId } = require("mongodb")
const { getDB } = require("../util/database")

class User {
    constructor(email, username, cart, id) {
        this.email = email
        this.username = username 
        this.cart = cart
        if(id) this._id = id
    }
 
    save() {
        const db = getDB()
        return db.collection('users').insertOne(this).then(() => console.log("User created")).catch((err) => console.log(err))
    }

    addToCart(product) {
        const updatedCart = {items: [{...product, quantity: 1}]}
        const db = getDB()
        return db.collection('users').updateOne({_id: this._id}, {$set: {cart: updatedCart}}).then(() => console.log("Cart Added")).catch((err) => console.log(err))
    }

    static findById(userId) {
        const db = getDB()
        return db.collection('users').find({_id: new ObjectId(userId)}).next().then(user => {
            console.log(user)
            return user
        }).catch(err => {
            console.log(err)
        })
    } 
}


module.exports = User