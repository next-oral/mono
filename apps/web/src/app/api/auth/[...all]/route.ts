import type { NextRequest } from "next/server";

import { auth } from "~/auth/server";
import { env } from "~/env";

const ALLOWED_ORIGIN_REGEX = new RegExp(
  `^(?:http://localhost:300[01]|https://(?:.*\\.)?${env.NEXT_PUBLIC_ROOT_DOMAIN.replace(/\./g, "\\.")}$|https://(?:.*\\.)?nextoral\\.com$|https://(?:.*\\.)?nextoral\\.local$)`,
);

function setCors(res: Response, origin?: string | null) {
  const allowed = origin && ALLOWED_ORIGIN_REGEX.test(origin) ? origin : "";
  if (allowed) {
    res.headers.set("Access-Control-Allow-Origin", allowed);
  }
  res.headers.set("Vary", "Origin");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type, X-Requested-With",
  );
}

export const OPTIONS = (req: NextRequest) => {
  const origin = req.headers.get("origin");
  const res = new Response(null, { status: 204 });
  setCors(res, origin);
  return res;
};

export const GET = async (req: NextRequest) => {
  const res = await auth.handler(req);
  const origin = req.headers.get("origin");
  setCors(res, origin);
  return res;
};

export const POST = async (req: NextRequest) => {
  const res = await auth.handler(req);
  const origin = req.headers.get("origin");
  setCors(res, origin);
  return res;
};
