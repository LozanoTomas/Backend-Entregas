import { Router } from "express";
import CartManager from "../../managers/CartManager.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../../constants/messages.constant.js";

const errorHandler = (res, message) => {
    if (message === ERROR_INVALID_ID) return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
    if (message === ERROR_NOT_FOUND_ID) return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
    return res.status(500).json({ status: false, message });
};

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const cartsFound = await cartManager.getAll(req.query);
        res.status(200).json({ status: true, payload: cartsFound });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const cartFound = await cartManager.getOneById(req.params.id);
        res.status(200).json({ status: true, payload: cartFound });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.post("/", async (req, res) => {
    try {
        const cartCreated = await cartManager.insertOne(req.body);
        res.status(201).json({ status: true, payload: cartCreated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const cartUpdated = await cartManager.updateOneById(req.params.id, req.body);
        res.status(200).json({ status: true, payload: cartUpdated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const cartDeleted = await cartManager.deleteOneById(req.params.id);
        res.status(200).json({ status: true, payload: cartDeleted });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.put("/:id/products/:iid", async (req, res) => {
    try {
        const { id, iid: productId } = req.params;
        const { amount } = req.body;
        const cartCreated = await cartManager.addOneProductByIdAndProductId(id, productId, amount ?? 1);
        res.status(200).json({ status: true, payload: cartCreated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.delete("/:id/products/:iid", async (req, res) => {
    try {
        const { id, iid: productId } = req.params;
        const cartDeleted = await cartManager.removeOneProductByIdAndProductId(id, productId, 1);
        res.status(200).json({ status: true, payload: cartDeleted });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

router.delete("/:id/products", async (req, res) => {
    try {
        const cartDeleted = await cartManager.removeAllProductsById(req.params.id);
        res.status(200).json({ status: true, payload: cartDeleted });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

export default router;