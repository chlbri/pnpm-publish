import type { Output } from './types';
export declare const exec: () => Promise<{
    result: Output[] | undefined;
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
}>;
//# sourceMappingURL=exec.d.ts.map