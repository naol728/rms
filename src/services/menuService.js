// src/services/MenuService.js
import { supabase } from "@/lib/supabase";

class MenuService {
  constructor() {
    this.bucketName = "photo";
  }

  // -----------------------------
  // Upload image to Supabase
  // -----------------------------
  async uploadImage(file) {
    if (!(file instanceof File)) return null;

    const ext = file.name.split(".").pop();
    const fileName = `menu/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(this.bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // -----------------------------
  // Get menu items
  // -----------------------------
  async getMenuItems() {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        id,
        name,
        description,
        price,
        image_url,
        is_available,
        category_id,
        categories ( id, name )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message };

    // normalize response for UI
    const normalized = data.map((item) => ({
      ...item,
      image: item.image_url,
      available: item.is_available,
      category: item.categories?.name ?? "",
    }));

    return { success: true, data: normalized };
  }

  // -----------------------------
  // Add menu item
  // -----------------------------
  async addMenuItem(item) {
    try {
      let imageUrl = null;

      if (item.file instanceof File) {
        imageUrl = await this.uploadImage(item.file);
      }

      const { data, error } = await supabase
        .from("menu_items")
        .insert({
          name: item.name,
          description: item.description,
          price: Number(item.price),
          category_id: item.category_id,
          image_url: imageUrl,
          is_available: item.available ?? true,
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // -----------------------------
  // Update menu item
  // -----------------------------
  async updateMenuItem(id, item) {
    try {
      let imageUrl = item.image; // keep existing image

      if (item.file instanceof File) {
        imageUrl = await this.uploadImage(item.file);
      }

      const { data, error } = await supabase
        .from("menu_items")
        .update({
          name: item.name,
          description: item.description,
          price: Number(item.price),
          category_id: item.category_id,
          image_url: imageUrl,
          is_available: item.available,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // -----------------------------
  // Delete menu item
  // -----------------------------
  async deleteMenuItem(id) {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // -----------------------------
  // Toggle availability
  // -----------------------------
  async toggleAvailability(id, available) {
    const { data, error } = await supabase
      .from("menu_items")
      .update({ is_available: available })
      .eq("id", id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  }

  // -----------------------------
  // Get categories
  // -----------------------------
  async getCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .eq("is_active", true)
      .order("id");

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  }
}

export default new MenuService();
