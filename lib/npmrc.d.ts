export type CreateNpmrcOptions = {
    authToken?: string;
    registry?: string;
};
type Out = Partial<{
    created: boolean;
    filePath: string;
    registry: string;
}>;
export declare const createNpmrc: (options?: CreateNpmrcOptions) => Out;
export {};
//# sourceMappingURL=npmrc.d.ts.map