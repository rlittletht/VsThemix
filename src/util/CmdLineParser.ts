import { exit } from "process";
import { StringBuilder } from "./StringBuilder";

export interface CmdLineOption
{
    key: string;
    hasParameter: boolean;
    required: boolean;
    paramName?: string;
    description?: string;
    ignoreRequiredArgs?: boolean;
}

export class CmdLineParser
{
    definitions: Map<string, CmdLineOption>;

    ValidateDefinitions()
    {
        for (const key of this.definitions.keys())
        {
            const def = this.definitions.get(key)!;

            if (def.hasParameter && def.paramName == undefined)
                throw new Error(`can't have a parameter with no name: key: ${key}`);
        }
    }

    constructor(definitions: Map<string, CmdLineOption>)
    {
        this.definitions = definitions;
        this.ValidateDefinitions();
    }

    usage(error?: string)
    {
        if (error)
            console.error(`usage error: ${error}\n\n`);

        const sb = new StringBuilder();
        const switches = [];
        for (const key of this.definitions.keys())
        {
            const def = this.definitions.get(key)!;
            const paramName = def.hasParameter ? ` <${def.paramName}>` : "";

            if (def.required)
                switches.push(`-${key}${paramName}`);
            else
                switches.push(`[-${key}${paramName}]`);
        }

        sb.Append(switches.join(" "));

        console.log(`usage: ${process.argv[0]} ${process.argv[1]} ${sb.ToString()}\n`);
        for (const key of this.definitions.keys())
        {
            const def = this.definitions.get(key)!;
            if (def.description)
                console.log(`-${key.padEnd(10, " ")}\t${def.description}`);
        }

        exit(error ? 1 : 0);
    }

    static IsSwitch(arg: string)
    {
        return (arg.startsWith("-") || arg.startsWith("/"));
    }

    ParseArgs<T>(args: string[], t: T)
    {
        const switchesFound = new Set<string>();
        let ignoreRequiredArgs: boolean = false;

        for (let i = 0; i < args.length; i++)
        {
            const _switch = args[i];

            if (!CmdLineParser.IsSwitch(_switch))
                this.usage(`invalid switch: ${_switch}`);

            if (_switch.substring(1) == "?")
                this.usage();

            const def = this.definitions.get(_switch.substring(1));

            if (def == undefined)
            {
                this.usage(`unknown switch: ${_switch}`);
                throw new Error("unreachable");
            }

            if (def.ignoreRequiredArgs)
                ignoreRequiredArgs = true;

            switchesFound.add(def.key);

            if (def.hasParameter)
            {
                if (i + 1 == args.length)
                    this.usage(`switch ${_switch} is missing parameter (out of arguments)`)

                const arg = args[i + 1];
                if (CmdLineParser.IsSwitch(arg))
                    this.usage(`switch ${_switch} is missing parameter (arg is a switch: ${arg})`);

                (t as any)[def.key] = arg;
                i++; // advance past the argument
            }
            else
            {
                (t as any)[def.key] = true;
            }
        }

        if (ignoreRequiredArgs)
            return;
        
        // and finally make sure we have all required switches
        for (const key of this.definitions.keys())
        {
            const def = this.definitions.get(key)!;
            if (def.required && !switchesFound.has(def.key))
                this.usage(`missing required switch: -${key}`);
        }
    }
}
