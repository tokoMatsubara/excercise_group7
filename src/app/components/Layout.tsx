import { Outlet, useNavigate } from "react-router";
import { useApp } from "../store";
import { BookOpen, LogOut, User } from "lucide-react";

export function Layout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* Top Nav */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-3"
        style={{
          background: "var(--sidebar)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: "var(--primary)" }}
          >
            <BookOpen size={14} color="#fff" />
          </div>
          <span style={{ color: "var(--foreground)", fontWeight: 700, fontSize: "0.9375rem" }}>
            日報アプリ
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "var(--muted)" }}
            >
              <User size={14} style={{ color: "var(--muted-foreground)" }} />
            </div>
            <span style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
              {user.name}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
            style={{
              background: "var(--muted)",
              color: "var(--muted-foreground)",
              fontSize: "0.8125rem",
            }}
          >
            <LogOut size={13} />
            ログアウト
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
