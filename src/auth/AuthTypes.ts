export type AuthServiceToken = { sub: string; email: string } | null;

export type AuthUser =
  | { id: string; email: string; jwt: AuthServiceToken; token: string }
  | undefined;

export type AuthStateChangeCallback = (authState: AuthUser) => void;
