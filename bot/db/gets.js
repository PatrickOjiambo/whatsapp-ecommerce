import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "firebase/firestore";

// Function to retrieve an order based on phone number
export async function getOrderByPhoneNumber(phone_number) {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("phone_number", "==", phone_number));
  
  try {
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    if (orders.length > 0) {
      return orders; // Returns an array of orders for the phone number
    } else {
      return null; // No orders found for the phone number
    }
  } catch (error) {
    console.error("Error retrieving order: ", error);
    throw error;
  }
}

// Function to retrieve all orders with a status of "confirmed"
export async function getConfirmedOrders() {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("status", "==", "confirmed"));
  
  try {
    const querySnapshot = await getDocs(q);
    const confirmedOrders = [];
    querySnapshot.forEach((doc) => {
      confirmedOrders.push({ id: doc.id, ...doc.data() });
    });
    return confirmedOrders; // Returns an array of confirmed orders
  } catch (error) {
    console.error("Error retrieving confirmed orders: ", error);
    throw error;
  }
}

