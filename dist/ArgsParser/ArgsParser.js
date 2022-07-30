"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = exports.FLAGS = void 0;
exports.FLAGS = ["-map", "-m", "-difficulty", "-d"];
const parseArgs = (args) => {
    let parsedArgs = [];
    let currentFlag = "default";
    let currentArgument = "";
    args.split(" ").forEach((arg) => {
        if (exports.FLAGS.includes(arg)) {
            if (currentArgument != "") {
                parsedArgs.push({ flag: currentFlag, arg: currentArgument.trim() });
                currentArgument = "";
                currentFlag = arg;
            }
            else
                currentFlag = arg;
        }
        else
            currentArgument += arg + " ";
    });
    if (currentArgument.trim() != "")
        parsedArgs.push({ flag: currentFlag, arg: currentArgument.trim() });
    return parsedArgs;
};
exports.parseArgs = parseArgs;
