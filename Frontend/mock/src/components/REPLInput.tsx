import { Dispatch, SetStateAction, useState, useRef, FormEvent } from "react";
import { Mode } from "../enums";
import { ControlledInput } from "./ControlledInput";
import splitSpacesExcludeQuotes from "quoted-string-space-split";
import { HistoryItem } from "./REPL";

/**
 * repl interface for the functions of the registered commands
 */
export interface REPLFunction {
  (args: Array<string>): Promise<string | string[][]>;
}

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

/**
 * main high level logic function for REPLInput
 * parses the commandString the user types through
 * the controlled input and submission from button
 * based on the command, directs concern to that
 * command's handler, lastly refreshes the command
 * str input state
 * @param props
 * @returns
 */
export function REPLInput(props: REPLInputProps) {
  const [mode, setMode] = useState<Mode>(Mode.Brief);
  const [commandString, setCommandString] = useState<string>("");


  // used to contain the current registered commands
  // useRef hook since the dynamic array is only used for logic and not state
  const registeredCommands = useRef<string[]>([]);



  function handleSubmit(event: FormEvent) {
    event.preventDefault(); // Prevent the default form submission behavior
    const fullCommand = commandString;
    const commandArgs = splitSpacesExcludeQuotes(commandString);
    setCommandString("");
    let stringData = "";

    if (commandArgs.length === 0) {
      stringData = "please enter some args";
      return;
    }

    // Removes the first element from commandArgs and returns the first element
    const command = commandArgs.shift();

    // this is sus
    if (command === undefined) {
      stringData = "this is sus";
      return;
    }

    // first check if user is trying to register a command
    if (command === "register") {
      if (commandArgs.length === 0) {
        stringData = "please enter a command to register";
      }
      // then if the command is already registered
      else if (registeredCommands.current.includes(commandArgs[0])) {
        // command already exists
        stringData = "command: " + commandArgs[0] + " already exists!";
      } else {
        // if so check if the command is a possible commands to register
        if (possibleCommands.has(commandArgs[0])) {
          // if it is, then register the command
          registeredCommands.current.push(commandArgs[0]);
          stringData = "command: " + commandArgs[0] + " registered";
        } else {
          // if the command is not a possible command to register
          stringData =
            "command: " +
            commandArgs[0] +
            " not a possible command to register";
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
        stringData = 
          "command function for command: " + commandArgs[0] + "is undefined";
      } else {
        commandFunction(commandArgs)
          .then((result) => {
             const myHistoryItem: HistoryItem = {
               data: result,
               mode: mode,
               command: fullCommand,
             };
             props.setHistory([...props.history, myHistoryItem]);
          })
          .catch((error) => {
             const myHistoryItem: HistoryItem = {
               data: error,
               mode: mode,
               command: fullCommand,
             };
             props.setHistory([...props.history, myHistoryItem]);
          });
      }
    }
    // if user is trying to use an invalid command
    else {
      stringData =
        command + " is not one of the registered commands";
    }
    const myHistoryItem: HistoryItem = {
       data: stringData,
       mode: mode,
       command: fullCommand,
     };
     props.setHistory([...props.history, myHistoryItem]);
  }


  /**
   * handles mode by parsing the string
   * setting enum mode state variable
   * to correspond to the user's desired
   * mode, handles error case
   * @param commandString
   */

  const handleMode: REPLFunction = async (args: Array<string>) => {
    const mode = args[0];
    switch (mode) {
      case "verbose":
        setMode(Mode.Verbose);
        return "Command: " + commandString + " \n Output: " + "mode set to verbose";
      case "brief":
        setMode(Mode.Brief);
        return "mode set to brief";
      default:
        return commandString + " does not exist, try either mode brief or mode verbose";
    }
  }
  // function handleMode: REPLFunction = async (args: Array<string>) => {
  //   const mode = args[0];
  //   let toReturn = "";
  //   switch (mode) {
  //     case "verbose":
  //       setMode(Mode.Verbose);
  //       toReturn = "mode set to verbose";
  //       break;
  //     case "brief":
  //       setMode(Mode.Brief);
  //       toReturn = "mode set to brief";
  //       break;
  //     default:
  //       toReturn = " does not exist, try either mode brief or mode verbose";
  //   }
  //   const promise = new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(toReturn);
  //     }, 300);
  //   });

  //   return promise
  // }
  /**
   * handles load case after error handling,
   * sends the inputted request to the mocked
   * backend through loadcsv
   * @param commandString
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
    return "successfully loaded " + filepath;

    // if (commandArgs.length != 2) {
    //   outputMsg =
    //     "Please provide 1 argument for load: load_file <csv-file-path>";
    // } else {
    //   outputMsg = loadcsv(commandArgs[1]);
    // }
    // switch (mode) {
    //   case Mode.Verbose:
    //     props.setHistory([
    //       ...props.history,
    //       "Command: " + commandString + " \n Output: " + outputMsg,
    //     ]);
    //     break;
    //   case Mode.Brief:
    //     props.setHistory([...props.history, outputMsg]);
    //     break;
    // }
  };
  /**
   * handles view case after error handling,
   * sends the inputted request to the mocked
   * backend through viewcsv
   * @param commandString
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
    // const commandArgs = commandString.split(" ");
    // let outputMsg: string | string[][];
    // if (commandArgs.length > 1) {
    //   outputMsg = "view does not take any arguments!";
    // } else {
    //   outputMsg = viewcsv();
    // }
    // switch (mode) {
    //   case Mode.Verbose:
    //     props.setHistory((prevHistory) => [
    //       ...prevHistory,
    //       "Command: " + commandString + "\n Output: ",
    //     ]);
    //     props.setHistory((prevHistory) => [...prevHistory, outputMsg]);
    //     break;

    //   case Mode.Brief:
    //     props.setHistory([...props.history, outputMsg]);
    //     break;
    // }
  };

  /**
   * handles search case after error handling,
   * sends the inputted request to the mocked
   * backend through searchcsv
   * @param commandString
   */
  const handleSearch: REPLFunction = async (args: Array<string>) => {
    const commandArgs = args;
    if (commandArgs.length >= 4) {
      return "It seems like you're trying to enter more than 3 search params. If your identifier or search term have multiple words, wrap them in quotes."
    }

    let urlToSearch = "http://localhost:3232/searchcsv"
    const numQueryParams = commandArgs.length;
    switch (numQueryParams) {
      case 1:
        urlToSearch += "?term=" + commandArgs[0];
        break;
      case 2:
        urlToSearch += "?term=" + commandArgs[0]+"&hasheader="+commandArgs[1];
        break;
      case 3:
        urlToSearch += "?term=" + commandArgs[0]+"&hasheader="+commandArgs[1]+"&identifier=" +commandArgs[2];
        break;
      default:
        break;
    }
    const response = await fetch(urlToSearch);
    const responseJson = await response.json();
    const result = responseJson.result;
    if (result.includes("error")) {
      return result;
    }
    const data = responseJson.data;
    return data;



    // in all other cases, we can attempt to search
    const queryTerm = commandArgs[0];
    const queryHeaders = commandArgs[1];

    if (commandArgs.length == 3) { // all three params
      const queryID = commandArgs[2];
      const response = await fetch(
        "http://localhost:3232/searchcsv?term=" +
          queryTerm +
          "&hasheader=" +
          queryHeaders +
          "&identifier=" +
          queryID
      );
      const responseJson = await response.json();
      const result = responseJson.result;
      const data = responseJson.data;
      console.log("3 response: " + result);
      if (result.includes("error")) {
        return result + " data: " + data;
      } else {
        
        return result + data;
      }
    } else if (commandArgs.length == 2) {
      console.log("qTerm: " + queryTerm);
      console.log("qHead: " + queryHeaders);
      const response = await fetch(
        "http://localhost:3232/searchcsv?term=" +
          queryTerm +
          "&hasheader=" +
          queryHeaders
      );
      const responseJson = await response.json();
      const result = responseJson.result;
      const data = responseJson.data;
      console.log("rahh response: " + result);
      if (result.includes("error")) {
        return "result: " + result + " data: " + data;
      } else {
        console.log(data);

        return data;
      }
    } else {
      const response = await fetch(
        "http://localhost:3232/searchcsv?term=" +
          queryTerm +
          "&hasheader=" +
          queryHeaders
      );
      const responseJson = await response.json();
      const status = responseJson.status;
      console.log("2 response: " + status);

      const filepath = responseJson.csvfile;
      if (status.includes("error")) {
        return status;
      }
    }

    // const responseJson = await response.json();
    // const response_type = responseJson.result;
    // const filepath = responseJson.csvfile;
  };

  const possibleCommands: Map<string, REPLFunction> = new Map([
    ["load_file", handleLoad],
    ["view", handleView],
    ["search", handleSearch],
    ["mode", handleMode],
  ]);

  return (
    <div className="REPL-input">
      {/* Wrap your input and button with a form element */}
      <form onSubmit={handleSubmit}>
        {/* Attach the handleSubmit to form submission */}
        <fieldset>
          <ControlledInput
            value={commandString}
            setValue={setCommandString}
            ariaLabel={"Command input"}
          />
          <br />
          {/* Change button type to "submit" */}
          <button
            type="submit"
            style={{
              backgroundColor: "#FF7F50",
              color: "#ffffff",
              marginTop: "10px",
            }}
          >
            Submit
          </button>
        </fieldset>
      </form>
    </div>
  );
}

