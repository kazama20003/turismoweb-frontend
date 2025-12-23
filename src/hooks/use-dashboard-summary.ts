"use client"

import { useQuery } from "@tanstack/react-query"
import { dashboardService, type DashboardSummary } from "@/services/dashboard-service"

export function useDashboardSummary() {
  const { data, error, isLoading, refetch } = useQuery<DashboardSummary>({
    queryKey: ["dashboard-summary"],
    queryFn: () => dashboardService.getSummary(),
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
  })

  return {
    data,
    isLoading,
    error,
    refetch,
  }
}
