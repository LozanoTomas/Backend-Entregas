import { Router } from "express";
import {
    httpCreateNewCart,
    httpReplaceProductsInCart,
    httpGetAllCarts,
    httpGetCartById,
    htttpDeleteAllProductsFromCart,
    httpDeleteCartById,
    httpRemoveOneProductFromCart,
    httpUpdateProductQuantityInCart,
    httpAddOneProductToCart } from "../controllers/carts.controller.js";

const cartRouter = Router();

cartRouter.post("/", httpCreateNewCart);

cartRouter.put("/:cid", httpReplaceProductsInCart);

cartRouter.put("/:cid/product", httpAddOneProductToCart);

cartRouter.put("/:cid/products/:pid", httpUpdateProductQuantityInCart);

cartRouter.get("/:cid", httpGetCartById);

cartRouter.get("/", httpGetAllCarts);

cartRouter.delete("/:cid", httpDeleteCartById);

cartRouter.delete("/:cid/products", htttpDeleteAllProductsFromCart );

cartRouter.delete("/:cid/products/:pid", httpRemoveOneProductFromCart);

export default cartRouter;