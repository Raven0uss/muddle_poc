export default class MoveRequestModel {
    private source;
    private targetPath;
    constructor(source: string, targetPath: string);
    get TargetPath(): string;
    get Source(): string;
}
