import { useQuery } from "@tanstack/react-query";
import type { FocusSession } from "@shared/schema";

interface AnalyticsSummary {
  totalSessions: number;
  totalTime: number;
  avgSessionTime: number;
  tasksCompleted: number;
  interruptions: number;
  avgEnergy: number;
}

export function useAnalyticsSummary() {
  return useQuery<AnalyticsSummary>({
    queryKey: ["/api/analytics/summary"],
  });
}

export function useFocusSessions() {
  return useQuery<FocusSession[]>({
    queryKey: ["/api/sessions"],
  });
}
