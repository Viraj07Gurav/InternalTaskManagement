import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../../Context/SessionContext";
import Input from "../Common/Input";
import Button from "../Common/Button";
import { Alert, AlertTitle, AlertDescription } from "../Common/SuccessDialog";
import { CheckCircle2 } from "lucide-react";

const AddEmployee = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { accessToken, role } = useSessionContext(); // Ensure you're using 'accessToken' from context
  const navigate = useNavigate();

  // Redirect if user is not logged in or doesn't have the required role
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else if (role !== "admin") { // Assuming 'admin' is required to add an employee
      navigate("/dashboard"); // Or wherever the non-admin should be redirected
    }
  }, [accessToken, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/addEmployee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Use the accessToken here
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/dashboard"); // Redirect to dashboard after success
        }, 2000);
      } else {
        setError(data.message || "Failed to add employee");
      }
    } catch (err) {
      console.error("Error adding employee:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-[1rem] items-center justify-center min-h-screen px-4 sm:px-0 py-[2rem] bg-gradient-to-br from-blue-50 to-indigo-50">
      {showSuccess && (
        <Alert className="fixed top-4 right-4 w-80 border-green-200 bg-green-50 text-green-800 animate-slide-down shadow-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800 font-semibold">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Employee added successfully
          </AlertDescription>
        </Alert>
      )}

      <div className="w-full max-w-sm p-6 sm:p-8 bg-white border-2 border-blue-100 shadow-lg rounded-2xl">
        <div className="mb-8 flex flex-col text-center gap-4">
          <div className="flex flex-row items-center justify-start gap-2">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h1 className="text-blue-600 text-2xl font-bold">TaskFlow</h1>
          </div>
          <div className="flex flex-row justify-between items-center relative">
            <h1 className="text-3xl font-semibold text-gray-800">Create Employee</h1>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            placeholder="Enter employee's username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter employee's password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            variant="primary"
            className="w-full text-center"
            type="submit"
          >
            Add Employee
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
