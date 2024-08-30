const moongoose = require('mongoose')
const ConnectDb = async() => {
    try {
        let db = await moongoose.connect(process.env.cloud_mongo)
        console.log(`mongodb connected : -- ${db.connection.host}`);
        
    } catch (error) {
        console.log(error);
        
    }
}
module.exports = ConnectDb