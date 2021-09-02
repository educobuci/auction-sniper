const { name } = require('./package.json')
const tsPreset = require('ts-jest/jest-preset')

module.exports = {
  ...tsPreset,
  displayName: `${name} Unit`,
  name,
  testRegex: "/unit/.*\\.(test|spec)\\.ts$",
}