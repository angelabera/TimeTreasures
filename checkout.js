// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const checkoutType = urlParams.get('type');

let orderItems = [];
let selectedPaymentMethod = null;

// Initialize checkout
document.addEventListener('DOMContentLoaded', () => {
    loadOrderItems();
    displayOrderSummary();
    setupEventListeners();
});

function loadOrderItems() {
    if (checkoutType === 'buynow') {
        const product = JSON.parse(localStorage.getItem('timetreasures_buynow'));
        if (product) {
            orderItems = [{...product, quantity: 1}];
        }
    } else {
        orderItems = JSON.parse(localStorage.getItem('timetreasures_cart')) || [];
    }
}

function displayOrderSummary() {
    const orderSummaryContainer = document.getElementById('order-summary');
    
    if (orderItems.length === 0) {
        orderSummaryContainer.innerHTML = '<div>No items to checkout</div>';
        return;
    }
    
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 200 ? 0 : 15; // Free shipping over $200
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    orderSummaryContainer.innerHTML = `
        ${orderItems.map(item => `
            <div class="summary-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('')}
        <div class="summary-item">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Shipping:</span>
            <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Tax:</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

function setupEventListeners() {
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', () => {
            // Remove selected class from all methods
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
            
            // Add selected class to clicked method
            method.classList.add('selected');
            selectedPaymentMethod = method.getAttribute('data-method');
            
            // Show/hide payment details based on method
            const paymentDetails = document.getElementById('payment-details');
            if (selectedPaymentMethod === 'card') {
                paymentDetails.style.display = 'block';
            } else {
                paymentDetails.style.display = 'none';
            }
            
            validateForm();
        });
    });
    
    // Form validation
    const form = document.getElementById('checkout-form');
    const formInputs = form.querySelectorAll('input[required]');
    
    formInputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });
    
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
            e.target.value = formattedValue;
            validateForm();
        });
    }
    
    // Expiry date formatting
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
            validateForm();
        });
    }
    
    // CVV validation
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
            validateForm();
        });
    }
    
    // Place order button
    document.getElementById('place-order-btn').addEventListener('click', placeOrder);
}

function validateForm() {
    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    const placeOrderBtn = document.getElementById('place-order-btn');
    
    let isValid = true;
    
    // Check required form fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    requiredFields.forEach(field => {
        if (!formData.get(field)) {
            isValid = false;
        }
    });
    
    // Check payment method
    if (!selectedPaymentMethod) {
        isValid = false;
    }
    
    // Check card details if card payment is selected
    if (selectedPaymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;
        
        if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) isValid = false;
        if (!expiryDate || expiryDate.length < 5) isValid = false;
        if (!cvv || cvv.length < 3) isValid = false;
        if (!cardName) isValid = false;
    }
    
    placeOrderBtn.disabled = !isValid;
}

function placeOrder() {
    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    
    // Simulate order processing
    const placeOrderBtn = document.getElementById('place-order-btn');
    placeOrderBtn.textContent = 'Processing...';
    placeOrderBtn.disabled = true;
    
    setTimeout(() => {
        // Create order object
        const order = {
            id: 'TT' + Date.now(),
            items: orderItems,
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: {
                    street: formData.get('address'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    zipCode: formData.get('zipCode')
                }
            },
            paymentMethod: selectedPaymentMethod,
            total: calculateTotal(),
            date: new Date().toISOString(),
            status: 'confirmed'
        };
        
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('timetreasures_orders')) || [];
        orders.push(order);
        localStorage.setItem('timetreasures_orders', JSON.stringify(orders));
        
        // Clear cart if coming from cart
        if (checkoutType === 'cart') {
            localStorage.removeItem('timetreasures_cart');
        } else {
            localStorage.removeItem('timetreasures_buynow');
        }
        
        // Show success message
        document.getElementById('success-message').style.display = 'block';
        placeOrderBtn.style.display = 'none';
        
        // Redirect to success page after delay
        setTimeout(() => {
            window.location.href = 'index.html?order=success';
        }, 3000);
        
    }, 2000);
}

function calculateTotal() {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 200 ? 0 : 15;
    const tax = subtotal * 0.08;
    return subtotal + shipping + tax;
}

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Phone validation
function isValidPhone(phone) {
    return /^\d{10,}$/.test(phone.replace(/[\s-()]/g, ''));
}