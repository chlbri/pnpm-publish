export declare const listVersions: (new_version: string, package_name: string) => Promise<string[] | undefined>;
export declare const getPreviousVersion: (new_version: string, package_name: string) => Promise<string>;
export declare const getFromPackage: (key: string, filter: string) => Promise<string | undefined>;
export declare const getCurrentVersion: (filter: string) => Promise<string | undefined>;
export declare const getPackageName: (filter: string) => Promise<string | undefined>;
//# sourceMappingURL=versions.d.ts.map