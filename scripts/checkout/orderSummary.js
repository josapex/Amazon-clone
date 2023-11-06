import { cart, removeFromCart, calculateCartQuantity, updateQuantity, upadteDeliveryOption } from "../../data/cart.js";
import { products, getproduct } from "../../data/products.js";
import formatCurrency from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";

const today = dayjs()

const deliveryDate = today.add(7, 'days');
console.log(deliveryDate.format('dddd, MMMM D'));
export function renderOrderSummary() {
    let cartsummaryHTML = '';

    cart.forEach((cartitem) => {
        // const productId = cartitem.productId;
        const {productId} = cartitem

        const matchingProduct = getproduct(productId);

        const deliveryOptionId = cartitem.deliveryOptionId;
        
        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        cartsummaryHTML += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image" src="${matchingProduct.image}">

                <div class="cart-item-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                        $${formatCurrency(matchingProduct.priceCents)}
                    </div>
                    <div class="product-quantity">
                        <span>
                            Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartitem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                            Update
                        </span>
                        <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number">
                        <span class="save-quantity-link link-primary js-save-quantity" data-product-id="${matchingProduct.id}">save</span>
                        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                            Delete
                        </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionHTML(matchingProduct, cartitem)}
                </div>
            </div>
        </div>
        `;
    });

    function deliveryOptionHTML(matchingProduct, cartitem) {
        let html = '';

        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');
        
            const priceString = deliveryOption.priceCents === 0 
                ? 'FREE' 
                : `$${formatCurrency(deliveryOption.priceCents)} -`;
            
            const isChecked = deliveryOption.id === cartitem.deliveryOptionId;

            html += `
                <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceString} Shipping
                        </div>
                    </div>
                </div>`;
        });

        return html;
    }

    document.querySelector('.js-order-summary').innerHTML = cartsummaryHTML;

    document.querySelectorAll('.js-delete-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                removeFromCart(productId);
                
                const container = document.querySelector(`.js-cart-item-container-${productId}`);
                container.remove();

                updateCartQuantity()
            });
        });

    function updateCartQuantity() {
        const cartQuantity = calculateCartQuantity();

        document.querySelector('.return-to-home-link').innerHTML = `${cartQuantity} items`;
    }

    document.querySelectorAll('.js-update-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId

                const container = document.querySelector(`.js-cart-item-container-${productId}`);
                container.classList.add('is-editing-quantity');
            });
        });
    document.querySelectorAll('.js-save-quantity')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId

                const container = document.querySelector(`.js-cart-item-container-${productId}`);
                container.classList.remove('is-editing-quantity');

                const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

                const newQuantity = Number(quantityInput.value);

                if (newQuantity < 0 || newQuantity >= 1000) {
                    alert('Quantity must be at least 0 and less than 1000');
                    return;
                }

                updateQuantity(productId, newQuantity);

                const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
                quantityLabel.innerHTML = newQuantity;
            
                updateCartQuantity();
            })
        });
    document.querySelectorAll('.js-delivery-option').forEach((element) => {
            element.addEventListener('click', () => {
                const {productId, deliveryOptionId} = element.dataset
                upadteDeliveryOption(productId, deliveryOptionId);
                renderOrderSummary();
            });
        })
}