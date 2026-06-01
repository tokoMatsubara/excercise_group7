// WeeklySummaryList.jsx

function WeeklySummaryList({ summaries }) {
  return (
    <>
      {summaries.map(summary => (
        <WeeklySummaryItem
          key={summary.weekId}
          summary={summary}
        />
      ))}
    </>
  );
}