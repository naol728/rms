import { supabase } from "@/lib/supabase";

class DashboardService {
  /* ===========================
     MAIN DASHBOARD DATA
  ============================ */
  async getDashboardStats() {
    try {
      /* ---------- Date helpers ---------- */
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      /* ---------- Orders ---------- */
      const { data: orders, error: ordersError } = await supabase.from("orders")
        .select(`
          id,
          status,
          total_amount,
          created_at,
          customer_name,
          table_number
        `);

      if (ordersError) throw ordersError;

      const totalOrders = orders.length;

      const todayOrders = orders.filter(
        (o) => new Date(o.created_at) >= startOfToday,
      );

      const todayRevenue = todayOrders.reduce(
        (sum, o) => sum + Number(o.total_amount || 0),
        0,
      );

      const totalSales = orders.reduce(
        (sum, o) => sum + Number(o.total_amount || 0),
        0,
      );

      const pendingOrders = orders.filter((o) => o.status === "pending").length;

      /* ---------- Active Staff ---------- */
      const { data: staff, error: staffError } = await supabase
        .from("users")
        .select("id")
        .eq("role", "staff")
        .eq("is_active", true);

      if (staffError) throw staffError;

      /* ---------- Low Stock ---------- */
      const { data: lowStock, error: stockError } = await supabase
        .from("inventory")
        .select("id")
        .lte("quantity", 5);

      if (stockError) throw stockError;

      /* ---------- Recent Orders ---------- */
      const { data: recentOrders, error: recentError } = await supabase
        .from("orders")
        .select(
          `
          id,
          status,
          total_amount,
          created_at,
          customer_name,
          table_number
        `,
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      /* ---------- FINAL RESPONSE ---------- */
      return {
        success: true,
        data: {
          stats: {
            totalSales,
            totalOrders,
            activeStaff: staff.length,
            lowStockItems: lowStock.length,
            todayRevenue,
            pendingOrders,
          },
          recentOrders,
        },
      };
    } catch (error) {
      console.error("Dashboard error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
