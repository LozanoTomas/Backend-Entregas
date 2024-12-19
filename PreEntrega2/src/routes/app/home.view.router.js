import { Router } from "express";
import ProductManager from "../../managers/ProductManager.js";

import {
    ERROR_SERVER,
} from "../../constants/messages.constant.js";

const router = Router();
const productManager = new ProductManager();
const currentcartId = "6695d0d93bfd208904213471";

router.get("/products", async (req, res) => {
    try {
        const data = await productManager.getAll(req.query);
        data.sort = req.query?.sort ? `&sort=${req.query.sort}` : "";
        data.currentcartId = currentcartId;
        data.docs = data.docs.map((doc) => {
            return { ...doc, currentcartId };
        });

        res.status(200).render("index", { title: "Inicio", data });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, ERROR_SERVER });
    }
});

router.get("/real-time-products", async (req, res) => {
    try {
        res.status(200).render("realTimeProducts", { title: "Tiempo Real" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: false, ERROR_SERVER });
    }
});

export default router;