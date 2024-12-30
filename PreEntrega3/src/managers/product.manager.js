import ErrorHandler from "../utils/error.handler.js";
import ProductModel from "../models/product.schema.js";
import ImageModel from "../models/images.schema.js";
import { isValidID } from "../config/mongoose.config.js";
import { convertToBoolean } from "../utils/converter.js";

export default class ProductManager {
    #productModel;

    constructor(){
        this.#productModel = ProductModel;
    }

    async #findProductById(id) {
        if(!isValidID(id)){
            throw new ErrorHandler("El id no es valido", 400);
        }
        const currentProduct = await this.#productModel.findById(id).populate("thumbnails").lean();

        if (!currentProduct){
            throw new ErrorHandler(`No se encontro un producto con el Id:${id}`, 404);
        }
        if (currentProduct.thumbnails) {
            const { data, filename, contentType } = currentProduct.thumbnails;

            currentProduct.thumbnails = {
                filename,
                src: `data:${contentType || "image/jpeg"};base64,${data.toString("base64")}`,
            };
        }
        return currentProduct;
    }

    async getAllProducts(params){
        try {
            const $and = [];

            if (params?.title) $and.push({ title: { $regex: params.title, $options: "i" } });
            if (params?.category) $and.push({ category: { $regex: params.category, $options: "i" } });
            if (params?.availability) {
                const availability = (convertToBoolean(params.availability) );
                $and.push({ availability });
            }
            const filters = $and.length > 0 ? { $and } : {};

            const sortBy = params?.sortBy || "title";
            const sortOrder = params?.sort === "desc" ? -1 : 1;

            const sortOption = { [sortBy]: sortOrder };

            const paginationOptions = {
                limit: params?.limit || 5,
                page: params?.page || 1,
                sort: sortOption,
                lean: true,
            };

            const products = await this.#productModel.paginate(filters, paginationOptions);

            if (!products){
                throw new ErrorHandler("No hay existencia de productos", 404);
            }

            return products;
        } catch (error) {
            throw new ErrorHandler(error.message, error.code);
        }
    }

    async getProductById(id){
        try {
            const selectedProduct = await this.#findProductById(id);

            return selectedProduct;
        } catch (error) {
            throw new ErrorHandler(error);
        }
    }

    async createNewProduct(data, file){
        try {
            let imageId = null;

            if (file) {
                const newImage = await ImageModel.create({
                    filename: `${data.title || "uploaded-image"}.jpg`,
                    data: file.buffer,
                    contentType: file.mimetype,
                });
                imageId = newImage._id;
            }

            const newProduct = await ProductModel.create({
                ...data,
                status: convertToBoolean(data.status),
                availability: convertToBoolean(data.availability),
                thumbnails: imageId,
            });

            return newProduct;

        } catch (error) {
            throw new ErrorHandler(error);
        }
    }

    async updateProductById (id, data, file) {
        try {
            const product = await this.#productModel.findById(id).populate("thumbnails");
            if (!product) {
                throw new ErrorHandler(`Product with id ${id} not found`, 404);
            }

            let imageId = product.thumbnails;

            if (file) {
                const newImage = await ImageModel.create({
                    filename: file.originalname,
                    data: file.buffer,
                    contentType: file.mimetype,
                });

                await ImageModel.findById(imageId).deleteOne();

                imageId = newImage._id;
            }

            const updatedProduct = {
                ...data,
                status: data.status ? convertToBoolean(data.status) : product.status,
                availability: data.availability ? convertToBoolean(data.availability) : product.availability,
                thumbnails: imageId,
            };

            product.set(updatedProduct);
            await product.save();

            return product;
        } catch (error) {
            throw new ErrorHandler(error);
        }
    }

    async deleteProductById (id) {
        try {
            const product = await this.#findProductById(id);

            if (product.thumbnails) {

                await ImageModel.deleteOne({ _id: { $in: product.thumbnails } });
            }

            await this.#productModel.deleteOne({ _id: product._id });

            return { message: `El producto con el Id: ${id} y su imagen fue borrado.` };

        } catch (error) {
            throw new ErrorHandler(error);
        }
    }
}