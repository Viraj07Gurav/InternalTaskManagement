import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../../Context/SessionContext";
import { Card, CardHeader, CardTitle, CardContent, Button } from "../Common/Card";
import { PlusCircle, Trash2, AlertCircle } from "lucide-react";
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

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const { accessToken, role } = useSessionContext(); // Get accessToken and role from context
  const navigate = useNavigate();

  // Redirect if user is not logged in or doesn't have the correct role
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else if (role !== "admin") { // Only allow admin to manage employees
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
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete employee");
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchEmployees(); // Fetch employees if the user is authenticated
    }
  }, [accessToken]);

  return (
    <div className="py-3 sm:py-6 px-4 bg-blue-50 rounded-xl w-full">
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
                  <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">
                    Id
                  </th>
                  <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-200 hover:bg-blue-50 text-sm text-gray-800"
                  >
                    <td className="px-4 py-2">{employee.id}</td>
                    <td className="px-4 py-2">{employee.username}</td>
                    <td className="px-4 py-2">
                      {new Date(employee.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{employee.role}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setEmployeeToDelete(employee)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={16} />
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
              Are you sure you want to remove <span className="font-bold text-red-800">{employeeToDelete?.username}</span> from the system?
              <p className="mt-2 text-gray-800 text-xs">This action cannot be undone. All associated data will be permanently deleted.</p>
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
    </div>
  );
};

export default EmployeeList;
