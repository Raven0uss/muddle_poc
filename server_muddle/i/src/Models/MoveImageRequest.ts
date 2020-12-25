export default class MoveRequestModel {
    private source: string = "";
    private targetPath: string = "";

    constructor(source: string, targetPath: string) {
        this.source = source;
        this.targetPath = targetPath;
    }

    public get TargetPath(): string {
        return this.targetPath;
    }

    public get Source(): string {
        return this.source;
    }
}