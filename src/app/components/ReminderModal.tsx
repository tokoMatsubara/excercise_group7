import { useState } from "react";
import { X, Bell, BellOff, Clock, Target, AlertTriangle } from "lucide-react";
import { useApp } from "../store";

const PRESET_TIMES = ["07:00", "08:00", "08:30", "09:00", "12:00", "17:00", "18:00", "20:00"];

export function ReminderModal({ onClose }: { onClose: () => void }) {
  const { getYesterdayGoal, getYesterdayIssues, reminderSettings, updateReminderSettings } =
    useApp();
  const [settings, setSettings] = useState(reminderSettings);

  const goal = getYesterdayGoal();
  const issues = getYesterdayIssues();

  const toggleTime = (time: string) => {
    const next = settings.times.includes(time)
      ? settings.times.filter((t) => t !== time)
      : [...settings.times, time].sort();
    setSettings((s) => ({ ...s, times: next }));
  };

  const handleSave = () => {
    updateReminderSettings(settings);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <Bell size={18} style={{ color: "var(--primary)" }} />
            <h2
              style={{ color: "var(--foreground)", fontSize: "1rem", fontWeight: 600 }}
            >
              リマインダー
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
            style={{ background: "var(--muted)" }}
          >
            <X size={16} style={{ color: "var(--muted-foreground)" }} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Yesterday's goal */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Target size={15} style={{ color: "var(--primary)" }} />
              <h3
                style={{ color: "var(--muted-foreground)", fontSize: "0.8125rem", fontWeight: 500 }}
              >
                前日に立てた今日の目標
              </h3>
            </div>
            <div
              className="rounded-lg p-3"
              style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
            >
              {goal ? (
                <p style={{ color: "var(--foreground)", fontSize: "0.875rem", lineHeight: 1.7 }}>
                  {goal}
                </p>
              ) : (
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
                  まだ日報が作成されていません
                </p>
              )}
            </div>
          </section>

          {/* Yesterday's issues */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={15} style={{ color: "#f59e0b" }} />
              <h3
                style={{ color: "var(--muted-foreground)", fontSize: "0.8125rem", fontWeight: 500 }}
              >
                前日の課題・問題点
              </h3>
            </div>
            <div
              className="rounded-lg p-3"
              style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
            >
              {issues ? (
                <p style={{ color: "var(--foreground)", fontSize: "0.875rem", lineHeight: 1.7 }}>
                  {issues}
                </p>
              ) : (
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
                  課題の記録はありません
                </p>
              )}
            </div>
          </section>

          {/* Notification settings */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={15} style={{ color: "var(--primary)" }} />
                <h3
                  style={{
                    color: "var(--muted-foreground)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }}
                >
                  リマインド通知設定
                </h3>
              </div>
              <button
                onClick={() => setSettings((s) => ({ ...s, enabled: !s.enabled }))}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all"
                style={{
                  background: settings.enabled ? "var(--primary)" : "var(--muted)",
                  color: settings.enabled ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                {settings.enabled ? (
                  <>
                    <Bell size={12} /> ON
                  </>
                ) : (
                  <>
                    <BellOff size={12} /> OFF
                  </>
                )}
              </button>
            </div>

            {settings.enabled && (
              <div className="flex flex-wrap gap-2">
                {PRESET_TIMES.map((time) => {
                  const active = settings.times.includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => toggleTime(time)}
                      className="px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: active ? "var(--primary)" : "var(--muted)",
                        color: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                        border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                        fontSize: "0.8125rem",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            )}

            {!settings.enabled && (
              <p
                className="rounded-lg p-3 text-center"
                style={{
                  background: "var(--muted)",
                  color: "var(--muted-foreground)",
                  fontSize: "0.8125rem",
                }}
              >
                通知は無効になっています
              </p>
            )}
          </section>
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{
              background: "var(--muted)",
              color: "var(--muted-foreground)",
              fontSize: "0.875rem",
            }}
          >
            閉じる
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            保存する
          </button>
        </div>
      </div>
    </div>
  );
}
