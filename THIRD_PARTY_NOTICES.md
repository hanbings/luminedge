# Third-party notices

Luminedge maintains adaptations of the following projects in this repository. Their original authors, contributors, copyright notices, and MIT license terms remain recognized. The licenses below accompany the corresponding published packages.

## Rough.js

- Source: <https://github.com/rough-stuff/rough>
- Snapshot: `56a2762171b1294d643501e8d14f120db6b27bd7`
- Author: Preet Shihn and contributors
- License: [MIT, copyright © 2019 Preet Shihn](packages/tools/third_party/rough/LICENSE)
- Maintained in `packages/tools/src/rough`; adapted for the Luminedge package, ESM imports, and current geometry dependencies.

The Rough.js adaptation uses these MIT-licensed runtime dependencies. Their original notices are included in the tools package:

| Dependency | Locked version(s) | Original license |
| --- | --- | --- |
| [hachure-fill](https://github.com/pshihn/hachure-fill) | 0.5.2 | [MIT](packages/tools/third_party/hachure-fill/LICENSE) |
| [path-data-parser](https://github.com/pshihn/path-data-parser) | 0.1.0 | [MIT](packages/tools/third_party/path-data-parser/LICENSE) |
| [points-on-curve](https://github.com/pshihn/bezier-points) | 1.0.1 and 0.2.0 | [MIT](packages/tools/third_party/points-on-curve/LICENSE) |
| [points-on-path](https://github.com/pshihn/points-on-path) | 0.2.1 | [MIT](packages/tools/third_party/points-on-path/LICENSE) |

`points-on-path` depends on the 0.2.0 version of `points-on-curve`; both versions carry the same license notice. See the lockfile for the resolved dependency tree.

## rough-notation

- Source: <https://github.com/slidevjs/rough-notation> (original project: <https://github.com/rough-stuff/rough-notation>)
- Snapshot: `54c6da938b366c88b1ca376948ca7691599ddda2`
- Original author: Preet Shihn; Slidev fork contributors include Anthony Fu and other contributors.
- License: [MIT, copyright © 2020 Preet Shihn](packages/components/third_party/rough-notation/LICENSE)
- Maintained in `packages/components/src/annotation`; adapted to use the local Rough.js package and to improve types, cleanup, and motion accessibility.

For package-specific notices, see [tools](packages/tools/THIRD_PARTY_NOTICES.md) and [components](packages/components/THIRD_PARTY_NOTICES.md).
