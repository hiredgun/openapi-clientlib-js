/* eslint-disable @typescript-eslint/no-unused-vars */
abstract class ParserBase {
    getSchemaNames() {}

    getSchemaType(_schemaName: string, _schemaType: string) {}

    getSchemaName() {}

    getSchema(_schemaName: string) {}

    addSchema(_schema: string, _schemaName: string) {}

    abstract parse(_data: string, _schemaName?: string): unknown;

    abstract stringify(_data: unknown, _schemaName?: string): string | null;

    abstract getFormatName(): string;
}

export default ParserBase;
