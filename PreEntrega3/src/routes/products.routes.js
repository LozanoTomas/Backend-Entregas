import { Router } from "express";
import { htppGetProductById, httpGetAllproducts, httpCreateNewProduct, httpUpdateProductById, httpDeleteProductById } from "../controllers/products.controller.js";
import uploader from "../utils/uploader.js";

const productRouter = Router();

productRouter.post("/", uploader.single("file"), httpCreateNewProduct);

productRouter.get("/", httpGetAllproducts);

productRouter.get("/:pid", htppGetProductById);

productRouter.delete("/:pid", httpDeleteProductById);

productRouter.put("/:pid", uploader.single("file"), httpUpdateProductById);

export default productRouter;