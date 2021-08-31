const { name } = require('./package.json');
const tsPreset = require('ts-jest/jest-preset')
const puppeteerPreset = require('jest-puppeteer/jest-preset')

module.exports = {
  displayName: name,
  name,
  ...tsPreset,
  ...puppeteerPreset,
}