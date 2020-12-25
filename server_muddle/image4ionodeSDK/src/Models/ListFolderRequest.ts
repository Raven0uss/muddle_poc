export default class ListFolderRequestModel {
    private path: string = "";
    private continuationToken: string="";

    constructor(path: string,continuationToken: string) {
        this.path = path;
        this.continuationToken=continuationToken;
    }

    public get Path(): string {
        return this.path;
    }

    public get ContinuationToken():string{
        return this.continuationToken;
    }
}