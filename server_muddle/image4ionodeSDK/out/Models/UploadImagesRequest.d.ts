export default class UploadImagesRequestModel {
    private useFilename;
    private overwrite;
    private path;
    private files;
    constructor(path: string, overwrite: boolean, useFilename: boolean);
    get UseFilename(): boolean;
    get Overwrite(): boolean;
    get Path(): string;
    get Files(): File[];
    Add(data: any, name: string, filename: string): void;
}
declare class File {
    private data;
    private name;
    private filename;
    constructor(data: any, name: string, filename: string);
    get Data(): string;
    get Name(): string;
    get FileName(): string;
}
export {};
