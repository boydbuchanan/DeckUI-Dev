import { AuthCallback } from "./cms";

export interface SessionData {
  isLoggedIn: boolean;
  Auth: AuthCallback | null;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
  Auth: {
    status: 400,
    user: null,
    jwt: null
  }
};
