const state = {
  products: [],
  categories: [],
  cart: JSON.parse(localStorage.getItem("dreamgirl-cart") || "[]"),
  selectedCategory: ""
};

const $ = (selector) => document.querySelector(selector);
const money = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", maximumFractionDigits: 0
}).format(value);

async function loadData() {
  const [categories, products] = await Promise.all([
    fetch("/api/categories").then(r => r.json()),
    fetch("/api/products").then(r => r.json())
  ]);

  state.categories = categories;
  state.products = products;
  renderCategories();
  renderProducts(products.filter(p => p.featured));
  updateCart();
}

function iconFor(name) {
  return {
    "Camisas": "👚", "Manillas": "📿", "Anillos": "💍", "Perfumes": "🌸",
    "Relojes": "⌚", "Ropa interior": "👙", "Medias": "🧦",
    "Cremas": "🧴", "Bolsos": "👜", "Otros": "✨"
  }[name] || "✨";
}

function renderCategories() {
  $("#categories").innerHTML = state.categories.map(c => `
    <button class="category ${state.selectedCategory === c.name ? "active" : ""}"
      onclick="filterCategory('${c.name.replaceAll("'", "\\'")}')">
      <div class="category-icon">${iconFor(c.name)}</div>
      <span>${c.name}</span>
    </button>
  `).join("");
}

function renderProducts(products) {
  $("#products").innerHTML = products.length ? products.map(p => `
    <article class="product">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <button class="favorite">♡</button>
      </div>
      <h3>${p.name}</h3>
      <div class="price">${money(p.price)}</div>
      <button class="btn" onclick="addToCart(${p.id})" ${p.stock < 1 ? "disabled" : ""}>
        ${p.stock < 1 ? "Agotado" : "Agregar al carrito"}
      </button>
    </article>
  `).join("") : `<p>No encontramos productos con esa búsqueda.</p>`;
}

async function filterCategory(category) {
  state.selectedCategory = category;
  const products = await fetch(`/api/products?category=${encodeURIComponent(category)}`).then(r => r.json());
  $("#productTitle").textContent = category;
  renderCategories();
  renderProducts(products);
  $("#productos").scrollIntoView({ behavior: "smooth" });
}

async function showAllProducts() {
  state.selectedCategory = "";
  const products = await fetch("/api/products").then(r => r.json());
  $("#productTitle").textContent = "Todos los productos";
  renderCategories();
  renderProducts(products);
  $("#productos").scrollIntoView({ behavior: "smooth" });
}
window.showAllProducts = showAllProducts;
window.filterCategory = filterCategory;

async function searchProducts() {
  const q = $("#search").value.trim();
  if (!q) return showAllProducts();
  const products = await fetch(`/api/products?search=${encodeURIComponent(q)}`).then(r => r.json());
  $("#productTitle").textContent = `Resultados para "${q}"`;
  renderProducts(products);
  $("#productos").scrollIntoView({ behavior: "smooth" });
}

function addToCart(id) {
  const product = state.products.find(p => p.id === id);
  if (!product) return;

  const item = state.cart.find(i => i.product_id === id);
  if (item) {
    if (item.quantity < product.stock) item.quantity++;
  } else {
    state.cart.push({ product_id: id, quantity: 1 });
  }
  saveCart();
  openCart();
}

window.addToCart = addToCart;

function saveCart() {
  localStorage.setItem("dreamgirl-cart", JSON.stringify(state.cart));
  updateCart();
}

