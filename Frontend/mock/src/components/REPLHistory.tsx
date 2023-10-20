import "../styles/main.css";
/**
 * REPLHistory Component that is in charge of displaying the command input and output history
 * Takes in the history prop that gets updated by REPLInput
 * @returns the REPLHistory Component
 */
interface REPLHistoryProps {
  //contains either a string or a 2d string array to represent the csv data
  history: (string | string[][])[];
}
// displays each item and differently
// based on if they are a string or 2d string array
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="REPL-history repl-history" aria-label="Command history">
      <h3> History Log </h3>

      <table className="table-dimensions">
        {props.history.map((item, index) =>
          //if item is a string, display string
          typeof item === "string" ? (
            <p key={index} aria-label={"Item " + index}>
              {item}
            </p>
          ) : (
            //if item is a 2d string array, display as a html table
            <div className="table-body">
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
          )
        )}
      </table>
    </div>
  );
}
