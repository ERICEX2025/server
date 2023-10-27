# Project details

**Project name:** REPL<br>
**Team members:** Eric Ko (eko10), Emily Wang (emwang)<br>
**Total estimated time:** 15 hours<br>
**Repo link:** https://github.com/cs0320-f23/repl-eko10-emwang<br><br>

# How to run program

To run REPL, you must start both the front end and back end separately. To start the front end, open the back folder in your IDE of choice, navigate to `back/src/Server/Server.java` and click the green play button to start the server. This should produce the link `http://locahost:3232` in the terminal, which you can navigate if you want to test the server on its own. You don't have to click the link. To run the front end, navigate to the directory `front/mock` in another IDE of choice, and run the command `npm start` in the terminal. This should produce the link `http://localhost:5173` in the terminal, to which you can navigate to in a new browser page. This should load the REPL page. To use this program, you can interact with the input box (that which has "Enter command here" as a placeholder), and the submit button. 

In order to run a command, you must register the command first. You can do this by typing `register <command>` into the input box (e.g. `register mode`, `register search`). You can register the following commands:
- `load_file`
- `view`
- `search`
- `broadband`
- `mode`
- `add2and2`

Once you register these commands, you can use them by entering the command into the terminal along with any other query parameters required for that command, if any. Descriptions of the commands are as follows:

- `load_file (filename.csv)`
  - This command loads the given csv file by saving the file name and ensuring the file exists. If the command is called correctly, there will be a success message. If
    the file doesn't exist, there will be a message telling this to the user and the file path won't be saved. The file the user wants to load must exist in the `data` folder.
- `view`
  - This command displays the loaded csv file as an HTML table. The file displayed will always be the most recent file loaded. If the user failed to successfully load a file, they will receive an error message instead of a table.
- `search (optional column header or index) (boolean has headers) (value to search for)`
  - This command returns the search results of the user's query based on the most recent file they've loaded, whether the file has headers, the optional column identifier, and their search value. If the user doesn't want to include a column identifier, they can just input `search (true/false) (value to search for)`. If the column header and/or search value have multiple words, the user should surround the inquiry with quotation marks so our program can distinguish each term. If the user doesn't load a file before searching, they will receive an error message. Same if the user tries to search with more three parameters, or less than two.
- `broadband (state) (optional county)`
  - This command returns the broadband percent of either all the counties within a certain state, or the broadband percent of a certain county within a certain state. For example, if the user enters `broadband Illinois`, they will receive the broadband data for all the counties in Illinois formatted as an HTML table. If the user enters `broadband Illinois "Cook County"`, they will receive the broadband data only for Cook County, Illinois. The county should include the word "County" and be surrounded by quotes as in the example, so we can parse the county as one search term. Same if the state has multiple words (i.e. `"Rhode Island"` must be surrounded by quotes). 
  - If the user enters no state, a nonexistent state, a nonexistent county, or more search parameters than a state and a county, they will receive an error message instead of broadband data.
- `mode`
  - This command switches the display of the command/result history between "brief" and "verbose" modes. Changing the mode of REPL changes how the following command/output pairs will be displayed; the previous command/output pairs will remain in the same mode as they originally were output as.
  - In "brief" mode, only the results of each command are displayed.
  - In "verbose" mode, each command as well as its respective result is displayed.
- `add2And2`
  - This command is a dummy command that serves as an example of how a developer could implement their own functions and inject them into our REPL, as long as their function implements REPLFunction. The command, when called, simply returns the result of 2+2 as a string. There are no other parameters, and no other results.
- `mock`
  - This command allows the user to switch to mode mock. Commands run using this (e.g. `mock load_file ri_income`) will return mocked responses. This is purely for testing purposes.


# Design choices

**Class relationships:** Our REPL contains two main directories: `front` and `back`.
Within `front`, our `src` folder contains three folders: `components`, `styles`, and `tests`. 

`components` contains all the main classes needed to run our REPL front end.
- The App function is the highest level component, and contains a REPL.
- The REPL contains a REPLHistory and a REPLInput. REPL functions as a middle man between these two classes, setting up the shared state, history, so both classes can have access to it.
- Our REPLInput and REPLLHistory utilize `HistoryItem`s, which are a data structure we use to store our command/output pairs to be displayed in the command history.

