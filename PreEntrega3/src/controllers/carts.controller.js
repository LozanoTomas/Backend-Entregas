import CartManager from "../managers/cart.manager.js";

const cartInstance = new CartManager();

export const httpCreateNewCart = async (req, res) => {
    try {
        const newCart = await cartInstance.createNewCart();

        res.status(201).json({ message: "Carrito creado", payload: newCart });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};

export const httpGetAllCarts = async (req, res) => {
    try {
        const carts = await cartInstance.getAllCarts();
        res.status(200).json({
            message: "Estos son todos los carritos",
            payload: carts });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};

export const httpGetCartById = async (req, res) => {
    try {
        const currentCart = await cartInstance.getCartById(req.params.cid);

        res.status(200).json({ message: "Este es el carrito que pidio", payload: currentCart });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};

export const httpReplaceProductsInCart = async (req, res) => {
    try {
        const updatedCart = await cartInstance.addProductsToCart(req.params.cid, req.body);

        res.status(200).json({ messsage: "Carrito actualizado", payload: updatedCart });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};

export const httpUpdateProductQuantityInCart = async (req, res) => {
    try {
        const updatedCart = await cartInstance.updateProductQuantityInCart(req.params.cid, req.params.pid, req.body.quantity);

        res.status(200).json({ messsage: "Carrito actualizado", payload: updatedCart });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};

export const httpAddOneProductToCart = async (req, res) => {
    try {
        const updatedCart = await cartInstance.AddOneProductToCart(req.params.cid, req.body);

        res.status(200).json({ messsage: "Carrito actualizado", payload: updatedCart });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};

export const httpRemoveOneProductFromCart = async (req, res) => {
    try {

        const updatedCart = await cartInstance.removeOneProductFromCart(req.params.cid, req.params.pid );

        res.status(200).json({ messsage: "Se borro el producto del carriot", payload: updatedCart });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};

export const htttpDeleteAllProductsFromCart = async (req, res) => {
    try {
        const cart = await cartInstance.deleteAllProductsFromCart(req.params.cid);

        res.status(200).json({ message: "Se vacio el carrito", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};

export const httpDeleteCartById = async (req, res) => {
    try {
        const cart= await cartInstance.deleteCartById(req.params.cid);

        res.status(200).json({ message: "Se borro el carrito", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};