function updateCart() {
  const detailed = state.cart.map(item => ({
    ...item,
    product: state.products.find(p => p.id === item.product_id)
  })).filter(i => i.product);

  const count = detailed.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = detailed.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

  $("#cartCount").textContent = count;
  $("#cartTitleCount").textContent = `(${count})`;
  $("#cartSubtotal").textContent = money(subtotal);
  $("#cartDelivery").textContent = money(count ? 8000 : 0);
  $("#cartTotal").textContent = money(subtotal + (count ? 8000 : 0));
  $("#checkoutTotal").textContent = money(subtotal + (count ? 8000 : 0));

  $("#cartItems").innerHTML = detailed.length ? detailed.map(i => `
    <div class="cart-item">
      <img src="${i.product.image}" alt="${i.product.name}">
      <div>
        <h4>${i.product.name}</h4>
        <div>${money(i.product.price)}</div>
        <div class="qty">
          <button onclick="changeQty(${i.product_id}, -1)">−</button>
          <span>${i.quantity}</span>
          <button onclick="changeQty(${i.product_id}, 1)">+</button>
        </div>
      </div>
      <button class="remove" onclick="removeFromCart(${i.product_id})">🗑</button>
    </div>
  `).join("") : `<p class="muted">Tu carrito está vacío.</p>`;
}

function changeQty(id, amount) {
  const item = state.cart.find(i => i.product_id === id);
  const product = state.products.find(p => p.id === id);
  if (!item || !product) return;

  item.quantity += amount;
  if (item.quantity <= 0) state.cart = state.cart.filter(i => i.product_id !== id);
  if (item.quantity > product.stock) item.quantity = product.stock;
  saveCart();
}
window.changeQty = changeQty;

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.product_id !== id);
  saveCart();
}
window.removeFromCart = removeFromCart;

function openCart() {
  $("#cart").classList.add("show");
  $("#overlay").classList.add("show");
}
function closeCart() {
  $("#cart").classList.remove("show");
  $("#overlay").classList.remove("show");
}

$("#cartButton").onclick = openCart;
$("#closeCart").onclick = closeCart;
$("#overlay").onclick = closeCart;
$("#showAll").onclick = showAllProducts;

$("#search").addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchProducts();
});

$("#checkoutButton").onclick = () => {
  if (!state.cart.length) return alert("Agrega al menos un producto al carrito.");
  closeCart();
  $("#checkout").classList.add("show");
  $("#orderDate").value = new Date().toISOString().slice(0, 10);
  $("#deliveryDate").min = $("#orderDate").value;
};

$("#closeCheckout").onclick = () => $("#checkout").classList.remove("show");

$("#needsDelivery").addEventListener("change", () => {
  const needs = $("#needsDelivery").value === "1";
  document.querySelector('input[name="address"]').required = needs;
  document.querySelector('input[name="neighborhood"]').required = needs;
  updateCart();
});

let lastOrderMessage = "";

$("#checkoutForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());
  data.needs_delivery = data.needs_delivery === "1";
  data.items = state.cart;

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!response.ok) {
    alert(result.error || "No fue posible registrar el pedido.");
    return;
  }

  const deliveryText = data.needs_delivery
    ? `Domicilio: ${data.address}, ${data.neighborhood}, ${data.city}`
    : "Recogida / entrega acordada con la tienda";

  lastOrderMessage =
`Hola, The Dream Girl Shop. Acabo de realizar el pedido #DG-${String(result.id).padStart(5, "0")}.

Cliente: ${data.customer_name}
Teléfono: ${data.phone}
${deliveryText}
Fecha del pedido: ${data.order_date}
Fecha de entrega: ${data.delivery_date || "Por confirmar"}
Total: ${money(result.total)}

Quedo atenta a la confirmación. 💗`;

  $("#checkout").classList.remove("show");
  state.cart = [];
  saveCart();

  $("#successData").innerHTML = `
    <b>Pedido #DG-${String(result.id).padStart(5, "0")}</b><br>
    Fecha del pedido: ${data.order_date}<br>
    Fecha de entrega: ${data.delivery_date || "Por confirmar"}<br>
    Total: <b>${money(result.total)}</b>
  `;
  $("#success").classList.add("show");
});

$("#whatsappButton").onclick = () => {
  const phone = "573008309863"; // Número de WhatsApp de la tienda
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(lastOrderMessage)}`, "_blank");
};

$("#continueButton").onclick = () => $("#success").classList.remove("show");

loadData();