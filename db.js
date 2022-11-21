const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const dbUrl = "mongodb+srv://m001-student:Akka123@sandbox.po0v4.mongodb.net/test"
const connect = async () => {
    mongoose.connect(dbUrl, {
        useNewUrlParser : true,
        useUnifiedTopology:true
    })

    const db = mongoose.connection
    db.on('error', () => {
        console.log('db not connected')
    })
    db.once('open' ,() => {
        console.log('db connected')
    })
}
module.exports = {connect}