const { name } = require('./package.json')
const tsPreset = require('ts-jest/jest-preset')
const puppeteerPreset = require('jest-puppeteer/jest-preset')

module.exports = {
  ...tsPreset,
  ...puppeteerPreset,
  displayName: `${name} End-to-End`,
  name,
  testRegex: "/end-to-end/.*\\.(test|spec)\\.ts$",
}