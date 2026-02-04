"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMiddleware = void 0;
const http_status_1 = __importDefault(require("http-status"));
const responseMiddleware = (handler) => {
    return async (event, context) => {
        try {
            const result = await handler(event, context);
            const response = {
                statusCode: result.statusCode ?? http_status_1.default.OK,
                headers: {
                    'Content-Type': 'application/json',
                    ...result.headers,
                },
                body: typeof result.body === 'string'
                    ? result.body
                    : JSON.stringify(result.body),
                isBase64Encoded: result.isBase64Encoded ?? false,
            };
            console.log(`AFTER: ${JSON.stringify(response)}`);
            return response;
        }
        catch (err) {
            console.error('Unhandled error:', err);
            return {
                statusCode: err.statusCode ?? http_status_1.default.INTERNAL_SERVER_ERROR,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: err.message ?? 'Internal Server Error',
                }),
            };
        }
    };
};
exports.responseMiddleware = responseMiddleware;
