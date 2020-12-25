export default class ListFolderRequestModel {
    private path;
    private continuationToken;
    constructor(path: string, continuationToken: string);
    get Path(): string;
    get ContinuationToken(): string;
}
