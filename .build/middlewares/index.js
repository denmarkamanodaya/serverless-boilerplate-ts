"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withMiddleware = void 0;
const chain_1 = require("./chain");
const withMiddleware = (handler, extra = []) => {
    const chain = [...chain_1.defaultMiddlewares, ...extra];
    return chain.reduceRight((next, middleware) => middleware(next), handler);
};
exports.withMiddleware = withMiddleware;
