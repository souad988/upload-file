import react, { useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  useEffect(async () => {
    const response = await axios.get("http://localhost:3001");
    console.log("response", response.data);
  }, []);

  return <div className="App">hello!!!</div>;
}

export default App;
