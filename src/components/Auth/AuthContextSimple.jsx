import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // ----------------------
  // Fetch user profile
  // ----------------------
  const fetchProfile = async (userId) => {
    if (!userId) return;

    setProfileLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error) {
      setProfile(data);
    } else {
      console.error("Profile fetch error:", error.message);
      setProfile(null);
    }

    setProfileLoading(false);
  };

  // ----------------------
  // REGISTER
  // ----------------------
  const register = async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      name,
      email,
      role: "staff",
    });

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // profile will be loaded via onAuthStateChange
    return { success: true };
  };

  // ----------------------
  // LOGIN
  // ----------------------
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, error: error.message };

    // DO NOT fetch here — let the listener handle it
    return { success: true, data };
  };

  // ----------------------
  // LOGOUT
  // ----------------------
  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  };

  // ----------------------
  // Session listener
  // ----------------------
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);

      if (data.session?.user) {
        fetchProfile(data.session.user.id);
      }

      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);

        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ⛔ Block rendering until EVERYTHING is ready
  const loading = authLoading || profileLoading;

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        register,
        login,
        logout,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
