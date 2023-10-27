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
- `add2And2`

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

The main new feature of our REPL is the use of asynchronous functions that all implement the `REPLFunction` interface.

- accessibility colors
- scroll (most recent)
- zoom should be fine
- shortcuts
- map for registration
- genericizing replfunction


A data structure we introduced for REPL was our `HistoryItem` that we use extensively to track our history. Our history is a list of `HistoryItem`s. These `HistoryItem` are essentially tuples that include the command submitted by the user in the input box, as well as the result of that command, as determined by our `REPLInput`. We decided to make a unique interface for these command/result pairs so that we would have an easier time switching between modes and deciding what to display, since we could call on the specific property (command and/or result) to be included in the history depending on which mode the user was currently in. For example, given that an `HistoryItem` is named `commandResultPair`, we use `commandResultPair.command` to obtain the saved command, and `commandResultPair.data` to obtain the (unformatted) result.

We decided to make the data of our `HistoryItem` a 2D array of strings because this would make it easier for us to format our strings into an HTML table by using nested map functions (as if they were for-loops) in our `REPLHistory` to display the results. Our notable shared state between our `REPL`, `REPLHistory`, and `REPLInput` is the history (list of InputObjects of commands/results). 



# Errors/bugs

None
- refreshing start doesn't restart back

# Tests

Our tests are separated into three files within the "tests" package: `mock-load.test.ts`, `mock-search.test.ts`, and `mock-view.test.ts`. These are, as the names suggest,
correlated to each major function of our mock server (load, view, and search).

Within `mock-load.test.ts`, our tests involve the load and mode commands. We test an empty input, miscellaneous input, switching modes, loading a normal csv, loading a csv that exists but is empty, loading multiple csvs, failure to load a csv, loading a file that doesn't exist, loading a file with the wrong number of arguments, calling `load_file` with no file name, and unsuccessful loading followed by successful loading. All of these are to ensure that we have ample protection against bad user input or multiple successive inputs, in the form of helpful error messages. We also throw in a lot of mode switches throughout our tests to make sure all our ouputs are as they should be, and that mode switching doesn't mess up the expected outputs.

Within `mock-view.test.ts`, our tests involve the load, mode, and view commands. We test a successful view, viewing an empty csv, viewing a csv with one row or one column, viewing a very horizontally-long csv that requires a horizontal scroll but is otherwise normal, viewing a csv after successful/unsuccessful loads, viewing the most recent csv when multiple csvs are loaded successfully, trying to view a csv before loading one, calling view with extraneous arguments, and viewing a csv after an unsuccessful load. Again, we have a lot of mode switches throughout these tests to make sure our command/result pairs are accurate, and that mode switching doesn't alter our expected output beyond what we expect. These tests all ensure that the user should be viewing what they expect when they call the view, or if they don't, that they are told why when they receive an error message.

Within `mock-search.test.ts`, our tests involve all four commands: load, mode, view, and search. We test a successful searching from a loaded csv and no column given, searching an empty csv, searching a csv with only one row and only one col, searching a really wide file, searching a csv after failing to load a different csv, searching after multiple files are successfully loaded, searching after viewing and viewing after searching, using a search term with multiple words, the user trying to search before loading, the user using too many parameters to search, the user just typing "search" with no identifiers/values, failure to load a file and then trying to search, and large combinations of load, view, search, and mode. These are to ensure that using all of these commands together will not crash the program or produce unexpected output. 

# How to run tests

Our tests are separated into three files within the "tests" package: `mock-load.test.ts`, `mock-search.test.ts`, and `mock-view.test.ts`. To run these tests, you can navigate to our main directory `mock-emwang-kli154` and type in
`npx playwright test` into the terminal to run all of the tests in our tests package at once. Occasionally, ou may come across errors when running these because the server refuses to
connect. All of the tests pass individually, but since running all of them at once may produce errors, for any test that doesn't pass, please navigate to that test in its
file and click the green play button--the test should then pass.
