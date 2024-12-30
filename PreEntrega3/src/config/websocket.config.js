import { Server } from "socket.io";
import ProductManager from "../managers/product.manager.js";

const productInstance = new ProductManager();

export const config = (httpServer) => {

    const socketServer = new Server(httpServer);

    socketServer.on("connection", async (socket) => {
        console.log("Conexion establecida", socket.id);

        socketServer.emit("products-list", { products: await productInstance.getAllProducts() });

        socket.on("create-product", async ( { productData, fileData } ) => {
            try {
                let fileInfo = null;

                if (fileData) {
                    const base64Data = fileData.split(",")[1];
                    const buffer = Buffer.from(base64Data, "base64");

                    console.log("Buffer length:", buffer.length); // Ensure non-zero
                    console.log("Buffer snippet:", buffer.toString("utf8", 0, 100));

                    fileInfo = {
                        originalname: `${productData.title || "uploaded-image"}.jpg`,
                        buffer: buffer,
                        mimetype: "image/jpeg",
                    };
                }

                await productInstance.createNewProduct( productData, fileInfo);

                socketServer.emit("products-list", { products: await productInstance.getAllProducts() });
            } catch (error) {
                socketServer.emit("error-message", { message: error.message });
            }
        });

        socket.on("delete-product", async (id)=>{
            try {
                await productInstance.deleteProductById(id);

                socketServer.emit("products-list", { products: await productInstance.getAllProducts() });

            } catch (error) {
                socketServer.emit("error-message", { message: error.message });
            }
        });

        socket.on("disconnect", () => {
            console.log("Se desconecto un cliente"); // Indica que un cliente se desconectó
        });
    });

};