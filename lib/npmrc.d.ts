export type CreateNpmrcOptions = {
    authToken?: string;
    filePath?: string;
    registry?: string;
};
type Out = Partial<{
    created: boolean;
    filePath: string;
    registry: string;
}>;
export declare const createNpmrc: (options?: CreateNpmrcOptions) => Out;
export {};
