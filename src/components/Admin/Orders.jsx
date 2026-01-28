import React, { useState } from "react";
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
import { Search, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";
import {
  getOrders,
  updateOrderStatus as updateOrderStatusAPI,
} from "@/services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = [
    "All",
    "Pending",
    "Preparing",
    "Ready",
    "Served",
    "Cancelled",
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.table.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatusAPI(orderId, newStatus);
      await fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      const data = await getOrders({ status: filterStatus });

      setOrders(
        data.map((order) => ({
          id: order.id,
          orderNumber: order.order_number,
          table: order.table_id ? `Table ${order.table_id}` : "Takeaway",
          customer: order.customer_name || "Guest",
          items: order.order_items.map((i) => ({
            name: i.menu_items.name,
            quantity: i.quantity,
            price: i.total_price,
          })),
          total: order.total_amount,
          status: capitalize(order.status),
          orderTime: new Date(order.created_at).toLocaleTimeString(),
          estimatedTime: order.status === "ready" ? "Ready" : "In progress",
          waiter: order.waiter_id || "—",
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-gray-100 text-gray-800",
      Preparing: "bg-yellow-100 text-yellow-800",
      Ready: "bg-green-100 text-green-800",
      Served: "bg-blue-100 text-blue-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Preparing":
        return <Clock className="h-4 w-4" />;
      case "Ready":
        return <CheckCircle className="h-4 w-4" />;
      case "Served":
        return <CheckCircle className="h-4 w-4" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
              <h1 className="text-3xl font-bold text-gray-900">
                Order Management
              </h1>
              <div className="flex space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  {orders.filter((o) => o.status === "Pending").length} Pending
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800"
                >
                  {orders.filter((o) => o.status === "Preparing").length}{" "}
                  Preparing
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {orders.filter((o) => o.status === "Ready").length} Ready
                </Badge>
              </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders by number, customer, or table..."
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
                <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                <CardDescription>
                  Monitor and manage all restaurant orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <h3 className="font-medium">{order.orderNumber}</h3>
                          <p className="text-sm text-gray-500">
                            {order.table} • {order.customer}
                          </p>
                          <p className="text-sm text-gray-500">
                            Waiter: {order.waiter} • {order.orderTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">
                            ${order.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.items.length} items
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.estimatedTime}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
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
                                  Order Details - {order.orderNumber}
                                </DialogTitle>
                                <DialogDescription>
                                  Complete order information and status
                                  management
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">
                                      Customer
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {order.customer}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Table</p>
                                    <p className="text-sm text-gray-600">
                                      {order.table}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      Waiter
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {order.waiter}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      Order Time
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {order.orderTime}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-sm font-medium mb-2">
                                    Items Ordered
                                  </p>
                                  <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                      <div
                                        key={index}
                                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                      >
                                        <span className="text-sm">
                                          {item.name} x{item.quantity}
                                        </span>
                                        <span className="text-sm font-medium">
                                          ${item.price.toFixed(2)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex justify-between items-center mt-2 pt-2 border-t">
                                    <span className="font-medium">Total</span>
                                    <span className="font-medium">
                                      ${order.total.toFixed(2)}
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-sm font-medium mb-2">
                                    Update Status
                                  </p>
                                  <div className="flex space-x-2">
                                    {[
                                      "Pending",
                                      "Preparing",
                                      "Ready",
                                      "Served",
                                    ].map((status) => (
                                      <Button
                                        key={status}
                                        variant={
                                          order.status === status
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                          updateOrderStatus(order.id, status)
                                        }
                                      >
                                        {status}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {order.status !== "Served" &&
                            order.status !== "Cancelled" && (
                              <Select
                                value={order.status}
                                onValueChange={(value) =>
                                  updateOrderStatus(order.id, value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="Preparing">
                                    Preparing
                                  </SelectItem>
                                  <SelectItem value="Ready">Ready</SelectItem>
                                  <SelectItem value="Served">Served</SelectItem>
                                  <SelectItem value="Cancelled">
                                    Cancelled
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
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
