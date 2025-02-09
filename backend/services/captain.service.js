const Captainmodel = require('../models/captain.model');
const con = require('../db/db');

module.exports.registercaptain = async ( fullname, email, password, vechile) => {
    try { 
        if (!fullname || !email || !password || !vechile) {
            throw new Error('Invalid request body');
        }

        const revokeconn = await con();
        console.log("connection", revokeconn);

        const captain = await Captainmodel.create({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password,
            vechile: {
                color: vechile.color,
                plate: vechile.plate,
                Vechiletype: vechile.Vechiletype,
                capacity: vechile.capacity
            }
        });

        return captain;
    } catch (error) {
        console.log("error while creating captain", error);
        throw error;
    }
}
