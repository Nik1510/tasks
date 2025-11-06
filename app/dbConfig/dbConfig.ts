import mongoose from "mongoose";

export async function connect(){
    try {
        mongoose.connect(process.env.MONGODB_URL!)
        const connection = mongoose.connection;
        connection.on('connected',()=>{
            console.log("Mongo db is connected successfully");
        })
        connection.on('error',(err)=>{
            console.log("Error while connecting the databases",err)
            process.exit();
        })
    } catch (error:any) {
        console.log("Failed to connect the database",error)
    }
}
