import { Router } from "express";
import { renderHomeView, renderRealTimeProductsView, renderCartView, renderProductDetails } from "../controllers/views.controller.js";

const viewHomeRouter = Router();
const viewRealTimeRouter = Router();
const viewCartRouter = Router();
const viewProductDetailsRouter = Router();

viewHomeRouter.get("/", renderHomeView);

viewRealTimeRouter.get("/", renderRealTimeProductsView);

viewCartRouter.get("/", renderCartView);

viewProductDetailsRouter.get("/", renderProductDetails);

export { viewHomeRouter, viewRealTimeRouter, viewCartRouter, viewProductDetailsRouter };