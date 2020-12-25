export default class FetchStreamRequestModel {
    private from;
    private targetPath;
    private filename;
    constructor(from: string, targetPath: string, filename: string);
    get From(): string;
    get TargetPath(): string;
    get Filename(): string;
}
