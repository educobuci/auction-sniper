import 'expect-puppeteer'

describe('Index Page', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000')
  })

  it('should display "Auction Sniper" text on page', async () => {
    await expect(page).toMatch('Auction Sniper')
  })
})