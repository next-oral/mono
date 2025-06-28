"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootDomain = exports.protocol = void 0;
var env_1 = require("@repo/auth/env");
exports.protocol = env_1.env.NODE_ENV === "production" ? "https" : "http";
exports.rootDomain = env_1.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_ROOT_DOMAIN
    : "localhost:3000";
