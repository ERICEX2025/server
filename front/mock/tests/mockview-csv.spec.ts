import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
  //Navigate to URL
  await page.goto("http://localhost:5173/");
    //register the load command
    await page.getByLabel("Command input").click();
    await page.getByLabel("Command input").fill("register mock");
    await page.getByRole("button").click();
})

test('after I type into the input bar "view", the command is recognized', async ({ page }) => {
  await expect(page.getByLabel('Command input')).toBeVisible();

  //Input a load command with no other parameters
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock load_file stardata.csv");
  await page.getByRole("button").click();

  //View the file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock view");
  await page.getByRole("button").click();


  //Check the history log for an element of the StarID csv
  await expect(page.getByLabel("Table 2 row 0 entry 0")).toContainText("Planet");
  await expect(page.getByLabel("Table 2 row 1 entry 0")).toContainText("Earth");
  await expect(page.getByLabel("Command input")).toBeEmpty();
});

test('I submit a view command, but a load command has not been submitted before', async ({ page }) => {
  await expect(page.getByLabel('Command input')).toBeVisible();

  //Try to use the view command before load
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock view");
  await page.getByRole("button").click();

  //Evaluate the response
  await expect(page.getByLabel("Item 1")).toContainText("csv file");
});

test('I submit a view command, but load has been submitted incorrectly', async ({ page }) => {
  await expect(page.getByLabel('Command input')).toBeVisible();

  //Input a load command with a bogus pathname
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock load bad_data.csv");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Item 1")).not.toContainText("successfully");

  //Input a view command
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock view");
  await page.getByRole("button").click();

  //Assess output
  await expect(page.getByLabel("Item 2")).toContainText("csv file not loaded");

});

test('I submit a load command and a view command twice', async ({ page }) => {
  await expect(page.getByLabel('Command input')).toBeVisible();

  //Input a load command with a bogus pathname
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock load_file postsecondary_education.csv");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Item 1")).toContainText("loaded");

  //Input a view command
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock view");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Table 2 row 1 entry 2")).toContainText("Brown");
  // await expect(page.getByLabel("Table 1 entry 2")).toHaveCount(11);


  //Input a new load command
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock load_file stardata.csv");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Item 3")).toContainText("loaded");

  //Input a view command
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock view");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Table 4 row 1 entry 2")).not.toContainText("Brown");
  // await expect(page.getByLabel("Table 3 entry 2")).toHaveCount(7);
});