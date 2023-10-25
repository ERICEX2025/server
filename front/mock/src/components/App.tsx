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
          <h1>Mock</h1>
          <h4>
            register one of these commands load_file &lt;csv-file-path&gt;,
            view, search &lt;column&gt; &lt;value&gt;, or mode &lt;mode&gt; to
            start
          </h4>
        </div>
        <div>
          <REPL />
        </div>
      </div>
    </>
  );
}



export default App;
