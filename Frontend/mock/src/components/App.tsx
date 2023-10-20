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
        <h1>Mock</h1>
        <h4>
          try load_file &lt;csv-file-path&gt;, view, search &lt;column&gt;
          &lt;value&gt;, or mode &lt;mode&gt; to start
        </h4>
      </div>
      <div>
        <REPL />
      </div>
    </>
  );
}



export default App;
