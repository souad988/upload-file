import react, { useEffect } from "react";
import "./App.css";
import axios from "axios";
import UploadFile from "./components/uploadFile";

function App() {
  // useEffect(async () => {
  //   const response = await axios.get("http://localhost:3001");
  //   console.log("response", response.data);
  // }, []);

  return <div className="App">
    <h1>
      UploadFile 
    </h1>
    <div>
      <UploadFile />
      </div></div>;
}

export default App;
