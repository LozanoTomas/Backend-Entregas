import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartSchema = new Schema({

    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "products",
                required: [ true, "El nombre del producto es obligatorio." ],
            },
            quantity: {
                type: Number,
                required: [ true, "La cantidad del producto es obligatoria." ],
                min: [ 1, "La cantidad debe ser mayor a 0" ],
            },
            _id: false,
        }],

}, { versionKey: false, timestamps: true });

cartSchema.plugin(paginate);

const CartModel = model("carts", cartSchema);

export default CartModel;