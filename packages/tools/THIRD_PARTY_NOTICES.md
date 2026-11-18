# Third-party notices

This package contains an adaptation of [Rough.js](https://github.com/rough-stuff/rough), snapshot `56a2762171b1294d643501e8d14f120db6b27bd7`, by Preet Shihn and contributors. The original [MIT license and copyright notice](third_party/rough/LICENSE) are included. Changes adapt imports and geometry dependency types for Luminedge.

Rough.js uses the following MIT-licensed runtime dependencies; their notices are provided for downstream redistributors:

- [hachure-fill](https://github.com/pshihn/hachure-fill) 0.5.2: [license](third_party/hachure-fill/LICENSE)
- [path-data-parser](https://github.com/pshihn/path-data-parser) 0.1.0: [license](third_party/path-data-parser/LICENSE)
- [points-on-curve](https://github.com/pshihn/bezier-points) 1.0.1 and 0.2.0: [license](third_party/points-on-curve/LICENSE)
- [points-on-path](https://github.com/pshihn/points-on-path) 0.2.1: [license](third_party/points-on-path/LICENSE)

The 0.2.0 version of `points-on-curve` is a dependency of `points-on-path`; both versions carry the same license notice. Versions above describe the workspace lockfile and may differ in a downstream installation.

QR encoding uses [uqr](https://github.com/unjs/uqr). Its [MIT notice](third_party/uqr/LICENSE) credits Project Nayuki and Anthony Fu.
