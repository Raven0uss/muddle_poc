export default class FetchImageRequestModel {
    private from;
    private targetPath;
    private useFilename;
    constructor(from: string, targetPath: string, useFilename: boolean);
    get From(): string;
    get TargetPath(): string;
    get UseFilename(): boolean;
}
