/*
    http://localhost:3000/users -> retrieve all users
    http://localhost:3000/users/register -> regitser a user 
    base route + backend route -> 1 function each only -> returns response to front end
*/

const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;

let userRoutes = express.Router() // express router object

// retrieve all 
userRoutes.route("/users").get(async (request, response) => { // request from front end, response is from back end
    let db = database.getDb() // connects to data base
    let data = await db.collection("users").find({}).toArray();
    if (data.length > 0) {
        response.json(data);
    } else {
        throw new Error("Data was not found.");
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

// login user
userRoutes.route("/users/login").post(async (request, response) => {
    let db = database.getDb();
    const { user_id, user_password } = request.body;
    console.log("Login attempt:", { user_id, user_password }); // Debug log
    const user = await db.collection("users").findOne({
        user_id: user_id,
        user_password: user_password
    });
    console.log("User found:", user); // Debug log
    if (user) {
        response.json(user);
    } else {
        response.status(401).json({ error: "Invalid credentials" });
    }
});

// register user
userRoutes.route("/users").post(async (request, response) => {
    let db = database.getDb();
    // Check for duplicate user_id or email_address
    const exists = await db.collection("users").findOne({
        $or: [
            { user_id: request.body.user_id },
            { email_address: request.body.email_address }
        ]
    });
    if (exists) {
        response.status(409).json({ error: "User ID or email already exists" });
        return;
    }
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
    let data = await db.collection("users").updateOne({_id: new ObjectId(request.params.id)}, mongoObject)
    response.json(data)
}) 

// delete user
userRoutes.route("/users/:id").delete(async (request, response) => { // request from front end, response is from back end
    let db = database.getDb() // connects to data base
    let data = await db.collection("users").deleteOne({_id: new ObjectId(request.params.id)})
    response.json(data)
})

module.exports = userRoutes