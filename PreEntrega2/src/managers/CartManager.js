
import mongoose from "mongoose";
import CartModel from "../models/cart.model.js";
import mongoDB from "../config/mongoose.config.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
    ERROR_NOT_FOUND_INDEX,
} from "../constants/messages.constant.js";

export default class CartManager {
    #cartModel;

    constructor () {
        this.#cartModel = CartModel;
    }

    getAll = async (paramFilters) => {
        try {
            const sort = {
                asc: { name: 1 },
                desc: { name: -1 },
            };

            const paginationOptions = {
                limit: paramFilters?.limit ?? 5,
                page: paramFilters?.page ?? 1,
                sort: sort[paramFilters?.sort] ?? {},
                populate: "products.product",
                lean: true,
            };

            const cartsFound = await this.#cartModel.paginate({}, paginationOptions);

            return cartsFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getOneById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(id).populate("products.product").lean();
            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    insertOne = async (data) => {
        try {
            const cartCreated = new CartModel(data);
            await cartCreated.save();

            return cartCreated;
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    };

    updateOneById = async (id, data) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(id);
            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            cartFound.observations = data.observations;
            cartFound.products = data.products;
            await cartFound.save();

            return cartFound;
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    };

    deleteOneById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(id);
            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            await this.#cartModel.findByIdAndDelete(id);

            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    addOneProductByIdAndProductId = async (id, productId, amount) => {
        try {
            if (!mongoDB.isValidID(id) || !mongoDB.isValidID(productId)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(id);
            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            const currentIndex = cartFound.products.findIndex((product) => product.product.toString() === productId);
            if (currentIndex >= 0) {
                const product = cartFound.products[currentIndex];
                product.amount += amount;
                cartFound.products[currentIndex] = product;
            } else {
                cartFound.products.push({ product: productId, amount });
            }

            await cartFound.save();

            return cartFound;
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    };

    removeOneProductByIdAndProductId = async (id, productId, amount) => {
        try {
            if (!mongoDB.isValidID(id) || !mongoDB.isValidID(productId)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(id);
            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            const currentIndex = cartFound.products.findIndex((product) => product.product.toString() === productId);
            if (currentIndex < 0) {
                throw new Error(ERROR_NOT_FOUND_INDEX);
            }

            const product = cartFound.products[currentIndex];
            if (product.amount > amount) {
                product.amount -= amount;
                cartFound.products[currentIndex] = product;
            } else {
                cartFound.products.splice(currentIndex, 1);
            }

            await cartFound.save();

            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    removeAllProductsById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(id);
            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            cartFound.products = [];
            await cartFound.save();

            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };
}