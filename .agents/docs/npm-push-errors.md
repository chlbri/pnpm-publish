# NPM & PNPM Registry Publishing Errors Reference

This guide provides a comprehensive reference of the potential errors, status codes, and issues encountered when publishing packages to the npm registry (or other registries like GitHub Packages) using `npm publish` or `pnpm publish`.

---

## Quick Reference Table

| Error Code | HTTP Status | Common Cause | Quick Resolution |
| :--- | :--- | :--- | :--- |
| **`ENEEDAUTH`** / **`E401`** | `401 Unauthorized` | Missing, expired, or invalid credentials/auth token. | Run `npm login` or verify the auth token in `.npmrc`. |
| **`E403`** | `403 Forbidden` | No write permission to package; or name already taken. | Check package ownership, or verify the package scope/name. |
| **`E402`** / **`E403`** | `402 Payment Req.` / `403` | Publishing a scoped package without public access. | Add the `--access public` flag when publishing. |
| **`EOTP`** | `403 Forbidden` | Two-Factor Authentication (2FA) is required. | Provide OTP using `--otp=xxxxxx` or use an automation token. |
| **`EPUBLISHCONFLICT`** / **`E403`** | `409 Conflict` / `403 Forbidden` | Package version already exists on the registry. | Increment the version number in `package.json`. |
| **`E404`** | `404 Not Found` | Registry URL misconfigured or package scope doesn't exist. | Verify registry configuration and scopes. |
| **`E400`** / **`E422`** | `400` / `422 Bad Request` | Invalid package name, metadata, or name too similar to existing. | Fix name in `package.json`, check spam limits. |
| **`E413`** | `413 Payload Too Large` | Package tarball size exceeds registry limit. | Optimize package contents using `files` array or `.npmignore`. |
| **`E429`** | `429 Too Many Requests` | Rate limit hit (e.g., too many failed OTP attempts). | Wait 10-15 minutes and retry. |
| **`ELIFECYCLE`** | N/A (Local) | A pre-publish or preparation script failed. | Run build/tests locally to debug lifecycle scripts. |
| **`EGITCHECKS`** | N/A (Local / pnpm) | Unclean git state, wrong branch, or not pushed to remote. | Use `--no-git-checks` or commit changes. |
| **`EPROVENANCE`** | N/A (Registry/CI) | Provenance generation failed due to configuration. | Add `id-token: write` permissions, align repository URLs. |

---

## 1. Authentication & Permission Errors

### `ENEEDAUTH` / `E401 Unauthorized`
* **Symptoms:**
  ```
  npm ERR! code ENEEDAUTH
  npm ERR! code E401
  npm ERR! 401 Unauthorized - GET https://registry.npmjs.org/... - You must be logged in to publish packages.
  ```
* **Causes:**
  1. The authentication token in `.npmrc` is missing, expired, or invalid.
  2. The command is running in a non-interactive CI/CD environment without registry credentials.
* **Solutions:**
  * **Locally:** Run `npm login` or `pnpm login` to refresh credentials.
  * **In CI/CD:** Ensure that your `.npmrc` file is correctly configured with the auth token, e.g.:
    ```text
    //registry.npmjs.org/:_authToken=${NPM_TOKEN}
    ```
    Make sure the environment variable (`NPM_TOKEN`) is properly exposed to the pipeline.

### `E403 Forbidden` (General)
* **Symptoms:**
  ```
  npm ERR! code E403
  npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/package-name - You do not have permission to publish "package-name". Are you logged in as the correct user?
  ```
* **Causes:**
  1. You are logged in, but you do not have collaborator/owner permissions for that package or scope.
  2. You are trying to publish a new package, but the package name has already been registered by someone else.
* **Solutions:**
  * Check the owner of the package on npm: `npm owner ls <package-name>`.
  * Ensure you are logged in as the correct user: `npm whoami`.
  * If the package name is taken, you must choose a different name, or publish it under your own user/organization scope (e.g., `@my-scope/my-package`).

### `402 Payment Required` or `403 Forbidden` (Scoped Private Package)
* **Symptoms:**
  ```
  npm ERR! code E402
  npm ERR! 402 Payment Required - PUT https://registry.npmjs.org/@scope/package-name - You must sign up for private packages
  ```
