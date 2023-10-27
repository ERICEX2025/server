import "../styles/main.css";
import { Mode } from "./exports/enums";
import { HistoryItem } from "./REPL";
import React, { useRef, useEffect } from "react";

/**
 * REPLHistory Component that is in charge of displaying the command input and output history
 * Takes in the history prop that gets updated by REPLInput
 * @returns the REPLHistory Component
 */
interface REPLHistoryProps {
  //data in HistoryItem contains either a string or a 2d string array to represent the csv data
  history: HistoryItem[];
}
// displays each item and differently
// based on if they are a string or 2d string array
// and if its mode brief or verbose
export function REPLHistory(props: REPLHistoryProps) {
  const stringBrief = (item: string, index: number) => {
    return (
      <p key={index} aria-label={"Item " + index}>
        {item}
      </p>
    );
  };

  const tableBrief = (item: string[][], index: number) => {
    return (
      <div key={index} className="table-body">
        <table aria-label={"Item " + index}>
          <tbody>
            {item.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                aria-label={"Table " + index + " row " + rowIndex}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    aria-label={
                      "Table " +
                      index +
                      " row " +
                      rowIndex +
                      " entry " +
                      cellIndex
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const stringVerbose = (
    commandString: string,
    item: string,
    index: number
  ) => {
    return (
      <p key={index} aria-label={"Item " + index}>
        {"Command: " + commandString + " \n Output: " + item}
      </p>
    );
  };

  const tableVerbose = (
    commandString: string,
    item: string[][],
    index: number
  ) => {
    return (
      <div>
        <p key={index} aria-label={"Item " + index}>
          {"Command: " + commandString + " \n Output: "}
        </p>
        <div key={index} className="table-body">
          <table aria-label={"Item " + index}>
            <tbody>
              {item.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  aria-label={"Table " + index + " row " + rowIndex}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      aria-label={
                        "Table " +
                        index +
                        " row " +
                        rowIndex +
                        " entry " +
                        cellIndex
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Get a reference to the repl-history div
  const historyRef = useRef(null);

  // Scroll to the bottom every time the history prop updates
  useEffect(() => {
    if (historyRef.current) {
      scrollToBottom(historyRef.current);
    }
  }, [props.history]);

  function scrollToBottom(element: HTMLElement) {
    element.scrollTop = element.scrollHeight;
  }

  return (
    <div className="REPL-history repl-history" aria-label="History">
      <h3 className="header">History Log</h3>
      <h4>
        please register a command to start! <br></br> mode, load_file
        (csvFilepath), view, search (searchterm, hasHeadersBoolean,
        optionalColumnIdentifier), broadband (state, optionalCounty)
      </h4>
      <div
        className="repl-history"
        aria-label="Command history"
        ref={historyRef}
        id="hist"
        tabIndex={0}
      >
        {props.history.map((item, index) => {
          if (typeof item.data === "string") {
            // Item is a string, outputs the idem depending on the item mode
            return item.mode === Mode.Verbose
              ? stringVerbose(item.command, item.data, index)
              : stringBrief(item.data, index);
          } else {
            // Item is a 2D array, outputs the idem depending on the item mode
            return item.mode === Mode.Verbose
              ? tableVerbose(item.command, item.data, index)
              : tableBrief(item.data, index);
          }
        })}
      </div>
    </div>
  );
}
