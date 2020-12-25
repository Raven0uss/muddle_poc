export default class CopyRequestModel {
    private source;
    private targetPath;
    private name;
    private useFilename;
    private overwrite;
    constructor(source: string, targetPath: string, name: string, useFilename: boolean, overwrite: boolean);
    get Source(): string;
    get TargetPath(): string;
    get Name(): string;
    get UseFilename(): boolean;
    get Overwrite(): boolean;
}
