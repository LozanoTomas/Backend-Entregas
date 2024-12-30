
const socket = io();

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const errorMessage = document.getElementById("error-message");
const imputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");

socket.on("products-list", (data) => {
    const products = data.products.docs ?? [];
    productsList.innerHTML = "";

    products.forEach((product) => {
        productsList.innerHTML += `<li> Id: ${product._id}<br>
    Nombre: ${product.title}<br>
    Precio: $ ${product.price}<br>
    Laboratorio: ${product.category} </li>`;
    });
});

productsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    errorMessage.innerText = "";

    const productData = {
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: formData.get("price"),
        status: formData.get("status") === "on",
        stock: formData.get("stock"),
        category: formData.get("category"),
        availability: formData.get("availability") === "on",
    };

    const file = formData.get("thumbnails");

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const fileData = reader.result;

            socket.emit("create-product", { productData, fileData } );
        };
        reader.readAsDataURL(file);
    } else {
        socket.emit("create-product", { productData, fileData: null });
    }

    form.reset();

});

btnDeleteProduct.onclick = () => {
    const id = imputProductId.value;
    imputProductId.value = "";
    errorMessage.innerText = "";

    console.log(id);

    socket.emit("delete-product", id );
};

socket.on("error-message", (data) =>{
    errorMessage.innerText = data.message;
});