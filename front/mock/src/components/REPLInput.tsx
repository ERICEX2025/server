import "../styles/main.css";
import { Dispatch, SetStateAction, useState, useRef, FormEvent } from "react";
import { Mode } from "./exports/enums";
import { ControlledInput } from "./ControlledInput";
import splitSpacesExcludeQuotes from "quoted-string-space-split";
import { HistoryItem } from "./REPL";
import { REPLFunction } from "./REPLFunction";
import { searchcsv, loadcsv, viewcsv, broadband } from "./exports/mockedJson";

/**
 * REPL Input component is in charge of dealing with everything
 * related to the inputs, accepts input commands and handles them
 * accordingly, updating the history state for REPLHistory
 * to display
 */
interface REPLInputProps {
  history: HistoryItem[];
  setHistory: Dispatch<SetStateAction<HistoryItem[]>>;
}

export function REPLInput(props: REPLInputProps) {
  let mode = useRef<Mode>(Mode.Brief);
  const [commandString, setCommandString] = useState<string>("");

  // used to contain the current registered commands
  // useRef hook since the dynamic array is only used for logic and not state
  const registeredCommands = useRef<string[]>([]);

  /**
   * main high level logic function for REPLInput
   * parses the commandString the user types through
   * the controlled input and submission from button
   * based on the command, directs concern to that
   * command's handler, lastly refreshes the command
   * str input state
   *
   * @param props
   * @returns
   */
  function handleSubmit(event: FormEvent) {
    event.preventDefault(); // Prevent the default form submission behavior

    // parses 2 word terms passed in as "firstword secondword" as one word with space
    const commandArgs = splitSpacesExcludeQuotes(commandString);

    // Removes the first element from commandArgs and returns the first element
    const command = commandArgs.shift();

    let data: string | string[][] = "Tim Nelson is cool";

    // if user doesnt input any args
    if (command === undefined) {
      data = "please enter a command or register a command";
    }

    //if user does input args
    else {
      // first check if user is trying to register a command
      if (command === "register") {
        if (commandArgs.length === 0) {
          data = "please enter a command to register";
        }
        // then if the command is already registered
        else if (registeredCommands.current.includes(commandArgs[0])) {
          // command already exists
          data = commandArgs[0] + " already exists!";
        } else {
          // if so check if the command is a possible command to register
          if (possibleCommands.has(commandArgs[0])) {
            // if it is, then register the command
            registeredCommands.current.push(commandArgs[0]);
            data = commandArgs[0] + " registered";
          } else {
            // if the command is not a possible command to register
            data = commandArgs[0] + " not a possible command to register";
          }
        }
      }

      // if user is trying to use a command
      else if (registeredCommands.current.includes(command)) {
        // Retrieve and call the function
        const commandFunction = possibleCommands.get(command);
        // notify the web developer that the function of this command
        // is initialized to undefined in the possibleCommands Map
        if (commandFunction === undefined) {
          data = "command function for command: " + command + "is undefined";
        } else {
          commandFunction(commandArgs)
            .then((result) => {
              const myHistoryItem: HistoryItem = {
                data: result,
                mode: mode.current,
                command: commandString,
              };
              props.setHistory([...props.history, myHistoryItem]);
              return;
            })
            .catch((error) => {
              const myHistoryItem: HistoryItem = {
                data: "backend not started",
                mode: mode.current,
                command: commandString,
              };
              props.setHistory([...props.history, myHistoryItem]);
              return;
            });
        }
      }
      // if user is trying to use an invalid command
      else {
        data = command + " is not one of the registered commands";
      }
    }
    const myHistoryItem: HistoryItem = {
      data: data,
      mode: mode.current,
      command: commandString,
    };
    props.setHistory([...props.history, myHistoryItem]);

    // reset command input state
    setCommandString("");
  }

  /**
   * handles mode by parsing the string
   * setting enum mode state variable
   * to correspond to the user's desired
   * mode, handles error case
   *
   * @param args - no params, but takes in args for consistency and future extensibility
   * @return - a promise that resolves to the handlemode success or error message
   */
  const handleMode: REPLFunction = async (args: Array<string>) => {
    const newMode = args[0];
    switch (newMode) {
      case "verbose":
        mode.current = Mode.Verbose;
        return "mode set to verbose";
      case "brief":
        mode.current = Mode.Brief;
        return "mode set to brief";
      default:
        return (
          commandString +
          " does not exist, try either mode brief or mode verbose"
        );
    }
  };

  /**
   * handles load case after error handling,
   * sends the inputted request to the
   * backend through loadcsv
   *
   * @param args - a list of strings containing any text that followed the command
   * @return - a promise that resolves to the load success or error message
   */
  const handleLoad: REPLFunction = async (args: Array<string>) => {
    const commandArgs = args;
    const queryFilePath = commandArgs[0];

    const response = await fetch(
      "http://localhost:3232/loadcsv?filepath=" + queryFilePath
    );
    const responseJson = await response.json();
    const response_type = responseJson.result;

    if (response_type.includes("error")) {
      return response_type + " filepath: " + queryFilePath;
    }
    const filepath = responseJson.csvfile;
    console.log("success");
    return "successfully loaded " + filepath;
  };

  /**
   * handles view case after error handling,
   * sends the inputted request to the
   * backend through viewcsv
   *
   * @param args - no params, but takes in args for consistency and future extensibility
   * @return - a promise that resolves to the view results or error message
   */
  const handleView: REPLFunction = async (args: Array<string>) => {
    const response = await fetch("http://localhost:3232/viewcsv");
    const responseJson = await response.json();
    const result = responseJson.result;
    if (result.includes("error")) {
      return result;
    } else {
      const data = responseJson.data;
      return data;
    }
  };

  /**
   * Handles search case after error handling,
   * sends the inputted request to the
   * backend through searchcsv.
   *
   * @param args - a list of strings containing any text that followed the command
   * @return - a promise that resolves to the search results or error message
   */
  const handleSearch: REPLFunction = async (args: Array<string>) => {
    const commandArgs = args;
    if (commandArgs.length >= 4) {
      return (
        "It seems like you're trying to enter more than 3 search params." +
        " If your identifier or search term have multiple words, wrap them in quotes."
      );
    }
    let urlToSearch = "http://localhost:3232/searchcsv"; // default search url; edit based on query params
    const numQueryParams = commandArgs.length;
    switch (numQueryParams) {
      case 1: // assume user just entered a search term
        urlToSearch += "?term=" + commandArgs[0];
        break;
      case 2: // assume user wants to search without a column identifier
        urlToSearch +=
          "?term=" + commandArgs[0] + "&hasheader=" + commandArgs[1];
        break;
      case 3: // user enters a search term, a boolean, and col identifier
        urlToSearch +=
          "?term=" +
          commandArgs[0] +
          "&hasheader=" +
          commandArgs[1] +
          "&identifier=" +
          commandArgs[2];
        break;
      default: // if zero query params, original searchcsv url is used
        break;
    }
    const response = await fetch(urlToSearch);
    const responseJson = await response.json();
    const result = await responseJson.result;
    if (result.includes("error")) {
      // if user receives error msg,
      return result; // only return the error msg
    }
    return responseJson.data; // otherwise, return the 2D array of search results
  };

  /**
   * Handles user request to access broadband data for a specific county within
   * a state, or for all of the counties within a state.
   *
   * @param args - a list of strings that followed the user's "broadband" command,
   *               i.e. a state and county, or just a state.
   * @returns - a promise containing an error message, or the broadband data requested by the user.
   */
  const handleBroadband: REPLFunction = async (args: Array<string>) => {
    const commandArgs = args;
    if (commandArgs.length > 2) {
      // if the user enters more terms than a state and county
      return (
        "It seems like you're trying to enter more params than state and county." +
        " If your state or county have multiple words, wrap them in quotes."
      );
    }
    let urlToSearch = "http://localhost:3232/broadband";
    const numQueryParams = commandArgs.length;
    switch (numQueryParams) {
      case 1: // if only one query param, let that be a state + edit url accordingly
        urlToSearch += "?state=" + commandArgs[0];
        break;
      case 2:
        urlToSearch += "?state=" + commandArgs[0] + "&county=" + commandArgs[1];
        break;
      default:
        break;
    }
    const response = await fetch(urlToSearch);
    const responseJson = await response.json();
    const result = responseJson.result;
    if (result.includes("error")) {
      // if broadband returns an error,
      return result; // just print the backend's error message
    }
    return responseJson.data; // otherwise, return the 2D array of broadband data
  };

  /**
   * handles view case after error handling,
   * sends the inputted request to the
   * backend through viewcsv
   *
   * @param args - no params, but takes in args for consistency and future extensibility
   * @return - a promise that resolves to the view results or error message
   */
  const handleMock: REPLFunction = async (args: Array<string>) => {
    const commandArgs = args;
    let outputMsg: string | string[][];

    const command = args[0];
    if (command === "load_file") {
      if (commandArgs.length != 2) {
        outputMsg =
          "Please provide 1 argument for load: load_file <csv-file-path>";
      } else {
        outputMsg = loadcsv(commandArgs[1]);
      }
    } else if (command === "view") {
      if (commandArgs.length > 1) {
        outputMsg = "view does not take any arguments!";
      } else {
        outputMsg = viewcsv();
      }
    } else if (command === "search") {
      let column = "";
      let value = "";
      let hasHeader = "";
      if (commandArgs.length > 4) {
        outputMsg = "please give a max of 3 arguments for search.";
      } else if (commandArgs.length < 2) {
        outputMsg =
          "please provide a search term and optional column identifier for search.";
      } else {
        value = commandArgs[1];
        if (commandArgs.length == 4) {
          column = commandArgs[1];
          value = commandArgs[2];
          hasHeader = commandArgs[3];
        }
        if (commandArgs.length == 3) {
          column = commandArgs[1];
          value = commandArgs[2];
        }
        outputMsg = searchcsv(column, value, hasHeader);
      }
    } else if (command === "broadband") {
      if (args.length === 1) {
        outputMsg = "please enter a state and optional county";
      } 
      else if (args.length > 3) {
        outputMsg =
          "It seems like you're trying to enter more params than state and county. If your state or county have multiple words, wrap them in quotes.";
      } else if (args.length === 2) {
        outputMsg = broadband(commandArgs[1], "");
      } else {
        outputMsg = broadband(commandArgs[1], commandArgs[2]);
      }
    } else {
      outputMsg =
        "Command " +
        commandString +
        " not recognized, try mock load_file <csv-file-path>, view, search <column> <value> or mode <mode>";
    }
    return outputMsg;
  };
  /**
   * Example function that could be hardcoded by a developer stakeholder
   * to register for their own use.
   *
   * @param args - an array of strings containing any text following the command
   * @return a promise that resolves to a string of "4"
   */
  const handleAdd2And2: REPLFunction = async (args: Array<string>) => {
    return String(2 + 2);
  };

  /**
   * Map that contains all of the possible commands the user can register. The user
   * must register these commands using the "register <command>" before accessing
   * these.
   */
  const possibleCommands: Map<string, REPLFunction> = new Map([
    ["mode", handleMode],
    ["load_file", handleLoad],
    ["view", handleView],
    ["search", handleSearch],
    ["broadband", handleBroadband],
    ["add2and2", handleAdd2And2],
    ["mock", handleMock], // developer can add their own functions like this
  ]);

  /**
   * returns the div for everything input related
   */
  return (
    <div className="repl-input">
      {/* Wraps input and button with a form element */}
      <form onSubmit={handleSubmit}>
        {/* Attach the handleSubmit to form submission (enter key and button press) */}
        <fieldset>
          {/*groups related elements in a form*/}
          <ControlledInput
            value={commandString}
            setValue={setCommandString}
            ariaLabel={"Command input"}
          />
          <br />
          {/* button type to "submit" trigggers the onSubmit form */}
          <button type="submit" className="submit-button">
            Submit
          </button>
        </fieldset>
      </form>
    </div>
  );
}
