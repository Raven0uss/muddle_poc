export default class UploadStreamPartRequest {
    private filename: string = "";
    private partId: number = 0;
    private token: string = "";
    private part: Buffer;

    constructor(filename: string, partId: number, token:string, part:Buffer) {
        this.filename = filename;
        this.partId = partId;
        this.token = token;
        this.part = part;
    }
    public get Filename(): string {
        return this.filename;
    }

    public get PartId(): number {
        return this.partId;
    }

    public get Token(): string {
        return this.token;
    }

    public get Part(): Buffer {
        return this.part;
    }

}
