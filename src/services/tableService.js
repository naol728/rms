import { supabase } from "@/lib/supabase";

export const getTables = async () => {
  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("is_available", true)
    .order("table_number", { ascending: true });

  if (error) throw error;
  return data;
};
