## CHANGELOG

<details>
<summary>

## **[0.5.0] - 04/06/2026** => _13:52_

</summary>

- Remove les inputs obsolètes de l'action composite (`version`, `cwd`,
  `report-summary`, `no-git-checks`).
- Add les nouveaux inputs `provenance`, `AUTH` et `registry`.
- Add les nouvelles sorties `access` et `dry-run` pour exposer les
  métadonnées de publication.
- Add une logique d'auto-stabilisation dans le hook husky `commit-msg`.
- Fix la validation des schémas d'extraction de version et l'affichage des
  logs de débogage.
- Fix les références aux variables de sortie dans le workflow de
  publication.
- Fix la standardisation des erreurs de console et résolution du pathing du
  package.
- Add une documentation détaillée sur les erreurs de push NPM.
- Refactor l'action composite en action Node24 écrite en TypeScript et
  compilée avec Rolldown.
- Refactor la gestion des commandes en extrayant l'exécution dans un helper
  avec validation via Valibot.
- Refactor l'extraction de la version en simplifiant le parsing.
- Refactor le code en supprimant les fichiers obsolètes.
- <u>Test coverage **_25.76%_**</u>

</details>

<br/>

<details>
<summary>

## **[0.2.0] - 03/06/2026** => _13:37_

</summary>

- Add une action composite GitHub pour encapsuler `pnpm publish` avec les
  options principales exposees en inputs.
- Fix la construction de la commande de publication et le quoting shell des
  arguments transmis a `pnpm publish`.
- Enhance les sorties de l'action avec le nom du package, les anciennes et
  nouvelles versions, l'etat de release et le tag utilise.
- Refactor la configuration de l'action en simplifiant les inputs, en
  supprimant l'etape de setup pnpm et en renommant les sorties de version
  en kebab-case.
- <u>Test coverage **_100%_**</u>

</details>

<br/>

<br/>
<br/>

### Version [0.0.1] --> _date & hour_

- ✨ Première version de la bibliothèque

<br/>

## Auteur

chlbri (bri_lvi@icloud.com)

[My github](https://github.com/chlbri?tab=repositories)

[<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>](https://github.com/chlbri?tab=repositories)

<br/>

## Liens

- [Documentation](https://github.com/chlbri/new-package)
