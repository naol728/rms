import { supabase } from "@/lib/supabase";

class AuthService {
  // ----------------------
  // LOGIN
  // ----------------------
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const user = await this.getUserProfile(data.user.id);

    return {
      success: true,
      user,
      session: data.session,
    };
  }

  // ----------------------
  // REGISTER
  // ----------------------
  async register({ name, email, password, phone, address }) {
    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // 2. Create profile row
    await supabase.from("users").insert({
      id: data.user.id,
      name,
      email,
      phone,
      address,
      role: "staff",
    });

    return {
      success: true,
      user: data.user,
    };
  }

  // ----------------------
  // LOGOUT
  // ----------------------
  async logout() {
    await supabase.auth.signOut();
  }

  // ----------------------
  // CURRENT USER (AUTH)
  // ----------------------
  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  // ----------------------
  // USER PROFILE (DB)
  // ----------------------
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return null;
    return data;
  }

  // ----------------------
  // SESSION
  // ----------------------
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  // ----------------------
  // AUTH STATE
  // ----------------------
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }

  // ----------------------
  // ROLE CHECK
  // ----------------------
  async hasRole(requiredRole) {
    const user = await this.getCurrentUser();
    if (!user) return false;

    const profile = await this.getUserProfile(user.id);
    return profile?.role === requiredRole;
  }

  // ----------------------
  // PASSWORD RESET
  // ----------------------
  async requestPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  // ----------------------
  // CHANGE PASSWORD
  // ----------------------
  async changePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }
}

export default new AuthService();
