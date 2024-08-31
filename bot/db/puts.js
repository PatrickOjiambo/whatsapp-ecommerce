import { collection, addDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.js";
// Function to create an order in Firestore
export async function createOrder(phone_number, product, totalPrice, orderReference, address, status = "pending") {
    const order = {
      phone_number,
      product,
      totalPrice,
      orderReference,
      address,
      status,
      createdAt: new Date().toISOString(),  // Optional: Add a timestamp for when the order was created
    };
  
    try {
      const docRef = await addDoc(collection(db, "orders"), order);
      console.log("All successfull", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating order: ", error);
      throw error;
    }
  }