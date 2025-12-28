export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "pemasukan" | "pengeluaran";
  date: string;
}

export type FilterType = "all" | "pemasukan" | "pengeluaran";
