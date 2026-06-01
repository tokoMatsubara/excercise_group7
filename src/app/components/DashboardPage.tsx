import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../store";
import { ReminderModal } from "./ReminderModal";
import { Bell, Plus, Target, ChevronRight, CalendarDays } from "lucide-react";

export function DashboardPage() {
  const { weeks, getYesterdayGoal, user } = useApp();
  const navigate = useNavigate();
  const [showReminder, setShowReminder] = useState(false);

  const yesterdayGoal = getYesterdayGoal();

  const today = new Date();
  const dayOfWeek = today.getDay();
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const currentWeek = weeks[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-6">
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
          おはようございます
        </p>
        <h1
          style={{ color: "var(--foreground)", fontSize: "1.5rem", fontWeight: 700 }}
        >
          {user?.name} さん
        </h1>
      </div>

      {/* Top row: 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Yesterday's goal */}
        <div
          className="rounded-xl p-5 flex flex-col gap-3"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <Target size={16} style={{ color: "var(--primary)" }} />
            <span
              style={{ color: "var(--muted-foreground)", fontSize: "0.8125rem", fontWeight: 500 }}
            >
              昨日立てた今日の目標
            </span>
          </div>
          {yesterdayGoal ? (
            <p
              className="leading-relaxed"
              style={{ color: "var(--foreground)", fontSize: "0.875rem", lineHeight: 1.65 }}
            >
              {yesterdayGoal}
            </p>
          ) : (
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
              まだ日報がありません
            </p>
          )}
        </div>

        {/* Reminder box */}
        <button
          onClick={() => setShowReminder(true)}
          className="rounded-xl p-5 flex flex-col gap-3 text-left transition-all hover:opacity-80 cursor-pointer"
          style={{
            background: "var(--card)",
            border: "1px solid var(--primary)",
            boxShadow: "0 0 12px rgba(59,130,246,0.1)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={16} style={{ color: "var(--primary)" }} />
              <span
                style={{
                  color: "var(--primary)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                }}
              >
                リマインドボックス
              </span>
            </div>
            <ChevronRight size={14} style={{ color: "var(--primary)" }} />
          </div>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.8125rem", lineHeight: 1.6 }}>
            前日の目標・課題を確認し、
            <br />
            通知時刻を設定できます
          </p>
          <div
            className="rounded-lg px-3 py-1.5 self-start"
            style={{ background: "rgba(59,130,246,0.1)" }}
          >
            <span style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: 500 }}>
              タップして確認
            </span>
          </div>
        </button>

        {/* New report button */}
        <button
          onClick={() => {
            if (currentWeek) {
              const days: Array<"mon" | "tue" | "wed" | "thu" | "fri"> = [
                "mon",
                "tue",
                "wed",
                "thu",
                "fri",
              ];
              const dayMap: Record<number, "mon" | "tue" | "wed" | "thu" | "fri"> = {
                1: "mon",
                2: "tue",
                3: "wed",
                4: "thu",
                5: "fri",
              };
              const today = dayMap[new Date().getDay()] ?? "mon";
              navigate(`/reports/${currentWeek.weekId}/${today}/create`);
            }
          }}
          className="rounded-xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:opacity-80"
          style={{
            background: "var(--card)",
            border: "2px dashed var(--border)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.15)" }}
          >
            <Plus size={22} style={{ color: "var(--primary)" }} />
          </div>
          <span
            style={{ color: "var(--foreground)", fontSize: "0.9375rem", fontWeight: 600 }}
          >
            日報を新規作成
          </span>
          <span style={{ color: "var(--muted-foreground)", fontSize: "0.8125rem" }}>
            今日の日報を記録する
          </span>
        </button>
      </div>

      {/* Weekly summaries */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={17} style={{ color: "var(--primary)" }} />
          <h2
            style={{ color: "var(--foreground)", fontSize: "1.0625rem", fontWeight: 600 }}
          >
            週次サマリー
          </h2>
          <span
            className="px-2 py-0.5 rounded-md ml-1"
            style={{
              background: "var(--muted)",
              color: "var(--muted-foreground)",
              fontSize: "0.75rem",
            }}
          >
            直近3週間
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {weeks.map((week, i) => (
            <button
              key={week.weekId}
              onClick={() => navigate(`/reports/${week.weekId}`)}
              className="w-full rounded-xl p-5 text-left transition-all group"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-md shrink-0"
                      style={{
                        background: i === 0 ? "rgba(59,130,246,0.15)" : "var(--muted)",
                        color: i === 0 ? "var(--primary)" : "var(--muted-foreground)",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                      }}
                    >
                      {week.label}
                    </span>
                    {i === 0 && (
                      <span
                        className="px-2 py-0.5 rounded"
                        style={{
                          background: "rgba(16,185,129,0.15)",
                          color: "#10b981",
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                        }}
                      >
                        今週
                      </span>
                    )}
                    <span
                      style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
                    >
                      週要約
                    </span>
                  </div>
                  <p
                    className="line-clamp-2"
                    style={{
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {week.summary}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  style={{ color: "var(--muted-foreground)", flexShrink: 0, marginTop: "2px" }}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {showReminder && <ReminderModal onClose={() => setShowReminder(false)} />}
    </div>
  );
}
