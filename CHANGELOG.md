# Changelog

## [17.0.1-8](https://github.com/eslint-community/eslint-plugin-n/compare/v17.0.0-8...v17.0.1-8) (2024-04-08)


### Chores

* release latest version ([#218](https://github.com/eslint-community/eslint-plugin-n/issues/218)) ([9814627](https://github.com/eslint-community/eslint-plugin-n/commit/9814627748f07129659f7d86ee500f8465c1ab26))

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
