import React, { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDropzone } from "react-dropzone";
import menuService from "@/services/menuService";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: "",
    available: true,
  });

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const fetchMenu = async () => {
    const res = await menuService.getMenuItems();
    if (res.success) {
      setMenuItems(
        res.data.map((item) => ({
          ...item,
          image: item.image_url,
          available: item.is_available,
          category_name: item.category_id?.name,
        })),
      );
    }
  };

  const fetchCategories = async () => {
    const res = await menuService.getCategories();
    if (res.success) setCategories(res.data);
  };

  /* ---------------- DROPZONE ---------------- */

  const onDrop = (files) => {
    if (files[0]) {
      const file = files[0];
      setUploadedFile(file);
      setFormData((prev) => ({ ...prev, file }));

      // Preview
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  /* ---------------- HANDLERS ---------------- */
  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category_id: item.category_id?.id || "",
        available: item.available,
      });

      setPreviewImage(item.image); // show stored image
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category_id: "",
        available: true,
      });
      setPreviewImage(null);
    }

    setUploadedFile(null);
    setModalOpen(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      file: uploadedFile,
    };
    console.log(payload);

    let res;
    if (editingItem) {
      res = await menuService.updateMenuItem(editingItem.id, payload);
    } else {
      res = await menuService.addMenuItem(payload);
    }

    if (!res.success) {
      alert(res.error);
      return;
    }

    setModalOpen(false);
    fetchMenu();
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this menu item?")) return;
    await menuService.deleteMenuItem(id);
    fetchMenu();
  };

  const toggleAvailability = async (item) => {
    await menuService.toggleAvailability(item.id, !item.available);
    fetchMenu();
  };

  /* ---------------- FILTER ---------------- */

  const filteredItems = menuItems.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between mb-4">
              <h1 className="text-3xl font-bold">Menu Management</h1>
              <Button onClick={() => openModal()}>Add Item</Button>
            </div>

            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-6"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative h-52">
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/400x225?text=No+Image"
                      }
                      className="w-full h-full object-cover"
                    />

                    <Badge className="absolute top-2 left-2">
                      {item.category_name}
                    </Badge>

                    <Badge
                      className={`absolute top-2 right-2 ${
                        item.available ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="font-bold mt-2">${item.price.toFixed(2)}</p>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={() => openModal(item)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAvailability(item)}
                      >
                        Toggle
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteItem(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </main>

        {/* MODAL */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
              />
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
              />

              <Select
                value={formData.category_id}
                onValueChange={(v) =>
                  setFormData({ ...formData, category_id: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* IMAGE UPLOAD */}
              <div className="space-y-3">
                <Label>Menu Image</Label>

                <div
                  {...getRootProps()}
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the image here…</p>
                  ) : (
                    <p>Drag & drop image, or click to upload</p>
                  )}
                </div>

                {/* IMAGE PREVIEW */}
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                )}
              </div>

              <DialogFooter>
                <Button type="submit">{editingItem ? "Update" : "Add"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MenuManagement;
