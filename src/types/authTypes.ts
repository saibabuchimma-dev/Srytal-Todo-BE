export interface JwtPayload {
  id: string;
  fullName: string;
  email: string;
  role: "Admin" | "Employee";
  type: "access" | "refresh";
}
