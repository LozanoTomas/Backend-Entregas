const socket = io();

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const errorMessage = document.getElementById("error-message");
const btnDeleteProduct = document.getElementById("btn-delete-product");
const inputProductId = document.getElementById("input-product-id");


socket.on("products-list", (data) => {
    const products = data.products || [];
    
    const productsList = document.getElementById("products-list");

    productsList.innerHTML = "";

    products.forEach((product) => {
      productsList.innerHTML += `
        <div class="card">
          <h3>Titulo: ${product.title}</h3>
          <p>ID:</strong> ${product.id}</p>
          <p><strong>Descripción:</strong> ${product.description}</p>
          <p><strong>Código:</strong> ${product.code}</p>
          <p><strong>Precio:</strong> $${product.price}</p>
          <p><strong>Categoría:</strong> ${product.category}</p>
          <p><strong>Stock:</strong> ${product.stock}</p>
        </div>
      `;
    });
});

productsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    const formdata = new FormData(form);

    errorMessage.innerText = "";
    form.reset();

    socket.emit("insert-product", {
        title: formdata.get("title"),
        description: formdata.get("description"),
        code: formdata.get("code"),
        price: formdata.get("price"),
        category: formdata.get("category"),
        stock: formdata.get("stock"),
        status: formdata.get("status") || "off",
    });
});

    btnDeleteProduct.addEventListener("click", () => {
    const id = inputProductId.value;
    inputProductId.innerText = "";
    errorMessage.innerText = "";

    if(id > 0 ){
        socket.emit("delete-product", {id});
    }
    
});

socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
});