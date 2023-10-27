import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
  //Navigate to URL
  await page.goto('http://localhost:5173/');
})

/**
 * Tests recognizing search command
 */
test('after I type into the input bar "search", the command is recognized', async ({ page }) => {

  await expect(page.getByLabel('Command input')).toBeVisible();
  //Input a search command with no other parameters
  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();
  await page.getByLabel("Command input").fill("mock search");
  await page.getByRole("button").click();

  //Check the history log for a search command message
  await expect(page.getByLabel("Item 1")).toContainText("please provide a search term");
  await expect(page.getByLabel("Command input")).toBeEmpty();
})

/**
 * Tests search without load
 */
test('I submit a search command, but a load command has not been submitted before', async ({ page }) => {
  await expect(page.getByLabel('Command input')).toBeVisible();

  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();

  //Input a search command with no load command
  await page.getByLabel("Command input").fill("mock search Planet Pluto");
  await page.getByRole("button").click();

  //Evaluate the response
  await expect(page.getByLabel("Item 1")).toContainText("csv file not loaded");
});

/**
 * Tests searching without column identifier
 */
test('I submit a search command with no column specified', async ({ page }) => {
  await expect(page.getByLabel('Command input')).toBeVisible();

  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();

  //Input a load command with a valid pathname
  await page.getByLabel("Command input").fill("mock load_file stardata.csv");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Item 1")).toContainText("successfully");

  //Input a search command without a column specified
  await page.getByLabel("Command input").fill("mock search Huge");
  await page.getByRole("button").click();

  //Assert that both entries are contained in the output
  await expect(page.getByLabel("Item 2")).toContainText("Saturn");
  await expect(page.getByLabel("Item 2")).toContainText("Jupiter");
  await expect(page.getByLabel("Item 2")).toContainText("Red");
});

/**
 * Tests searching with column identifier
 */
test('I submit a search command with column specified', async ({ page }) => {
  await expect(page.getByLabel('Command input')).toBeVisible();
  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();

  //Input a load command with a valid pathname
  await page.getByLabel("Command input").fill("mock load_file stardata.csv");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Item 1")).toContainText("successfully");

  //Input a search command with the wrong column specified
  await page.getByLabel("Command input").fill("mock search Size Pluto");
  await page.getByRole("button").click();
  //Assert that no results were found
  await expect(page.getByLabel("Item 2")).toContainText("cannot find search query");

  //Input a search command with the right column specified
  await page.getByLabel("Command input").fill("mock search Planet Pluto");
  await page.getByRole("button").click();

  //Assert that both entries are contained in the output
  await expect(page.getByLabel("Item 3")).toContainText("Pluto");
  await expect(page.getByLabel("Item 3")).toContainText("Tiny");

});

/**
 * Tests searching after viewing
 */
test('I submit a search command after submitting a view command', async ({ page }) => {
  await expect(page.getByLabel('Command input')).toBeVisible();

  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();

  //Input a load command with a valid filepath
  await page.getByLabel("Command input").fill("mock load_file income_by_race_edited.csv");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Item 1")).toContainText("successfully");

  //Input a view command
  await page.getByLabel("Command input").fill("mock view");
  await page.getByRole("button").click();

  //Input a search command
  await page.getByLabel("Command input").fill("mock search Year 2000");
  await page.getByRole("button").click();

  //Assert that search works as intended
  await expect(page.getByLabel("Item 3")).toContainText("67000");
  await expect(page.getByLabel("Item 3")).toContainText("2000");
  await expect(page.getByLabel("Item 3")).toContainText("Asian");
});

/**
 * Tests multiple search commands
 */
test('I submit multiple search commands', async ({ page }) => {
  await expect(page.getByLabel('Command input')).toBeVisible();
  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();

  //Input a load command with a valid filename
  await page.getByLabel("Command input").fill("mock load_file postsecondary_education.csv");
  await page.getByRole("button").click();

  //Input a search command
  await page.getByLabel("Command input").fill("mock search Brown");
  await page.getByRole("button").click();  

  await expect(page.getByLabel("Item 2")).toContainText("Brown");
  await expect(page.getByLabel("Item 2")).toContainText("2000");
  await expect(page.getByLabel("Item 2")).toContainText("Hispanic");

  //Input a different search command
  await page.getByLabel("Command input").fill("mock search Hispanic");
  await page.getByRole("button").click();  

  await expect(page.getByLabel("Item 3")).toContainText("Female");
  await expect(page.getByLabel("Item 3")).toContainText("2001");    
});

/**
 * Test search with no results
 */
test('I submit a search command, but nothing was found', async ({ page }) => {
  await expect(page.getByLabel('Command input')).toBeVisible();

  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();

  //Input a load command with a valid pathname
  await page.getByLabel("Command input").fill("mock load_file stardata.csv");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Item 1")).toContainText("successfully");

  //Input a search command to an entry that doesn't exist
  await page.getByLabel("Command input").fill("mock search fakeData");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Item 2")).toContainText("cannot find search query");
});

/**
 * Test search using index as col identifier
 */
test("I submit a search command using and index as a column identifier", async({page}) => {
  await expect(page.getByLabel('Command input')).toBeVisible();

  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();

  //Input a load command with a valid pathname
  await page.getByLabel("Command input").fill("mock load_file postsecondary_education.csv");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Item 1")).toContainText("successfully");

  //Input a search command to an entry that doesn't exist
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock search 0 Asian");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Table 2 row 0 entry 0")).toContainText("Asian");
  await expect(page.getByLabel("Table 2 row 0 entry 3")).toContainText("Female");
})