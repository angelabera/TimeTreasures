// Sample 10 products
const products = [
    {name: "Ancient Greek Vase", price: 250, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtmFp7Yj33nPioaoKP0shJD9XLFdVmkri4dA&s", description: "A beautifully crafted ceramic vase from ancient Greece, featuring intricate geometric patterns and mythological scenes."},
    {name: "Vintage Pocket Watch", price: 180, img: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=764&auto=format&fit=crop", description: "An elegant 19th-century pocket watch with gold plating and Roman numerals, perfect for collectors and enthusiasts."},
    {name: "Medieval Knight's Sword", price: 450, img: "https://images.unsplash.com/photo-1636075219672-a422660ce589?q=80&w=687&auto=format&fit=crop", description: "A masterfully forged medieval longsword with authentic craftsmanship, featuring a sharp blade and ornate crossguard."},
    {name: "Egyptian Scarab Amulet", price: 120, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzlLButzGKYRLSfwCQEYJwj2DdpyW6DmRR6H44LkkmbSh9xYYuvxlQ_heJsWr2ioOV2hY&usqp=CAU", description: "A sacred ancient Egyptian scarab beetle amulet symbolizing rebirth and protection, carved from precious stone."},
    {name: "Roman Helmet", price: 400, img: "https://t4.ftcdn.net/jpg/09/63/41/85/360_F_963418585_MWxbe6e4neBtSaHhKJ1kYMjQI9bqX0gI.jpg", description: "An authentic Roman centurion helmet replica with detailed plume and face protection, showcasing imperial craftsmanship."},
    {name: "Ancient Coin Set", price: 90, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjKJu33seUel_Uvd2YG5NjuHIp4o_QQw8i4Q&s", description: "A collection of rare ancient coins from various civilizations, including Roman, Greek, and Byzantine currencies."},
    {name: "Viking Axe Replica", price: 320, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOOjn20yr5hgN6MqgGl2qs7w7Vj3rv0jvo0Q&s", description: "A fierce Viking battle axe replica with hand-carved wooden handle and steel blade, embodying Norse warrior tradition."},
    {name: "Medieval Goblet", price: 150, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0IzjJxUmbgb922-Eo1_ZSt92wJgPEUnJJlQ&s", description: "An ornate medieval drinking goblet made from pewter with intricate engravings, perfect for ceremonial occasions."},
    {name: "Samurai Katana", price: 500, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnnQYvs56P6ZIhme5Cx8krVfmABkt3zGxzHw&s", description: "A traditional Japanese katana with folded steel blade and silk-wrapped handle, representing centuries of samurai tradition."},
    {name: "Ancient Scroll", price: 200, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1mmpd-afgW7Vi-HIUEdrWduuMabt7IoUs7Q&s", description: "A preserved ancient papyrus scroll containing historical texts and hieroglyphics, offering glimpses into past civilizations."}
];

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");

// Function to display products
function displayProducts(items) {
    productList.innerHTML = "";
    items.forEach(prod => {
        const div = document.createElement("div");
        div.classList.add("product-item");
        div.innerHTML = `
            <img src="${prod.img}" alt="${prod.name}">
            <div class="product-content">
                <div>
                    <h3>${prod.name}</h3>
                    <p class="product-description">${prod.description}</p>
                    <p>Price: $${prod.price}</p>
                </div>
                <div class="product-buttons">
                    <button class="buy-btn">Buy Now</button>
                    <button class="add-btn">Add to Cart</button>
                </div>
            </div>
        `;
        productList.appendChild(div);
    });
}

// Cart management functions
function getCart() {
    return JSON.parse(localStorage.getItem('timetreasures_cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('timetreasures_cart', JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1, id: Date.now()});
    }
    
    saveCart(cart);
    showNotification(`${product.name} added to cart!`);
    updateCartCount();
}

function buyNow(product) {
    // Store single product for immediate purchase
    localStorage.setItem('timetreasures_buynow', JSON.stringify(product));
    window.location.href = 'checkout.html?type=buynow';
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart count in navbar if element exists
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f2bf1a;
        color: #2c2c2c;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: 600;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to display products with event listeners
function displayProducts(items) {
    productList.innerHTML = "";
    items.forEach((prod, index) => {
        const div = document.createElement("div");
        div.classList.add("product-item");
        div.innerHTML = `
            <img src="${prod.img}" alt="${prod.name}">
            <div class="product-content">
                <div>
                    <h3>${prod.name}</h3>
                    <p class="product-description">${prod.description}</p>
                    <p>Price: $${prod.price}</p>
                </div>
                <div class="product-buttons">
                    <button class="buy-btn" data-index="${index}">Buy Now</button>
                    <button class="add-btn" data-index="${index}">Add to Cart</button>
                </div>
            </div>
        `;
        productList.appendChild(div);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            buyNow(items[index]);
        });
    });
    
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            addToCart(items[index]);
        });
    });
}

// Initial display
displayProducts(products);
updateCartCount();

// Search functionality
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    displayProducts(filtered);
});

// Sort functionality
sortSelect.addEventListener("change", () => {
    let sorted = [...products];
    if(sortSelect.value === "price-low") {
        sorted.sort((a,b) => a.price - b.price);
    } else if(sortSelect.value === "price-high") {
        sorted.sort((a,b) => b.price - a.price);
    }
    displayProducts(sorted);
});
