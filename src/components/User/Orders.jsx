import React, { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  Receipt,
} from "lucide-react";
import { getOrders, updateOrderStatus } from "../../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const statuses = ["All", "Preparing", "Ready", "Delivered", "Cancelled"];

  const loadOrders = async (status) => {
    setLoading(true);
    try {
      const data = await getOrders({ status });
      setOrders(data);
    } catch (err) {
      alert("Failed to fetch orders: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(filterStatus);
  }, [filterStatus]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_items.some((item) =>
        item.menu_items.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      Preparing: "bg-yellow-100 text-yellow-800",
      Ready: "bg-blue-100 text-blue-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Preparing":
        return <Clock className="h-4 w-4" />;
      case "Ready":
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const reorderItems = (order) => {
    alert(
      `Reordering items from ${order.order_number}. This would add items to your cart.`,
    );
  };

  const trackOrder = (order) => {
    alert(
      `Tracking order ${order.order_number}. This would show real-time updates.`,
    );
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      alert("Failed to update order status: " + err.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <div className="flex space-x-2">
                {statuses
                  .filter((s) => s !== "All")
                  .map((s) => (
                    <Badge key={s} className={getStatusColor(s)}>
                      {
                        orders.filter((o) => o.status === s.toLowerCase())
                          .length
                      }{" "}
                      {s}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders by number or items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <Card>
              <CardHeader>
                <CardTitle>Order History ({filteredOrders.length})</CardTitle>
                <CardDescription>
                  View and manage your restaurant orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <p className="text-center py-6">Loading orders...</p>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders found
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm || filterStatus !== "All"
                          ? "Try adjusting your search or filter criteria"
                          : "You haven't placed any orders yet"}
                      </p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {order.order_number}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {order.table_id
                                ? `Table ${order.table_id}`
                                : "Takeout"}{" "}
                              • {order.order_type || "Dine In"}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(
                                  order.created_at,
                                ).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(order.created_at).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">
                              ${order.total_amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.order_items.length} items
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Order Details - {order.order_number}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Complete order information and actions
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium">
                                        Order Date
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {new Date(
                                          order.created_at,
                                        ).toLocaleDateString()}{" "}
                                        at{" "}
                                        {new Date(
                                          order.created_at,
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        Table
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {order.table_id
                                          ? `Table ${order.table_id}`
                                          : "Takeout"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        Status
                                      </p>
                                      <Select
                                        value={order.status}
                                        onValueChange={(value) =>
                                          handleStatusChange(order.id, value)
                                        }
                                      >
                                        <SelectTrigger className="w-full sm:w-48">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {statuses
                                            .filter((s) => s !== "All")
                                            .map((status) => (
                                              <SelectItem
                                                key={status}
                                                value={status.toLowerCase()}
                                              >
                                                {status}
                                              </SelectItem>
                                            ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium mb-2">
                                      Items Ordered
                                    </p>
                                    <div className="space-y-2">
                                      {order.order_items.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                        >
                                          <span className="text-sm">
                                            {item.menu_items.name} x
                                            {item.quantity}
                                          </span>
                                          <span className="text-sm font-medium">
                                            $
                                            {(
                                              item.total_price ||
                                              item.unit_price
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t">
                                      <span className="font-medium">Total</span>
                                      <span className="font-medium">
                                        ${order.total_amount.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex space-x-2 pt-4">
                                    {order.status === "Delivered" && (
                                      <Button
                                        onClick={() => reorderItems(order)}
                                        className="flex-1"
                                      >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Reorder
                                      </Button>
                                    )}
                                    {(order.status === "Preparing" ||
                                      order.status === "Ready") && (
                                      <Button
                                        onClick={() => trackOrder(order)}
                                        variant="outline"
                                        className="flex-1"
                                      >
                                        <Clock className="h-4 w-4 mr-2" />
                                        Track Order
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      className="flex-1"
                                    >
                                      <Receipt className="h-4 w-4 mr-2" />
                                      View Receipt
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Orders;
