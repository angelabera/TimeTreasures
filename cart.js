// Cart management functions
function getCart() {
    return JSON.parse(localStorage.getItem('timetreasures_cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('timetreasures_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

function calculateTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function removeFromCart(itemId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    saveCart(updatedCart);
    displayCart();
    updateCartCount();
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    const cart = getCart();
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = parseInt(newQuantity);
        saveCart(cart);
        displayCart();
        updateCartCount();
    }
}

function displayCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotalContainer.innerHTML = '';
        checkoutBtn.style.display = 'none';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" class="qty-input" value="${item.quantity}" 
                       onchange="updateQuantity(${item.id}, this.value)" min="1">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');
    
    const total = calculateTotal();
    cartTotalContainer.innerHTML = `Total: $${total.toFixed(2)}`;
    checkoutBtn.style.display = 'block';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    updateCartCount();
    
    document.getElementById('checkout-btn').addEventListener('click', () => {
        window.location.href = 'checkout.html?type=cart';
    });
});