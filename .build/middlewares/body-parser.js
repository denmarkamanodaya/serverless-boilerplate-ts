"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonBodyMiddleware = void 0;
const jsonBodyMiddleware = (handler) => {
    return async (event, context) => {
        if (event.body && typeof event.body === 'string') {
            try {
                event.body = JSON.parse(event.body);
            }
            catch {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid JSON body' }),
                };
            }
        }
        return handler(event, context);
    };
};
exports.jsonBodyMiddleware = jsonBodyMiddleware;