* **Causes:**
  * By default, npm treats scoped packages (e.g., `@my-org/my-package`) as private. Private packages require a paid subscription on the npm registry.
* **Solutions:**
  * If the package should be public (free), append the access flag:
    ```bash
    npm publish --access public
    pnpm publish --access public
    ```
  * Alternatively, configure private hosting via a different registry (e.g., GitHub Packages) or pay for npm Teams/Pro.

### Email Verification Required (`E403`)
* **Symptoms:**
  ```
  npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/... - Please verify your email before publishing
  ```
* **Causes:**
  * The npm account registered to the token has not completed email verification.
* **Solutions:**
  * Log in to the npm web interface, go to your profile settings, and request/complete email verification.

---

## 2. Two-Factor Authentication (2FA) & One-Time Password (OTP) Errors

### `EOTP` / `E403 Forbidden` (One-Time Password Required)
* **Symptoms:**
  ```
  npm ERR! code EOTP
  npm ERR! code E403
  npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/... - You must provide a one-time password
  ```
* **Causes:**
  * The publishing account has 2FA enabled for write/publish actions, and the OTP was either not provided or was invalid/expired.
* **Solutions:**
  * **Locally:** Enter the 6-digit OTP when prompted, or explicitly pass it:
    ```bash
    npm publish --otp=123456
    ```
  * **In CI/CD:** You cannot enter OTP interactively. You must use an **Automation Token** (specifically generated in npm settings to bypass 2FA) or configure **Trusted Publishing (OIDC)**. Note that "Publish Tokens" require 2FA, while "Automation Tokens" bypass it.

### `E429 Too Many Requests` (Rate-Limiting)
* **Symptoms:**
  ```
  npm ERR! code E429
  npm ERR! 429 Too Many Requests - PUT https://registry.npmjs.org/...
  ```
* **Causes:**
  * Too many failed authentication attempts (e.g., inputting wrong OTPs repeatedly) or too many consecutive publication runs in a very short window.
* **Solutions:**
  * Wait 10 to 15 minutes for the rate limit to reset.
  * Check that your OTP device clock is synchronized. Time mismatches (even by 30 seconds) will cause invalid OTPs and trigger rate-limiting.

---

## 3. Conflict & Versioning Errors

### `EPUBLISHCONFLICT` / `E409 Conflict` or `E403 Forbidden` (Version already exists)
* **Symptoms:**
  * **On npm registry:**
    ```
    npm ERR! code EPUBLISHCONFLICT
    npm ERR! 409 Conflict - PUT https://registry.npmjs.org/package-name - You cannot publish over the previously published versions: x.y.z.
    ```
  * **On GitHub Packages / other registries:**
    ```
    npm ERR! code E403
    npm ERR! 403 Forbidden - PUT https://npm.pkg.github.com/@scope/package - Cannot publish over existing version.
    ```
* **Causes:**
  * You are trying to publish a version of the package that is already present on the registry.
  * The public npm registry is immutable and rejects overwrite attempts with `409 Conflict`.
  * Alternative/private registries (such as GitHub Packages, AWS CodeArtifact, or JFrog Artifactory) often return `403 Forbidden` because package version overwrites are either disabled by policy or restrict permissions. Once a version is published, it cannot be replaced or republished.
* **Solutions:**
  * Increment the version number in your `package.json` before publishing:
    ```bash
    npm version patch
    # or minor / major
    ```

---

## 4. Package Metadata & Name Validation Errors

### `E400 Bad Request` / `E422 Unprocessable Entity` (Invalid Name)
* **Symptoms:**
  ```
  npm ERR! code E400
  npm ERR! 400 Bad Request - PUT https://registry.npmjs.org/... - Package name contains invalid characters
  ```
* **Causes:**
  * The `name` field in `package.json` violates naming rules:
    * Contains uppercase letters.
    * Contains spaces, underscores, or invalid special characters (only hyphens, alphanumeric characters, and scoped `@` syntax are allowed).
    * Clashes with core Node.js modules (e.g., `http`, `path`, `fs`).
