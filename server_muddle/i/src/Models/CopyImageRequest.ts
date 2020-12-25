
export default class CopyRequestModel {
    private source: string = "";
    private targetPath: string = "";
    private name: string="";
    private useFilename: boolean=false;
    private overwrite: boolean=false;

    constructor(source: string, targetPath: string, name:string,useFilename:boolean,overwrite:boolean) {
        this.source = source;
        this.targetPath = targetPath;
        this.name=name;
        this.useFilename=useFilename;
        this.overwrite=overwrite;
    }

    public get Source(): string {
        return this.source;
    }

    public get TargetPath(): string {
        return this.targetPath;
    }

    public get Name(): string {
        return this.name;
    }

    public get UseFilename(): boolean {
        return this.useFilename;
    }

    public get Overwrite(): boolean {
        return this.overwrite;
    }

}
