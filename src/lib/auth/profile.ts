// Profile row shape, shared by server and client code.

export type AccountType = "doctor" | "student" | "clinic";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  governorate: string | null;
  address: string | null;
  account_type: AccountType | null;
  role: "user" | "admin";
  onboarded_at: string | null;
};

export const PROFILE_COLUMNS = "id, email, full_name, phone, governorate, address, account_type, role, onboarded_at";
