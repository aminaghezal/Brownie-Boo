// Flavour data with enhanced properties
const flavours = [
    {
        id: 1,
        name: "Classic Chocolate",
        description: "Rich, fudgy chocolate brownies made with premium Belgian cocoa",
        price: 4.99,
        image: "/placeholder.svg?height=250&width=350&text=Classic+Chocolate",
        popular: true,
        category: "chocolate",
        allergens: ["gluten", "eggs", "dairy"],
        rating: 4.9,
        calories: 320
    },
    {
        id: 2,
        name: "Salted Caramel",
        description: "Decadent brownies swirled with house-made salted caramel",
        price: 5.49,
        image: "/placeholder.svg?height=250&width=350&text=Salted+Caramel",
        popular: true,
        category: "caramel",
        allergens: ["gluten", "eggs", "dairy"],
        rating: 5.0,
        calories: 350
    },
    {
        id: 3,
        name: "Walnut Crunch",
        description: "Traditional brownies loaded with premium California walnuts",
        price: 5.29,
        image: "/placeholder.svg?height=250&width=350&text=Walnut+Crunch",
        popular: false,
        category: "nuts",
        allergens: ["gluten", "eggs", "dairy", "nuts"],
        rating: 4.8,
        calories: 380
    },
    {
        id: 4,
        name: "Double Chocolate",
        description: "Extra rich brownies with dark chocolate chunks and cocoa dusting",
        price: 5.79,
        image: "/placeholder.svg?height=250&width=350&text=Double+Chocolate",
        popular: true,
        category: "chocolate",
        allergens: ["gluten", "eggs", "dairy"],
        rating: 4.9,
        calories: 400
    },
    {
        id: 5,
        name: "Peanut Butter",
        description: "Creamy natural peanut butter swirled through rich chocolate",
        price: 5.49,
        image: "/placeholder.svg?height=250&width=350&text=Peanut+Butter",
        popular: false,
        category: "nuts",
        allergens: ["gluten", "eggs", "dairy", "peanuts"],
        rating: 4.7,
        calories: 370
    },
    {
        id: 6,
        name: "Raspberry Delight",
        description: "Fresh raspberry pieces and white chocolate in dark brownies",
        price: 5.99,
        image: "/placeholder.svg?height=250&width=350&text=Raspberry+Delight",
        popular: false,
        category: "fruit",
        allergens: ["gluten", "eggs", "dairy"],
        rating: 4.8,
        calories: 340
    }
];

// Quick add suggestions
const quickAddSuggestions = {
    popular: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 2 },
        { id: 4, quantity: 2 }
    ],
    chocolate: [
        { id: 1, quantity: 2 },
        { id: 4, quantity: 2 }
    ],
    variety: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 2 },
        { id: 3, quantity: 2 },
        { id: 4, quantity: 2 },
        { id: 5, quantity: 2 },
        { id: 6, quantity: 2 }
    ]
};

// Global state
let cart = {};
let gameScore = 0;
let achievements = [];
let orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');

// DOM elements
let flavoursGrid, cartItems, cartCount, totalItems, totalPrice, finalPrice;
let cartTotal, customerForm, progressFill, progressText, cartBadge, cartHeaderTotal;

// Initialize the order page
document.addEventListener('DOMContentLoaded', function() {
    initializeOrderPage();
});

function initializeOrderPage() {
    // Show loading screen briefly
    setTimeout(() => {
        hideLoadingScreen();
    }, 1000);
    
    // Initialize DOM elements
    initializeDOMElements();
    
    // Load saved cart from localStorage
    loadSavedCart();
    
    // Render initial state
    renderFlavours();
    updateCartDisplay();
    updateGameProgress();
    
    // Initialize form handling
    initializeOrderForm();
    
    // Initialize game features
    initializeGameFeatures();
    
    // Set minimum delivery date
    setMinimumDeliveryDate();
    
    // Initialize animations
    initializeOrderAnimations();
}

