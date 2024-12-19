import express from "express";
import paths from "./utils/paths.js";
import mongoDB from "./config/mongoose.config.js";
import handlebars from "./config/handlebars.config.js";
import serverSocket from "./config/websocket.config.js";
import homeRouter from "./routes/app/home.view.router.js";
import productsRouter from "./routes/app/products.router.js";
import cartsRouter from "./routes/app/carts.router.js";
import productsApiRouter from "./routes/api/products.router.js";
import cartsApiRouter from "./routes/api/carts.router.js";

const server = express();
const PORT = 8080;
const HOST = "localhost";

// Decodificadores del BODY
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Enrutadores
server.use("/", homeRouter);
server.use("/products", productsRouter);
server.use("/carts", cartsRouter);
server.use("/api/products", productsApiRouter);
server.use("/api/carts", cartsApiRouter);

// Declaración de ruta estática: http://localhost:8080/api/public
server.use("/public", express.static(paths.public));

// Configuración del motor de plantillas
handlebars.config(server);

// Control de rutas inexistentes
server.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

// Control de errores internos
server.use((error, req, res) => {
    console.log("Error:", error.message);
    res.status(500).send("<h1>Error 500</h1><h3>Se ha generado un error en el servidor</h3>");
});

// Método oyente de solicitudes
const serverHTTP = server.listen(PORT, () => {
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
    mongoDB.connectDB();
});

// Configuración del servidor de websocket
serverSocket.config(serverHTTP);