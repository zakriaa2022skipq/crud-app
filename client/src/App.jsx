import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import CatchAll from "./pages/CatchAll";
import Landing from "./pages/Landing";
import Home from "./pages/Home";

function App() {
  
  
  return (
    <>
      <div className="App">
        <Toaster position="top-center" closeButton richColors />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<CatchAll />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
