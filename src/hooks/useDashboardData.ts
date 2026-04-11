import { useQuery } from '@tanstack/react-query';
import {
  MOCK_CRITERIA, MOCK_READINESS_SCORE, MOCK_GAPS, MOCK_TASKS,
  MOCK_AI_INSIGHTS, MOCK_ACTIVITY_FEED, MOCK_KPIS, MOCK_AI_SUMMARY,
} from '@/data/mockData';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const useCriteria       = () => useQuery({ queryKey: ['criteria'],      queryFn: async () => { await delay(300); return MOCK_CRITERIA; },          staleTime: 60_000 });
export const useReadinessScore = () => useQuery({ queryKey: ['readiness'],     queryFn: async () => { await delay(200); return MOCK_READINESS_SCORE; },   staleTime: 60_000 });
export const useGaps           = () => useQuery({ queryKey: ['gaps'],          queryFn: async () => { await delay(300); return MOCK_GAPS; },              staleTime: 60_000 });
export const useTasks          = () => useQuery({ queryKey: ['tasks'],         queryFn: async () => { await delay(300); return MOCK_TASKS; },             staleTime: 60_000 });
export const useAIInsights     = () => useQuery({ queryKey: ['aiInsights'],    queryFn: async () => { await delay(400); return MOCK_AI_INSIGHTS; },       staleTime: 60_000 });
export const useActivityFeed   = () => useQuery({ queryKey: ['activity'],      queryFn: async () => { await delay(200); return MOCK_ACTIVITY_FEED; },     staleTime: 60_000 });
export const useKPIs           = () => useQuery({ queryKey: ['kpis'],          queryFn: async () => { await delay(150); return MOCK_KPIS; },              staleTime: 60_000 });
export const useAISummary      = () => useQuery({ queryKey: ['aiSummary'],     queryFn: async () => { await delay(350); return MOCK_AI_SUMMARY; },        staleTime: 60_000 });
