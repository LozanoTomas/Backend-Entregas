import ProductManager from "../managers/product.manager.js";

const productInstance = new ProductManager();

export const httpCreateNewProduct = async (req, res) =>{
    try {
        const newProduct = await productInstance.createNewProduct(req.body, req.file);

        res.status(201).json({ status: "Success", payload: newProduct });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};

export const httpGetAllproducts = async (req, res) => {
    try {
        const params = req.query;
        const products = await productInstance.getAllProducts(params);

        res.status(200).json({
            status: "Success",
            payload: products });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};

export const htppGetProductById = async (req, res) => {
    try {
        const product = await productInstance.getProductById(req.params.pid);

        res.status(200).json({ message: "This is the product you requested", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};

export const httpUpdateProductById = async (req, res) => {
    try {
        const product = await productInstance.updateProductById(req.params.pid, req.body, req.file);

        res.status(200).json({ message: "Product updated", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};

export const httpDeleteProductById = async (req, res)=> {
    try {
        const product = await productInstance.deleteProductById(req.params.pid);

        res.status(200).json({ message: "Product Deleted", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message });
    }
};