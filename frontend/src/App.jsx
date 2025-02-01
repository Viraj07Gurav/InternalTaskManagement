import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import { SessionProvider } from "./Context/SessionContext";
// import Home from './pages/Home';
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import AddEmployee from "./components/admin/AddEmployee";
import ProtectedRoute from "./Routes/ProtectedRoute";
import EmployeeList from "./components/admin/EmployeeList";

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/addEmployee"
            element={
              <ProtectedRoute requiredRole="admin">
                <AddEmployee />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedRoute requiredRole="admin">
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard" element={<MainPage />} />
          
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
