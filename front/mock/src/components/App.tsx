import "../styles/App.css";
import REPL from "./REPL";
import { useEffect, KeyboardEventHandler } from "react";



/**
 * Highest level component that displays the title, usage info, and REPL
 * @returns the entire application 
 */
function App() {

  useEffect(()=>{
    const doc = document.getElementById("app");
    doc?.focus();
  }, [])
  // upon render, the app is in focus
  

  /**
   * Handles key keyboard shortcuts from the user's keystrokes. The available shortcuts
   * include "h" to focus on the history, "control" to focus on the input box, "escape"
   * to remove focus from the input box so the user can use shortcuts/scroll.
   *
   * @param event - a keyboard event from user input.
   */
  const handleKeyDownApp: KeyboardEventHandler<HTMLDivElement> = (
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

  return (
    <>
      <div id="app" tabIndex={0} onKeyDown={handleKeyDownApp}>
        <div className="card">
          <h1>REPL</h1>
        </div>
        <div>
          <REPL />
        </div>
      </div>
    </>
  );
}



export default App;
