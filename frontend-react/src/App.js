import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";
import Tasks from "./components/Tasks";
import Services from "./components/Services";

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1 className="al">Task Management System</h1>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
