"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const index_1 = require("../../middlewares/index");
// import { ResponseInterface } from "../../utils/response-interface";
exports.handler = (0, index_1.withMiddleware)(async (event) => {
    return {
        statusCode: http_status_1.default.OK,
        body: JSON.stringify({
            message: "Hello from Serverless + TypeScript + Offline!",
            input: event.body,
        }),
    };
});
