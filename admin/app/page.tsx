"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import {getConfirmedOrders} from './puts'
export default function Home() {
    const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    console.log("Confirmed orders", orders);
  useEffect(() => {
    async function fetchOrders() {
      try {
        const confirmedOrders = await getConfirmedOrders();
        setOrders(confirmedOrders);
      } catch (err) {
        console.log("Error occured while fetching");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-300">
      {/* AppBar */}
      <header className="w-full bg-white shadow-md">
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo.png" // Replace with your logo path
              alt="Logo"
              width={40}
              height={40}
              className="mr-3"
            />
            <span className="text-xl font-semibold">Cairo</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Services
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-between p-24">
        <div>

        </div>
      </main>
    </div>
  );
}
