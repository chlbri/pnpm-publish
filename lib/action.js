import { getCurrentVersion, getPackageName, getPreviousVersion } from "./versions.js";
import { saveOuputs } from "./outputs.js";
import { exec } from "./exec.js";
//#region src/action.ts
const main = async () => {
	const { inputs, result } = await exec();
	const packageName = await getPackageName(inputs.filter);
	if (result === void 0 || result.length === 0) {
		const version = await getCurrentVersion(inputs.filter);
		return saveOuputs({
			tag: inputs.tag,
			access: inputs.access,
			dry_run: String(inputs.dry_run),
			old_version: version,
			version
		});
	} else {
		const { version, name } = result.find((e) => e.name === packageName);
		const old_version = await getPreviousVersion(version, name);
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