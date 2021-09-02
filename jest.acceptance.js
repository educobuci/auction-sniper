const { name } = require('./package.json')
const tsPreset = require('ts-jest/jest-preset')

module.exports = {
  ...tsPreset,
  displayName: `${name} Acceptance`,
  name,
  testRegex: "/acceptance/.*\\.(test|spec)\\.ts$",
}