import { useState } from "react";
import { REPLInput } from "./REPLInput";
import { REPLHistory } from "./REPLHistory";
import { Mode } from "./enums";

export interface HistoryItem {
  data: string | string[][];
  mode: Mode;
  command: string;
}

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
