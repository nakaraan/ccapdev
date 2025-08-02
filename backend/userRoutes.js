/*
    http://localhost:3000/users -> retrieve all users
    http://localhost:3000/users/register -> regitser a user 
    base route + backend route -> 1 function each only -> returns response to front end
*/

const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // to use for authentication
require("dotenv").config({path: "./config.env"});

let userRoutes = express.Router() // express router object
const SALT_ROUNDS = 6

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
    let data = await db.collection("users").findOne({ _id: new ObjectId(request.params.id) })
    if (Object.keys(data).length > 0) {
        response.json(data)
    } else {
        throw new Error("Data was not found.")
    }
}) // return direct object

// login user
userRoutes.route("/users/login").post(async (request, response) => {
    let db = database.getDb();
    const { user_id } = request.body;
    console.log("Login attempt:", { user_id }); // Debug log
    const user = await db.collection("users").findOne({
        user_id: user_id
    });
    console.log("User found:", user); // Debug log
    if (user) {
        let confirmation = await bcrypt.compare(request.body.user_password, user.user_password); // decrypt password
        if (confirmation) {
            const token = jwt.sign(user, process.env.SECRETKEY, {expiresIn: "1h"}); // create token 
            response.json(token)
        } else {
            response.json({ success: false, error: "Incorrect password" });// return error if password is incorrect
        }
    } else {
        response.status(401).json({ error: "User not found" });
    }
});

// register user
userRoutes.route("/users") .post(async (request, response) => {
    let db = database.getDb();

    const takenID = await db.collection("users").findOne({ user_id: request.body.user_id })

    if (takenID) {
        response.json({ message: "User ID already exists." });
    } else {
        const hash = await bcrypt.hash(request.body.user_password, SALT_ROUNDS); // encrypt password
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
            user_password: hash,
            user_role: request.body.user_role,
            email_address: request.body.email_address,
            user_description: request.body.user_description
        }
        let data = await db.collection("users").insertOne(mongoObject)
        response.json(data)
    }
})

// update user
userRoutes.route("/users/:id").put(async (request, response) => { // request from front end, response is from back end
    let db = database.getDb()

    // Only include fields that are actually provided in the request body
    let updateFields = {}
    if (request.body.user_id !== undefined) updateFields.user_id = request.body.user_id
    if (request.body.first_name !== undefined) updateFields.first_name = request.body.first_name
    if (request.body.last_name !== undefined) updateFields.last_name = request.body.last_name
    if (request.body.user_password !== undefined) updateFields.user_password = request.body.user_password
    if (request.body.user_role !== undefined) updateFields.user_role = request.body.user_role
    if (request.body.email_address !== undefined) updateFields.email_address = request.body.email_address
    if (request.body.user_description !== undefined) updateFields.user_description = request.body.user_description

    let mongoObject = {
        $set: updateFields
    }
    let data = await db.collection("users").updateOne({ _id: new ObjectId(request.params.id) }, mongoObject)
    response.json(data)
})

// delete user
userRoutes.route("/users/:id").delete(async (request, response) => { // request from front end, response is from back end
    let db = database.getDb() // connects to data base
    let data = await db.collection("users").deleteOne({ _id: new ObjectId(request.params.id) })
    response.json(data)
})

// === SEAT RESERVATION ROUTES ===

