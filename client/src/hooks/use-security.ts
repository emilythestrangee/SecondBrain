import { useQuery } from "@tanstack/react-query";
import type { SecurityHealthData, SecurityMetric } from "@shared/schema";

export function useSecurityHealth() {
  return useQuery<SecurityHealthData>({
    queryKey: ["/api/security/health"],
  });
}

export function useSecurityMetrics() {
  return useQuery<SecurityMetric[]>({
    queryKey: ["/api/security/metrics"],
  });
}

export function useSecurityRecommendations() {
  return useQuery<{ recommendations: string[] }>({
    queryKey: ["/api/security/recommendations"],
  });
}
