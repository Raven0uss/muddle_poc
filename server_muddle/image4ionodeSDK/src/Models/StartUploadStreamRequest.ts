export default class StartUploadStreamRequest {
    private path: string = "";
    private filename: string = "";

    constructor(path: string, filename: string) {
        this.path = path;
        this.filename = filename;
    }

    public get Path(): string {
        return this.path;
    }

    public get Filename(): string {
        return this.filename;
    }
}