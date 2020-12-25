export default class FinalizeStreamRequest {
    private filename: string = "";
    private token: string = "";

    constructor(filename: string, token: string) {
        this.filename = filename;
        this.token = token;
    }

    public get Filename(): string {
        return this.filename;
    }

    public get Token(): string {
        return this.token;
    }
}