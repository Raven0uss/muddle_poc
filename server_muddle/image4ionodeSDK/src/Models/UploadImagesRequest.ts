export default class UploadImagesRequestModel {
    private useFilename: boolean = false;
    private overwrite: boolean = false;
    private path: string = "";
    private files: File[] = new Array();

    constructor(path: string, overwrite: boolean, useFilename: boolean) {
        this.useFilename = useFilename;
        this.overwrite = overwrite;
        this.path = path;
    }
    public get UseFilename(): boolean {
        return this.useFilename;
    }

    public get Overwrite(): boolean {
        return this.overwrite;
    }

    public get Path(): string {
        return this.path;
    }

    public get Files(): File[] {
        return this.files;
    }

    public Add(data: any, name: string, filename: string) {
        this.files.push(new File(data, name, filename));
    }

}

class File {
    private data: string = "";
    private name: string = "";
    private filename: string = "";

    constructor(data: any, name: string, filename: string) {
        this.data = data;
        this.name = name;
        this.filename = filename;
    }

    public get Data(): string {
        return this.data;
    }

    public get Name(): string {
        return this.name;
    }

    public get FileName(): string {
        return this.filename;
    }

}
