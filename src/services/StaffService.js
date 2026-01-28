// src/services/StaffService.js
import { supabase } from "@/lib/supabase";

class StaffService {
  // Get all staff
  async getStaff() {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  }

  // Add a new staff member
  async addStaff(member) {
    const { data, error } = await supabase.from("staff").insert([member]);
    if (error) return { success: false, error: error.message };
    return { success: true, data: data[0] };
  }

  // Update staff member
  async updateStaff(id, member) {
    const { data, error } = await supabase
      .from("staff")
      .update(member)
      .eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true, data: data[0] };
  }

  // Delete staff member
  async deleteStaff(id) {
    const { error } = await supabase.from("staff").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  }
}

export default new StaffService();
