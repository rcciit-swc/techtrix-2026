export interface userDataType {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface userStateType {
  userData: userDataType | null;
  userLoading: boolean;
}

export interface userActionsType {
  setUserData: () => void;
}
