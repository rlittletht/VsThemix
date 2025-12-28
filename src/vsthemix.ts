
import { CmdLineParser, CmdLineOption } from "./util/CmdLineParser.js";
import { _defaultOptions, IOptions } from "./util/IOptions.js";

const optionDefinitions = new Map<string, CmdLineOption>(
    [
        ["ut", { key: "runUnitTests", required: false, hasParameter: false, description: "Run all unit tests" }],
        ["verbose", { key: "verbose", required: false, hasParameter: false, description: "Show verbose output" }],
        ["themedef", { key: "themeDef", required: true, hasParameter: true, paramName: "themeDef", description: "theme definition file" }],
    ]);

const parser = new CmdLineParser(optionDefinitions);

const options: IOptions = _defaultOptions
    
parser.ParseArgs(process.argv.slice(2), options);