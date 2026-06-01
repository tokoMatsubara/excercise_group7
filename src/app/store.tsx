import React, { createContext, useContext, useState, useEffect } from "react";

export type Day = "mon" | "tue" | "wed" | "thu" | "fri";

export const DAY_LABELS: Record<Day, string> = {
  mon: "月",
  tue: "火",
  wed: "水",
  thu: "木",
  fri: "金",
};

export const CATEGORY_LABELS: Record<number, string> = {
  1: "今日学んだこと",
  2: "今日の成果・進捗",
  3: "明日の目標・計画",
  4: "課題・問題点",
  5: "上司へのコメント・報告",
  6: "振り返り・反省",
  7: "今日の体調・コンディション",
};

export type DailyReport = {
  id: string;
  weekId: string;
  day: Day;
  date: string;
  dailySummary: string;
  categories: Record<number, string>;
};

export type WeekSummary = {
  weekId: string;
  startDate: string;
  endDate: string;
  label: string;
  summary: string;
  days: Day[];
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type ReminderSettings = {
  enabled: boolean;
  times: string[];
};

type AppState = {
  user: User | null;
  weeks: WeekSummary[];
  reports: DailyReport[];
  reminderSettings: ReminderSettings;
};

type AppContextType = AppState & {
  login: (user: User) => void;
  logout: () => void;
  addReport: (report: DailyReport) => void;
  updateReport: (report: DailyReport) => void;
  deleteReport: (id: string) => void;
  getReport: (weekId: string, day: Day) => DailyReport | undefined;
  getWeekReports: (weekId: string) => DailyReport[];
  getYesterdayGoal: () => string;
  getYesterdayIssues: () => string;
  updateReminderSettings: (settings: ReminderSettings) => void;
};

const defaultWeeks: WeekSummary[] = [
  {
    weekId: "2025-W21",
    startDate: "5/18",
    endDate: "5/22",
    label: "5/18〜5/22",
    summary:
      "Reactの状態管理についてRedux ToolkitとZustandを比較検証。チームレビューでコードレビュープロセスを改善する提案を行い、採用された。週後半は新機能のAPI設計に注力し、設計書を完成させた。",
    days: ["mon", "tue", "wed", "thu", "fri"],
  },
  {
    weekId: "2025-W20",
    startDate: "5/11",
    endDate: "5/15",
    label: "5/11〜5/15",
    summary:
      "TypeScriptの型定義を強化し、バグ発生率を大幅に低減。ユニットテストのカバレッジを62%から78%に向上。木曜日に顧客向けデモを実施し、好評を得た。",
    days: ["mon", "tue", "wed", "thu", "fri"],
  },
  {
    weekId: "2025-W19",
    startDate: "5/4",
    endDate: "5/8",
    label: "5/4〜5/8",
    summary:
      "GW明けの立ち上がり週。積み残しのバグ修正3件を完了。パフォーマンス改善タスクに着手し、ページ読み込み速度を20%改善した。",
    days: ["mon", "tue", "wed", "thu", "fri"],
  },
];

const defaultReports: DailyReport[] = [
  {
    id: "r1",
    weekId: "2025-W21",
    day: "mon",
    date: "5/18",
    dailySummary:
      "Redux ToolkitとZustandの比較検証を開始。基本的なパターンの実装を完了した。",
    categories: {
      1: "Redux ToolkitのcreateSliceとcreateAsyncThunkの使い方を実践的に習得した。",
      2: "比較検証用のサンプルアプリ（カウンター・TodoList）を両ライブラリで実装完了。",
      3: "明日はZustandのmiddleware対応とDevTools連携を調査する。",
      4: "Redux ToolkitはBoilerplateが多く、小規模プロジェクトでは冗長に感じた。",
      5: "比較検証の中間報告を水曜日に行う予定です。資料作成を進めます。",
      6: "最初はZustandのシンプルさに惹かれたが、大規模プロジェクトではToolkitの恩恵が大きいと感じた。",
      7: "体調良好。集中力高く作業できた。",
    },
  },
  {
    id: "r2",
    weekId: "2025-W21",
    day: "tue",
    date: "5/19",
    dailySummary:
      "ZustandのMiddleware調査完了。persist・devtoolsの導入方法を把握した。",
    categories: {
      1: "Zustandのimmer middlewareを使った不変データ更新パターンを学んだ。",
      2: "ZustandのMiddleware（persist/devtools/immer）の動作検証を完了。",
      3: "明日は比較検証の資料作成と、チームへの共有準備を行う。",
      4: "persistでのTypeScript型定義が複雑で時間がかかった。",
      5: "水曜のレビュー資料の骨子をSlackで共有しました。",
      6: "ドキュメントを読み込む時間を確保できた。理解度が高まった。",
      7: "やや疲れ気味だが問題なし。",
    },
  },
  {
    id: "r3",
    weekId: "2025-W21",
    day: "wed",
    date: "5/20",
    dailySummary: "チームレビューで状態管理比較の発表を実施。Zustand採用を提案し承認された。",
    categories: {
      1: "発表後のQ&Aでチームメンバーから学ぶ点が多かった。",
      2: "Zustand採用決定。既存コードへの移行計画書の初稿を作成。",
      3: "明日から移行作業に着手する。まずは認証周りの状態から。",
      4: "移行期間中の既存コードとの並存設計が課題。",
      5: "採用決定の報告をしました。移行期間は2週間を見込んでいます。",
      6: "プレゼンで改善点が明確になった。次回はデモをもっと充実させたい。",
      7: "発表後に緊張が解けた。良いコンディションで臨めた。",
    },
  },
];

const STORAGE_KEY = "nippo_app_state";

const defaultState: AppState = {
  user: null,
  weeks: defaultWeeks,
  reports: defaultReports,
  reminderSettings: { enabled: true, times: ["08:30", "17:00"] },
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch {}
  return defaultState;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const login = (user: User) =>
    setState((s) => ({ ...s, user }));

  const logout = () =>
    setState((s) => ({ ...s, user: null }));

  const addReport = (report: DailyReport) =>
    setState((s) => ({ ...s, reports: [...s.reports, report] }));

  const updateReport = (report: DailyReport) =>
    setState((s) => ({
      ...s,
      reports: s.reports.map((r) => (r.id === report.id ? report : r)),
    }));

  const deleteReport = (id: string) =>
    setState((s) => ({
      ...s,
      reports: s.reports.filter((r) => r.id !== id),
    }));

  const getReport = (weekId: string, day: Day) =>
    state.reports.find((r) => r.weekId === weekId && r.day === day);

  const getWeekReports = (weekId: string) =>
    state.reports.filter((r) => r.weekId === weekId);

  const getYesterdayGoal = () => {
    const sorted = [...state.reports].sort((a, b) => b.id.localeCompare(a.id));
    const last = sorted[0];
    return last?.categories[3] ?? "";
  };

  const getYesterdayIssues = () => {
    const sorted = [...state.reports].sort((a, b) => b.id.localeCompare(a.id));
    const last = sorted[0];
    return last?.categories[4] ?? "";
  };

  const updateReminderSettings = (settings: ReminderSettings) =>
    setState((s) => ({ ...s, reminderSettings: settings }));

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        addReport,
        updateReport,
        deleteReport,
        getReport,
        getWeekReports,
        getYesterdayGoal,
        getYesterdayIssues,
        updateReminderSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
