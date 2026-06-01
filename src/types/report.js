// reportApi.js

import axios from "axios";

export const getReportsByWeek = async (weekId) => {
  const res = await axios.get(
    `/api/reports/week/${weekId}`
  );

  return res.data;
};