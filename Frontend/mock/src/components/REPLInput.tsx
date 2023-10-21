import { Dispatch, SetStateAction, useState, useRef } from "react";
import { Mode } from "../enums";
import { ControlledInput } from "./ControlledInput";
import { loadcsv, viewcsv, searchcsv } from "./mockedJson";

/**
 * repl interface for the functions of the registered commands
 */
export interface REPLFunction {
  (args: Array<string>): Promise<string>;
}

/**
 * REPL Input component is in charge of dealing with everything
 * related to the inputs, accepts input commands and handles them 
 * accordingly, updating the history state for REPLHistory
 * to display
 */
interface REPLInputProps {
  history: (string | string[][])[];
  setHistory: Dispatch<SetStateAction<(string | string[][])[]>>;
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
  const [commandString, setCommandString] = useState<string>("");
  const [mode, setMode] = useState<Mode>(Mode.Brief);
  // used to contain the current registered commands
  // useRef hook since the dynamic array is only used for logic and not state 
  const registeredCommands = useRef<string[]>([]);

  function handleSubmit(commandString: string) {
    const commandArgs = commandString.split(" ");
    setCommandString("");

    // Removes the first element from commandArgs and returns the first element
    const firstInput = commandArgs.shift();

    // first check if user is trying to register a command
    if (firstInput === "register") {
      if (commandArgs.length === 0) {
        props.setHistory(["please enter a command to register"]);
      }
      // then if the command is already registered
      else if (registeredCommands.current.includes(commandArgs[0])) {
        // command already exists
        props.setHistory(["command: " + commandArgs[0] + " already exists!"]);
      } 
      else {
        // if so check if the command is a possible commands to register
        if (possibleCommands.has(commandArgs[0])) {
          // if it is, then register the command
          registeredCommands.current.push(commandArgs[0]);
          props.setHistory(["command: " + commandArgs[0] + " registered"]);
        } else {
          // if the command is not a possible command to register
          props.setHistory([
            "command: " + commandArgs[0] + " not a possible command to register"
          ]);
        }
      }
    }
    // if user is trying to use a command
    else if (registeredCommands.current.includes(commandArgs[0])) {
      // Retrieve and call the function
      const commandFunction = possibleCommands.get(commandArgs[0]);
      // notify the web developer that the function of this command
      // is initialized to undefined in the possibleCommands Map
      if (commandFunction === undefined) {
        props.setHistory([
          "command function for command: " + commandArgs[0] + "is undefined"
        ]);
      } else {
        commandFunction(commandArgs).then(r =>);
      }
    }
    // if user is trying to use an invalid command
    else{
      props.setHistory([
        "command: " + commandArgs[0] + " is not one of the registered commands"
      ]);
    }
  } 
  

  /**
   * handles mode by parsing the string
   * setting enum mode state variable
   * to correspond to the user's desired
   * mode, handles error case
   * @param commandString
   */
  function handleMode(commandString: string) {
    switch (commandString) {
      case "mode verbose":
        setMode(Mode.Verbose);
        props.setHistory([
          ...props.history,
          "Command: " + commandString + " \n Output: " + "mode set to verbose",
        ]);
        break;
      case "mode brief":
        setMode(Mode.Brief);
        props.setHistory([...props.history, "mode set to brief"]);
        break;
      default:
        props.setHistory([
          ...props.history,
          commandString + " does not exist, try either mode brief or mode verbose",
        ]);
        break;
    }
  }
  /**
   * handles load case after error handling,
   * sends the inputted request to the mocked
   * backend through loadcsv
   * @param commandString
   */
  const handleLoad: REPLFunction = async (args: Array<string>) => {
   const commandArgs = commandString.split(" ");
   let outputMsg;
   if (commandArgs.length != 2) {
     outputMsg =
      "Please provide 1 argument for load: load_file <csv-file-path>";
   } else {
     outputMsg = loadcsv(commandArgs[1]);
   }
   switch (mode) {
     case Mode.Verbose:
       props.setHistory([
         ...props.history,
         "Command: " + commandString + " \n Output: " + outputMsg,
       ]);
       break;
     case Mode.Brief:
       props.setHistory([...props.history, outputMsg]);
       break;
   }
   return new Promise<string>((resolve, reject) => {
     // Implement your function logic here.
     // You can access the command arguments in the 'args' array.

     // For example, let's say we return a simple message.
     resolve(`Arguments received: ${args.join(", ")}`);
   });
 };
  /**
   * handles view case after error handling,
   * sends the inputted request to the mocked
   * backend through viewcsv
   * @param commandString
   */
  function handleView(commandString: string) {
    const commandArgs = commandString.split(" ");
    let outputMsg: string | string[][];
    if (commandArgs.length > 1) {
      outputMsg = "view does not take any arguments!";
    } else {
      outputMsg = viewcsv();
    }
    switch (mode) {
      case Mode.Verbose:
        props.setHistory((prevHistory) => [
          ...prevHistory,
          "Command: " + commandString + "\n Output: ",
        ]);
        props.setHistory((prevHistory) => [...prevHistory, outputMsg]);
        break;

      case Mode.Brief:
        props.setHistory([...props.history, outputMsg]);
        break;
    }
  }

  /**
   * handles search case after error handling,
   * sends the inputted request to the mocked
   * backend through searchcsv
   * @param commandString
   */
  function handleSearch(commandString: string) {
    const commandArgs = commandString.split(" ");
    let outputMsg: string | string[][];
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
    switch (mode) {
      case Mode.Verbose:
        props.setHistory((prevHistory) => [
          ...prevHistory,
          "Command: " + commandString + "\n Output: ",
        ]);

        props.setHistory((prevHistory) => [...prevHistory, outputMsg]);
        break;

      case Mode.Brief:
        props.setHistory([...props.history, outputMsg]);
        break;
    }
  }

  /**
   * handles invalid command,
   * describes a list of valid commands
   * @param commandString
   */
  function handleError(commandString: string) {
    let outputMsg =
      "Command " + commandString + " not recognized, try load_file <csv-file-path>, view, search <column> <value> or mode <mode>";
    switch (mode) {
      case Mode.Brief:
        props.setHistory([...props.history, outputMsg]);
        break;
      case Mode.Verbose:
        props.setHistory([
          ...props.history,
          "Command: " + commandString + " \n Output: " + outputMsg,
        ]);
        break;
    }
  }

  const possibleCommands: Map<string, REPLFunction> = new Map([
    ["handleLoad", handleLoad],
    // ["handleView", handleView],
    // ["handleSearch", handleSearch],
    // ["handleMode", handleMode]
  ]);


  return (
    <div className="REPL-input">
      <fieldset>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
        <br /> {/* Add a line break (new line) */}
        <button
          onClick={() => handleSubmit(commandString)}
          style={{
            backgroundColor: "#FF7F50",
            color: "#ffffff",
            marginTop: "10px",
          }}
        >
          Submit
        </button>
      </fieldset>
    </div>
  );
}
