import { pb } from "@/lib/pocketbase";

export interface ActivityItem {
  id: string;
  title: string;
  user: string;
  date: string;
  time: string;
  color: string;
  notes: string;
  is_completed: boolean;
}

export interface FinanceItem {
  id: string;
  title: string;
  user: string;
  type: "pemasukan" | "pengeluaran";
  amount: number;
  date: string;
}

export interface MonthlyMarkers {
  [dateString: string]: {
    hasActivity: boolean;
    hasFinance: boolean;
    activityColors: string[];
  };
}

const toLocalYMD = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

export const getMonthlyMarkers = async (year: number, month: number, userId?: string): Promise<MonthlyMarkers> => {
  if (!userId) return {};
  const startOfMonth = new Date(year, month, 1, 0, 0, 0);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);
  const filter = `date >= "${startOfMonth.toISOString()}" && date <= "${endOfMonth.toISOString()}" && user = "${userId}"`;

  try {
    const [activitiesReq, financesReq] = await Promise.all([
      pb.collection('activities').getList(1, 200, { filter, fields: 'date,color', $autoCancel: false }),
      pb.collection('finances').getList(1, 200, { filter, fields: 'date', $autoCancel: false })
    ]);

    const markers: MonthlyMarkers = {};

    activitiesReq.items.forEach((item) => {
      const dateStr = toLocalYMD(new Date(item.date));
      if (!markers[dateStr]) {
          markers[dateStr] = { hasActivity: false, hasFinance: false, activityColors: [] };
      }
      
      markers[dateStr].hasActivity = true;
      const color = item.color || "pink"; 
      if (!markers[dateStr].activityColors.includes(color)) {
          markers[dateStr].activityColors.push(color);
      }
    });

    financesReq.items.forEach((item) => {
      const dateStr = toLocalYMD(new Date(item.date));
      if (!markers[dateStr]) {
          markers[dateStr] = { hasActivity: false, hasFinance: false, activityColors: [] };
      }
      markers[dateStr].hasFinance = true;
    });

    return markers;
  } catch (error) {
    console.error("Gagal load markers:", error);
    return {};
  }
};

export const getActivitiesByDate = async (date: Date, userId: string): Promise<ActivityItem[]> => {
  const startOfDay = new Date(date); startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(date); endOfDay.setHours(23,59,59,999);
  const filter = `date >= "${startOfDay.toISOString()}" && date <= "${endOfDay.toISOString()}" && user = "${userId}"`;
  return await pb.collection('activities').getFullList<ActivityItem>({ filter, sort: 'time' });
};

export const createActivity = async (data: Omit<ActivityItem, "id">) => await pb.collection('activities').create(data);
export const deleteActivity = async (id: string) => await pb.collection('activities').delete(id);

export const getFinancesByDate = async (date: Date, userId: string): Promise<FinanceItem[]> => {
  const startOfDay = new Date(date); startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(date); endOfDay.setHours(23,59,59,999);
  const filter = `date >= "${startOfDay.toISOString()}" && date <= "${endOfDay.toISOString()}" && user = "${userId}"`;
  return await pb.collection('finances').getFullList<FinanceItem>({ filter, sort: '-created' });
};

export const createFinance = async (data: Omit<FinanceItem, "id">) => await pb.collection('finances').create(data);
export const deleteFinance = async (id: string) => await pb.collection('finances').delete(id);