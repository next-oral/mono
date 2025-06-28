"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
var trpc_1 = require("../trpc");
exports.authRouter = {
    getSession: trpc_1.publicProcedure.query(function (_a) {
        var ctx = _a.ctx;
        return ctx.session;
    }),
    getSecretMessage: trpc_1.protectedProcedure.query(function () {
        return "you can see this secret message!";
    }),
};
