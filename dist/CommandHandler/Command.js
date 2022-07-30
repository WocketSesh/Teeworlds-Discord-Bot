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
        }
        else {
            this.permission = null;
            this.aliases = [];
        }
    }
}
exports.Command = Command;
