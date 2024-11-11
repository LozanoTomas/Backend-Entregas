import express from "express";
import routerProducts from "./routes/products.router.js";
import routerComponents from "./routes/carts.router.js";

const app = express();

const PORT = 8080;

app.use("/api/public", express.static("./src/public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/Products", routerProducts);
app.use("/api/Carts", routerComponents);

app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});