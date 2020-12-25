/// <reference types="node" />
export default class UploadStreamPartRequest {
    private filename;
    private partId;
    private token;
    private part;
    constructor(filename: string, partId: number, token: string, part: Buffer);
    get Filename(): string;
    get PartId(): number;
    get Token(): string;
    get Part(): Buffer;
}
