export declare const buildCommand: () => {
    command: string;
    inputs: {
        access: string;
        tag: string;
        publishBranch: string;
        filter: string;
        dry_run: boolean;
        force: boolean;
        provenance: boolean;
        AUTH: string;
        registry: string;
    };
};
