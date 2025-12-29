
import { ThemeCompiler } from "./vstheme/ThemeCompiler.js";
import { CmdLineParser, CmdLineOption } from "./util/CmdLineParser.js";
import { _defaultOptions, IOptions } from "./util/IOptions.js";
import { exit } from "process";
import { Guid } from "./util/Guid.js";
import { ByteArray } from "./util/ByteArray.js";
import { write } from "fs";
import { PkgString } from "./vstheme/PkgString.js";

async function main(): Promise<void>
{
    const optionDefinitions = new Map<string, CmdLineOption>(
        [
            ["ut", { key: "runUnitTests", required: false, hasParameter: false, description: "Run all unit tests", ignoreRequiredArgs: true }],
            ["verbose", { key: "verbose", required: false, hasParameter: false, description: "Show verbose output" }],
            ["themedef", { key: "themeDef", required: true, hasParameter: true, paramName: "themeDef", description: "theme definition file" }],
            ["output", { key: "output", required: true, hasParameter: true, paramName: "output", description: "output path" }],
        ]);

    const parser = new CmdLineParser(optionDefinitions);

    const options: IOptions = _defaultOptions

    parser.ParseArgs(process.argv.slice(2), options);

    if (options.runUnitTests)
    {
        // Run unit tests here
        ByteArray.RunUnitTests();
        Guid.RunUnitTests();
        PkgString.RunUnitTests();

        console.log("All unit tests passed.");
        exit(0);
    }

    const compiler: ThemeCompiler = new ThemeCompiler(options.output);
    await compiler.CompileTheme(options.themeDef);
}

// Top-level invocation
(async () => {
    try {
        await main();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();