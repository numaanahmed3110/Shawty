> ⚠️ **NOTE:** ⚠️ This project is being merged into a monorepo [here](https://github.com/jrc03c/monorepo/tree/main/packages/make-key). This repo will soon be archived.

---

# Intro

**make-key** generates alphanumeric strings of arbitrary length.

# Node / browser

## Installation

```bash
npm install --save https://github.com/jrc03c/make-key
```

## Usage

Node / bundlers:

```js
const makeKey = require("@jrc03c/make-key")
const keyLength = 32
const keySeed = 1234

console.log(makeKey(keyLength))
// "8v1101x1whevcm1cgdhuq90e12549xri"

console.log(makeKey(keyLength, keySeed))
// "dcb09fuuv3smirvqaetiyggvhap90e88"
```

Browser:

```html
<script src="path/to/@jrc03c/make-key/dist/make-key.js"></script>
<script>
  // (makeKey is now in the global scope)

  const keyLength = 32
  const keySeed = 1234

  console.log(makeKey(keyLength))
  // "8v1101x1whevcm1cgdhuq90e12549xri"

  console.log(makeKey(keyLength, keySeed))
  // "dcb09fuuv3smirvqaetiyggvhap90e88"
</script>
```

## API

### `makeKey(length, seed, charset)`

Returns a random string of length `length`. Can optionally be given a random `seed` value as a number and/or a `charset` as a string of characters from which to generate the new string.

# CLI

## Installation

```bash
git clone https://github.com/jrc03c/make-key
cd make-key
npm link
```

Optionally, you can install `xsel` to automatically have the key copied to the clipboard:

```bash
sudo apt-get install -y xsel
```

## Usage

```bash
# key <length> <seed>
key 32 12345
```

## API

### `key <length> <seed> <charset>`

These arguments mean the same thing as in the Node / browser API.
