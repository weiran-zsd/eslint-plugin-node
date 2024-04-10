# Changelog

## [17.2.0](https://github.com/eslint-community/eslint-plugin-n/compare/v17.1.0...v17.2.0) (2024-04-10)


### 🌟 Features

* **no-missing-imports:** add `tryExtensions` option ([#228](https://github.com/eslint-community/eslint-plugin-n/issues/228)) ([ae5329c](https://github.com/eslint-community/eslint-plugin-n/commit/ae5329c06b38da1220a352d4d268cfa8038c0d00))
* **no-unsupported-features:** ✨ Update to node v20.12.0/v21.7.0 ([#229](https://github.com/eslint-community/eslint-plugin-n/issues/229)) ([a8d0539](https://github.com/eslint-community/eslint-plugin-n/commit/a8d0539ae99697f0e3441625c61e2e6ed7a10b9a))


### 🩹 Fixes

* `stream/promises` is stable ([02a264e](https://github.com/eslint-community/eslint-plugin-n/commit/02a264e0acb7ba913500e195fe0a2a6aaae74c6e))
* **no-unsupported-features:** `stream/promises` is stable ([#235](https://github.com/eslint-community/eslint-plugin-n/issues/235)) ([02a264e](https://github.com/eslint-community/eslint-plugin-n/commit/02a264e0acb7ba913500e195fe0a2a6aaae74c6e)), closes [#234](https://github.com/eslint-community/eslint-plugin-n/issues/234)

## [17.1.0](https://github.com/eslint-community/eslint-plugin-n/compare/v17.0.0...v17.1.0) (2024-04-09)


### 🌟 Features

* add `name` to flat configs ([#224](https://github.com/eslint-community/eslint-plugin-n/issues/224)) ([24512a0](https://github.com/eslint-community/eslint-plugin-n/commit/24512a0fe27bcb9b2a0ed20cd83bcbd3c0060d0b))
* **import-target:** Add resolution error reason ([ed7b25c](https://github.com/eslint-community/eslint-plugin-n/commit/ed7b25cf4ccb3f27bf89993a7fc8c706e3491ad5))
* remove "is-builtin-module" dependency (fixes [#232](https://github.com/eslint-community/eslint-plugin-n/issues/232)) ([#227](https://github.com/eslint-community/eslint-plugin-n/issues/227)) ([03619ee](https://github.com/eslint-community/eslint-plugin-n/commit/03619eed4d24cb8ed79c467fe4a620bd58fea4cd))


### 📚 Documentation

* add v17 changelog ([#223](https://github.com/eslint-community/eslint-plugin-n/issues/223)) ([4fb36eb](https://github.com/eslint-community/eslint-plugin-n/commit/4fb36eb253536b694d16b72d31221c98f1012f9f))

## [17.0.0](https://github.com/eslint-community/eslint-plugin-n/compare/v17.0.0...v17.0.0-8) (2024-04-08)

## 💥 Breaking changes:

* feat!: drop eslint v7 & node.js < 18 ([#161](https://github.com/eslint-community/eslint-plugin-n/issues/161)) ([41ceed7](https://github.com/eslint-community/eslint-plugin-n/commit/41ceed7))
* feat!: Start using `enhanced-resolve` to improve ts support ([#139](https://github.com/eslint-community/eslint-plugin-n/issues/139)) ([dc9f473](https://github.com/eslint-community/eslint-plugin-n/commit/dc9f473))
* rename rule shebang => hashbang, deprecate rule shebang ([#198](https://github.com/eslint-community/eslint-plugin-n/issues/198))

## Features

* typescript (jsdoc) checking and definition generation ([#169](https://github.com/eslint-community/eslint-plugin-n/issues/169)) ([6d8ed14](https://github.com/eslint-community/eslint-plugin-n/commit/6d8ed14c186a814c3a258993fb6c986a02ed5568))
* rename rule shebang =&gt; hashbang, deprecate rule shebang ([#198](https://github.com/eslint-community/eslint-plugin-n/issues/198)) ([cefdb1c](https://github.com/eslint-community/eslint-plugin-n/commit/cefdb1c26d856b544470e825daef2dfa5d0e4a30)), closes [#196](https://github.com/eslint-community/eslint-plugin-n/issues/196)
* **shebang:** add support for env's split-string option ([#195](https://github.com/eslint-community/eslint-plugin-n/issues/195)) ([b383b49](https://github.com/eslint-community/eslint-plugin-n/commit/b383b4971df4f4b67099655797b654b36d6a8fdf))
* Update ES Syntax ([#189](https://github.com/eslint-community/eslint-plugin-n/issues/189)) ([4778ae8](https://github.com/eslint-community/eslint-plugin-n/commit/4778ae86c398f90da13248c2d31bfc4a83cd2dea))
* feat: Update es-builtins ([#174](https://github.com/eslint-community/eslint-plugin-n/issues/174)) ([fbc9e7b](https://github.com/eslint-community/eslint-plugin-n/commit/fbc9e7b))
* feat(no-unsupported-features): Update to v21.6.1 of node ([#180](https://github.com/eslint-community/eslint-plugin-n/issues/180)) ([d24f645](https://github.com/eslint-community/eslint-plugin-n/commit/d24f645))
* feat: Add n/prefer-node-protocol rule ([#183](https://github.com/eslint-community/eslint-plugin-n/issues/183)) ([88d1c37](https://github.com/eslint-community/eslint-plugin-n/commit/88d1c37))
* feat(shebang): Add options to ignore unpublished files ([#172](https://github.com/eslint-community/eslint-plugin-n/issues/172)) ([5609abb](https://github.com/eslint-community/eslint-plugin-n/commit/5609abb))

## Bugfixes

* prefer-node-protocol: not first target ([#204](https://github.com/eslint-community/eslint-plugin-n/issues/204)) ([caab777](https://github.com/eslint-community/eslint-plugin-n/commit/caab77714ec9195c07290d4c212a95f11b48bb5f))
* **prefer-node-protocol:** continue on version range check ([#206](https://github.com/eslint-community/eslint-plugin-n/issues/206)) ([14d2ea9](https://github.com/eslint-community/eslint-plugin-n/commit/14d2ea90c1609b49e95cc805105711c62bf6fd50))
* prefer-node-prefix: pass moduleName ([#203](https://github.com/eslint-community/eslint-plugin-n/issues/203))
* **no-unsupported-features:** Remove use of `static` as a variable ([#190](https://github.com/eslint-community/eslint-plugin-n/issues/190)) ([e31d868](https://github.com/eslint-community/eslint-plugin-n/commit/e31d8683b65a6f982cb91634f951afd0fe5583ae))
* fix: Remove `require("util")` import in import-target (#181) (d32eff3)

## Chores

* use `ts-ignore-import` to lighten the dependencies ([#219](https://github.com/eslint-community/eslint-plugin-n/issues/219)) ([fb0aaae](https://github.com/eslint-community/eslint-plugin-n/commit/fb0aaae9a5d540542a4122fe333097c200b78b95))
* update dependency @typescript-eslint/parser to v7 ([#207](https://github.com/eslint-community/eslint-plugin-n/issues/207)) ([0b8aeb3](https://github.com/eslint-community/eslint-plugin-n/commit/0b8aeb3e8d8f1837a443d93a5bf55ad55bba085d))
* update dependency husky to v9 ([#208](https://github.com/eslint-community/eslint-plugin-n/issues/208)) ([e84d47b](https://github.com/eslint-community/eslint-plugin-n/commit/e84d47b98de65eb77ac96cef44af2adb901acac0))
* Enable global strict eslint rule ([#191](https://github.com/eslint-community/eslint-plugin-n/issues/191)) ([99fe387](https://github.com/eslint-community/eslint-plugin-n/commit/99fe38722d02de867f4bd8061a343b9754b62610))
* Migrate to manifest config ([#192](https://github.com/eslint-community/eslint-plugin-n/issues/192)) ([c8a87f3](https://github.com/eslint-community/eslint-plugin-n/commit/c8a87f3ef99348e547259f3939274cdf4da72b08))
* docs: improve wording of file-extension-in-import docs (#110) (3f178ab)
* build: run test on eslint pre-releases (#171) (77de809)
* ci: Make release-please publish pre-releases (#186) (4b12cdc)
* chore: update dependency globals to v14 (#185) (9930101)
* chore: update dependency markdownlint-cli to ^0.39.0 (#179) (cd5cbbb)
* chore: Merge supported and backport properties (#177) (5d1cb98)
* chore: `npm run format` (#175) (17e658e)
* chore!: remove "n/no-unsupported-features" #140 (#173) (372b283)
* chore: update dependency minimatch to v9 (#167) (5ad657c)
* chore: add release-please (#170) (fc77da2)
* chore: update dependency @typescript-eslint/parser to v6 (#166) (4265094)
* chore: update dependency markdownlint-cli to ^0.38.0 (#149) (3fd61be)
* chore: update dependency release-it to v17 (#168) (1c91e05)
* chore: upgrade prettier v3 (#165) (bbfde8d)

## [17.0.0-8](https://github.com/eslint-community/eslint-plugin-n/compare/v17.0.0-7...v17.0.0-8) (2024-04-08)


### Chores

* use `ts-ignore-import` to lighten the dependencies ([#219](https://github.com/eslint-community/eslint-plugin-n/issues/219)) ([fb0aaae](https://github.com/eslint-community/eslint-plugin-n/commit/fb0aaae9a5d540542a4122fe333097c200b78b95))

## [17.0.0-7](https://github.com/eslint-community/eslint-plugin-n/compare/v17.0.0-6...v17.0.0-7) (2024-04-07)


### Features

* typescript (jsdoc) checking and definition generation ([#169](https://github.com/eslint-community/eslint-plugin-n/issues/169)) ([6d8ed14](https://github.com/eslint-community/eslint-plugin-n/commit/6d8ed14c186a814c3a258993fb6c986a02ed5568))


### Bug Fixes

* change peer dependencies to allow eslint v9 ([#216](https://github.com/eslint-community/eslint-plugin-n/issues/216)) ([5e82d7f](https://github.com/eslint-community/eslint-plugin-n/commit/5e82d7f26aa8dc58b46584c9fe3c74a11c265228))

## [17.0.0-6](https://github.com/eslint-community/eslint-plugin-n/compare/v17.0.0-5...v17.0.0-6) (2024-03-25)


### Bug Fixes

* prefer-node-protocol: not first target ([#204](https://github.com/eslint-community/eslint-plugin-n/issues/204)) ([caab777](https://github.com/eslint-community/eslint-plugin-n/commit/caab77714ec9195c07290d4c212a95f11b48bb5f))
* **prefer-node-protocol:** continue on version range check ([#206](https://github.com/eslint-community/eslint-plugin-n/issues/206)) ([14d2ea9](https://github.com/eslint-community/eslint-plugin-n/commit/14d2ea90c1609b49e95cc805105711c62bf6fd50))


### Chores

* update dependency @typescript-eslint/parser to v7 ([#207](https://github.com/eslint-community/eslint-plugin-n/issues/207)) ([0b8aeb3](https://github.com/eslint-community/eslint-plugin-n/commit/0b8aeb3e8d8f1837a443d93a5bf55ad55bba085d))
* update dependency husky to v9 ([#208](https://github.com/eslint-community/eslint-plugin-n/issues/208)) ([e84d47b](https://github.com/eslint-community/eslint-plugin-n/commit/e84d47b98de65eb77ac96cef44af2adb901acac0))

## [17.0.0-5](https://github.com/eslint-community/eslint-plugin-n/compare/v17.0.0-4...v17.0.0-5) (2024-03-19)


### ⚠ BREAKING CHANGES

* prefer-node-prefix: pass moduleName ([#203](https://github.com/eslint-community/eslint-plugin-n/issues/203))

### Features

* prefer-node-prefix: pass moduleName ([#203](https://github.com/eslint-community/eslint-plugin-n/issues/203)) ([38985ca](https://github.com/eslint-community/eslint-plugin-n/commit/38985ca63537cc56ae2476457ec7d5e433bf0a2f))


### Bug Fixes

* explicitly support ESLint 9.0.0 pre-releases ([#200](https://github.com/eslint-community/eslint-plugin-n/issues/200)) ([a5eaa9c](https://github.com/eslint-community/eslint-plugin-n/commit/a5eaa9c867bc2e87b1fa54920c85acd1e8f9f927))


### Documentation

* Remove text "Node does not support modules yet" ([#202](https://github.com/eslint-community/eslint-plugin-n/issues/202)) ([5abca5b](https://github.com/eslint-community/eslint-plugin-n/commit/5abca5bb6f1166045578ba7d51cda36b32cb333b))

## [17.0.0-4](https://github.com/eslint-community/eslint-plugin-n/compare/17.0.0-3...v17.0.0-4) (2024-03-06)


### ⚠ BREAKING CHANGES

* rename rule shebang => hashbang, deprecate rule shebang ([#198](https://github.com/eslint-community/eslint-plugin-n/issues/198))

### Features

* rename rule shebang =&gt; hashbang, deprecate rule shebang ([#198](https://github.com/eslint-community/eslint-plugin-n/issues/198)) ([cefdb1c](https://github.com/eslint-community/eslint-plugin-n/commit/cefdb1c26d856b544470e825daef2dfa5d0e4a30)), closes [#196](https://github.com/eslint-community/eslint-plugin-n/issues/196)
* **shebang:** add support for env's split-string option ([#195](https://github.com/eslint-community/eslint-plugin-n/issues/195)) ([b383b49](https://github.com/eslint-community/eslint-plugin-n/commit/b383b4971df4f4b67099655797b654b36d6a8fdf))
* Update ES Syntax ([#189](https://github.com/eslint-community/eslint-plugin-n/issues/189)) ([4778ae8](https://github.com/eslint-community/eslint-plugin-n/commit/4778ae86c398f90da13248c2d31bfc4a83cd2dea))


### Bug Fixes

* **no-unsupported-features:** Remove use of `static` as a variable ([#190](https://github.com/eslint-community/eslint-plugin-n/issues/190)) ([e31d868](https://github.com/eslint-community/eslint-plugin-n/commit/e31d8683b65a6f982cb91634f951afd0fe5583ae))


### Chores

* Enable global strict eslint rule ([#191](https://github.com/eslint-community/eslint-plugin-n/issues/191)) ([99fe387](https://github.com/eslint-community/eslint-plugin-n/commit/99fe38722d02de867f4bd8061a343b9754b62610))
* Migrate to manifest config ([#192](https://github.com/eslint-community/eslint-plugin-n/issues/192)) ([c8a87f3](https://github.com/eslint-community/eslint-plugin-n/commit/c8a87f3ef99348e547259f3939274cdf4da72b08))
