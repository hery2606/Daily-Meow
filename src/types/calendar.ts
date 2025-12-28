import { ActivityItem, FinanceItem } from "@/services/dailyService";

export interface UnifiedItem {
  id: string;
  type: "activity" | "finance";
  time: string;
  title: string;
  subtitle: string;
  color: string;
  amount?: number;
  originalData: ActivityItem | FinanceItem;
}

export interface FinanceSummary {
  income: number;
  expense: number;
}
