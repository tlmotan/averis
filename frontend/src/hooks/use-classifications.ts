import { useEffect, useState } from "react";
import { classificationData } from "@/data/averis-data";

export function useClassifications(pollInterval = 30_000) {
  const [data, setData] = useState(classificationData);

  useEffect(() => {
    const timer = window.setInterval(() => setData({ ...classificationData }), pollInterval);
    return () => window.clearInterval(timer);
  }, [pollInterval]);

  return data;
}