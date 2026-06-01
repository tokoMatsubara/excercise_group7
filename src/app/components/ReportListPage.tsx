import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useApp, DAY_LABELS, CATEGORY_LABELS, type Day } from "../store";
import { Plus, ArrowLeft, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const DAYS: Day[] = ["mon", "tue", "wed", "thu", "fri"];

export function ReportListPage() {
  const { weekId } = useParams<{ weekId: string }>();
  const navigate = useNavigate();
  const { weeks, getReport, deleteReport } = useApp();

  const week = weeks.find((w) => w.weekId === weekId);
  const [activeDay, setActiveDay] = useState<Day>("mon");
  const [expandedCategories, setExpandedCategories] = useState<number[]>([1, 2, 3]);

  if (!week || !weekId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--muted-foreground)" }}>週が見つかりません</p>
      </div>
    );
  }

  const report = getReport(weekId, activeDay);

  const toggleCategory = (cat: number) => {
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleDelete = () => {
    if (!report) return;
    if (window.confirm("この日報を削除しますか？")) {
      deleteReport(report.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
          style={{ background: "var(--muted)" }}
        >
          <ArrowLeft size={15} style={{ color: "var(--muted-foreground)" }} />
        </button>
        <div>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.8125rem" }}>日報一覧</p>
          <h1
            style={{ color: "var(--foreground)", fontSize: "1.25rem", fontWeight: 700 }}
          >
            {week.label} の週
          </h1>
        </div>
      </div>

      {/* Week summary */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", marginBottom: "4px" }}>
          週要約
        </p>
        <p style={{ color: "var(--foreground)", fontSize: "0.875rem", lineHeight: 1.65 }}>
          {week.summary}
        </p>
      </div>

      {/* Day tabs */}
      <div
        className="flex rounded-xl p-1 mb-6"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        {DAYS.map((day) => {
          const dayReport = getReport(weekId, day);
          const isActive = day === activeDay;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className="flex-1 flex flex-col items-center py-2.5 rounded-lg transition-all"
              style={{
                background: isActive ? "var(--primary)" : "transparent",
                color: isActive ? "var(--primary-foreground)" : "var(--muted-foreground)",
              }}
            >
              <span style={{ fontSize: "1rem", fontWeight: isActive ? 700 : 400 }}>
                {DAY_LABELS[day]}
              </span>
              <span style={{ fontSize: "0.625rem", marginTop: "2px" }}>
                {dayReport ? "●" : "○"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Report content or empty state */}
      {report ? (
        <div className="flex flex-col gap-4">
          {/* Daily summary header */}
          <div
            className="rounded-xl p-5"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2 py-0.5 rounded-md"
                    style={{
                      background: "rgba(59,130,246,0.15)",
                      color: "var(--primary)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {week.startDate.split("/")[0] === week.endDate.split("/")[0]
                      ? `${report.date}`
                      : report.date}{" "}
                    ({DAY_LABELS[activeDay]})
                  </span>
                  <span
                    style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
                  >
                    日要約
                  </span>
                </div>
                <p
                  style={{ color: "var(--foreground)", fontSize: "0.9375rem", lineHeight: 1.65 }}
                >
                  {report.dailySummary}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate(`/reports/${weekId}/${activeDay}/edit`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                  style={{
                    background: "rgba(59,130,246,0.1)",
                    color: "var(--primary)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }}
                >
                  <Edit2 size={13} />
                  編集
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    color: "var(--destructive)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }}
                >
                  <Trash2 size={13} />
                  削除
                </button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-2">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const catNum = Number(key);
              const content = report.categories[catNum];
              const isExpanded = expandedCategories.includes(catNum);
              return (
                <div
                  key={key}
                  className="rounded-xl overflow-hidden"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                  <button
                    onClick={() => toggleCategory(catNum)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-center gap-3">
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
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={15} style={{ color: "var(--muted-foreground)" }} />
                    ) : (
                      <ChevronDown size={15} style={{ color: "var(--muted-foreground)" }} />
                    )}
                  </button>
                  {isExpanded && (
                    <div
                      className="px-5 pb-4"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <p
                        className="pt-3"
                        style={{
                          color: content ? "var(--foreground)" : "var(--muted-foreground)",
                          fontSize: "0.875rem",
                          lineHeight: 1.7,
                        }}
                      >
                        {content || "（未記入）"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty state */
        <div
          className="rounded-xl flex flex-col items-center justify-center py-16 gap-4"
          style={{ background: "var(--card)", border: "2px dashed var(--border)" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.1)" }}
          >
            <Plus size={28} style={{ color: "var(--primary)" }} />
          </div>
          <div className="text-center">
            <p style={{ color: "var(--foreground)", fontWeight: 600, marginBottom: "4px" }}>
              {DAY_LABELS[activeDay]}曜日の日報がまだありません
            </p>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
              日報を作成してください
            </p>
          </div>
          <button
            onClick={() => navigate(`/reports/${weekId}/${activeDay}/create`)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              fontWeight: 600,
              fontSize: "0.9375rem",
            }}
          >
            <Plus size={16} />
            日報を作成する
          </button>
        </div>
      )}
    </div>
  );
}
