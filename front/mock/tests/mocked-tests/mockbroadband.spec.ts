import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  //Navigate to URL
  await page.goto("http://localhost:5173/");
});

/**
 * Tests entering only "broadband" w/o registering
 */
test('after I type into the input bar "mock broadband", the command mock has to be registered', async ({
  page,
}) => {
  await expect(page.getByLabel("Command input")).toBeVisible();
  //Input a search command with no other parameters
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock broadband");
  await page.getByRole("button").click();

  //Check the history log for a search command message
  await expect(page.getByLabel("Item 0")).toContainText(
    "mock is not one of the registered commands"
  );
  await expect(page.getByLabel("Command input")).toBeEmpty();
});

/**
 * Tests entering only "broadband" after registering
 */
test('after registering mock, I input "mock broadband" and command is recognized', async ({
  page,
}) => {
  await expect(page.getByLabel("Command input")).toBeVisible();

  // register command
  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();
  await expect(page.getByLabel("Item 0")).toContainText("mock registered");

  //Input a search command with no other parameters
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock broadband");
  await page.getByRole("button").click();

  //Check the history log for a search command message
  await expect(page.getByLabel("Item 0")).toContainText("mock registered");
  await expect(page.getByLabel("Item 1")).toContainText(
    "please enter a state and optional county"
  );
  await expect(page.getByLabel("Command input")).toBeEmpty();
});

/**
 * Tests successful broadband of one county
 */
test("successful broadband call", async ({ page }) => {
  await expect(page.getByLabel("Command input")).toBeVisible();

  // register command
  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();
  await expect(page.getByLabel("Item 0")).toHaveText("mock registered");

  await page.getByLabel("Command input").click();
  await page
    .getByLabel("Command input")
    .fill("mock broadband Illinois 'Cook County'");
  await page.getByRole("button").click();

  //Check the history log for a search command message
  await expect(page.getByLabel("Item 0")).toHaveText("mock registered");
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
  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();
  await expect(page.getByLabel("Item 0")).toHaveText("mock registered");

  //Input a broadband command with only state
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock broadband Illinois");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 1")).toContainText(
    "Kankakee County, Illinois: 83.1"
  );
  await expect(page.getByLabel("Item 1")).toContainText(
    "Cook County, Illinois: 84.8"
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
  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();
  await expect(page.getByLabel("Item 0")).toHaveText("mock registered");

  //Input a broadband command with only state
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mock broadband 'Rhode Island'");
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
  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();
  await expect(page.getByLabel("Item 0")).toHaveText("mock registered");

  //Input a broadband command with incorrect format
  await page
    .getByLabel("Command input")
    .fill("mock broadband Rhode Island Providence County");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 1")).not.toContainText(
    "Providence County, Rhode Island: 84.1"
  );

  //Check the history log for output
  await expect(page.getByLabel("Item 1")).toHaveText(
    "It seems like you're trying to enter more params than state and county. If your state or county have multiple words, wrap them in quotes."
  );

  await page.getByLabel("Command input").fill("mock broadband Illinois Cook County");
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
  await page.getByLabel("Command input").fill("register mock");
  await page.getByRole("button").click();
  await expect(page.getByLabel("Item 0")).toHaveText("mock registered");

  //Input a broadband command with incorrect format
  await page.getByLabel("Command input").fill("mock broadband Illinois Cook");
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
    .fill("mock broadband 'Cook County' Illinois");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 2")).toHaveText(
    "error_bad_request,Cook County is not a valid state"
  );

  await page.getByLabel("Command input").fill("mock broadband FakeState FakeCounty");
  await page.getByRole("button").click();

  //Check the history log for output
  await expect(page.getByLabel("Item 3")).toHaveText(
    "error_bad_request,FakeState is not a valid state"
  );
});
