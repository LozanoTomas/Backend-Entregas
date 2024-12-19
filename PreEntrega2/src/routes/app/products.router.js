import { Router } from "express";
import ProductManager from "../../managers/ProductManager.js";
import moment from "moment";

import {
    ERROR_SERVER,
} from "../../constants/messages.constant.js";

const router = Router();
const productManager = new ProductManager();

router.get("/:id/cart/:rid", async (req, res) => {
    try {
        const { id, rid: cartId } = req.params;
        const data = await productManager.getOneById(id);
        data.createdAt = moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss");
        data.updatedAt = moment(data.updatedAt).format("YYYY-MM-DD HH:mm:ss");
        data.currentCartId = cartId;

        res.status(200).render("product", { title: "Producte", data });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, ERROR_SERVER });
    }
});

export default router;