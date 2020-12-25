export default class FetchImageRequestModel {
    private from: string = "";
    private targetPath: string = "";
    private useFilename: boolean=false;

    constructor(from: string, targetPath: string, useFilename:boolean) {
        this.from = from;
        this.targetPath = targetPath;
        this.useFilename=useFilename;
    }

    public get From(): string {
        return this.from;
    }

    public get TargetPath(): string {
        return this.targetPath;
    }

    public get UseFilename():boolean{
        return this.useFilename;
    }

}