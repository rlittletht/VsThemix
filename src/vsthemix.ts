
import { ThemeCompiler } from "./vstheme/ThemeCompiler";
import { CmdLineParser, CmdLineOption } from "./util/CmdLineParser";
import { _defaultOptions, IOptions } from "./util/IOptions";
import { exit } from "process";
import { Guid } from "./util/Guid";
import { ByteArray } from "./util/ByteArray";
import { PkgString } from "./vstheme/PkgString";
import { XmlToJson } from "./vstheme/XmlToJson";
import { Builtins } from "./vstheme/Builtins";

async function main(): Promise<void>
{
    const optionDefinitions = new Map<string, CmdLineOption>(
        [
            ["ut", { key: "runUnitTests", required: false, hasParameter: false, description: "Run all unit tests", ignoreRequiredArgs: true }],
            ["verbose", { key: "verbose", required: false, hasParameter: false, description: "Show verbose output" }],
            ["saveTemps", { key: "saveTemps", required: false, hasParameter: false, description: "Save temporary files created during VSIX build" }],
            ["testBuild", { key: "testBuild", required: false, hasParameter: false, description: "Build a VSIX for testing. A new guid will be generated always to ensure clean caches", ignoreRequiredArgs: true }],
            ["operation", { key: "operation", required: false, hasParameter: true, paramName: "operation", description: "operation to perform (compile | xml-to-json | json-to-xml)  default is compile" }],
            ["source", { key: "source", required: true, hasParameter: true, paramName: "source", description: "input file or path" }],
            ["destination", { key: "destination", required: true, hasParameter: true, paramName: "destination", description: "output file or path" }],
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
        Builtins.RunUnitTests();

        console.log("All unit tests passed.");
        exit(0);
    }

    if (options.operation === "compile")
    {
        const compiler: ThemeCompiler = new ThemeCompiler(options.destination);
        await compiler.CompileTheme(options.source, options.saveTemps, options.testBuild);
    }
    else if (options.operation === "xml-to-json")
    {
        await XmlToJson.ConvertXmlToJson(options.source, options.destination);
    }
}

// Top-level invocation
(async () =>
{
    try
    {
        await main();
    } catch (err)
    {
        console.error(err);
        process.exit(1);
    }
})();