* **Solutions:**
  * Standardize the name in `package.json` to lowercase and remove disallowed characters.

### `E400 Bad Request` (Name Too Similar)
* **Symptoms:**
  ```
  npm ERR! 400 Bad Request - PUT https://registry.npmjs.org/... - Package name is too similar to an existing package
  ```
* **Causes:**
  * npm's spam and typosquatting protection blocks names that are phonetically or visually too close to popular packages.
* **Solutions:**
  * Choose a more distinct name for your package.

---

## 5. Size & Network Limits

### `E413 Payload Too Large`
* **Symptoms:**
  ```
  npm ERR! code E413
  npm ERR! 413 Payload Too Large - PUT https://registry.npmjs.org/...
  ```
* **Causes:**
  * The generated package tarball exceeds the size limit allowed by the registry (for npm registry, this is typically 2GB, but corporate registries may have lower limits).
* **Solutions:**
  * Reduce package size by optimizing what files are packed.
  * Use the `files` field in `package.json` to whitelist only necessary distribution files (e.g., `dist`, `lib`, `README.md`).
  * Use `.npmignore` or `.gitignore` to exclude build artifacts, testing suites, node_modules, and cache files.

---

## 6. Git Status & Monorepo/Workspace Errors (PNPM Specific)

### `EGITCHECKS` (Dirty Working Directory / Branch Mismatch)
* **Symptoms:**
  ```
  ERR_PNPM_GIT_NOT_UNCLEAN  Cannot publish: there are uncommitted changes
  # OR
  ERR_PNPM_GIT_NOT_CORRECT_BRANCH  Cannot publish from branch "feature/xyz" (expected "main")
  ```
* **Causes:**
  * By default, `pnpm publish` validates that:
    1. Your git working directory is completely clean (no uncommitted changes).
    2. You are on the main release branch (typically `master` or `main`).
    3. Your local branch is fully in sync with the remote repository.
* **Solutions:**
  * **CI/CD environments:** Since CI/CD checkouts are often in detached HEAD states or have build artifacts generated before publishing, bypass these git checks by running:
    ```bash
    pnpm publish --no-git-checks
    ```
  * **Config-level:** Permanently disable this check in your project's `.npmrc` file:
    ```text
    git-checks=false
    ```

### Private Workspace Packages
* **Symptoms:**
  * Running publish fails or skips a package in a monorepo workspace.
* **Causes:**
  * A package inside a pnpm workspace has `"private": true` in its `package.json`, which prevents npm from publishing it.
* **Solutions:**
  * Ensure packages meant to be public have `"private": false` or omit the field.
  * Use pnpm filters to publish only specific packages:
    ```bash
    pnpm --filter ./packages/my-package publish
    ```

---

## 7. Provenance & Attestation Errors (OIDC)

### Missing Workflow Permissions (OIDC)
* **Symptoms:**
  ```
  npm ERR! Provenance generation failed: ...
  ```
* **Causes:**
  * When using `--provenance` in GitHub Actions, npm needs to query the GitHub OIDC provider for an identity token. If the token permission is not granted, provenance generation fails.
* **Solutions:**
  * Add the `id-token: write` permission to your GitHub Actions workflow file:
    ```yaml
    permissions:
      contents: read
      id-token: write  # Crucial for OIDC provenance attestation
    ```

### Repository URL Mismatch
* **Symptoms:**
  ```
  npm ERR! 400 Bad Request - Provenance statement repository URL does not match package.json repository URL
  ```
* **Causes:**
  * The `repository.url` listed in `package.json` does not match the actual GitHub repository URL where the CI action is running.
* **Solutions:**
  * Update the `repository` field in `package.json` to match the exact casing and format of your repository URL (e.g., `git+https://github.com/org/repo.git`).

### Self-Hosted Runner or Private Repo Limitations
* **Symptoms:**
  ```
  npm ERR! Provenance is only supported for public repositories and cloud-hosted runners.
  ```
* **Solutions:**
  * Do not use `--provenance` if publishing from a private GitHub repository or from a self-hosted runner, as npm cannot verify the execution chain.
