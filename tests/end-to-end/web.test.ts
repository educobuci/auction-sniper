jest.setTimeout(10000)

test.skip('web test', async () => {
  page.on('console', (message) => console.log(message?.text()))
  await page.goto('http://localhost:3000/?item-id=item-123')
  
  // const statusXPath = `//div[contains(text(), 'Lost')]`
  // await expect(page.waitForXPath(statusXPath)).resolves.not.toThrow()
  
  // const content = await page.waitForSelector('#status-label-lost')
  // const value = await content.evaluate(el => el.textContent)
  // expect(value).toEqual('Lost')

  await page.waitForFunction(
    'document.querySelector("#status-label").innerText.includes("Lost")'
  )
})

afterEach(async () => {
  await jestPuppeteer.resetBrowser()
})

export {}