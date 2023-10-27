import { useState } from "react";
import { REPLInput } from "./REPLInput";
import { REPLHistory } from "./REPLHistory";
import { Mode } from "./exports/enums";
import { KeyboardEventHandler } from "react";

export interface HistoryItem {
  data: string | string[][];
  mode: Mode;
  command: string;
}

/**
 * Handles key keyboard shortcuts from the user's keystrokes. The available shortcuts
 * include "h" to focus on the history, "control" to focus on the input box, "escape"
 * to remove focus from the input box so the user can use shortcuts/scroll.
 *
 * @param event - a keyboard event from user input.
 */
export const handleKeyDownApp: KeyboardEventHandler<HTMLDivElement> = (
  event
) => {
  switch (event.key) {
    case "h":
      const active_elt = document.activeElement;
      if (!(active_elt === document.getElementById("box"))) {
        const hist = document.getElementById("hist");
        hist?.focus();
      }
      break;
    case "Control":
      const box = document.getElementById("box");
      box?.focus();
      break;
    case "Escape":
      const input_box = document.getElementById("box");
      input_box?.blur();
      const history = document.getElementById("hist");
      history?.blur();
      const doc = document.getElementById("app");
      doc?.focus();
      break;
    default:
      break;
  }
};

/**
 * top level REPL component that ocntains the REPL Input and History
 * contains the history state passed into the child componenets
 * @returns the high level REPL Component
 */
export default function REPL() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  return (
    <div className="repl">
      <REPLHistory history={history}></REPLHistory>
      <REPLInput history={history} setHistory={setHistory}></REPLInput>
    </div>
  );
}
