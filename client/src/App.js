import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/register/register";
import TaskListPage from "./pages/task-list/task-list";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tasks" element={<TaskListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
