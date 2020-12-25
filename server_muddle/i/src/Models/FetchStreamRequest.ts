export default class FetchStreamRequestModel {
    private from: string = "";
    private targetPath: string = "";
    private filename: string="";

    constructor(from: string, targetPath: string, filename:string) {
        this.from = from;
        this.targetPath = targetPath;
        this.filename=filename;
    }

    public get From(): string {
        return this.from;
    }

    public get TargetPath(): string {
        return this.targetPath;
    }

    public get Filename():string{
        return this.filename;
    }

}