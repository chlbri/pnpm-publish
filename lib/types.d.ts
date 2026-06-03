export type Output = {
    name?: string;
    version?: string;
};
export type OutputExtended = Output & {
    tag?: string;
    access?: string;
    released?: string;
    old_version?: string;
    dry_run?: string;
};
export type InputsSommand = {
    access: string;
    tag: string;
    publishBranch: string;
    filter: string;
    dry_run: boolean;
    provenance: boolean;
    force: boolean;
};
//# sourceMappingURL=types.d.ts.map