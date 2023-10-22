import { useState } from "react";
import { REPLInput } from "./REPLInput";
import { REPLHistory } from "./REPLHistory";

//Extra simple TODO chores: display html table to newest inputted command and flexbox, mode kinda scuffed
/**
 * top level REPL component that ocntains the REPL Input and History
 * contains the history state passed into the child componenets
 * @returns the high level REPL Component
 */
export default function REPL() {
  const [history, setHistory] = useState<(string | string[][])[]>([]);
  return (
    <div className="repl">
      <REPLHistory history={history}></REPLHistory>
      <REPLInput history={history} setHistory={setHistory}></REPLInput>
    </div>
  );
}
