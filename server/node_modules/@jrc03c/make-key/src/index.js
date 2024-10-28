const {
  assert,
  int,
  isNumber,
  isString,
  random,
  seed,
} = require("@jrc03c/js-math-tools")

function makeKey(keyLength, keySeed, charset) {
  if (arguments.length === 2) {
    if (isNumber(arguments[1])) {
      charset = null
    } else {
      charset = keySeed
      keySeed = null
    }
  }

  assert(
    isNumber(keyLength) && int(keyLength) === keyLength,
    "`keyLength` must be an integer!"
  )

  if (keySeed) {
    assert(
      isNumber(keySeed) && int(keySeed) === keySeed,
      "`keySeed` must be an integer!"
    )

    seed(keySeed)
  }

  if (charset) {
    assert(isString(charset), "`charset` must be a string!")
  }

  let out = ""
  charset = charset || "abcdefg1234567890"

  for (let i = 0; i < keyLength; i++) {
    out += charset[int(random() * charset.length)]
  }

  return out
}

if (typeof module !== "undefined") {
  module.exports = makeKey
}

if (typeof window !== "undefined") {
  window.makeKey = makeKey
}
