export type CreateNpmrcOptions = {
    authToken?: string;
    filePath?: string;
    registry?: string;
};
export declare const createNpmrc: (options?: CreateNpmrcOptions) => {
    created: boolean;
    filePath: string;
    registry: string;
};
