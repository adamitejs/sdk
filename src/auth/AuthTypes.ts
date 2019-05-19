export type AuthServiceToken = {
  sub: string;
  email: string;
} | null;

export type AuthUser = {
  id: string;
  email: string;
  jwt: AuthServiceToken;
  token: string;
};

export type AuthStateChangeCallback = (authState?: AuthUser) => void;
export type PostRegistrationCallback = (user: AuthUser | undefined) => Promise<void>;
