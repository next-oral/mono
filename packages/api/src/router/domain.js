"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainRouter = void 0;
var zod_1 = require("zod");
var utils_1 = require("../lib/utils");
var trpc_1 = require("../trpc");
exports.domainRouter = {
    getDomainConfig: trpc_1.publicProcedure.query(function () { return ({
        protocol: utils_1.protocol,
        root: utils_1.rootDomain !== null && utils_1.rootDomain !== void 0 ? utils_1.rootDomain : "",
    }); }),
    get: trpc_1.publicProcedure
        .input(zod_1.z.object({
        domain: zod_1.z.string(),
    }))
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var sanitizedSubdomain, data;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sanitizedSubdomain = input.domain
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "");
                    return [4 /*yield*/, ctx.redis.get("subdomain:".concat(sanitizedSubdomain))];
                case 1:
                    data = _c.sent();
                    return [2 /*return*/, data];
            }
        });
    }); }),
    create: trpc_1.publicProcedure
        .input(zod_1.z.object({
        subdomain: zod_1.z.string().min(1),
    }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var subdomain, sanitizedSubdomain, subdomainAlreadyExists;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    subdomain = input.subdomain;
                    sanitizedSubdomain = subdomain
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "");
                    if (sanitizedSubdomain !== subdomain) {
                        throw new Error("Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.");
                    }
                    return [4 /*yield*/, ctx.redis.get("subdomain:".concat(sanitizedSubdomain))];
                case 1:
                    subdomainAlreadyExists = _c.sent();
                    if (subdomainAlreadyExists) {
                        throw new Error("This subdomain is already taken");
                    }
                    return [4 /*yield*/, ctx.redis.set("subdomain:".concat(sanitizedSubdomain), {
                            createdAt: Date.now(),
                        })];
                case 2:
                    _c.sent();
                    return [2 /*return*/, {
                            success: true,
                            redirectUrl: "".concat(utils_1.protocol, "://").concat(sanitizedSubdomain, ".").concat(utils_1.rootDomain),
                        }];
            }
        });
    }); }),
    delete: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        subdomain: zod_1.z.string(),
    }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var subdomain;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    subdomain = input.subdomain;
                    return [4 /*yield*/, ctx.redis.del("subdomain:".concat(subdomain))];
                case 1:
                    _c.sent();
                    return [2 /*return*/, { success: true, message: "Domain deleted successfully" }];
            }
        });
    }); }),
    getAll: trpc_1.protectedProcedure.query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var keys, values;
        var _c;
        var ctx = _b.ctx;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, ctx.redis.keys("subdomain:*")];
                case 1:
                    keys = _d.sent();
                    if (!keys.length) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, (_c = ctx.redis).mget.apply(_c, keys)];
                case 2:
                    values = _d.sent();
                    return [2 /*return*/, keys.map(function (key, index) {
                            var _a;
                            var subdomain = key.replace("subdomain:", "");
                            var data = values[index];
                            return {
                                subdomain: subdomain,
                                createdAt: (_a = data === null || data === void 0 ? void 0 : data.createdAt) !== null && _a !== void 0 ? _a : Date.now(),
                            };
                        })];
            }
        });
    }); }),
};
