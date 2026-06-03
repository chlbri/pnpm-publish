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
