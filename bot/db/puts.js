import { collection, addDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.js";

export async function createOrder(phone_number, product, totalPrice, orderReference, address, status = "pending") {
  if (typeof phone_number !== 'string' || typeof product !== 'string' || typeof totalPrice !== 'number' || typeof orderReference !== 'string' || typeof address !== 'string') {
    throw new Error("Invalid input types");
  }

  const order = {
    phone_number: phone_number.trim(),
    product,
    totalPrice,
    orderReference: orderReference.trim(),
    address: address.trim(),
    status: status.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, "orders"), order);
    console.log(docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating order: ", error);
    throw error;
  }
}

