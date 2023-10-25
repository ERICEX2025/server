import "../styles/App.css";
import REPL, { handleKeyDownApp } from "./REPL";


/**
 * Highest level component that displays the title, usage info, and REPL
 * @returns the entire application 
 */
function App() {

  // upon render, the app is in focus
  const doc = document.getElementById("app");
  doc?.focus();

  return (
    <>
      <div id="app" tabIndex={0} onKeyDown={handleKeyDownApp} >
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
