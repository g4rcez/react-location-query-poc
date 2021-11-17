import "./App.css";
import logo from "./logo.svg";
import { Link } from "react-location";
import { SmartComponent } from "./types";

const App: SmartComponent = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Link className="App-link" to="/test" rel="noopener noreferrer">
          Learn React
        </Link>
      </header>
    </div>
  );
};

App.displayName = "App";
export default App;
