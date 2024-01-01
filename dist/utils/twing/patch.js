"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (env) => {
    const defaultFilter = env.filters.get('default');
    // @ts-ignore
    defaultFilter.callable = async (ctx, val, defaultVal) => {
        return val === undefined ? defaultVal : val;
    };
};
