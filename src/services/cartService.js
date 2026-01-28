import { supabase } from "@/lib/supabase";

class CartService {
  /* =========================
     GET CART
  ========================= */
  async getCart() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: true, data: [] };
    }

    const { data, error } = await supabase
      .from("cart")
      .select(
        `
        id,
        quantity,
        menu_items (
          id,
          name,
          description,
          price,
          image_url
        )
      `,
      )
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return { success: false, error: error.message };
    }

    const cart = data.map((row) => ({
      id: row.id,
      menu_item_id: row.menu_items.id,
      name: row.menu_items.name,
      description: row.menu_items.description,
      price: row.menu_items.price,
      image_url: row.menu_items.image_url,
      quantity: row.quantity,
      total_price: row.quantity * row.menu_items.price,
    }));

    return { success: true, data: cart };
  }

  /* =========================
     ADD TO CART
  ========================= */
  async addToCart(menuItemId, quantity = 1) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data: existing } = await supabase
      .from("cart")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("menu_item_id", menuItemId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("cart")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("cart").insert({
        user_id: user.id,
        menu_item_id: menuItemId,
        quantity,
      });

      if (error) throw error;
    }

    return { success: true };
  }

  /* =========================
     UPDATE QUANTITY
  ========================= */
  async updateCartItem(cartItemId, quantity) {
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    const { error } = await supabase
      .from("cart")
      .update({ quantity })
      .eq("id", cartItemId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /* =========================
     REMOVE ITEM
  ========================= */
  async removeFromCart(cartItemId) {
    const { error } = await supabase.from("cart").delete().eq("id", cartItemId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /* =========================
     CLEAR CART
  ========================= */
  async clearCart() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: true };

    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }
}

export default new CartService();
