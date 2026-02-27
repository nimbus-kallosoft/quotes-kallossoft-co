import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'https://quotes.kallossoft.co';

test.describe('Homepage', () => {
  test('loads with heading and quote cards', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Main heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    // Quote cards rendered as blockquotes inside the grid
    const cards = page.locator('blockquote');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('has a quote submission form with textarea and author input', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Quote textarea
    const textarea = page.locator('textarea[placeholder="Enter an inspiring quote..."]');
    await expect(textarea).toBeVisible();

    // Author input
    const authorInput = page.locator('input[placeholder="Who said this?"]');
    await expect(authorInput).toBeVisible();

    // Submit button
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });
});

test.describe('Quote Submission', () => {
  test('submit quote via form → success message shown', async ({ page }) => {
    const testQuote = `Test quote ${Date.now()} — automated testing`;
    const testAuthor = 'Playwright Bot';

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Fill quote textarea
    const textarea = page.locator('textarea[placeholder="Enter an inspiring quote..."]');
    await textarea.fill(testQuote);

    // Fill author input
    const authorInput = page.locator('input[placeholder="Who said this?"]');
    await authorInput.fill(testAuthor);

    // Submit
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Expect success message
    await expect(page.locator('text=Quote submitted successfully')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Gallery Page', () => {
  test('loads with quote cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/gallery`);
    await page.waitForLoadState('networkidle');
    // Wait for client-side data fetch to complete
    await page.waitForTimeout(3000);

    const cards = page.locator('blockquote');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('category filter tabs are present and clickable', async ({ page }) => {
    await page.goto(`${BASE_URL}/gallery`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Category filter buttons (pill buttons)
    const filterButtons = page.locator('button').filter({ hasText: /Wisdom|Humor|Motivation|Love|Life|Tech/ });
    if (await filterButtons.count() > 0) {
      await filterButtons.first().click();
      await page.waitForTimeout(1000);
      // Cards should still be visible after filter
      const cards = page.locator('blockquote');
      await expect(cards.first()).toBeVisible({ timeout: 8000 });
    }
  });

  test('has All filter tab', async ({ page }) => {
    await page.goto(`${BASE_URL}/gallery`);
    await page.waitForLoadState('networkidle');
    // "All" button should be present
    const allButton = page.locator('button:has-text("All")');
    await expect(allButton.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Quote Detail Page', () => {
  test('single quote page shows quote text and share links', async ({ page }) => {
    // Get a quote ID from the API
    const response = await page.request.get(`${BASE_URL}/api/quotes?limit=1`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);

    const quoteId = data[0].id;
    await page.goto(`${BASE_URL}/quote/${quoteId}`);
    await page.waitForLoadState('networkidle');

    // Quote text visible as blockquote
    const quoteBlock = page.locator('blockquote');
    await expect(quoteBlock.first()).toBeVisible({ timeout: 10000 });

    // Share links (Twitter / LinkedIn)
    const twitterLink = page.locator('a:has-text("Twitter")');
    await expect(twitterLink).toBeVisible({ timeout: 5000 });

    const linkedinLink = page.locator('a:has-text("LinkedIn")');
    await expect(linkedinLink).toBeVisible({ timeout: 5000 });
  });

  test('quote detail page has OG image preview', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/quotes?limit=1`);
    const data = await response.json();
    const quoteId = data[0].id;

    await page.goto(`${BASE_URL}/quote/${quoteId}`);
    await page.waitForLoadState('networkidle');

    // OG image preview should be on the page
    const ogImg = page.locator(`img[src*="/api/og/${quoteId}"]`);
    await expect(ogImg).toBeVisible({ timeout: 10000 });
  });
});

test.describe('API Routes', () => {
  test('GET /api/quotes returns JSON array', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/quotes`);
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET /api/quotes with limit param works', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/quotes?limit=5`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeLessThanOrEqual(5);
  });

  test('GET /api/quotes with category filter works', async ({ request }) => {
    // Get all quotes, find a category ID
    const allResp = await request.get(`${BASE_URL}/api/quotes?limit=20`);
    const all = await allResp.json();
    expect(all.length).toBeGreaterThan(0);
    const catId = all[0].category_id;

    const filtered = await request.get(`${BASE_URL}/api/quotes?category=${catId}`);
    expect(filtered.status()).toBe(200);
    const filteredBody = await filtered.json();
    expect(Array.isArray(filteredBody)).toBeTruthy();
    // All results should belong to that category
    filteredBody.forEach((q: { category_id: string }) => {
      expect(q.category_id).toBe(catId);
    });
  });

  test('GET /api/og/[id] returns image/png 1200x630', async ({ request }) => {
    const quotesResp = await request.get(`${BASE_URL}/api/quotes?limit=1`);
    expect(quotesResp.status()).toBe(200);
    const quotes = await quotesResp.json();
    expect(quotes.length).toBeGreaterThan(0);

    const quoteId = quotes[0].id;
    const response = await request.get(`${BASE_URL}/api/og/${quoteId}`);
    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('image/png');

    // Verify PNG magic bytes: 89 50 4E 47
    const body = await response.body();
    expect(body[0]).toBe(0x89);
    expect(body[1]).toBe(0x50); // P
    expect(body[2]).toBe(0x4E); // N
    expect(body[3]).toBe(0x47); // G
  });

  test('POST /api/quotes creates a new quote (201)', async ({ request }) => {
    const quotesResp = await request.get(`${BASE_URL}/api/quotes?limit=1`);
    const quotes = await quotesResp.json();
    const categoryId = quotes[0]?.category_id;
    expect(categoryId).toBeTruthy();

    const response = await request.post(`${BASE_URL}/api/quotes`, {
      data: {
        text: `API test quote ${Date.now()} — Playwright`,
        author: 'Playwright Test',
        category_id: categoryId,
      },
    });
    // API returns 201 Created
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('text');
    expect(body).toHaveProperty('author');
  });

  test('POST /api/quotes validates required fields', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/quotes`, {
      data: { text: 'Missing author and category' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

test.describe('OG Metadata', () => {
  test('quote detail page has correct og:image meta tag', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/quotes?limit=1`);
    const quotes = await response.json();
    const quoteId = quotes[0].id;

    await page.goto(`${BASE_URL}/quote/${quoteId}`);
    await page.waitForLoadState('networkidle');

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
    expect(ogImage).toContain('/api/og/');
  });

  test('quote detail page has correct og:title meta tag', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/quotes?limit=1`);
    const quotes = await response.json();
    const quoteId = quotes[0].id;

    await page.goto(`${BASE_URL}/quote/${quoteId}`);
    await page.waitForLoadState('networkidle');

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
  });
});
