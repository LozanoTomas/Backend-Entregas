import { connect } from "mongoose"

export const connectDB = async ()=>{
    const URL = "mongodb+srv://lozanotdlc:4321@cluster0.1cyyd.mongodb.net/prueba";

    try {
        await connect(URL);
        console.log("conectado a monguito dibi");
    } catch (error){
        console.log("no se pudo tomito :(", error.message);
        
    }
}