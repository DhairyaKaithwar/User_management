import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import UserChart from "./components/UserChart"; // Import UserChart

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userchart" element={<UserChart />} />  {/* Add route for UserChart */}
      </Routes>
    </Router>
  );
}

export default App;
