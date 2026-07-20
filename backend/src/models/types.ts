export type Role = 'Customer' | 'Admin';
export type AuthProvider = 'native' | 'google';

export interface User {
  id: number;
  email: string;
  password_hash: string | null;
  first_name: string;
  last_name: string;
  role: Role;
  auth_provider: AuthProvider;
  google_id: string | null;
  created_at: Date;
}

export type PublicUser = Omit<User, 'password_hash' | 'google_id'>;

export interface JwtPayload {
  sub: number;
  role: Role;
  iat?: number;
  exp?: number;
}
