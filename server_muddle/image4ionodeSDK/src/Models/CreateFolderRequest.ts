export default class CreateFolderRequestModel {
    private path: string = "";

    constructor(path: string) {
        this.path = path;
    }

    public get Path(): string {
        return this.path;
    }

}