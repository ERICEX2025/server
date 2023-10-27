import { test, expect } from '@playwright/test';


// If you needed to do something before every test case...
test.beforeEach(async({ page }) => {
    // ... you'd put it here.
    // TODO: Is there something we need to do before every test case to avoid repeating code?
    await page.goto('http://localhost:5173/');
  })

/**
 * Don't worry about the "async" yet. We'll cover it in more detail
 * for the next sprint. For now, just think about "await" as something 
 * you put before parts of your test that might take time to run, 
 * like any interaction with the page.
 */
test('on page load, i see an input bar', async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await expect(page.getByLabel('Command input')).toBeVisible()
})

test('on page load, i see a button', async ({ page }) => {
  //Navigate to URL
  //Assert that a button is on the page
  await expect(page.getByRole('button')).toBeVisible();
});

test('after I click the button, the command is pushed to history', async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("sample response");
  await page.getByRole("button").click();
  //Targeting the history div box
  await expect(page.getByLabel("Command history")).toBeVisible();
  await expect(page.getByLabel("Command history")).toContainText("");
  await expect(page.getByLabel("Command history")).toHaveCount(1);

  await expect(page.getByLabel("Command input")).toBeEmpty();


  //Inputting another command and submitted 
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("sample response");
  await page.getByRole("button").click();

  //Checking the history is updated again
  await expect(page.getByLabel("Command history")).toBeVisible();
  await expect(page.getByLabel("Command history")).toContainText("");
  await expect(page.getByLabel("Command history")).toHaveCount(1);

});

test('after I type into the input box, its text changes', async ({ page }) => {

  // Step 2: Interact with the page
  // Locate the element you are looking for
  await page.getByLabel('Command input').click();
  await page.getByLabel('Command input').fill('Awesome command');

  // Step 3: Assert something about the page
  // Assertions are done by using the expect() function
  const mock_input = `Awesome command`
  await expect(page.getByLabel('Command input')).toHaveValue(mock_input)
});
