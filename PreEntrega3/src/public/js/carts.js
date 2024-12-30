const cartList = document.getElementById("cart-list");
const btnEmptyCart = document.getElementById("empty-cart-btn");
const btnGoBack = document.getElementById("go-back-btn");

const cartId = "675b738009aabebdea1e84a3";

const loadCart = async () => {
    try {
        const response = await fetch(`/api/carts/${cartId}`, { method: "GET" });
        const data = await response.json();

        if (!data || !data.payload) {
            cartList.innerHTML = "<tr><td colspan='4'>No hay productos en el carrito</td></tr>";
            return;
        }

        const cartItems = data.payload.products;

        cartList.innerHTML = cartItems.map((item) =>{
            const { product, quantity } = item;
            const { _id, title, price } = product;

            return `
            <tr>
                <td>${_id}</td>
                <td>${title}</td>
                <td>$${price}</td>
                <td>${quantity}</td>
                <td class="controls-btns">
                    <button class="remove-from-cart-btn" data-id="${_id}">Eliminar</button>
                </td>
            </tr>
        `;}).join("");
    } catch (error) {
        throw new Error("Error loading cart:", error);
    }
};

document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const productId = event.target.getAttribute("data-id");

        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });

            if (response.ok) {
                loadCart();
            } else {
                throw new Error("Failed to remove product from cart");
            }
        } catch (error) {
            throw new Error("Error removing product from cart:", error);
        }
    }
});

btnEmptyCart.addEventListener("click", async () => {
    try {
        const response = await fetch(`/api/carts/${cartId}/products`, { method: "DELETE" });

        if (response.ok) {
            loadCart();
        } else {
            throw new Error("Failed to empty the cart");
        }
    } catch (error) {
        throw new Error("Error emptying the cart:", error);
    }
});

btnGoBack.addEventListener("click", () => {
    window.location.href = "/";
});

document.addEventListener("DOMContentLoaded", loadCart);