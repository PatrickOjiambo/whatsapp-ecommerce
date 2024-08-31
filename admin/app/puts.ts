import { collection, addDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Function to retrieve all orders with a status of "confirmed"
export async function getConfirmedOrders(): any {
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
  