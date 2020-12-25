export default class DeleteStreamRequest {
    private name: string = "";

    constructor(name: string) {
        this.name = name;
    }

    public get Name(): string {
        return this.name;
    }
}