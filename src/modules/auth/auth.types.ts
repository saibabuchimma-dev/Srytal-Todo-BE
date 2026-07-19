export interface LoginDto {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  fullName: string;
  email: string;
  role: "Admin" | "Employee";
}
