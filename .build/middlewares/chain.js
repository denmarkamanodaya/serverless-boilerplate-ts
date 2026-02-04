"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMiddlewares = void 0;
const body_parser_middleware_1 = require("./body-parser.middleware");
const response_middlware_1 = require("./response.middlware");
exports.defaultMiddlewares = [
    body_parser_middleware_1.jsonBodyMiddleware,
    response_middlware_1.responseMiddleware
];
