export const protocol =
  process.env.NODE_ENV === "production" ? "https" : "http";
export const rootDomain =
  process.env.NODE_ENV === "production" ? "nextoral.com" : "localhost:3000";
