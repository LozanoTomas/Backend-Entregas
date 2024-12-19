import { Server } from "socket.io";
import ProductManager from "../managers/ProductManager.js";
import FileSystem from "../utils/fileHandler.js";
import paths from "../utils/paths.js";
import { generateNameForFile } from "../utils/random.js";

const productManager = new ProductManager();
const fileSystem = new FileSystem();
let serverSocket = null;

const config = (serverHTTP) => {
    serverSocket = new Server(
        serverHTTP,
        {
            maxHttpBufferSize: 5e6, // Permitir archivos hasta 5MB (por defecto es 1MB)
        },
    );

    serverSocket.on("connection", async (socket) => {
        const response = await productManager.getAll({ limit: 100 });
        console.log("Socket connected");

        // Envía la lista de productes al conectarse
        serverSocket.emit("products-list", response);

        socket.on("insert-product", async (data) => {
            if (data?.file) {
                const filename = generateNameForFile(data.file.name);
                await fileSystem.write(paths.images, filename, data.file.buffer);

                await productManager.insertOne(data, filename);
                const response = await productManager.getAll({ limit: 100 });

                //Envía la lista de productes actualizada después de insertar
                serverSocket.emit("products-list", response);
            }
        });

        socket.on("delete-product", async (data) => {
            await productManager.deleteOneById(data.id);
            const response = await productManager.getAll({ limit: 100 });

            // Envía la lista de productes actualizada después de eliminar
            serverSocket.emit("products-list", response);
        });
    });
};

const updateProductsList = async () => {
    const response = await productManager.getAll({ limit: 100 });

    // Envía la lista de productes actualizada
    serverSocket.emit("products-list", { response });
};

export default {
    config,
    updateProductsList,
};