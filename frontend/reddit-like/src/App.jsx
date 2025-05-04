import "./style.css";
import { BrowserRouter , Routes, Route } from "react-router-dom";
import Sub from "./components/Sub.jsx";
import SubAdd from "./components/SubAdd.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sub />} />
        <Route path="/subs" element={<Sub />} />
        <Route path="/add" element={<SubAdd />} />
      </Routes>
    </BrowserRouter>

    
  )
}

export default App