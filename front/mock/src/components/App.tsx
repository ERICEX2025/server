import "../styles/App.css";
import REPL from "./REPL";

/**
 * Highest level component that displays the title, usage info, and REPL
 * @returns the entire application 
 */
function App() {
  return (
    <>
      <div className="card">
        <h1>REPL</h1>
      </div>
      <div>
        <REPL />
      </div>
    </>
  );
}



export default App;
