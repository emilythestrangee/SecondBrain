import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ScheduleResult } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ScheduleRequest {
  timeBudgetMinutes: number;
  energyBudget: number;
  taskIds?: string[];
  algorithm?: "greedy" | "knapsack" | "auto";
}

export function useGenerateSchedule() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (request: ScheduleRequest): Promise<ScheduleResult> => {
      return await apiRequest("POST", "/api/schedule", request);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to generate schedule",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
}
