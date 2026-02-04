"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonBodyMiddleware = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonBodyMiddleware = (handler) => {
    return async (event, context) => {
        if (event.body && typeof event.body === 'string') {
            try {
                event.body = JSON.parse(event.body);
                console.log(`BEFORE: ${JSON.stringify(event.body)}`);
            }
            catch {
                return {
                    statusCode: http_status_1.default.BAD_REQUEST,
                    body: JSON.stringify({ message: 'Invalid JSON body' }),
                };
            }
        }
        return handler(event, context);
    };
};
exports.jsonBodyMiddleware = jsonBodyMiddleware;
