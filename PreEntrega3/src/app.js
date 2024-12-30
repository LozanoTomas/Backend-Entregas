import express from "express";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import { viewHomeRouter, viewRealTimeRouter, viewCartRouter, viewProductDetailsRouter } from "./routes/views.routes.js";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import { connectDB } from "./config/mongoose.config.js";

const app = express();

const server = express();
const PORT = 8080;
const HOST = "localhost";

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configHandlebars(app);

app.use("/api/public", express.static("./src/public"));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewHomeRouter);
app.use("/realTimeProducts", viewRealTimeRouter);
app.use("/cart", viewCartRouter);
app.use("/productDetails", viewProductDetailsRouter);

app.use("*", (req, res) => {
    res.status(404).render("error404", { title: "Error 404" });
});

const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

configWebsocket(httpServer);