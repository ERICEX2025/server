import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
    //Navigate to URL
    await page.goto('http://localhost:5173/');
  })

  /**
   * Tests entering only "search" w/o registering
   */
  test('after I type into the input bar "search", the command has to be registered', async ({ page }) => {

    await expect(page.getByLabel('Command input')).toBeVisible();
    //Input a search command with no other parameters
    await page.getByLabel("Command input").click();
    await page.getByLabel("Command input").fill("search");
    await page.getByRole("button").click();

    //Check the history log for a search command message
    await expect(page.getByLabel("Item 0")).toContainText(
      "search is not one of the registered commands"
    );
    await expect(page.getByLabel("Command input")).toBeEmpty();
  })

  /**
   * Tests entering only "search" after registering
   */
  test('after registering search, I input "search" and command is recognized', async ({ page }) => {
    await expect(page.getByLabel('Command input')).toBeVisible();

    // register command
    await page.getByLabel("Command input").fill("register search");
    await page.getByRole("button").click();
    await expect(page.getByLabel("Item 0")).toContainText("search registered");

    //Input a search command with no other parameters
    await page.getByLabel("Command input").click();
    await page.getByLabel("Command input").fill("search");
    await page.getByRole("button").click();

    //Check the history log for a search command message
    await expect(page.getByLabel("Item 0")).toContainText(
      "search registered"
    );
    await expect(page.getByLabel("Item 1")).toContainText(
      "error_bad_request, Please enter a search term"
    );
    await expect(page.getByLabel("Command input")).toBeEmpty();
  })

  /**
   * Tests searching without successful load
   */
  test('I submit a search command, but a load command has not been submitted before', async ({ page }) => {
    await expect(page.getByLabel('Command input')).toBeVisible();

    // register command
    await page.getByLabel('Command input').fill("register search");
    await page.getByRole("button").click();
    await expect(page.getByLabel("Item 0")).toContainText(
      "search registered"
    );

    // unsuccessful search
    await page.getByLabel("Command input").fill("search Planet Pluto");
    await page.getByRole("button").click();

    // evaluate
    await expect(page.getByLabel("Item 1")).toHaveText(
      "error_datasource, CSV File datasource not loaded"
    );
  });

  /**
   * Tests with successful load, then unsuccessful load, then search
   */
  test('I successfully load, then fail to load a file, then search', async ({ page }) => {
    await expect(page.getByLabel('Command input')).toBeVisible();

    // register command
    await page.getByLabel('Command input').fill("register search");
    await page.getByRole("button").click();
    await page.getByLabel("Command input").fill("register load_file");
    await page.getByRole("button").click();

    // unsuccessful load
    await page.getByLabel("Command input").fill("load_file ri_income.csv");
    await page.getByRole("button").click();

    // successful load
    await page.getByLabel("Command input").fill("load_file wahefsldjskl.csv");
    await page.getByRole("button").click();

    // search first csv
    await page.getByLabel("Command input").fill("search Barrington true");
    await page.getByRole("button").click();

    // evaluate
    await expect(page.getByLabel("Item 4")).not.toHaveText(
      "error_datasource, CSV File datasource not loaded"
    );

    await expect(page.getByLabel("Item 4")).toHaveText(
      "Barrington130,455.00154,441.0069,917.00"
    );
    
  });

  /**
   * Tests loading multiple csvs, then searching, then also viewing and searching
   */
  test('I successfully load three times, search, view, and switch modes', async ({ page }) => {
    await expect(page.getByLabel("Command input")).toBeVisible();

    // register command
    await page.getByLabel("Command input").fill("register search");
    await page.getByRole("button").click();
    await page.getByLabel("Command input").fill("register load_file");
    await page.getByRole("button").click();
    await page.getByLabel("Command input").fill("register view");
    await page.getByRole("button").click();

    // load
    await page.getByLabel("Command input").fill("load_file ri_income.csv");
    await page.getByRole("button").click();

    // successful load
    await page
      .getByLabel("Command input")
      .fill("load_file postsecondary_education.csv");
    await page.getByRole("button").click();

    // search most recent csv
    await page.getByLabel("Command input").fill("search Barrington true");
    await page.getByRole("button").click();

    // evaluate
    await expect(page.getByLabel("Item 5")).not.toHaveText(
      "error_datasource, CSV File datasource not loaded"
    );

    await expect(page.getByLabel("Item 5")).toHaveText(
      "error_bad_request, Term Barrington not found"
    );

    await page.getByLabel("Command input").fill("search Asian true");
    await page.getByRole("button").click();
    await expect(page.getByLabel("Item 6")).toContainText("Brown University");

    // successful load
    await page.getByLabel("Command input").fill("load_file dol_ri_earnings_disparity.csv");
    await page.getByRole("button").click();

    await page
      .getByLabel("Command input")
      .fill("search RI true");
    await page.getByRole("button").click();
    await expect(page.getByLabel("Item 8")).toContainText(
      "Asian-Pacific Islander"
    );

  });



  /**
   * Tests searching without specifying boolean hasheader true/false
   */
  test("I submit a search command without a hasHeader boolean", async ({
    page,
  }) => {
    await expect(page.getByLabel("Command input")).toBeVisible();

    // register commands
    await page.getByLabel("Command input").fill("register search");
    await page.getByRole("button").click();
    await page.getByLabel("Command input").fill("register load_file");
    await page.getByRole("button").click();

    // successful load
    await page.getByLabel("Command input").fill("load_file ri_income.csv");
    await page.getByRole("button").click();
    await expect(page.getByLabel("Item 2")).toHaveText(
      "successfully loaded ri_income.csv"
    );

    //Input a search command without a boolean specified
    await page.getByLabel("Command input").fill("search Barrington");
    await page.getByRole("button").click();

    //Assert that entries are contained in the output
    await expect(page.getByLabel("Item 3")).toHaveText(
      "error_bad_request, Please include a boolean to indicate if the csv has a header row"
    );

  });


  /**
   * Tests successfully searching with no column identifier
   */
  test('I submit a search command with no column specified', async ({ page }) => {
    await expect(page.getByLabel('Command input')).toBeVisible();
    
    // register commands
    await page.getByLabel("Command input").fill("register search");
    await page.getByRole("button").click();
    await page.getByLabel("Command input").fill("register load_file");
    await page.getByRole("button").click();

    // successful load
    await page.getByLabel("Command input").fill("load_file ri_income.csv");
    await page.getByRole("button").click();
    await expect(page.getByLabel("Item 2")).toHaveText(
      "successfully loaded ri_income.csv"
    );

    //Input a search command without a column specified
    await page.getByLabel("Command input").click();
    await page.getByLabel("Command input").fill("search Barrington true");
    await page.getByRole("button").click();

    //Assert that entries are contained in the output
    await expect(page.getByLabel("Item 3")).toContainText("Barrington");
    await expect(page.getByLabel("Item 3")).toContainText("130,455.00");
    await expect(page.getByLabel("Item 3")).toHaveText("Barrington130,455.00154,441.0069,917.00");
  });


  /**
   * Tests successfully searching with column header name identifier, with multi words
   */
  test('I submit a search command with column specified', async ({ page }) => {
    await expect(page.getByLabel("Command input")).toBeVisible();

    // register commands
    await page.getByLabel("Command input").fill("register search");
    await page.getByRole("button").click();
    await page.getByLabel("Command input").fill("register load_file");
    await page.getByRole("button").click();

    //Input a load command with a valid pathname
    await page.getByLabel("Command input").click();
    await page.getByLabel("Command input").fill("load_file ri_income.csv");
    await page.getByRole("button").click();

    await expect(page.getByLabel("Item 2")).toHaveText(
      "successfully loaded ri_income.csv"
    );

    //Input a search command with the wrong column specified
    await page.getByLabel("Command input").click();
    await page.getByLabel("Command input").fill("search 69,917.00 true City/Town");
    await page.getByRole("button").click();
    //Assert that no results were found
    await expect(page.getByLabel("Item 3")).toContainText(
      "error_bad_request, Term 69,917.00 does not exist in this identifier City/Town"
    );

    //Input a search command with the right column specified
    await page.getByLabel("Command input").click();
    await page.getByLabel("Command input").fill('search 69,917.00 true "Per Capita Income"'); // also tests multi words
    await page.getByRole("button").click();

    //Assert that both entries are contained in the output
    await expect(page.getByLabel("Item 4")).toHaveText(
      "Barrington130,455.00154,441.0069,917.00"
    );

    await page
      .getByLabel("Command input")
      .fill('search "Rhode Island true City/Town'); // tests multi words
    await page.getByRole("button").click();
    await expect(page.getByLabel("Item 5")).toHaveText("It seems like you're trying to enter more than 3 search params. "+
    "If your identifier or search term have multiple words, wrap them in quotes."
    );

    await page
      .getByLabel("Command input")
      .fill('search "Rhode Island" true City/Town'); // tests multi words
    await page.getByRole("button").click();
    await expect(page.getByLabel("Item 6")).toHaveText("Rhode Island74,489.0095,198.0039,603.00");
    

  });

  /**
   * Tests using search after view, and view after search
   */
  test('I submit a search command after submitting a view command', async ({ page }) => {
    await expect(page.getByLabel("Command input")).toBeVisible();

    // register commands
    await page.getByLabel("Command input").fill("register search");
    await page.getByRole("button").click();
    await page.getByLabel("Command input").fill("register load_file");
    await page.getByRole("button").click();

    //Input a load command with a valid pathname
    await page.getByLabel("Command input").click();
    await page.getByLabel("Command input").fill("load_file ri_income.csv");
    await page.getByRole("button").click();

    await expect(page.getByLabel("Item 2")).toHaveText(
      "successfully loaded ri_income.csv"
    );

    //Input a view command
    await page.getByLabel("Command input").fill("view");
    await page.getByRole("button").click();

    //Input a search command
    await page
      .getByLabel("Command input")
      .fill("search Barrington true");
    await page.getByRole("button").click();

    //Assert that search works as intended
    await expect(page.getByLabel("Item 4")).toHaveText(
      "Barrington130,455.00154,441.0069,917.00"
    );
  });

  /**
   * Tests using multiple searches
   */
  test('I submit multiple search commands', async ({ page }) => {
    await expect(page.getByLabel("Command input")).toBeVisible();

    // register commands
    await page.getByLabel("Command input").fill("register search");
    await page.getByRole("button").click();
    await page.getByLabel("Command input").fill("register load_file");
    await page.getByRole("button").click();

    //Input a load command with a valid pathname
    await page.getByLabel("Command input").fill("load_file postsecondary_education.csv");
    await page.getByRole("button").click();

    //Input a search command
    await page
      .getByLabel("Command input")
      .fill('search "American Indian or Alaska Native" false');
    await page.getByRole("button").click();

    await expect(page.getByLabel("Item 3")).toContainText(
      "American Indian or Alaska Native20202020217156Brown University4brown-university0.00129408Men1"
    );
    await expect(page.getByLabel("Item 3")).toContainText(
      "American Indian or Alaska Native20202020217156Brown University7brown-university0.002264639Women2"
    );

    //Input a different search command
    await page.getByLabel("Command input").click();
    await page.getByLabel("Command input").fill("search 'Hispanic or Latino' true");
    await page.getByRole("button").click();

    await expect(page.getByLabel("Item 4")).toContainText(
      "Hispanic or Latino20202020217156Brown University143brown-university0.046263345Men1"
    );
    await expect(page.getByLabel("Item 4")).toContainText(
      "Hispanic or Latino20202020217156Brown University207brown-university0.066968619Women2"
    );
  });

  test('I submit a search command, but nothing was found', async ({ page }) => {
    await expect(page.getByLabel("Command input")).toBeVisible();

    // register commands
    await page.getByLabel("Command input").fill("register search");
    await page.getByRole("button").click();
    await page.getByLabel("Command input").fill("register load_file");
    await page.getByRole("button").click();

    //Input a load command with a valid pathname
    await page.getByLabel("Command input").click();
    await page
      .getByLabel("Command input")
      .fill("load_file dol_ri_earnings_disparity.csv");
    await page.getByRole("button").click();

    //Input a search command to an entry that doesn't exist
    await page.getByLabel("Command input").click();
    await page.getByLabel("Command input").fill("search fakeData true");
    await page.getByRole("button").click();

    await expect(page.getByLabel("Item 3")).toContainText(
      "error_bad_request, Term fakeData not found"
    );

    // tests different boolean
    await page.getByLabel("Command input").fill("search fakeData false");
    await page.getByRole("button").click();

    await expect(page.getByLabel("Item 4")).toContainText(
      "error_bad_request, Term fakeData not found"
    );

    // tests using a header
    await page.getByLabel("Command input").fill("search fakeData false header");
    await page.getByRole("button").click();

    await expect(page.getByLabel("Item 5")).toContainText(
      "error_bad_request, Identifier header does not exist"
    );
  });

  /**
   * Tests search with column number as identifier
   */
  test("I submit a search command using and index as a column identifier", async({page}) => {
      await expect(page.getByLabel('Command input')).toBeVisible();

      await expect(page.getByLabel("Command input")).toBeVisible();

      // register commands
      await page.getByLabel("Command input").fill("register search");
      await page.getByRole("button").click();
      await page.getByLabel("Command input").fill("register load_file");
      await page.getByRole("button").click();

      //Input a load command with a valid pathname
      await page.getByLabel("Command input").click();
      await page.getByLabel("Command input").fill("load_file postsecondary_education.csv");
      await page.getByRole("button").click();

      await expect(page.getByLabel("Item 2")).toContainText("successfully loaded postsecondary_education.csv");

      //Input a search command to an entry that doesn't exist
      await page.getByLabel("Command input").click();
      await page.getByLabel("Command input").fill("search Asian true 0");
      await page.getByRole("button").click();

      await expect(page.getByLabel("Item 3")).toContainText("Asian");
  })

  /**
   * Tests search with true/false booleans
   */
  test("I submit a search command using different booleans for hasHeader", async({page}) => {
      await expect(page.getByLabel("Command input")).toBeVisible();

      // register commands
      await page.getByLabel("Command input").fill("register search");
      await page.getByRole("button").click();
      await page.getByLabel("Command input").fill("register load_file");
      await page.getByRole("button").click();

      //Input a load command with a valid pathname
      await page.getByLabel("Command input").click();
      await page.getByLabel("Command input").fill("load_file ri_income.csv");
      await page.getByRole("button").click();
      await expect(page.getByLabel("Item 2")).toContainText("successfully loaded ri_income.csv");

      //Search first row if we say there aren't headers
      await page.getByLabel("Command input").click();
      await page.getByLabel("Command input").fill("search City/Town false");
      await page.getByRole("button").click();

      await expect(page.getByLabel("Item 3")).toHaveText(
        "City/TownMedian Household IncomeMedian Family IncomePer Capita Income"
      );

      await page.getByLabel("Command input").fill("search City/Town true");
      await page.getByRole("button").click();
      await expect(page.getByLabel("Item 4")).not.toHaveText(
        "City/TownMedian Household IncomeMedian Family IncomePer Capita Income"
      );
      await expect(page.getByLabel("Item 4")).toHaveText(
        "error_bad_request, Term City/Town not found"
      );
  })