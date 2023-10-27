import { test, expect } from '@playwright/test';

test.beforeEach(async({page}) => {
    // ... you'd put it here.
    // TODO: Is there something we need to do before every test case to avoid repeating code?
    await page.goto('http://localhost:5173/');
  

  })


  /**
   * Tests recognizing the command
   */
  test('after I type into the input bar "load", the command is recognized', async ({ page }) => {
    await expect(page.getByLabel('Command input')).toBeVisible();
    //Input a load command with no other parameters
    await page.getByLabel("Command input").fill("register mock");
    await page.getByRole("button").click();
    await page.getByLabel("Command input").fill("mock load_file");
    await page.getByRole("button").click();

    //Check the history log for a load command message
    const bad_load = "Please provide 1 argument for load: load_file <csv-file-path>"
    await expect(page.getByLabel("Item 1")).toContainText(bad_load);
    await expect(page.getByLabel("Command input")).toBeEmpty();
  })

  /**
   * Tests loading invalid csv, then loading valid csv
   */
  test('I submit a load command, but the path is not recognized', async ({ page }) => {
    await expect(page.getByLabel('Command input')).toBeVisible();

    await page.getByLabel("Command input").fill("register mock");
    await page.getByRole("button").click();
    await page.getByLabel("Command input").fill("mock load_file");
    await page.getByRole("button").click();

    //Input a load command with a bogus pathname
    await page.getByLabel("Command input").fill("mock load_file data/not_valid.csv");
    await page.getByRole("button").click();
  
    //Evaluate the response
    const bad_load = "can not recognize the csv filepath"
    await expect(page.getByLabel("Item 2")).toContainText(bad_load);

    await page
      .getByLabel("Command input")
      .fill("mock load_file stardata.csv");
    await page.getByRole("button").click();
    await expect(page.getByLabel("Item 3")).toContainText(
          "successfully loaded stardata.csv"
        );

  });

  /**
   * Tests loading valid csvs
   */
  test('I submit a load command, and the path is recognized', async ({ page }) => {
    await expect(page.getByLabel('Command input')).toBeVisible();

    await page.getByLabel("Command input").fill("register mock");
    await page.getByRole("button").click();

    //Input a load command with a valid pathname
    await page.getByLabel("Command input").click();
    await page.getByLabel("Command input").fill("mock load_file stardata.csv");
    await page.getByRole("button").click();

    await expect(page.getByLabel("Item 1")).toContainText("successfully loaded stardata.csv");

    await page.getByLabel("Command input").fill("mock load_file ri_income");
    await page.getByRole("button").click();
    await expect(page.getByLabel("Item 2")).toContainText(
          "successfully loaded ri_income"
        );

  });