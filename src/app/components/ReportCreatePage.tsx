import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useApp, CATEGORY_LABELS, type Day, type DailyReport } from "../store";
import { ArrowLeft, Target, CheckCircle2 } from "lucide-react";

const CATEGORY_PLACEHOLDERS: Record<number, string> = {
  1: "今日新たに学んだこと、気づいたことを記入してください",
  2: "今日達成したこと、進捗状況を記入してください",
  3: "明日取り組む目標や計画を記入してください",
  4: "今日直面した課題や問題点を記入してください",
  5: "上司への報告・連絡事項を記入してください",
  6: "今日一日を振り返り、改善点などを記入してください",
  7: "今日の体調や気分・コンディションを記入してください",
};

const DAY_DATES: Record<string, Record<Day, string>> = {
  "2025-W21": { mon: "5/18", tue: "5/19", wed: "5/20", thu: "5/21", fri: "5/22" },
  "2025-W20": { mon: "5/11", tue: "5/12", wed: "5/13", thu: "5/14", fri: "5/15" },
  "2025-W19": { mon: "5/4", tue: "5/5", wed: "5/6", thu: "5/7", fri: "5/8" },
};

const DAY_LABELS_JP: Record<Day, string> = {
  mon: "月",
  tue: "火",
  wed: "水",
  thu: "木",
  fri: "金",
};

export function ReportCreatePage() {
  const { weekId, day } = useParams<{ weekId: string; day: Day }>();
  const navigate = useNavigate();
  const { getYesterdayGoal, addReport, updateReport, getReport } = useApp();

  const isEditing = window.location.pathname.includes("/edit");
  const existingReport = weekId && day ? getReport(weekId, day) : undefined;

  const yesterdayGoal = getYesterdayGoal();

  const [dailySummary, setDailySummary] = useState(existingReport?.dailySummary ?? "");
  const [categories, setCategories] = useState<Record<number, string>>(
    existingReport?.categories ?? { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" }
  );
  const [submitted, setSubmitted] = useState(false);

  if (!weekId || !day) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--muted-foreground)" }}>パラメータが不正です</p>
      </div>
    );
  }

  const date = DAY_DATES[weekId]?.[day] ?? "";

  const handleComplete = () => {
    setSubmitted(true);
    if (!dailySummary.trim()) return;

    if (isEditing && existingReport) {
      updateReport({
        ...existingReport,
        dailySummary,
        categories,
      });
    } else {
      const newReport: DailyReport = {
        id: `r_${Date.now()}`,
        weekId,
        day,
        date,
        dailySummary,
        categories,
      };
      addReport(newReport);
    }

    navigate(`/reports/${weekId}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(`/reports/${weekId}`)}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
          style={{ background: "var(--muted)" }}
        >
          <ArrowLeft size={15} style={{ color: "var(--muted-foreground)" }} />
        </button>
        <div>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.8125rem" }}>
            {isEditing ? "日報編集" : "日報作成"}
          </p>
          <h1 style={{ color: "var(--foreground)", fontSize: "1.25rem", fontWeight: 700 }}>
            {date}（{DAY_LABELS_JP[day]}）の日報
          </h1>
        </div>
      </div>

      {/* Yesterday's goal reminder */}
      {yesterdayGoal && (
        <div
          className="rounded-xl p-4 mb-6 flex gap-3"
          style={{
            background: "rgba(59,130,246,0.07)",
            border: "1px solid rgba(59,130,246,0.25)",
          }}
        >
          <Target size={16} style={{ color: "var(--primary)", marginTop: "2px", flexShrink: 0 }} />
          <div>
            <p
              style={{
                color: "var(--primary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                marginBottom: "4px",
              }}
            >
              昨日立てた今日の目標
            </p>
            <p style={{ color: "var(--foreground)", fontSize: "0.875rem", lineHeight: 1.65 }}>
              {yesterdayGoal}
            </p>
          </div>
        </div>
      )}

      {/* Daily summary */}
      <div
        className="rounded-xl p-5 mb-4"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <label
          htmlFor="dailySummary"
          style={{
            display: "block",
            color: "var(--muted-foreground)",
            fontSize: "0.8125rem",
            fontWeight: 500,
            marginBottom: "8px",
          }}
        >
          日要約 <span style={{ color: "var(--destructive)" }}>*</span>
        </label>
        <textarea
          id="dailySummary"
          rows={3}
          placeholder="今日一日を一言でまとめてください"
          value={dailySummary}
          onChange={(e) => setDailySummary(e.target.value)}
          className="w-full rounded-lg px-3 py-2.5 resize-none outline-none transition-all"
          style={{
            background: "var(--input-background)",
            border: submitted && !dailySummary.trim()
              ? "1px solid var(--destructive)"
              : "1px solid var(--border)",
            color: "var(--foreground)",
            fontSize: "0.875rem",
            lineHeight: 1.7,
          }}
        />
        {submitted && !dailySummary.trim() && (
          <p style={{ color: "var(--destructive)", fontSize: "0.75rem", marginTop: "4px" }}>
            日要約を入力してください
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-3 mb-6">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
          const catNum = Number(key);
          return (
            <div
              key={key}
              className="rounded-xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <label
                htmlFor={`cat-${catNum}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "10px",
                  cursor: "pointer",
                }}
              >
                <span
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    color: "var(--primary)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {catNum}
                </span>
                <span
                  style={{
                    color: "var(--foreground)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </span>
              </label>
              <textarea
                id={`cat-${catNum}`}
                rows={catNum === 4 || catNum === 6 ? 3 : 2}
                placeholder={CATEGORY_PLACEHOLDERS[catNum]}
                value={categories[catNum] ?? ""}
                onChange={(e) =>
                  setCategories((prev) => ({ ...prev, [catNum]: e.target.value }))
                }
                className="w-full rounded-lg px-3 py-2.5 resize-none outline-none transition-all"
                style={{
                  background: "var(--input-background)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Complete button */}
      <button
        onClick={handleComplete}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl hover:opacity-90 active:opacity-75 transition-opacity"
        style={{
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          fontSize: "1rem",
          fontWeight: 700,
        }}
      >
        <CheckCircle2 size={18} />
        {isEditing ? "更新する" : "完了する"}
      </button>
    </div>
  );
}