// Get seat reservations for a specific date, lab, and time slot
userRoutes.route("/reservations/:date/:lab/:timeSlot").get(async (request, response) => {
    let db = database.getDb();
    try {
        const { date, lab, timeSlot } = request.params;
        let data = await db.collection("reservations").findOne({
            date: date,
            lab: lab,
            timeSlot: timeSlot
        });

        if (data) {
            response.json(data.seats || {});
        } else {
            response.json({}); // Return empty object if no reservations found
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

// Create or update a seat reservation
userRoutes.route("/reservations").post(async (request, response) => {
    let db = database.getDb();
    try {
        const { date, lab, timeSlot, seatIndex, status, occupantName, user_id } = request.body;

        const filter = { date, lab, timeSlot };
        const update = {
            $set: {
                [`seats.${seatIndex}`]: {
                    status: status,
                    occupantName: occupantName,
                    ...(user_id && { user_id: user_id })
                }
            }
        };

        let data = await db.collection("reservations").updateOne(
            filter,
            update,
            { upsert: true }
        );

        response.json(data);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

// Clear a seat reservation (make it vacant)
userRoutes.route("/reservations/clear").post(async (request, response) => {
    let db = database.getDb();
    try {
        const { date, lab, timeSlot, seatIndex } = request.body;

        const filter = { date, lab, timeSlot };
        const update = {
            $unset: { [`seats.${seatIndex}`]: "" }
        };

        let data = await db.collection("reservations").updateOne(filter, update);
        response.json(data);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

// Toggle blocked seat
userRoutes.route("/reservations/toggle-block").post(async (request, response) => {
    let db = database.getDb();
    try {
        const { date, lab, timeSlot, seatIndex } = request.body;

        // First, get current seat data
        const doc = await db.collection("reservations").findOne({
            date, lab, timeSlot
        });

        const currentSeat = doc?.seats?.[seatIndex];
        const isCurrentlyBlocked = currentSeat?.status === -1;

        if (isCurrentlyBlocked) {
            // Unblock: remove from map
            const update = { $unset: { [`seats.${seatIndex}`]: "" } };
            let data = await db.collection("reservations").updateOne(
                { date, lab, timeSlot },
                update
            );
            response.json(data);
        } else {
            // Block: set status to -1 (no occupantName for blocked seats)
            const update = {
                $set: {
                    [`seats.${seatIndex}`]: {
                        status: -1
                    }
                }
            };
            let data = await db.collection("reservations").updateOne(
                { date, lab, timeSlot },
                update,
                { upsert: true }
            );
            response.json(data);
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

// Clear all reservations for a specific date, lab, and time slot
userRoutes.route("/reservations/clear-all").delete(async (request, response) => {
    let db = database.getDb();
    try {
        const { date, lab, timeSlot } = request.body;
        let data = await db.collection("reservations").deleteOne({
            date: date,
            lab: lab,
            timeSlot: timeSlot
        });
        response.json(data);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

// Get all reservations for a specific user
userRoutes.route("/user-reservations/:user_id").get(async (request, response) => {
    let db = database.getDb();
    try {
        const { user_id } = request.params;
        console.log("=== SEARCHING FOR USER RESERVATIONS ===");
        console.log("Target user_id:", user_id);

        // Get all reservations from the collection
        let allReservations = await db.collection("reservations").find({}).toArray();
        console.log("Total reservation documents found:", allReservations.length);

        const userReservations = [];

        // Go through every single reservation document
        allReservations.forEach((reservationDoc, docIndex) => {
            console.log(`\n--- Processing reservation document ${docIndex + 1} ---`);
            console.log("Document ID:", reservationDoc._id);
            console.log("Date:", reservationDoc.date);
            console.log("Lab:", reservationDoc.lab);
            console.log("Time Slot:", reservationDoc.timeSlot);

            // Check if this document has seats
            if (reservationDoc.seats) {
                console.log("Seats object found, checking each seat...");

                // Go through every seat in this reservation
                Object.keys(reservationDoc.seats).forEach(seatIndex => {
                    const seatData = reservationDoc.seats[seatIndex];
                    console.log(`  Seat ${seatIndex}:`, {
                        user_id: seatData.user_id,
                        status: seatData.status,
                        occupantName: seatData.occupantName
                    });

                    // Check if this seat belongs to our target user
                    if (seatData.user_id === user_id) {
                        console.log(`  ✓ FOUND MATCHING USER_ID for seat ${seatIndex}!`);

                        // Check if status is 1 (reserved)
                        const status = parseInt(seatData.status) || seatData.status;
                        if (status === 1) {
                            console.log(`  ✓ SEAT IS RESERVED (status = ${seatData.status})`);

                            // Add this reservation to the list
                            const reservation = {
                                date: reservationDoc.date,
                                lab: reservationDoc.lab,
                                timeSlot: reservationDoc.timeSlot,
                                seatIndex: parseInt(seatIndex),
                                seatId: `S${parseInt(seatIndex) + 1}`,
                                occupantName: seatData.occupantName
                            };

                            userReservations.push(reservation);
                            console.log("  ✓ ADDED TO USER RESERVATIONS:", reservation);
                        } else {
                            console.log(`  ✗ Seat not reserved (status = ${seatData.status})`);
                        }
                    }
                });
            } else {
                console.log("No seats object in this document");
            }
        });

        console.log("\n=== FINAL RESULTS ===");
        console.log("Total user reservations found:", userReservations.length);
        console.log("User reservations:", userReservations);

        response.json(userReservations);
    } catch (error) {
        console.error("Error in user-reservations route:", error);
        response.status(500).json({ error: error.message });
    }
});

// Get all labs (for use as indexes in the reservation system)
userRoutes.route("/labs").get(async (request, response) => {
    let db = database.getDb();
    try {
        const labs = await db.collection("labs").find({}).toArray();
        response.json(labs);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

// Delete all reservations for a specific user
userRoutes.route("/user-reservations/:user_id").delete(async (request, response) => {
    let db = database.getDb();
    try {
        const { user_id } = request.params;
        console.log("=== DELETING USER RESERVATIONS ===");
        console.log("Target user_id:", user_id);

        // Get all reservations from the collection
        let allReservations = await db.collection("reservations").find({}).toArray();
        console.log("Total reservation documents found:", allReservations.length);

        let deletedCount = 0;

        // Go through each reservation document and remove seats belonging to this user
        for (const reservationDoc of allReservations) {
            if (reservationDoc.seats) {
                let hasChanges = false;
                const updatedSeats = { ...reservationDoc.seats };

                // Check each seat and remove if it belongs to the user
                Object.keys(updatedSeats).forEach(seatIndex => {
                    const seatData = updatedSeats[seatIndex];
                    if (seatData.user_id === user_id) {
                        console.log(`Removing user from seat ${seatIndex} in reservation:`, {
                            date: reservationDoc.date,
                            lab: reservationDoc.lab,
                            timeSlot: reservationDoc.timeSlot
                        });

                        // Set seat back to vacant
                        updatedSeats[seatIndex] = {
                            status: 0,
                            occupantName: "Anonymous"
                        };
                        hasChanges = true;
                        deletedCount++;
                    }
                });

                // Update the document if there were changes
                if (hasChanges) {
                    await db.collection("reservations").updateOne(
                        { _id: reservationDoc._id },
                        { $set: { seats: updatedSeats } }
                    );
                }
            }
        }

        console.log("=== DELETION COMPLETE ===");
        console.log("Total reservations cleared:", deletedCount);

        response.json({
            message: `Successfully cleared ${deletedCount} reservations for user ${user_id}`,
            deletedCount
        });
    } catch (error) {
        console.error("Error deleting user reservations:", error);
        response.status(500).json({ error: error.message });
    }
});

module.exports = userRoutes