function initializeDOMElements() {
    flavoursGrid = document.getElementById('flavoursGrid');
    cartItems = document.getElementById('cartItems');
    cartCount = document.getElementById('cartCount');
    totalItems = document.getElementById('totalItems');
    totalPrice = document.getElementById('totalPrice');
    finalPrice = document.getElementById('finalPrice');
    cartTotal = document.getElementById('cartTotal');
    customerForm = document.getElementById('customerForm');
    progressFill = document.getElementById('progressFill');
    progressText = document.getElementById('progressText');
    cartBadge = document.getElementById('cartBadge');
    cartHeaderTotal = document.getElementById('cartHeaderTotal');
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Cart management
function loadSavedCart() {
    const savedCart = localStorage.getItem('brownieCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCart() {
    localStorage.setItem('brownieCart', JSON.stringify(cart));
}

function updateQuantity(flavourId, change) {
    const currentQty = cart[flavourId] || 0;
    const newQty = Math.max(0, currentQty + change);
    
    if (newQty === 0) {
        delete cart[flavourId];
    } else {
        cart[flavourId] = newQty;
    }
    
    // Save cart state
    saveCart();
    
    // Update displays
    updateCartDisplay();
    updateGameProgress();
    renderFlavours(); // Re-render to update quantity displays
    
    // Add visual feedback
    addItemFeedback(flavourId, change);
    
    // Check for achievements
    checkAchievements();
    
    // Play sound effect (if enabled)
    playSound(change > 0 ? 'add' : 'remove');
}

function addItemFeedback(flavourId, change) {
    const card = document.querySelector(`[data-flavour-id="${flavourId}"]`);
    if (card) {
        // Add pulse animation
        card.style.transform = 'scale(1.05)';
        card.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
        
        // Show floating feedback
        const feedback = document.createElement('div');
        feedback.textContent = change > 0 ? '+1' : '-1';
        feedback.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: ${change > 0 ? '#28a745' : '#dc3545'};
            font-weight: bold;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1s ease-out forwards;
        `;
        
        card.style.position = 'relative';
        card.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 1000);
    }
}

function clearCart() {
    if (Object.keys(cart).length === 0) return;
    
    // Show confirmation
    if (confirm('Are you sure you want to clear your entire cart?')) {
        cart = {};
        saveCart();
        updateCartDisplay();
        updateGameProgress();
        renderFlavours();
        
        // Show notification
        showNotification('Cart cleared successfully!', 'info');
        
        // Reset game progress
        gameScore = 0;
        updateGameProgress();
    }
}

// Quick add functionality
function quickAdd(type) {
    const suggestions = quickAddSuggestions[type];
    if (!suggestions) return;
    
    // Clear current cart
    cart = {};
    
    // Add suggested items
    suggestions.forEach(item => {
        cart[item.id] = item.quantity;
    });
    
    // Save and update
    saveCart();
    updateCartDisplay();
    updateGameProgress();
    renderFlavours();
    
    // Show success message
    const totalItems = getTotalItems();
    showNotification(`Added ${totalItems} brownies to your box! 🎉`, 'success');
    
    // Add celebration effect
    createMiniCelebration();
    
    // Update game score
    gameScore += 50;
    checkAchievements();
}

// Render flavour cards
function renderFlavours() {
    if (!flavoursGrid) return;
    
    flavoursGrid.innerHTML = flavours.map(flavour => `
        <div class="flavour-card" data-flavour-id="${flavour.id}" data-aos="fade-up">
            <div class="card-image">
                <img src="${flavour.image}" alt="${flavour.name}" loading="lazy">
                <div class="image-overlay"></div>
                ${flavour.popular ? `
                    <div class="popular-badge">
                        <i class="fas fa-fire"></i>
                        <span>Popular</span>
                    </div>
                ` : ''}
                <div class="price-tag">$${flavour.price.toFixed(2)}</div>
                <div class="rating-overlay">
                    <i class="fas fa-star"></i>
                    <span>${flavour.rating}</span>
                </div>
            </div>
            <div class="card-content">
                <h3>${flavour.name}</h3>
                <p>${flavour.description}</p>
                <div class="card-meta">
                    <div class="calories">
                        <i class="fas fa-fire"></i>
                        <span>${flavour.calories} cal</span>
                    </div>
                    <div class="allergens">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>${flavour.allergens.join(', ')}</span>
                    </div>
                </div>
                <div class="flavour-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${flavour.id}, -1)" ${!cart[flavour.id] ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${cart[flavour.id] || 0}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${flavour.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="add-to-box-btn" onclick="updateQuantity(${flavour.id}, 1)">
                        <i class="fas fa-plus"></i>
                        <span>Add to Box</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Initialize card animations
    initializeFlavourCardAnimations();
}

function initializeFlavourCardAnimations() {
    const cards = document.querySelectorAll('.flavour-card');
    
    cards.forEach((card, index) => {
        // Stagger animation delays
        card.style.animationDelay = `${index * 100}ms`;
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Cart display updates
function updateCartDisplay() {
    const totalItemsCount = getTotalItems();
    const totalPriceAmount = getTotalPrice();
    const discountAmount = calculateDiscount(totalPriceAmount);
    const finalAmount = totalPriceAmount - discountAmount;
    
    // Update header cart summary
    if (cartBadge) cartBadge.textContent = totalItemsCount;
    if (cartCount) cartCount.textContent = `${totalItemsCount} item${totalItemsCount !== 1 ? 's' : ''}`;
    if (cartHeaderTotal) cartHeaderTotal.textContent = `$${finalAmount.toFixed(2)}`;
    
    // Update clear cart button visibility
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.style.display = totalItemsCount > 0 ? 'flex' : 'none';
    }
    
    // Update cart items display
    if (totalItemsCount === 0) {
        if (cartItems) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-cookie-bite"></i>
                    </div>
                    <h4>Your box is empty</h4>
                    <p>Start adding delicious brownies to create your perfect box!</p>
                </div>
            `;
        }
        if (cartTotal) cartTotal.style.display = 'none';
        if (customerForm) customerForm.style.display = 'none';
    } else {
        // Show cart items
        if (cartItems) {
            cartItems.innerHTML = Object.entries(cart).map(([flavourId, qty]) => {
                const flavour = flavours.find(f => f.id === parseInt(flavourId));
                if (!flavour) return '';
                
                return `
                    <div class="cart-item" data-item-id="${flavourId}">
                        <div class="item-info">
                            <h5>${flavour.name}</h5>
                            <p>Qty: ${qty} × $${flavour.price.toFixed(2)}</p>
                        </div>
                        <div class="item-controls">
                            <div class="mini-quantity-controls">
                                <button class="mini-quantity-btn" onclick="updateQuantity(${flavour.id}, -1)">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <button class="mini-quantity-btn" onclick="updateQuantity(${flavour.id}, 1)">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div class="item-price">$${(flavour.price * qty).toFixed(2)}</div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // Show cart total
        if (cartTotal) {
            cartTotal.style.display = 'block';
            if (totalItems) totalItems.textContent = totalItemsCount;
            
            // Update subtotal
            const subtotalElement = document.getElementById('subtotal');
            if (subtotalElement) subtotalElement.textContent = totalPriceAmount.toFixed(2);
            
            // Update discount
            const discountLine = document.getElementById('discountLine');
            const discountAmountElement = document.getElementById('discountAmount');
            if (discountAmount > 0) {
                if (discountLine) discountLine.style.display = 'flex';
                if (discountAmountElement) discountAmountElement.textContent = discountAmount.toFixed(2);
            } else {
                if (discountLine) discountLine.style.display = 'none';
            }
            
            // Update final total
            if (totalPrice) totalPrice.textContent = finalAmount.toFixed(2);
            if (finalPrice) finalPrice.textContent = finalAmount.toFixed(2);
        }
        
        // Show customer form
        if (customerForm) customerForm.style.display = 'block';
    }
}

// Calculation functions
function getTotalItems() {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function getTotalPrice() {
    return Object.entries(cart).reduce((sum, [flavourId, qty]) => {
        const flavour = flavours.find(f => f.id === parseInt(flavourId));
        return sum + (flavour ? flavour.price * qty : 0);
    }, 0);
}

function calculateDiscount(subtotal) {
    // Bulk discount tiers
    if (subtotal >= 100) return subtotal * 0.15; // 15% off for $100+
    if (subtotal >= 75) return subtotal * 0.12;  // 12% off for $75+
    if (subtotal >= 50) return subtotal * 0.10;  // 10% off for $50+
    if (subtotal >= 30) return subtotal * 0.05;  // 5% off for $30+
    return 0;
}

// Game progress system
function updateGameProgress() {
    const totalItems = getTotalItems();
    const maxItems = 24; // Maximum for progress bar
    const progress = Math.min((totalItems / maxItems) * 100, 100);
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
        if (totalItems === 0) {
            progressText.textContent = 'Start building your box!';
        } else if (totalItems < 6) {
            progressText.textContent = `${totalItems} brownies added - Keep going! 🍫`;
        } else if (totalItems < 12) {
            progressText.textContent = `${totalItems} brownies - You're doing great! 🎉`;
        } else if (totalItems < 18) {
            progressText.textContent = `${totalItems} brownies - Almost there! 🚀`;
        } else {
            progressText.textContent = `${totalItems} brownies - Perfect box! 🏆`;
        }
    }
    
    // Update game score
    gameScore = totalItems * 10 + (getTotalPrice() * 2);
}

// Achievement system
function checkAchievements() {
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const uniqueFlavours = Object.keys(cart).length;
    
    const newAchievements = [];
    
    // First brownie achievement
    if (totalItems >= 1 && !achievements.includes('first_brownie')) {
        newAchievements.push({
            id: 'first_brownie',
            title: 'First Bite!',
            description: 'Added your first brownie to the box',
            icon: 'fas fa-cookie-bite'
        });
    }
    
    // Variety lover achievement
    if (uniqueFlavours >= 4 && !achievements.includes('variety_lover')) {
        newAchievements.push({
            id: 'variety_lover',
            title: 'Variety Lover',
            description: 'Tried 4 different flavours',
            icon: 'fas fa-rainbow'
        });
    }
    
    // Big spender achievement
    if (totalPrice >= 50 && !achievements.includes('big_spender')) {
        newAchievements.push({
            id: 'big_spender',
            title: 'Sweet Tooth',
            description: 'Spent over $50 on brownies',
            icon: 'fas fa-dollar-sign'
        });
    }
    
    // Party planner achievement
    if (totalItems >= 20 && !achievements.includes('party_planner')) {
        newAchievements.push({
            id: 'party_planner',
            title: 'Party Planner',
            description: 'Ordered 20+ brownies for the party',
            icon: 'fas fa-party-horn'
        });
    }
    
    // Show new achievements
    newAchievements.forEach(achievement => {
        achievements.push(achievement.id);
        showAchievement(achievement);
    });
    
    // Save achievements
    localStorage.setItem('brownieAchievements', JSON.stringify(achievements));
}

function showAchievement(achievement) {
    const achievementElement = document.createElement('div');
    achievementElement.className = 'achievement-notification';
    achievementElement.innerHTML = `
        <div class="achievement-content">
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="achievement-text">
                <h4>Achievement Unlocked!</h4>
                <h5>${achievement.title}</h5>
                <p>${achievement.description}</p>
            </div>
        </div>
    `;
    
    achievementElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #8B4513;
        padding: 1rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        z-index: 10000;
        max-width: 300px;
        animation: achievementSlide 0.5s ease-out;
        transform: translateX(100%);
    `;
    
    document.body.appendChild(achievementElement);
    
    // Animate in
    setTimeout(() => {
        achievementElement.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        achievementElement.style.transform = 'translateX(100%)';
        setTimeout(() => achievementElement.remove(), 500);
    }, 4000);
    
    // Play achievement sound
    playSound('achievement');
}

// Form handling
function initializeOrderForm() {
    const orderForm = document.getElementById('orderForm');
    const deliveryTypeSelect = document.getElementById('deliveryType');
    const addressGroup = document.getElementById('addressGroup');
    
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmission);
    }
    
    if (deliveryTypeSelect && addressGroup) {
        deliveryTypeSelect.addEventListener('change', function() {
            if (this.value === 'delivery') {
                addressGroup.style.display = 'block';
                document.getElementById('customerAddress').required = true;
            } else {
                addressGroup.style.display = 'none';
                document.getElementById('customerAddress').required = false;
            }
        });
    }
    
    // Add real-time validation
    const inputs = orderForm?.querySelectorAll('input, textarea, select');
    inputs?.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function setMinimumDeliveryDate() {
    const deliveryDateInput = document.getElementById('deliveryDate');
    if (deliveryDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        deliveryDateInput.min = tomorrow.toISOString().split('T')[0];
        
        // Set default to day after tomorrow
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        deliveryDateInput.value = dayAfterTomorrow.toISOString().split('T')[0];
    }
}

function handleOrderSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateOrderForm(form)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    const originalButtonContent = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Processing Order...</span>';
    submitButton.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        processOrder(formData, originalButtonContent, submitButton);
    }, 2000);
}

function processOrder(formData, originalButtonContent, submitButton) {
    const customerInfo = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        deliveryType: formData.get('deliveryType'),
        address: formData.get('address'),
        notes: formData.get('notes'),
        deliveryDate: formData.get('deliveryDate')
    };
    
    const orderData = {
        id: generateOrderId(),
        items: { ...cart },
        customer: customerInfo,
        totals: {
            subtotal: getTotalPrice(),
            discount: calculateDiscount(getTotalPrice()),
            final: getTotalPrice() - calculateDiscount(getTotalPrice())
        },
        timestamp: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Save order to history
    orderHistory.push(orderData);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    
    // Show success modal
    showSuccessModal(orderData);
    
    // Clear cart
    cart = {};
    saveCart();
    
    // Reset form and UI
    document.getElementById('orderForm').reset();
    updateCartDisplay();
    updateGameProgress();
    renderFlavours();
    
    // Restore button
    submitButton.innerHTML = originalButtonContent;
    submitButton.disabled = false;
    
    // Add final achievement
    if (!achievements.includes('order_placed')) {
        achievements.push('order_placed');
        showAchievement({
            id: 'order_placed',
            title: 'Order Master!',
            description: 'Successfully placed your first order',
            icon: 'fas fa-trophy'
        });
    }
    
    // Create celebration effect
    createOrderCelebration();
}

function generateOrderId() {
    return 'SB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 3).toUpperCase();
}

function showSuccessModal(orderData) {
    const modal = document.getElementById('successModal');
    const orderDetails = document.getElementById('orderDetails');
    
    if (modal && orderDetails) {
        // Populate order details
        const itemsList = Object.entries(orderData.items).map(([flavourId, qty]) => {
            const flavour = flavours.find(f => f.id === parseInt(flavourId));
            return `<li>${qty}x ${flavour.name}</li>`;
        }).join('');
        
        orderDetails.innerHTML = `
            <div class="order-summary">
                <h4>Order #${orderData.id}</h4>
                <ul class="order-items">${itemsList}</ul>
                <div class="order-totals">
                    <div class="total-line">
                        <span>Subtotal:</span>
                        <span>$${orderData.totals.subtotal.toFixed(2)}</span>
                    </div>
                    ${orderData.totals.discount > 0 ? `
                        <div class="total-line discount">
                            <span>Discount:</span>
                            <span>-$${orderData.totals.discount.toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div class="total-line final">
                        <span>Total:</span>
                        <span>$${orderData.totals.final.toFixed(2)}</span>
                    </div>
                </div>
                <div class="delivery-info">
                    <p><strong>Delivery:</strong> ${orderData.customer.deliveryType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}</p>
                    <p><strong>Date:</strong> ${new Date(orderData.customer.deliveryDate).toLocaleDateString()}</p>
                </div>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'flex';
        modal.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

// Validation functions
function validateOrderForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Remove existing error
    clearFieldError({ target: field });
    
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    // Phone validation
    else if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-$$$$]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    // Date validation
    else if (fieldType === 'date' && value) {
        const selectedDate = new Date(value);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (selectedDate < tomorrow) {
            isValid = false;
            errorMessage = 'Delivery date must be at least tomorrow.';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: shake 0.5s ease-in-out;
    `;
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = '#dc3545';
    field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    
    field.style.borderColor = '';
    field.style.boxShadow = '';
}

// Animation and effects
function initializeOrderAnimations() {
    // Stagger card animations
    const cards = document.querySelectorAll('.flavour-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Initialize scroll animations
    initializeScrollAnimations();
}

function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.flavour-card, .cart-card, .customer-form-card').forEach(el => {
        observer.observe(el);
    });
}

function createMiniCelebration() {
    const colors = ['#FF8C00', '#8B4513', '#D2B48C', '#FFD700'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: 20%;
                left: ${Math.random() * 100}%;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                z-index: 10000;
                pointer-events: none;
                animation: miniConfettiFall ${Math.random() * 2 + 1}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

function createOrderCelebration() {
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉 Order Placed Successfully! 🎉';
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 2rem 3rem;
        border-radius: 20px;
        font-weight: bold;
        font-size: 1.5rem;
        z-index: 10001;
        box-shadow: 0 20px 40px rgba(40, 167, 69, 0.3);
        animation: celebrationPop 3s ease-out forwards;
        text-align: center;
    `;
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        if (celebration.parentNode) {
            celebration.remove();
        }
    }, 3000);
    
    // Create fireworks effect
    createFireworks();
}

function createFireworks() {
    const colors = ['#FF8C00', '#8B4513', '#D2B48C', '#FFD700', '#28a745', '#dc3545'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.style.cssText = `
                position: fixed;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                z-index: 10000;
                pointer-events: none;
                animation: fireworkExplode ${Math.random() * 2 + 1}s ease-out forwards;
            `;
            
            document.body.appendChild(firework);
            setTimeout(() => firework.remove(), 3000);
        }, i * 30);
    }
}

// Sound effects (optional)
function playSound(type) {
    // This would play actual sound files in a real implementation
    // For now, we'll just use the Web Audio API to create simple tones
    
    if (!window.AudioContext && !window.webkitAudioContext) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    let frequency;
    let duration;
    
    switch (type) {
        case 'add':
            frequency = 800;
            duration = 0.1;
            break;
        case 'remove':
            frequency = 400;
            duration = 0.1;
            break;
        case 'achievement':
            frequency = 1000;
            duration = 0.3;
            break;
        default:
            return;
    }
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);}