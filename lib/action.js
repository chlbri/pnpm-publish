import { getCurrentVersion, getPreviousVersion } from "./versions.js";
import { saveOuputs } from "./outputs.js";
import { exec } from "./exec.js";
//#region src/action.ts
const main = async () => {
	const { inputs, result } = await exec();
	if (result === void 0 || result.length === 0) {
		const old_version = await getCurrentVersion(inputs.filter);
		return saveOuputs({
			tag: inputs.tag,
			access: inputs.access,
			dry_run: String(inputs.dry_run),
			old_version,
			version: old_version
		});
	} else {
		const old_version = await getPreviousVersion(result[0].version, result[0].name);
		const { name, version } = result[0];
		return saveOuputs({
			name,
			version,
			tag: inputs.tag,
			access: inputs.access,
			released: "true",
			old_version,
			dry_run: String(inputs.dry_run)
		});
	}
};
//#endregion
export { main };

//# sourceMappingURL=action.js.map