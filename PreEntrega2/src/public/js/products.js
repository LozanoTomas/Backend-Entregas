const productsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");

const loadProductsList =async () => {
    const response = await fetch("/api/products", {method: "GET"});
    const data = await response.json();
    const products =  data.payload || [];

    productsList.innerText = "" ;

    products.forEach((product) => {
        productsList.innerHTML += `
          <div class="card">
            <h3>${product.title}</h3>
            <p><strong>Descripción:</strong> ${product.description}</p>
            <p><strong>Código:</strong> ${product.code}</p>
            <p><strong>Precio:</strong> $${product.price}</p>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
          </div>
        `;
    });
};

btnRefreshProductsList.addEventListener("click", () => {
    loadProductsList();
})

loadProductsList();