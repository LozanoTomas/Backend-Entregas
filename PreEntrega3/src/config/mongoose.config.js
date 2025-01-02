import { connect, Types } from "mongoose";

export const connectDB = async () => {
    const URL = "mongodb+srv://lozanotdlc:4321@cluster0.1cyyd.mongodb.net/prueba";

    try {
        await connect(URL);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.log("Error al conectar con MongoDB", error.message);
    }
};
export const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};
