"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(name, func, options) {
        this.name = name;
        this.func = func;
        if (options) {
            this.permission = options.permission ?? null;
            this.aliases = options.aliases ?? [];
            this.flags = options.flags ?? [];
            this.description = options.description ?? null;
            this.expectedUsage = options.expectedUsage ?? null;
        }
        else {
            this.permission = null;
            this.aliases = [];
            this.flags = [];
            this.description = null;
            this.expectedUsage = null;
        }
    }
}
exports.Command = Command;
