import "../styles/main.css";
import { Dispatch, SetStateAction } from "react";

/**
 * Props taking in the commandString state
 * set commandString setter and ariaLabel
 * for testing and accessibility
 */
interface ControlledInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  ariaLabel: string;
}

/**
 * Special ControlledInput component that wraps the input box.
 * Input boxes contain state so We want to make sure React is managing that state,
 * @returns the input box
 */
export function ControlledInput({
  value,
  setValue,
  ariaLabel,
}: ControlledInputProps) {
  return (
    <input
      type="text"
      className="repl-command-box"
      value={value}
      placeholder="Type your command here"
      onChange={(ev) => setValue(ev.target.value)}
      aria-label={ariaLabel}
      id="box"
    ></input>
  );
}
