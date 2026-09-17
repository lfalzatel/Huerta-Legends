import { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "employee";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  photoURL: string | null;
  role: UserRole;
  level: number;
  xp: number;
  coins: number;
  streakDays: number;
  lastActiveAt: Timestamp | null;
  achievements: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ProductCategory = "vegetales" | "frutas" | "hierbas" | "plantas";
export type ProductRarity = "comun" | "raro" | "epico" | "legendario";

export interface Product {
  id?: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  minStock: number;
  image: string | null;
  sku: string | null;
  isActive: boolean;
  rarity: ProductRarity;
  entryDate?: Timestamp | string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dni: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Employee {
  id?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  salary: number;
  hireDate: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type PaymentMethod =
  | "efectivo"
  | "nequi"
  | "daviplata"
  | "transferencia"
  | "tarjeta";

export type SaleStatus = "pendiente" | "completada" | "cancelada";

export interface SaleItem {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id?: string;
  saleNumber: string;
  customerId: string;
  customerName: string;
  employeeId: string | null;
  employeeName: string | null;
  userId: string;
  totalAmount: number;
  itemsCount: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  notes: string | null;
  xpAwarded: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  items?: SaleItem[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  coinReward: number;
  condition: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  rewardXP: number;
  rewardCoins: number;
  progress: number;
  target: number;
  isCompleted: boolean;
  type: "sales" | "customer" | "inventory";
}
