export interface ParsedArgs {
  flag: string;
  arg: string;
}
export const FLAGS = ["-map", "-m", "-difficulty", "-d"];

export const parseArgs = (args: string): ParsedArgs[] => {
  let parsedArgs: ParsedArgs[] = [];
  let currentFlag = "default";
  let currentArgument = "";

  args.split(" ").forEach((arg) => {
    if (FLAGS.includes(arg)) {
      if (currentArgument != "") {
        parsedArgs.push({ flag: currentFlag, arg: currentArgument.trim() });
        currentArgument = "";
        currentFlag = arg;
      } else currentFlag = arg;
    } else currentArgument += arg + " ";
  });

  if (currentArgument.trim() != "")
    parsedArgs.push({ flag: currentFlag, arg: currentArgument.trim() });

  return parsedArgs;
};
