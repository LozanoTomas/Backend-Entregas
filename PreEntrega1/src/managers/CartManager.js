import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import ErrorManager from "./ErrorManager.js";

export default class CartManager {
    #jsonFilename;
    #carts;

    constructor() {
        this.#jsonFilename = "carts.json";
    }

    // Busca un carrito por su ID
    async #findOneById(id) {
        this.#carts = await this.getAll();
        const cartFound = this.#carts.find((item) => item.id === Number(id));

        if (!cartFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return cartFound;
    }

    // Obtiene una lista de productos en el carrito
    async getAll() {
        try {
            this.#carts = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#carts;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Obtiene un carrito específico por su ID
    async getOneById(id) {
        try {
            const cartFound = await this.#findOneById(id);
            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Inserta un carrito
    async insertOne(data) {
        try {
            const carts = data?.carts?.map((item) => {
                return { cart: Number(item.cart), quantity: 1 };
            });

            const cart = {
                id: generateId(await this.getAll()),
                carts: carts ?? [],
            };

            this.#carts.push(cart);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Agrega un producto a un carrito o incrementa la cantidad de un producto existente
    addOneProduct = async (id, cartId) => {
        try {
            const cartFound = await this.#findOneById(id);
            const cartIndex = cartFound.carts.findIndex((item) => item.cart === Number(cartId));

            if (cartIndex >= 0) {
                cartFound.carts[cartIndex].quantity++;
            } else {
                cartFound.carts.push({ cart: Number(cartId), quantity: 1 });
            }

            const index = this.#carts.findIndex((item) => item.id === Number(id));
            this.#carts[index] = cartFound;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);

            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    };
}