// ── PRODUCTS DATA ───────────────────────────────────────────────────────────
const products = [
  {
    id: 1,
    name: "The Classic — Vintage Black",
    desc: "380gsm organic cotton. Relaxed fit. The one you'll reach for every day.",
    price: 89,
    oldPrice: 120,
    badge: "Best Seller",
    stock: 7,
    img: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80"
  },
  {
    id: 2,
    name: "The Oversized — Slate Grey",
    desc: "Dropped shoulders, boxy cut. Pairs with everything.",
    price: 95,
    oldPrice: null,
    badge: "New",
    stock: 12,
    img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80"
  },
  {
    id: 3,
    name: "The Archive — Washed Cream",
    desc: "Pre-washed for that vintage broken-in feel. Never goes out of style.",
    price: 99,
    oldPrice: 130,
    badge: "Low Stock",
    stock: 3,
    img: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600&q=80"
  },
  {
    id: 4,
    name: "The Zip — Forest Green",
    desc: "Full-zip heavyweight. Structured collar, no hood — clean and elevated.",
    price: 109,
    oldPrice: null,
    badge: null,
    stock: 9,
    img: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80"
  }
];

// ── CART STATE ───────────────────────────────────────────────────────────────
let cart = [];

// ── RENDER PRODUCTS ──────────────────────────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ""}
        <div class="product-stock">Only ${p.stock} left</div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-bottom">
          <div>
            <span class="product-price">$${p.price}</span>
            ${p.oldPrice ? `<span class="product-price-old">$${p.oldPrice}</span>` : ""}
          </div>
          <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ── CART ─────────────────────────────────────────────────────────────────────
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(i => i.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`✅ ${product.name.split("—")[0].trim()} added to cart`);
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  document.getElementById("cartCount").textContent = totalItems;

  const cartItems = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
    cartFooter.style.display = "none";
  } else {
    cartItems.innerHTML = cart.map(i => `
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}"/>
        <div class="cart-item-info">
          <div class="cart-item-name">${i.name.split("—")[0].trim()}</div>
          <div class="cart-item-size">Qty: ${i.qty}</div>
          <div class="cart-item-price">$${i.price * i.qty}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${i.id})">✕</button>
      </div>
    `).join("");
    document.getElementById("cartTotal").textContent = totalPrice;
    cartFooter.style.display = "block";
  }
}

function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function checkout() {
  const items = cart.map(i => `${i.qty}x ${i.name} ($${i.price * i.qty})`).join(", ");
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const msg = encodeURIComponent(`Hi! I'd like to order:\n${items}\n\nTotal: $${total}`);
  window.open(`https://wa.me/972XXXXXXXXX?text=${msg}`, "_blank");
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

// ── EMAIL CAPTURE ─────────────────────────────────────────────────────────────
function submitEmail(e) {
  e.preventDefault();
  const input = e.target.querySelector("input");
  showToast(`🔔 You're on the list! We'll notify ${input.value}`);
  input.value = "";
}

// ── LIVE ACTIVITY (social proof popups) ───────────────────────────────────────
const activities = [
  { emoji: "🛒", text: "Someone in London just ordered The Classic" },
  { emoji: "🔥", text: "3 people are viewing The Archive right now" },
  { emoji: "✅", text: "Priya from New York just purchased The Zip" },
  { emoji: "⚡", text: "Last 3 units of The Archive remaining!" },
  { emoji: "🛒", text: "Someone in Berlin added The Oversized to cart" },
  { emoji: "💬", text: "Marco just left a 5-star review" },
  { emoji: "🔥", text: "The Classic is selling fast today" },
  { emoji: "✅", text: "Jordan from Toronto just ordered The Oversized" }
];

let actIndex = 0;

function showLiveActivity() {
  const el = document.getElementById("liveActivity");
  const a = activities[actIndex % activities.length];
  actIndex++;

  el.innerHTML = `<span style="font-size:20px">${a.emoji}</span> ${a.text}`;
  el.style.display = "flex";

  setTimeout(() => {
    el.style.animation = "none";
    el.style.display = "none";
    el.style.animation = "";
  }, 4500);
}

// Start live activity popups after 6 seconds, then every 12s
setTimeout(() => {
  showLiveActivity();
  setInterval(showLiveActivity, 12000);
}, 6000);

// ── COUNTDOWN TIMER (urgency) ─────────────────────────────────────────────────
// Adds a small countdown at the bottom of each product to nudge purchases
function startCountdown() {
  // Random end time between 8–18 minutes from now
  const ends = Date.now() + (Math.floor(Math.random() * 10) + 8) * 60 * 1000;

  function tick() {
    const remaining = ends - Date.now();
    if (remaining <= 0) return;

    const m = Math.floor(remaining / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    const timers = document.querySelectorAll(".timer-text");
    timers.forEach(el => {
      el.textContent = `⏳ Sale ends in ${m}:${String(s).padStart(2, "0")}`;
    });

    setTimeout(tick, 1000);
  }

  // Inject timer into each product card
  const cards = document.querySelectorAll(".product-card");
  cards.forEach(card => {
    const timer = document.createElement("div");
    timer.className = "timer-text";
    timer.style.cssText = "font-size:12px;color:#ff3c00;font-weight:700;padding:0 20px 14px;";
    card.appendChild(timer);
  });

  tick();
}

// ── INIT ──────────────────────────────────────────────────────────────────────
renderProducts();

// Start countdown after products render
setTimeout(startCountdown, 100);
