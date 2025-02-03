import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../../Context/SessionContext";
import { PiPasswordBold } from "react-icons/pi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "../Common/Card";
import { PlusCircle, Trash2, AlertCircle, EyeOff, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../Common/AlertDialog";
import { toast, ToastContainer } from "react-toastify";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [resetPassword, setResetPassword] = useState(null);
  const { accessToken, role } = useSessionContext(); // Get accessToken and role from context
  const navigate = useNavigate();
  const [manualPassword, setManualPassword] = useState("");
  const [isManualReset, setIsManualReset] = useState(false);
  const [showPassword, setShowPassword] = useState(true); // Toggle password visibility

  // Redirect if user is not logged in or doesn't have the correct role
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else if (role !== "admin") {
      // Only allow admin to manage employees
      navigate("/dashboard"); // Redirect non-admin users
    }
  }, [accessToken, role, navigate]);

  const handleAddEmployeeClick = () => {
    navigate("/addEmployee");
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5000/employees", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEmployees(data.employees);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch employees");
      console.error("Error:", err);
    }
  };

  const handleDeleteEmployee = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:5000/deleteEmployee/${username}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        fetchEmployees();
        toast.success("Employee deleted successfully!");
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete employee");
      toast.error("Failed to delete employee",err);
      console.error("Error:", err);
    }
  };

  const handleResetPassword = async (username, isManual = false) => {
    try {
      let passwordToUse;
      if (isManual) {
        if (!manualPassword) {
          setError("Password cannot be empty");
          toast.error("Password cannot be empty");
          return;
        }
        passwordToUse = manualPassword;
      } else {
        passwordToUse = generateTemporaryPassword();
      }

      const response = await fetch(
        `http://localhost:5000/resetPassword/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            newPassword: passwordToUse,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (!isManual) {
          toast.success(
            `Password reset successful! Temporary password: ${data.temporaryPassword}`
          );
        } else {
          toast.success("Password reset successful!");
        }
        setManualPassword("");
        setIsManualReset(false);
        setResetPassword(null);
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (err) {
      setError("Failed to reset password");
      toast.error("Failed to reset password");
      console.error("Error:", err);
    }
  };

  // Add utility function to generate a temporary password
  const generateTemporaryPassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  useEffect(() => {
    if (accessToken) {
      fetchEmployees(); // Fetch employees if the user is authenticated
    }
  }, [accessToken]);

  return (
    <div className="py-3 sm:py-6 px-2 sm:px-6 bg-blue-50 rounded-xl w-full">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <Button onClick={handleAddEmployeeClick}>
            <PlusCircle className="mr-1 w-4 sm:w-5 h-4 sm:h-5" />
            Add Employee
          </Button>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="overflow-x-auto rounded-tl-lg rounded-tr-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="px-4 py-2 text-left text-gray-700 whitespace-nowrap font-medium">
                    Id
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 whitespace-nowrap font-medium">
                    Username
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 whitespace-nowrap font-medium">
                    Created At
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 whitespace-nowrap font-medium">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 whitespace-nowrap font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-200 hover:bg-blue-50 text-[13px] text-gray-600"
                  >
                    <td className="px-4 py-2">{employee.id}</td>
                    <td className="px-4 py-2">{employee.username}</td>
                    <td className="px-4 py-2">
                      {new Date(employee.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{employee.role}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => setEmployeeToDelete(employee)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => setResetPassword(employee)}
                        className="text-green-500 hover:text-green-700 cursor-pointer"
                      >
                        <PiPasswordBold size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {employees.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No employees found</p>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={employeeToDelete !== null}
        onOpenChange={() => setEmployeeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirm Employee Removal
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Are you sure you want to remove{" "}
              <span className="font-bold text-red-800">
                {employeeToDelete?.username}
              </span>{" "}
              from the system?
              <p className="mt-2 text-gray-800 text-xs">
                This action cannot be undone. All associated data will be
                permanently deleted.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteEmployee(employeeToDelete.username);
                setEmployeeToDelete(null);
              }}
            >
              Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={resetPassword !== null}
        onOpenChange={() => {
          setResetPassword(null);
          setIsManualReset(false);
          setManualPassword("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Reset Password
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Reset password for{" "}
              <span className="font-bold text-green-600">
                {resetPassword?.username}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-800"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "password" : "text"} // Toggle visibility based on showPassword state
                    value={manualPassword}
                    onChange={(e) => setManualPassword(e.target.value)}
                    className="border rounded-md px-3 py-2 text-gray-800"
                    placeholder="Enter new password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-600 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setManualPassword("");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleResetPassword(resetPassword.username, true); // always true for manual reset
              }}
            >
              Reset Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toast Container for displaying toast messages */}
      <ToastContainer />
    </div>
  );
};

export default EmployeeList;
