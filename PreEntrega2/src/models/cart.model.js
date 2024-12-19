import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartSchema = new Schema({
    observations: {
        type: String,
        trim: true,
        maxLength: [ 250, "Las observaciones deben tener como máximo 250 caracteres" ],
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "products",
                required: [ true, "El nombre es obligatorio" ],
            },
            amount: {
                type: Number,
                required: [ true, "El nombre es obligatorio" ],
                min: [ 1, "La cantidad debe ser mayor que 0" ],
            },
        },
    ],
}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt
});

// Agrega mongoose-paginate-v2 para habilitar las funcionalidades de paginación.
cartSchema.plugin(paginate);

const CartModel = model("carts", cartSchema);

export default CartModel;