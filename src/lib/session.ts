import { SessionOptions } from "iron-session";

export interface SessionData {
    geminiApiKey?: string; // Legacy / Global key
    modelApiKeys?: Record<string, string>; // Per-model keys
    defaultModel?: string;
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_PASSWORD || "my-super-secret-password-at-least-32-chars-long",
    cookieName: "coding_problem_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};
