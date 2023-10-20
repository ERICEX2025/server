import { Dispatch, SetStateAction, useState } from "react";
import { Mode } from "../enums";
import { ControlledInput } from "./ControlledInput";
import { loadcsv, viewcsv, searchcsv } from "./mockedJson";

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

  function handleSubmit(commandString: string) {
    const commandArgs = commandString.split(" ");

    if (commandArgs[0] == "mode") {
      handleMode(commandString);
    } else if (commandArgs[0] == "load_file") {
      handleLoad(commandString);
    } else if (commandArgs[0] == "view") {
      handleView(commandString);
    } else if (commandArgs[0] == "search") {
      handleSearch(commandString);
    } else {
      handleError(commandString);
    }

    setCommandString("");
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
          commandString +" does not exist, try either mode brief or mode verbose",
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
  function handleLoad(commandString: string) {
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
  }
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
