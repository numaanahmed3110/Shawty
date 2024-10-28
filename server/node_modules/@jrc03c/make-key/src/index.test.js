const makeKey = require("./index.js")

test("tests that random strings can be generated correctly", () => {
  const a = makeKey(123)
  expect(a.length).toBe(123)

  const b = makeKey(123)
  const c = makeKey(123)
  expect(b).not.toBe(c)

  const d = makeKey(123, 12345)
  const e = makeKey(123, 12345)
  expect(d).toBe(e)

  const f = makeKey(64, 12345)
  const g = makeKey(32, 12345)
  expect(f.includes(g)).toBe(true)
  expect(g.includes(f)).toBe(false)

  const charset = "Hello, world!"
  const h = makeKey(123, charset)

  h.split("").forEach(char => {
    expect(charset.includes(char)).toBe(true)
  })

  const i = makeKey(123, charset)
  expect(h).not.toBe(i)

  const j = makeKey(123, 12345, charset)
  const k = makeKey(123, 12345, charset)
  expect(j).toBe(k)
  expect(makeKey(123, 12345, "foobar")).not.toBe(k)

  const l = makeKey(64, 12345, charset)
  const m = makeKey(32, 12345, charset)
  expect(l.includes(m)).toBe(true)
  expect(m.includes(l)).toBe(false)
})
