import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    name: {
        index: { name: "idx_name" },
        type: String,
        required: [ true, "El nombre es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "El nombre debe tener al menos 3 caracteres" ],
        maxLength: [ 25, "El nombre debe tener como máximo 25 caracteres" ],
    },
    description: {
        type: String,
        trim: true,
        maxLength: [ 250, "La descripción debe tener como máximo 250 caracteres" ],
    },
    category: {
        type: String,
        required: [ true, "La categoría es obligatoria" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "La categoría debe tener al menos 3 caracteres" ],
        maxLength: [ 10, "La categoría debe tener como máximo 10 caracteres" ],
    },
    availability: {
        type: Boolean,
        required: [ true, "La disponibilidad es obligatoria" ],
    },
    thumbnail: {
        type: String,
        required: [ true, "La imagen es obligatoria" ],
        trim: true,
    },
}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt

});

// Middleware que elimina la referencia en las recetas al eliminar el producte.
productSchema.pre("findByIdAndDelete", async function(next) {
    const CartModel = this.model("carts");

    await CartModel.updateMany(
        { "products.product": this._id },
        { $pull: { products: { product: this._id } } },
    );

    next();
});

// Agrega mongoose-paginate-v2 para habilitar las funcionalidades de paginación.
productSchema.plugin(paginate);

const ProductModel = model("products", productSchema);

export default ProductModel;