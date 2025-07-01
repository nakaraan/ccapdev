/*
    http://localhost:3000/users -> retrieve all users
    http://localhost:3000/users/register -> regitser a user 
    base route + backend route -> 1 function each only -> returns response to front end
*/

const express = require("express")
const database = require("./connect")
const ObjectID = require("mongodb").ObjectID

let userRoutes = express.Router() // express router object

// retrieve all 
userRoutes.route("/users").get(async (request, response) => { // request from front end, response is from back end
    let db = database.getDb() // connects to data base
    let data = await db.collection("users").find({}).toArray() 
    if (data.length > 0) {
        response.json(data)
    } else {
        throw new Error("Data was not found.")
    }
}) // returns mongo cursor in array

// retrieve one
userRoutes.route("/users/:id").get(async (request, response) => { // request from front end, response is from back end
    let db = database.getDb() // connects to data base
    let data = await db.collection("users").findOne({_id: new ObjectId(request.params.id)})
    if (Object.keys(data).length > 0) {
        response.json(data)
    } else {
        throw new Error("Data was not found.")
    }
}) // return direct object

// register user
userRoutes.route("/users").post(async (request, response) => { // request from front end, response is from back end
    let db = database.getDb() // connects to data base
    let mongoObject = {
        user_id: request.body.user_id,
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        user_password: request.body.user_password,
        user_role: request.body.user_role,
        email_address: request.body.email_address,
        user_description: request.body.user_description
    }
    let data = await db.collection("users").insertOne(mongoObject)
    response.json(data)
}) 

// update user
userRoutes.route("/users/:id").put(async (request, response) => { // request from front end, response is from back end
    let db = database.getDb()
    let mongoObject = { 
        $set: {
            user_id: request.body.user_id,
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            user_password: request.body.user_password,
            user_role: request.body.user_role,
            email_address: request.body.email_address,
            user_description: request.body.user_description
        }
    }
    let data = await db.collection("users").updateOne({_id: new ObjectID(request.params.id)}, mongoObject)
    response.json(data)
}) 

// delete user
userRoutes.route("/users/:id").delete(async (request, response) => { // request from front end, response is from back end
    let db = database.getDb() // connects to data base
    let data = await db.collection("users").deleteOne({_id: new ObjectId(request.params.id)})
    response.json(data)
})

module.exports = userRoutes