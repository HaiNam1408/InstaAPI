const mongoose = require('mongoose')

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        if(connect.connection.readyState === 1) console.log("DB connection is successfully!")
        else console.log("DB connecting...")
    } catch (error) {
        console.error("DB connect is failed!")
        throw new Error(error)
    }
}

module.exports = dbConnect