export default class GetStreamRequest {
    private name: string = "";

    constructor(names: string) {
        this.name = name;
    }

    public get Name(): string {
        return this.name;
    }
}