import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import axios from "axios";
import { createOrder } from "./db/puts.js";
import { getOrderByPhoneNumber } from "./db/gets.js";
const client = new Client();

let currentOrder = {};

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  const chatId = msg.from;
  const userMessage = msg.body.toLowerCase().trim();

  // Check if the user is in the middle of an order process
  if (currentOrder[chatId]) {
    if (currentOrder[chatId].step === 1) {
      // Handle the quantity input
      const quantity = parseInt(userMessage);
      if (!isNaN(quantity) && quantity > 0) {
        currentOrder[chatId].quantity = quantity;
        currentOrder[chatId].step = 2;
        client.sendMessage(chatId, "Please provide your delivery address.");
      } else {
        client.sendMessage(chatId, "Please enter a valid quantity.");
      }
    } else if (currentOrder[chatId].step === 2) {
      // Handle the address input
      currentOrder[chatId].address = userMessage;
      currentOrder[chatId].step = 3;
      const { product, quantity, address } = currentOrder[chatId];
      const totalPrice = (product.price * quantity).toFixed(2);
      const response = `You are about to order ${quantity} x ${product.title} for $${totalPrice}.\nDelivery to: ${address}\n\nType *confirm* to place the order or *cancel* to abort.`;
      client.sendMessage(chatId, response);
    } else if (
      userMessage === "confirm" &&
      currentOrder[chatId].step === 3
    ) {
      // Handle the order confirmation
      const { product, quantity, address } = currentOrder[chatId];
      const totalPrice = (product.price * quantity).toFixed(2);
      const orderReference = `ORD-${Math.floor(Math.random() * 1000000)}`;
      // TODO: Save the order details in a DB.
    //   await createOrder(chatId.split("@")[0], product, totalPrice, orderReference, address);
      client.sendMessage(
        chatId,
        `Your order for ${quantity} x ${product.title} has been placed successfully! Total: $${totalPrice}\nDelivery to: ${address}\nOrder Reference: ${orderReference}\n\nPlease proceed with the payment using your preferred method. Your phone number is ${chatId.split('@')[0]}.`
      );
      delete currentOrder[chatId]; // Clear the order once confirmed
    } else if (userMessage === "cancel") {
      // Handle order cancellation
      delete currentOrder[chatId];
      client.sendMessage(chatId, "Your order has been canceled.");
    }
    return; // Exit early if the user is in an order process
  }

  // If no ongoing order, handle other commands
  if (userMessage === "hi" || userMessage === "hello") {
    client.sendMessage(
      chatId,
      "Welcome to Cairo! Type *catalog* to view our jewelry collection or *help* for assistance."
    );
  } else if (userMessage === "catalog") {
    const products = await fetchProducts();
    let response = "Here are our latest jewelry pieces:\n";
    products.forEach((product, index) => {
      response += `${index + 1}. ${product.title}\nPrice: $${product.price}\n`;
    });
    response += `\nType the product number to view details or type *order [Product Number]* to place an order.`;
    client.sendMessage(chatId, response);
  } else if (/^\d+$/.test(userMessage)) {
    const productIndex = parseInt(userMessage) - 1;
    const products = await fetchProducts();
    if (productIndex >= 0 && productIndex < products.length) {
      const product = products[productIndex];
      const response = `Product: ${product.title}\nDescription: ${
        product.description
      }\nPrice: $${product.price}\n\nType *order ${
        productIndex + 1
      }* to place an order or *catalog* to view more products.`;
      client.sendMessage(chatId, response);
    } else {
      client.sendMessage(chatId, "Invalid product number. Please try again.");
    }
  } else if (userMessage.startsWith("order ")) {
    const productIndex = parseInt(userMessage.split(" ")[1]) - 1;
    const products = await fetchProducts();
    if (productIndex >= 0 && productIndex < products.length) {
      const product = products[productIndex];
      currentOrder[chatId] = { product, step: 1 };
      client.sendMessage(
        chatId,
        `You are ordering: ${product.title}\nHow many would you like to order?`
      );
    } else {
      client.sendMessage(chatId, "Invalid product number. Please try again.");
    }
  } else if (userMessage === "help") {
    client.sendMessage(
      chatId,
      "For assistance, type *catalog* to view products, *order [Product Number]* to place an order, or *status* to track your order."
    );
  } else {
    client.sendMessage(
      chatId,
      "Sorry, I didn't understand that. Type *help* for assistance."
    );
  }
});

client.initialize();

async function fetchProducts() {
  try {
    const response = await axios.get(
      "https://fakestoreapi.com/products/category/jewelery"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
