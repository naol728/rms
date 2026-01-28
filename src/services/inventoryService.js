import { supabase } from "@/lib/supabase";

/* ============================
   GET ALL INVENTORY ITEMS
============================ */
export const getInventory = async () => {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .order("item_name");

  if (error) throw error;

  return data;
};

/* ============================
   CREATE ITEM
============================ */
export const createInventoryItem = async (item) => {
  const { data, error } = await supabase
    .from("inventory")
    .insert([
      {
        item_name: item.name,
        category: item.category,
        current_stock: Number(item.quantity),
        min_stock_level: Number(item.minStock),
        unit: item.unit,
        supplier: item.supplier,
        last_restocked: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/* ============================
   UPDATE ITEM
============================ */
export const updateInventoryItem = async (id, item) => {
  const { data, error } = await supabase
    .from("inventory")
    .update({
      item_name: item.name,
      category: item.category,
      current_stock: Number(item.quantity),
      min_stock_level: Number(item.minStock),
      unit: item.unit,
      supplier: item.supplier,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/* ============================
   DELETE ITEM
============================ */
export const deleteInventoryItem = async (id) => {
  const { error } = await supabase.from("inventory").delete().eq("id", id);

  if (error) throw error;
};
