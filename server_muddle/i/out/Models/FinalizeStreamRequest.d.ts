export default class FinalizeStreamRequest {
    private filename;
    private token;
    constructor(filename: string, token: string);
    get Filename(): string;
    get Token(): string;
}
