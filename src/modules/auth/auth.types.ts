export interface LoginDto {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: "Admin" | "Employee";
}
