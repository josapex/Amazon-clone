export let cart = JSON.parse(localStorage.getItem('cart'))

if (!cart) {
    cart = [{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2
    }, {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1
    }];
};

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addtocart(productId) {
    let matchingItem;

    cart.forEach((cartitem) => {
        if (productId === cartitem.productId) {
            matchingItem = cartitem;
        }
    });

    const quantitySelector = document.querySelector(`.quantity-seletor-${productId}`);

    const quantity = Number(quantitySelector.value);

    if (matchingItem) {
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity
        });
    }
    saveToStorage()
}

export function calculateCartQuantity() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
  
    return cartQuantity;
}

export function removeFromCart(productId) {
    const newCart = [];

    cart.forEach((cartitem) => {
        if (cartitem.productId !== productId) {
            newCart.push(cartitem)
        }
    });

    cart = newCart;

    saveToStorage()
}

export function updateQuantity(productId, newQuantity) {
    let matchingItem;

    cart.forEach((cartitem) => {
        if (productId === cartitem.productId) {
          matchingItem = cartitem;
        }
    });
    
    matchingItem.quantity = newQuantity;
    
    saveToStorage();
}