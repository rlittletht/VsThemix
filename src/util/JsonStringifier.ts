
export interface IJsonStringifyOptions {
    indent?: string;
    maxInlineLength?: number;
    inlineArrays?: boolean;
    inlineObjects?: boolean;
    inlineAfterKeys?: string[];
}

export class JsonStringifier {
    private indent: string;
    private maxInlineLength: number;
    private inlineArrays: boolean;
    private inlineObjects: boolean;
    private inlineAfterKeys: Set<string>;

    constructor(options: IJsonStringifyOptions = {}) {
        this.indent = options.indent ?? '  ';
        this.maxInlineLength = options.maxInlineLength ?? 80;
        this.inlineArrays = options.inlineArrays ?? false;
        this.inlineObjects = options.inlineObjects ?? false;
        this.inlineAfterKeys = new Set(options.inlineAfterKeys ?? []);
    }

    /**
     * Stringify an object with custom pretty printing
     */
    public stringify(obj: any): string {
        return this.stringifyValue(obj, 0, null);
    }

    private stringifyValue(value: any, depth: number, parentKey: string | null): string {
        if (value === null) {
            return 'null';
        }

        if (value === undefined) {
            return 'undefined';
        }

        const type = typeof value;

        if (type === 'string') {
            return JSON.stringify(value);
        }

        if (type === 'number' || type === 'boolean') {
            return String(value);
        }

        if (Array.isArray(value)) {
            return this.stringifyArray(value, depth, parentKey);
        }

        if (type === 'object') {
            return this.stringifyObject(value, depth, parentKey);
        }

        return JSON.stringify(value);
    }

    private stringifyArray(arr: any[], depth: number, parentKey: string | null): string {
        if (arr.length === 0) {
            return '[]';
        }

        const shouldInline = this.shouldInlineArray(arr, parentKey);

        if (shouldInline) {
            const items = arr.map(item => this.stringifyValue(item, depth + 1, null));
            const inline = `[${items.join(', ')}]`;
            if (inline.length <= this.maxInlineLength) {
                return inline;
            }
        }

        const currentIndent = this.indent.repeat(depth);
        const nextIndent = this.indent.repeat(depth + 1);
        const items = arr.map(item => {
            const itemStr = this.stringifyValue(item, depth + 1, null);
            return `${nextIndent}${itemStr}`;
        });

        return `[\n${items.join(',\n')}\n${currentIndent}]`;
    }

    private stringifyObject(obj: any, depth: number, parentKey: string | null): string {
        const keys = Object.keys(obj);

        if (keys.length === 0) {
            return '{}';
        }

        const shouldInline = this.shouldInlineObject(obj, parentKey);

        if (shouldInline) {
            const pairs = keys.map(key => `"${key}": ${this.stringifyValue(obj[key], depth + 1, key)}`);
            const inline = `{${pairs.join(', ')}}`;
            if (inline.length <= this.maxInlineLength) {
                return inline;
            }
        }

        const currentIndent = this.indent.repeat(depth);
        const nextIndent = this.indent.repeat(depth + 1);
        const pairs: string[] = [];

        for (const key of keys) {
            const value = obj[key];
            const shouldInlineValue = this.inlineAfterKeys.has(key);
            
            let valueStr: string;
            if (shouldInlineValue && (Array.isArray(value) || typeof value === 'object')) {
                // Force inline for this specific key
                if (Array.isArray(value)) {
                    const items = value.map(item => this.stringifyValue(item, 0, null));
                    valueStr = `[${items.join(', ')}]`;
                } else if (value !== null) {
                    const kvPairs = Object.keys(value).map(k => 
                        `"${k}": ${this.stringifyValue(value[k], 0, k)}`
                    );
                    valueStr = `{${kvPairs.join(', ')}}`;
                } else {
                    valueStr = this.stringifyValue(value, depth + 1, key);
                }
            } else {
                valueStr = this.stringifyValue(value, depth + 1, key);
            }

            pairs.push(`${nextIndent}"${key}": ${valueStr}`);
        }

        return `{\n${pairs.join(',\n')}\n${currentIndent}}`;
    }

    private shouldInlineArray(arr: any[], parentKey: string | null): boolean {
        if (this.inlineArrays) {
            return true;
        }

        if (parentKey && this.inlineAfterKeys.has(parentKey)) {
            return true;
        }

        // Check if all items are primitives
        return arr.every(item => {
            const type = typeof item;
            return item === null || type === 'string' || type === 'number' || type === 'boolean';
        });
    }

    private shouldInlineObject(obj: any, parentKey: string | null): boolean {
        if (this.inlineObjects) {
            return true;
        }

        if (parentKey && this.inlineAfterKeys.has(parentKey)) {
            return true;
        }

        return false;
    }
}
