const menu = [{
        id: 1,
        name: "Roasted Vegetable Bowl",
        category: "Mains",
        price: 249,
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
        desc: "Seasonal vegetables, grains and herb dressing."
    },
    {
        id: 2,
        name: "Classic Margherita",
        category: "Pizza",
        price: 299,
        img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80",
        desc: "Tomato, mozzarella and fresh basil."
    },
    {
        id: 3,
        name: "House Cheeseburger",
        category: "Mains",
        price: 279,
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
        desc: "Grilled patty, aged cheese and house sauce."
    },
    {
        id: 4,
        name: "Creamy Tomato Pasta",
        category: "Mains",
        price: 269,
        img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80",
        desc: "Pasta tossed in slow-cooked tomato sauce."
    },
    {
        id: 5,
        name: "Crispy Potato Wedges",
        category: "Sides",
        price: 119,
        img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80",
        desc: "Golden wedges with a house seasoning."
    },
    {
        id: 6,
        name: "Garden Side Salad",
        category: "Sides",
        price: 149,
        img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
        desc: "Crisp greens, cucumber and lemon vinaigrette."
    },
    {
        id: 7,
        name: "Fresh Lemon Cooler",
        category: "Drinks",
        price: 89,
        img: "https://images.unsplash.com/photo-1685156329025-05cd54c7b348?w=700",
        desc: "Fresh citrus, lightly sweetened and chilled."
    },
    {
        id: 8,
        name: "Cold Brew Coffee",
        category: "Drinks",
        price: 129,
        img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80",
        desc: "Slow-steeped coffee served over ice."
    }
];

let cart = {};

try {
    cart = JSON.parse(localStorage.getItem("table-cart") || "{}");

    if (!cart || typeof cart !== "object" || Array.isArray(cart)) {
        cart = {};
    }
} catch {
    cart = {};
}

let filter = "All";

const $ = id => document.getElementById(id);
const money = n => "₹" + n.toLocaleString("en-IN");

// Render menu items
function renderMenu() {
    const list = menu.filter(
        item => filter === "All" || item.category === filter
    );

    $("products").innerHTML = list.map(item => `
        <article class="product">
            <div class="product-img">
                <img
                    loading="lazy"
                    src="${item.img}"
                    alt="${item.name}"
                    data-fallback="false"
                >
            </div>

            <div class="product-info">
                <span class="category">${item.category}</span>
                <h3>${item.name}</h3>
                <p>${item.desc}</p>

                <div class="product-bottom">
                    <span class="price">${money(item.price)}</span>
                    <button
                        class="add"
                        data-add="${item.id}"
                        aria-label="Add ${item.name} to cart"
                    >+</button>
                </div>
            </div>
        </article>
    `).join("");
}

// Use a local fallback if an image fails to load
$("products").addEventListener("error", event => {
    const img = event.target;

    if (img.tagName !== "IMG" || img.dataset.fallback === "true") {
        return;
    }

    img.dataset.fallback = "true";

    // Neutral placeholder; replace with a local food image if desired.
    img.removeAttribute("src");
    img.alt = "Image unavailable: " + img.alt;
    img.style.display = "none";
    img.parentElement.style.background =
        "linear-gradient(135deg, #e8e5dc, #f5f2eb)";
}, true);

// Render shopping cart
function renderCart() {
    const items = menu.filter(item => Number(cart[item.id]) > 0);

    const qty = items.reduce(
        (sum, item) => sum + Number(cart[item.id]),
        0
    );

    const total = items.reduce(
        (sum, item) => sum + item.price * Number(cart[item.id]),
        0
    );

    $("count").textContent = qty;
    $("subtotal").textContent = money(total);

    $("cart-lines").innerHTML = items.length ?
        items.map(item => `
            <div class="line-item">
                <div>
                    <strong>${item.name}</strong>
                    <small>${money(item.price)} each</small>

                    <div class="quantity">
                        <button
                            data-change="${item.id}"
                            data-delta="-1"
                            aria-label="Remove one ${item.name}"
                        >−</button>

                        <span>${cart[item.id]}</span>

                        <button
                            data-change="${item.id}"
                            data-delta="1"
                            aria-label="Add one ${item.name}"
                        >+</button>
                    </div>
                </div>

                <span class="line-total">
                    ${money(item.price * Number(cart[item.id]))}
                </span>
            </div>
        `).join("") :
        `<div class="empty">
            Your order is empty.<br>
            Choose an item from the menu to begin.
        </div>`;

    $("checkout").disabled = items.length === 0;

    try {
        localStorage.setItem("table-cart", JSON.stringify(cart));
    } catch (error) {
        console.warn("Cart could not be saved in this browser.", error);
    }
}

// Display notification
let noticeTimer;

function notify(message) {
    $("notice").textContent = message;
    $("notice").classList.add("show");

    clearTimeout(noticeTimer);

    noticeTimer = setTimeout(() => {
        $("notice").classList.remove("show");
    }, 2600);
}

// Open and close cart
function showCart() {
    $("drawer").classList.add("visible");
    $("shade").classList.add("visible");
    $("drawer").setAttribute("aria-hidden", "false");
}

function hideCart() {
    $("drawer").classList.remove("visible");
    $("shade").classList.remove("visible");
    $("drawer").setAttribute("aria-hidden", "true");
}

// Filter products
$("filters").addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");

    if (!button) return;

    filter = button.dataset.filter;

    document.querySelectorAll("[data-filter]").forEach(item => {
        item.classList.toggle("active", item === button);
    });

    renderMenu();
});

// Add product to cart
$("products").addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    const id = Number(button.dataset.add);

    cart[id] = (Number(cart[id]) || 0) + 1;

    renderCart();
    notify("Added to your order.");
});

// Update cart quantity
$("cart-lines").addEventListener("click", event => {
    const button = event.target.closest("[data-change]");

    if (!button) return;

    const id = Number(button.dataset.change);
    const delta = Number(button.dataset.delta);

    cart[id] = (Number(cart[id]) || 0) + delta;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    renderCart();
});

// Cart controls
$("open-cart").addEventListener("click", showCart);
$("close-cart").addEventListener("click", hideCart);
$("shade").addEventListener("click", hideCart);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        hideCart();
    }
});

// Open checkout
$("checkout").addEventListener("click", () => {
    if (!menu.some(item => Number(cart[item.id]) > 0)) return;

    hideCart();
    $("checkout-dialog").showModal();
});

$("close-dialog").addEventListener("click", () => {
    $("checkout-dialog").close();
});

// Demo checkout — no real order is sent to a server
$("checkout-form").addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const order = {
        reference: "TT" + Date.now().toString().slice(-6),
        name: formData.get("name"),
        phone: formData.get("phone"),
        address: formData.get("address"),

        items: menu
            .filter(item => Number(cart[item.id]) > 0)
            .map(item => ({
                name: item.name,
                quantity: Number(cart[item.id]),
                price: item.price
            })),

        total: menu.reduce(
            (sum, item) =>
            sum + item.price * (Number(cart[item.id]) || 0),
            0
        ),

        createdAt: new Date().toISOString()
    };

    try {
        localStorage.setItem("table-last-order", JSON.stringify(order));
    } catch (error) {
        console.warn("Demo order could not be saved.", error);
    }

    cart = {};

    renderCart();
    event.target.reset();
    $("checkout-dialog").close();

    notify("Demo order " + order.reference + " confirmed.");
});

// Initialise website
renderMenu();
renderCart();