`styles` contains the stylesheets for our page.
- App.css, index.css, and main.css all contribute to the appearance of our page. App.css is used by the App class, index.css is used by index.tsx, and main.css is used in the demo main.ts.

`tests` contains all of our tests for this sprint.
- mock-load.tests.ts contains all the tests for the load_file command, as well as some for mode and miscellaneous situations.
- mock-view.tests.ts contains all the tests for the view command.
- mock-search tests.ts contains all the tests for the search command.

Within `back`, our `src` folder contains two main folders: `CSV`, `DataObject`, `Exceptions`, `test` and `Server`.
- `CSV` and `DataObject` contain classes related to Sprint 1: CSV. These files are used to run the `Main.java` class in the `CSV` folder, which works by the user inputting their filepath/query params into the `Main`'s `args` as a `String[]`. 
- `Server` contains classes related to Sprint 2: Server. These files are used to start the backend of our REPL, and make our server usable by entering commands and query parameters into the command line, to be returned as JSON files. All of the handler classes are contained within the Server.java file, and are responsible for handling the logic associated with whatever the user enters.
- `Exceptions` contains classes related to both `CSV` and `Server`, housing custom exceptions like `CountryDoesNotExistException` for a specific broadband case, or `IdentifierNotFoundException` for a specific search case. These make it easier to return helpful information to the user.
- `test` contains all of `Server`'s tests, including the mocked tests.


**Design:**

- To fulfill User Story 2, the main new feature of our REPL is the use of asynchronous functions that all implement the `REPLFunction` interface. This is so that we can genericize our calls to whatever command function the user wants by calling `commandFunction(commandString)` in REPLInput. Our `REPLFunction`s are all asynchronous so that they return Promises, allowing us to wait till the information is accessed and returned from the backend before calling `.then` on the output.
  - We also introduced a map and list for registration. Our map contains all of the functions a user can possibly register, and maps from the name of the command to the actual function (e.g. `"load_file"` maps to `handleLoad`.) Our list contains all of the functions the user has already registered. When a user registers a command, we check whether the command exists as a key in our map. If it is, we check if the command exists in the list. If not, we add the command to the list of registered commands. Once the user has registered a command, they can call the command normally, and our map will return the command to call to our `handleSubmit` method. We did this for a smooth command registration process.

- To fulfill User Story 1, we made a lot of changes to our REPL's design, including:
  - Accessibility colors: We changed the color scheme of our REPL to be more accessible using higher contrast colors, using a website with accessible color palettes.
  - When the user enters enough commands that the command history begins to scroll, the command history will always scroll to the most recent output to make the results easier to read and easier to navigate to using a screenreader.
  - We added aria labels to all of the important divs within our app, as well as the `REPLHistory`- and `REPLInput`-related components so that the user can navigate to each one using a screenreader. All of the outputs within our `REPLHistory` also have aria labels (`Item 0`, `Item 1`, `Item 2`, etc.) so that they can be accessed easily.
  - We changed our css files by editing the flex display, so that resizing the window will adjust the proportions of the screen smoothly.
  - We added four main **keyboard shortcuts**:
    - On render, the App's div will be selected. From here,
    - `h` selects the history log. The user can use the up and down arrow keys to scroll through the log.
    - `Control` selects the input box, into which the user can type directly.
    - `Esc` deselects the history log or input box and reselects the App. This is mainly so that if the user is in the input box, they can escape out of it to continue using keyboard shortcuts.
    - `Enter` when the input box is selected will hit the submit button. This is so that the user doesn't have to use a touchpad or mouse to access the button.
    - Whenever the App is selected (when the user presses `Esc`, or upon first render), the user can scroll up and down the whole page using the up and down arrow keys. This ensures that zooming in significantly will still allow the user to navigate and use the program; they can use the arrow keys as well as our keyboard shortcuts and fully access the program. 

- To mock our data, we have a mock command within our possible commands list. This mock command uses if statements to determine what mocked data from our `mockedJson.tsx` should be returned. This was for frontend testing purposes.

