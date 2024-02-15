import { useState } from "react";
import "./App.css";
import Room from "./pages/Room";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1> Chat app using ReactJs and NodeJs</h1>
      <Room />
    </>
  );
}

export default App;
