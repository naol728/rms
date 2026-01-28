import React, { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import cartService from "../../services/cartService";
import { createOrder } from "../../services/orderService";
import { getTables } from "../../services/tableService";
import { supabase } from "@/lib/supabase";
const Cart = () => {
  const [cart, setCart] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    customer_name: "",
    customer_phone: "",
    table_id: null,
    notes: "",
  });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Load cart from database
  useEffect(() => {
    const loadCart = async () => {
      const result = await cartService.getCart();
      if (result.success) {
        setCart(result.data);
      }
    };
    loadCart();
  }, []);
  useEffect(() => {
    const loadTables = async () => {
      try {
        const data = await getTables();
        setTables(data);
      } catch (error) {
        console.error("Failed to load tables:", error);
      }
    };
    loadTables();
  }, []);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    setLoading(true);
    try {
      const result = await cartService.updateCartItem(cartItemId, newQuantity);
      if (result.success) {
        // Reload cart from database
        const cartResult = await cartService.getCart();
        if (cartResult.success) {
          setCart(cartResult.data);
        }
      } else {
        alert(result.error || "Failed to update quantity");
      }
    } catch (error) {
      alert("Error updating quantity");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    try {
      const result = await cartService.removeFromCart(cartItemId);
      if (result.success) {
        // Reload cart from database
        const cartResult = await cartService.getCart();
        if (cartResult.success) {
          setCart(cartResult.data);
        }
      } else {
        alert(result.error || "Failed to remove item from cart");
      }
    } catch (error) {
      alert("Error removing item from cart");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) {
      return;
    }

    setLoading(true);
    try {
      const result = await cartService.clearCart();
      if (result.success) {
        setCart([]);
      } else {
        alert(result.error || "Failed to clear cart");
      }
    } catch (error) {
      alert("Error clearing cart");
    } finally {
      setLoading(false);
    }
  };

  const proceedToCheckout = async () => {
    if (!checkoutData.customer_name.trim()) {
      alert("Please enter customer name");
      return;
    }

    setCheckoutLoading(true);

    try {
      const orderPayload = {
        customer_name: checkoutData.customer_name,
        customer_phone: checkoutData.customer_phone,
        table_id: checkoutData.table_id, // <-- pass selected table here
        notes: checkoutData.notes,
        status: "pending",
        total_amount: cart.reduce((sum, i) => sum + i.total_price, 0),
      };

      const items = cart.map((item) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const order = await createOrder({
        order: orderPayload,
        items,
      });

      // Optional: mark table as unavailable
      if (checkoutData.table_id) {
        await supabase
          .from("tables")
          .update({ is_available: false })
          .eq("id", checkoutData.table_id);
      }

      await cartService.clearCart();
      setCart([]);
      alert(`Order #${order.order_number} created`);
    } catch (err) {
      alert(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div
            className={`transition-all duration-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <ShoppingCart className="h-8 w-8 text-orange-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Shopping Cart
                </h1>
              </div>
              <p className="text-gray-600">Review your order before checkout</p>
            </div>

            {cart.length === 0 ? (
              <Card className="p-8 text-center">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-4">
                  Add some delicious items to get started!
                </p>
                <Button onClick={() => (window.location.href = "/menu")}>
                  Browse Menu
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex">
                        {/* Item Image */}
                        <div className="w-24 h-24 bg-gray-200 flex-shrink-0">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingCart className="h-8 w-8" />
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">
                                ${item.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">each</p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                size="sm"
                                className="rounded-full px-3 bg-gray-200 text-gray-700 hover:bg-gray-300"
                                disabled={loading}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium px-3">
                                {item.quantity}
                              </span>
                              <Button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                size="sm"
                                className="rounded-full px-3 bg-green-500 text-white hover:bg-green-600"
                                disabled={loading}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center space-x-2">
                              <p className="font-semibold text-lg">
                                ${item.total_price.toFixed(2)}
                              </p>
                              <Button
                                onClick={() => removeFromCart(item.id)}
                                size="sm"
                                variant="destructive"
                                className="rounded-full px-3"
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <ShoppingCart className="h-5 w-5 text-orange-600" />
                        <span>Order Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Items ({cart.length})
                        </span>
                        <span className="font-semibold">
                          {/* ${cart.reduce((sum,red)=>)totalPrice.toFixed(2)} */}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (8%)</span>
                        <span className="font-semibold">
                          {/* ${(totalPrice * 0.08).toFixed(2)} */}
                        </span>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-green-600">
                            {/* ${(totalPrice * 1.08).toFixed(2)} */}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        {/* Checkout Form */}
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="customer_name">
                              Customer Name *
                            </Label>
                            <Input
                              id="customer_name"
                              value={checkoutData.customer_name}
                              onChange={(e) =>
                                setCheckoutData({
                                  ...checkoutData,
                                  customer_name: e.target.value,
                                })
                              }
                              placeholder="Enter customer name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="customer_phone">Phone Number</Label>
                            <Input
                              id="customer_phone"
                              value={checkoutData.customer_phone}
                              onChange={(e) =>
                                setCheckoutData({
                                  ...checkoutData,
                                  customer_phone: e.target.value,
                                })
                              }
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="table_id">Select Table</Label>
                            <select
                              id="table_id"
                              value={checkoutData.table_id || ""}
                              onChange={(e) =>
                                setCheckoutData({
                                  ...checkoutData,
                                  table_id: e.target.value
                                    ? parseInt(e.target.value)
                                    : null,
                                })
                              }
                              className="w-full border rounded p-2"
                            >
                              <option value="">Takeout / No Table</option>
                              {tables.map((table) => (
                                <option key={table.id} value={table.id}>
                                  {table.table_number} (Seats: {table.capacity})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <Label htmlFor="notes">Special Instructions</Label>
                            <Input
                              id="notes"
                              value={checkoutData.notes}
                              onChange={(e) =>
                                setCheckoutData({
                                  ...checkoutData,
                                  notes: e.target.value,
                                })
                              }
                              placeholder="Any special requests?"
                            />
                          </div>
                        </div>

                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={proceedToCheckout}
                          disabled={checkoutLoading || cart.length === 0}
                        >
                          {checkoutLoading
                            ? "Creating Order..."
                            : "Proceed to Checkout"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={clearCart}
                          disabled={loading}
                        >
                          Clear Cart
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => (window.location.href = "/menu")}
                        >
                          Continue Shopping
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cart;
