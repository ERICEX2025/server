import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  //Navigate to URL
  await page.goto("http://localhost:5173/");
});

/**
 * Tests entering only "broadband" w/o registering
 */
test('after I type into the input bar "broadband", the command has to be registered', async ({
  page,
}) => {
  await expect(page.getByLabel("Command input")).toBeVisible();
  //Input a search command with no other parameters
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("broadband");
  await page.getByRole("button").click();

  //Check the history log for a search command message
  await expect(page.getByLabel("Item 0")).toContainText(
    "broadband is not one of the registered commands"
  );
  await expect(page.getByLabel("Command input")).toBeEmpty();
});

/**
 * Tests entering only "broadband" after registering
 */
test('after registering broadband, I input "broadband" and command is recognized', async ({
  page,
}) => {
  await expect(page.getByLabel("Command input")).toBeVisible();

  // register command
  await page.getByLabel("Command input").fill("register broadband");
  await page.getByRole("button").click();
  await expect(page.getByLabel("Item 0")).toContainText("broadband registered");

  //Input a search command with no other parameters
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("broadband");
  await page.getByRole("button").click();

  //Check the history log for a search command message
  await expect(page.getByLabel("Item 0")).toContainText("broadband registered");
  await expect(page.getByLabel("Item 1")).toContainText(
    "error_bad_request, please specify a state"
  );
  await expect(page.getByLabel("Command input")).toBeEmpty();
});

/**
 * Tests successful broadband of one county
 */
test("successful broadband call", async ({ page }) => {
  await expect(page.getByLabel("Command input")).toBeVisible();

  // register command
  await page.getByLabel("Command input").fill("register broadband");
  await page.getByRole("button").click();
  await expect(page.getByLabel("Item 0")).toHaveText("broadband registered");

  await page.getByLabel("Command input").click();
  await page
    .getByLabel("Command input")
    .fill("broadband Illinois 'Cook County'");
  await page.getByRole("button").click();

  //Check the history log for a search command message
  await expect(page.getByLabel("Item 0")).toHaveText("broadband registered");
  await expect(page.getByLabel("Item 1")).toHaveText(
    "Cook County, Illinois: 84.8"
  );
});

/**
 * Tests successful broadband of one state
 */
test("successful broadband state call", async ({ page }) => {
  await expect(page.getByLabel("Command input")).toBeVisible();

  // register command
  await page.getByLabel("Command input").fill("register broadband");
  await page.getByRole("button").click();
  await expect(page.getByLabel("Item 0")).toHaveText("broadband registered");

  //Input a broadband command with only state
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("broadband Illinois");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 1")).toContainText(
    "Kankakee County, Illinois: 83.1"
  );
  await expect(page.getByLabel("Item 1")).toContainText(
    "Lake County, Illinois: 90.2"
  );
  await expect(page.getByLabel("Item 1")).toContainText(
    "Lake County, Illinois: 90.2"
  );
  await expect(page.getByLabel("Item 1")).toContainText(
    "Tazewell County, Illinois: 82.4"
  );
});

/**
 * Tests successful broadband of  multiword state
 */
test("successful broadband multi wordstate call", async ({ page }) => {
  await expect(page.getByLabel("Command input")).toBeVisible();

  // register command
  await page.getByLabel("Command input").fill("register broadband");
  await page.getByRole("button").click();
  await expect(page.getByLabel("Item 0")).toHaveText("broadband registered");

  //Input a broadband command with only state
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("broadband 'Rhode Island'");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 1")).toContainText(
    "Kent County, Rhode Island: 84.1"
  );
  await expect(page.getByLabel("Item 1")).toContainText(
    "Providence County, Rhode Island: 85.4"
  );
  await expect(page.getByLabel("Item 1")).toContainText(
    "Newport County, Rhode Island: 90.1"
  );
  await expect(page.getByLabel("Item 1")).toContainText(
    "Washington County, Rhode Island: 92.8"
  );
});

/**
 * Tests unsuccessful broadband (too many params/incorrectly-formatted params)
 */
