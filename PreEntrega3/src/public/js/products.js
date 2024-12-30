
const productsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById("refresh-btn");
const btnGoToCart = document.getElementById("goto-cart-btn");
const btnFirstPage = document.getElementById("first-page");
const btnPreviousPage = document.getElementById("previous-page");
const btnNextPage = document.getElementById("next-page");
const btnLastPage = document.getElementById("last-page");
const currentPageDisplay = document.getElementById("current-page");

let currentPage = 1;
let totalPages;
const itemsPerPage = 4;

const loadProductsList = async (page = 1, sort = null) => {
    const queryParams = new URLSearchParams({
        page,
        limit: itemsPerPage,
    });

    if (sort) {
        queryParams.append("sort", sort);
    }

    const response = await fetch(`/api/products?${queryParams.toString()}`, { method: "GET" });
    const data = await response.json();

    const products = data.payload.docs ?? [];
    totalPages = data.payload.totalPages;
    currentPage = data.payload.page || 1;

    productsList.innerHTML = products.map((product) => `
        <tr>
            <td>${product._id}</td>
            <td>${product.title}</td>
            <td>$${product.price}</td>            
            <td>${product.availability ? "🟢" : "🔴"}</td>
            <td><input type="number" id="quantity-${product._id}" name="quantity"></td>
            <td class="controls-btns">
                <button class="add-to-cart-btn" data-id="${product._id}">Agregar al Carrito</button>
                <button class="view-details-btn" data-id="${product._id}">Ver Detalles</button>
            </td>
        </tr>
    `).join("");

    updatePaginationInfo();
};

document.querySelectorAll(".sort-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
        const sort = event.target.dataset.sort;
        console.log(sort);
        loadProductsList(1, sort);
    });
});

const updatePaginationInfo = () => {
    currentPageDisplay.textContent = `Página ${currentPage}`;
    btnFirstPage.disabled = currentPage === 1;
    btnPreviousPage.disabled = currentPage === 1;
    btnNextPage.disabled = currentPage === totalPages;
    btnLastPage.disabled = currentPage === totalPages;
};

btnFirstPage.addEventListener("click", () => {
    if (currentPage > 1) loadProductsList(1);
});

btnPreviousPage.addEventListener("click", () => {
    if (currentPage > 1) loadProductsList(currentPage - 1);
});

btnNextPage.addEventListener("click", () => {
    if (currentPage < totalPages) loadProductsList(currentPage + 1);
});

btnLastPage.addEventListener("click", () => {
    if (currentPage < totalPages) loadProductsList(totalPages);
});

document.addEventListener("DOMContentLoaded", () => {
    btnGoToCart.addEventListener("click", ()=> {
        window.location.href = "/cart";
    });
});

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("view-details-btn")) {
        const productId = event.target.getAttribute("data-id");
        window.location.href = `/productDetails?productId=${productId}`;
    }
});

document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("add-to-cart-btn")){
        const productId = event.target.getAttribute("data-id");
        const quantityInput = document.getElementById(`quantity-${productId}`);
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
        cartId = "675b738009aabebdea1e84a3";

        try {
            const response = await fetch(`/api/carts/${cartId}/product`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify([{
                    "_id": productId,
                    "quantity": quantity,
                }]),
            });

            if (response.ok) {
                const result = await response.json();

                quantityInput.value = "";
                return result;
            } else {
                throw new Error("Failed to add product to cart:", response.status, response.statusText);

            }

        } catch (error) {
            throw new Error("Error adding product to cart:", error);
        }

    }
});

btnRefreshProductsList.addEventListener("click", () => {
    loadProductsList();
});

loadProductsList();