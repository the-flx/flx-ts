[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/flx-ts?logo=npm&color=green)](https://www.npmjs.com/package/flx-ts)
[![npm-dt](https://img.shields.io/npm/dt/flx-ts.svg)](https://npmcharts.com/compare/flx-ts?minimal=true)
[![npm-dm](https://img.shields.io/npm/dm/flx-ts.svg)](https://npmcharts.com/compare/flx-ts?minimal=true)

# flx-ts
> Rewrite emacs-flx in TypeScript, with added support for JavaScript

[![CI](https://github.com/jcs090218/flx-ts/actions/workflows/test.yml/badge.svg)](https://github.com/jcs090218/flx-ts/actions/workflows/test.yml)

## 🔧 Usage

You will need to first install the package:

```bash
$ npm install flx-ts
```

### CommonJS

```js
const flx_ts = require('flx-ts');

console.log(flx_ts.Flx.Score("buffer-file-name", "bfn"));
```

### TypeScript

```typescript
import { Flx } from 'flx-ts';

console.log(Flx.Score("buffer-file-name", "bfn"));
```

### Browser

In your `index.html`:

```html
<script src="/path/to/flx.js"></script>
```

In your javascript file:

```js
console.log(flx_ts.Flx.Score("buffer-file-name", "bfn"));
```

## 🔍 See Also

- [flx][] - Original algorithm
- [flx-rs][] - Rewrite emacs-flx in Rust for dynamic modules
- [FlxCs][] - Rewrite emacs-flx in C#
- [flx-c][] - Rewrite emacs-flx in C

## 📦 Other alternatives

- [fuzzysort](https://github.com/farzher/fuzzysort)

*📝 P.S. Source are from a Reddit post [What is your go to client-side fuzzy searching library?](https://www.reddit.com/r/nextjs/comments/10yxu92/what_is_your_go_to_clientside_fuzzy_searching/).*

## ⚜️ License

`flx-ts` is distributed under the terms of the MIT license.

See [LICENSE](./LICENSE) for details.


<!-- Links -->

[flx]: https://github.com/lewang/flx
[flx-rs]: https://github.com/jcs-elpa/flx-rs
[FlxCs]: https://github.com/jcs090218/FlxCs
[flx-ts]: https://github.com/jcs090218/flx-ts
[flx-c]: https://github.com/jcs090218/flx-c