test("successful broadband multi word county call", async ({ page }) => {
  await expect(page.getByLabel("Command input")).toBeVisible();

  // register command
  await page.getByLabel("Command input").fill("register broadband");
  await page.getByRole("button").click();
  await expect(page.getByLabel("Item 0")).toHaveText("broadband registered");

  //Input a broadband command with incorrect format
  await page
    .getByLabel("Command input")
    .fill("broadband Rhode Island Providence County");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 1")).not.toContainText(
    "Providence County, Rhode Island: 84.1"
  );

  //Check the history log for output
  await expect(page.getByLabel("Item 1")).toHaveText(
    "It seems like you're trying to enter more params than state and county. If your state or county have multiple words, wrap them in quotes."
  );

  await page.getByLabel("Command input").fill("broadband Illinois Cook County");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 2")).toHaveText(
    "It seems like you're trying to enter more params than state and county. If your state or county have multiple words, wrap them in quotes."
  );
});

/**
 * Tests unsuccessful broadband (too few params/incorrectly-formatted params)
 */
test("successful broadband few word call", async ({ page }) => {
  await expect(page.getByLabel("Command input")).toBeVisible();

  // register command
  await page.getByLabel("Command input").fill("register broadband");
  await page.getByRole("button").click();
  await expect(page.getByLabel("Item 0")).toHaveText("broadband registered");

  //Input a broadband command with incorrect format
  await page.getByLabel("Command input").fill("broadband Illinois Cook");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 1")).not.toContainText(
    "Cook County, Illinois: 84.8"
  );

  //Check the history log for output
  await expect(page.getByLabel("Item 1")).toHaveText(
    "error_bad_request, Cook county does not exist"
  );

  await page
    .getByLabel("Command input")
    .fill("broadband 'Cook County' Illinois");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 2")).toHaveText(
    "error_bad_request,Cook County is not a valid state"
  );

  await page.getByLabel("Command input").fill("broadband FakeState FakeCounty");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 3")).toHaveText(
    "error_bad_request,FakeState is not a valid state"
  );
});

/**
 * Tests integration of load, mode, view, search, broadband, add2and2
 */
test("full integration with basically all the implemented commands", async ({
  page,
}) => {
  await expect(page.getByLabel("Command input")).toBeVisible();

  // register commands
  await page.getByLabel("Command input").fill("register broadband");
  await page.getByRole("button").click();
  await page.getByLabel("Command input").fill("register load_file");
  await page.getByRole("button").click();
  await page.getByLabel("Command input").fill("register search");
  await page.getByRole("button").click();
  await page.getByLabel("Command input").fill("register view");
  await page.getByRole("button").click();
  await page.getByLabel("Command input").fill("register mode");
  await page.getByRole("button").click();

  //Input a broadband command with incorrect format
  await page.getByLabel("Command input").fill("load_file ri_income.csv");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 5")).toContainText(
    "successfully loaded ri_income.csv"
  );

  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 6")).toContainText("Barrington");

  await page.getByLabel("Command input").fill("search Barrington true");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 7")).toHaveText(
    "Barrington130,455.00154,441.0069,917.00"
  );

  await page
    .getByLabel("Command input")
    .fill("broadband Illinois 'Cook County'");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 8")).toHaveText(
    "Cook County, Illinois: 84.8"
  );

  await page.getByLabel("Command input").fill("mode verbose");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 9")).toContainText(
    "Command: mode verbose"
  );

  await page
    .getByLabel("Command input")
    .fill("broadband 'Rhode Island' 'Providence County'");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Item 10")).toContainText(
    "Command: broadband 'Rhode Island' 'Providence County"
  );
  await expect(page.getByLabel("Item 10")).toContainText(
    "Output:"
  );

  await page
    .getByLabel("Command input")
    .fill("load_file postsecondary_education.csv");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 11")).toContainText(
    "successfully loaded postsecondary_education.csv"
  );

  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").fill("mode brief");
  await page.getByRole("button").click();
  await page.getByLabel("Command input").fill("search 'Brown University' true");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 14")).toContainText(
    "Asian20202020217156Brown University214brown-university0.069233258Men1"
  );

  await expect(page.getByLabel("Item 14")).not.toContainText(
    "Command:"
  );
   await page.getByLabel("Command input").fill("register add2and2");
   await page.getByRole("button").click();
   await page.getByLabel("Command input").fill("add2and2");
   await page.getByRole("button").click();

   await expect(page.getByLabel("Item 16")).toContainText("4");

  
});


