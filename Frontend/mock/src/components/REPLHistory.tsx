import "../styles/main.css";
import { Mode } from "../enums";
import { HistoryItem } from "./REPL";

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
export function REPLHistory(props: REPLHistoryProps) {
   
  const renderStringItemBrief = (item: string, index: number) => {
     return (
       <p key={index} aria-label={"Item " + index}>
         {item}
       </p>
     );
   };

   const renderTableItemBrief = (item: string[][], index: number) => {
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

    const renderStringItemVerbose = (commandString: string, item: string, index: number) => {
      return (
        <p key={index} aria-label={"Item " + index}>
          {"Command: " + commandString + " \n Output: " + item}
        </p>
      );
    };

    const renderTableItemVerbose = (
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

   return (
     <div className="REPL-history repl-history" aria-label="Command history">
       <h3>History Log</h3>
       {props.history.map((item, index) => {
         if (typeof item.data === "string") {
           // Item is a string, use the mode captured with the history item
           return item.mode === Mode.Verbose
             ? renderStringItemVerbose(item.command, item.data, index)
             : renderStringItemBrief(item.data, index);
         } else {
           // Item is a 2D array, use the mode captured with the history item
           return item.mode === Mode.Verbose
             ? renderTableItemVerbose(item.command, item.data, index)
             : renderTableItemBrief(item.data, index);
         }
       })}
     </div>
   );

  // return (
  //   <div className="REPL-history repl-history" aria-label="Command history">
  //     <h3> History Log </h3>

  //     <table className="table-dimensions">
  //       {props.history.map((item, index) =>
  //         //if item is a string, display string
  //         typeof item === "string" ? (
  //           <p key={index} aria-label={"Item " + index}>
  //             {item}
  //           </p>
  //         ) : (
  //           //if item is a 2d string array, display as a html table
  //           <div className="table-body">
  //             <table aria-label={"Item " + index}>
  //               <tbody>
  //                 {item.map((row, rowIndex) => (
  //                   <tr
  //                     key={rowIndex}
  //                     aria-label={"Table " + index + " row " + rowIndex}
  //                   >
  //                     {row.map((cell, cellIndex) => (
  //                       <td
  //                         key={cellIndex}
  //                         aria-label={
  //                           "Table " +
  //                           index +
  //                           " row " +
  //                           rowIndex +
  //                           " entry " +
  //                           cellIndex
  //                         }
  //                       >
  //                         {cell}
  //                       </td>
  //                     ))}
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         )
  //       )}
  //     </table>
  //   </div>

  //  );
  
}