- A data structure we introduced for REPL was our `HistoryItem` that we use extensively to track our history. Our history is a list of `HistoryItem`s. These `HistoryItem` are essentially tuples that include the command submitted by the user in the input box, as well as the result of that command, as determined by our `REPLInput`. We decided to make a unique interface for these command/result pairs so that we would have an easier time switching between modes and deciding what to display, since we could call on the specific property (command and/or result) to be included in the history depending on which mode the user was currently in. For example, given that an `HistoryItem` is named `commandResultPair`, we use `commandResultPair.command` to obtain the saved command, and `commandResultPair.data` to obtain the (unformatted) result.
- We decided to make the data of our `HistoryItem` a 2D array of strings because this would make it easier for us to format our strings into an HTML table by using nested map functions (as if they were for-loops) in our `REPLHistory` to display the results. Our notable shared state between our `REPL`, `REPLHistory`, and `REPLInput` is the history (list of InputObjects of commands/results). 


# Errors/bugs

Refreshing our frontend doesn't refresh our backend, because they are started and run on separate local host ports. Therefore, in order to clear the loaded data in our backend, the server must be restarted. We would fix this by using different session IDs, probably, given more time.

# Tests

Our tests are separated into many files within the "tests" package: `App.spec.ts`, `broadband.spec.ts`, `load-csv.spec.ts`, `mode.spec.ts`, `search-csv.spec.ts`, and `view-csv.test.ts`, as well as mocked tests for each of these functions (`mockload-csv.spec.ts`, `mockview-csv.spec.ts`, etc.) These are, as the names suggest,
correlated to each major function of our REPL. 

Within `App.spec.ts`, our tests involve making sure essentially components of our App are visible and usable. We test:
- visibility of our input box
- visibility of our button
- that clicking the button causes something to appear in the history
- that the history will continue to get updated with more button presses
- that text can be entered into the input box

Within `load-csv.spec.ts`, our tests involve the `load_file` command. We test:
- registering load_file
- inputting only "load_file"
- inputting "load_file" with a fake csv file
- inputting "load_file with a real csv file

Within `view-csv.spec.ts`, our tests involve the `view` command. We test:
- registering view
- view with unsuccessful load
- view without any load
- multiple calls to view
- multiple files loaded, then viewed

Within `search-csv.spec.ts`, our tests involve the `search` command. We test:
- registering search
- search without any load
- successful load followed by unsuccessful load followed by search
- integration between search, view, and mode commands
- searching without a hasHeader boolean
- searching without a column identifier
- searching with a name column identifier, where the name has multiple words and the search val has multiple words
- integration between search and view
- multiple searches
- search with no result
- search with column index as identifier
- search with true/false boolean

Within `mode.spec.ts`, our tests involve the `mode` command. We test:
- registering mode
- switching to brief mode
- switching to verbose mode
- switching between modes with other commands in between

Within `broadband.spec.ts`, our tests involve the `broadband.spec.ts` command, along with all of our other commands. We test:
- registering broadband
- successful broadband of one county
- successful broadband of one state
- successful broadband of multi-word state
- unsuccessful broadband (too many parameters/incorrectly formatted params)
- unsuccessful broadband of incorrectly formatted county
- unsuccessful broadband of too few params (another incorrectly formatted county)
- unsuccessful broadband of a fake state and fake county
- integration of all possible commands including load_file, search, view, mode, and broadband

We chose not to unit test using Jest because the nature of our frontend lends itself to its "backend" being tested through our frontend/end-to-end tests. We consulted several TAs about this as well as posted about this on Ed, as well as consulted several other pairs of students, and we were told by essentially all of them that we were okay without unit testing since our playwright tests were thorough enough. To "unit test" command registration, in our `search-csv.spec.ts` file, we have tests that check for registered commands; if a command was not registered, it cannot be called, and once a command is registered, it is recognized and can be used.


# How to run tests

Start the backend by running the `Server.java` file in `back/src/Server`. Then, you can run the command `npx playwright test` in the terminal.

Some of these tests may fail because they involve load failures, and there are load failure tests in several files (e.g. `load-csv.spec.ts` and `search-csv.spec.ts`). We do not refresh the backend after every test, so the leftover loaded files from previous tests may cause current tests to fail. For tests involving load failures, we recommend restarting the backend and running those tests individually using the green play button to verify that they do all pass.
