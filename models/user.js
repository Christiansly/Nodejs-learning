const { ObjectId } = require("mongodb")
const { getDB } = require("../util/database")

class User {
    constructor(email, username) {
        this.email = email
        this.username = username 
    }

    save() {
        const db = getDB()
        return db.collections('users').insertOne(this).then(() => console.log("User created")).catch((err) => console.log(err))
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