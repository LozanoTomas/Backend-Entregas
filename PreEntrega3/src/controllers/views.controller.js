export const renderHomeView = async (req, res) => {
    try {
        res.render("home", { title: "Pagina de inicio", styles: `<link rel="stylesheet" href="/api/public/css/home.css">` });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
};

export const renderRealTimeProductsView = async (req, res) => {
    try {
        res.render("realTimeProducts", { title: "Real time products list", styles: `<link rel="stylesheet" href="/api/public/css/realtime.css">` });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
};

export const renderCartView = async (req, res) => {
    try {
        res.render("cart", { title: "Carrito de compras", styles: `<link rel="stylesheet" href="/api/public/css/cart.css">` });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
};

export const renderProductDetails = async (req, res) => {
    try {
        res.render("productDetails", { title: "Detalle del Prducto", styles: `<link rel="stylesheet" href="/api/public/css/product.css">` });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
};