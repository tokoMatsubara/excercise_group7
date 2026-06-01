import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../store";
import { BookOpen, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: "",
    name: "",
    password: "",
    email: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.id.trim()) e.id = "社員IDを入力してください";
    if (!form.name.trim()) e.name = "氏名を入力してください";
    if (!form.password) e.password = "パスワードを入力してください";
    if (!form.email.trim()) e.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "正しいメールアドレスを入力してください";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    login({ id: form.id, name: form.name, email: form.email });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "var(--primary)" }}
          >
            <BookOpen size={20} color="#fff" />
          </div>
          <div>
            <h1
              className="tracking-wide"
              style={{ color: "var(--foreground)", fontSize: "1.25rem", fontWeight: 700 }}
            >
              日報アプリ
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>
              Daily Report System
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-8"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <h2
            className="mb-1"
            style={{ color: "var(--foreground)", fontSize: "1.125rem", fontWeight: 600 }}
          >
            ログイン
          </h2>
          <p className="mb-6" style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
            アカウント情報を入力してください
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field
              label="社員ID"
              name="id"
              type="text"
              placeholder="例：EMP001"
              value={form.id}
              onChange={handleChange}
              error={errors.id}
            />
            <Field
              label="氏名"
              name="name"
              type="text"
              placeholder="例：山田 太郎"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Field
              label="メールアドレス"
              name="email"
              type="email"
              placeholder="例：yamada@company.co.jp"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", fontWeight: 500 }}
              >
                パスワード
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="パスワードを入力"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2.5 pr-10 outline-none transition-all"
                  style={{
                    background: "var(--input-background)",
                    border: errors.password
                      ? "1px solid var(--destructive)"
                      : "1px solid var(--border)",
                    color: "var(--foreground)",
                    fontSize: "0.875rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: "var(--destructive)", fontSize: "0.75rem" }}>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg py-3 mt-2 transition-opacity hover:opacity-90 active:opacity-75"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                fontWeight: 600,
                fontSize: "0.9375rem",
              }}
            >
              ログイン
            </button>
          </form>
        </div>

        <p
          className="text-center mt-4"
          style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
        >
          © 2025 Daily Report System
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", fontWeight: 500 }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg px-3 py-2.5 outline-none transition-all"
        style={{
          background: "var(--input-background)",
          border: error ? "1px solid var(--destructive)" : "1px solid var(--border)",
          color: "var(--foreground)",
          fontSize: "0.875rem",
        }}
      />
      {error && (
        <p style={{ color: "var(--destructive)", fontSize: "0.75rem" }}>{error}</p>
      )}
    </div>
  );
}
