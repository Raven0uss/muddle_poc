export default class StartUploadStreamRequest {
    private path;
    private filename;
    constructor(path: string, filename: string);
    get Path(): string;
    get Filename(): string;
}
