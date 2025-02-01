import React, { useState } from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { format } from "date-fns";

const ReportGenerator = ({ tasks, employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const generateEmployeeReport = () => {
    // Filter tasks for selected employee
    const employeeTasks = tasks.filter(
      (task) => task.assignee_username === selectedEmployee
    );

    const groupedTasks = employeeTasks.reduce((acc, task) => {
      const clientPackageKey = `${task.client} - ${task.package}`;
      if (!acc[clientPackageKey]) {
        acc[clientPackageKey] = [];
      }

      const taskDate = new Date(selectedDate);
      const formattedDate = format(taskDate, "yyyy-MM-dd");
      const taskCompletion = task.dailyCompletions[formattedDate] || {};

      const isAnyTaskCompleted =
        taskCompletion.posts || taskCompletion.reels || taskCompletion.mockups;

      const dailyCompletionData = {
        Client: task.client,
        Package: task.package,
        Date: formattedDate,
        Posts: taskCompletion.posts ? "Completed" : "Not Completed",
        Reels: taskCompletion.reels ? "Completed" : "Not Completed",
        Mockups: taskCompletion.mockups ? "Completed" : "Not Completed",
        "Completed At": isAnyTaskCompleted
          ? format(new Date(), "HH:mm:ss")
          : "Not Completed",
      };

      acc[clientPackageKey].push(dailyCompletionData);
      return acc;
    }, {});

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Define column widths
    const columnWidths = [
      { wch: 15 }, // Client
      { wch: 12 }, // Package
      { wch: 12 }, // Date
      { wch: 15 }, // Posts
      { wch: 15 }, // Reels
      { wch: 15 }, // Mockups
      { wch: 15 }, // Completed At
    ];

    // Create sheets for each client-package group
    Object.entries(groupedTasks).forEach(([clientPackage, taskReport]) => {
      const ws = XLSX.utils.json_to_sheet(taskReport, {
        header: [
          "Client",
          "Package",
          "Date",
          "Posts",
          "Reels",
          "Mockups",
          "Completed At",
        ],
      });

      // Apply column widths
      ws["!cols"] = columnWidths;

      // Add this worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, clientPackage);
    });

    // Generate the file name with employee name and date
    const fileName = `${selectedEmployee}_Task_Report_${selectedDate}.xlsx`;

    // Write the workbook to a file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="py-3 sm:py-6 px-2 sm:px-6 bg-blue-50 rounded-xl w-full">
      <div className="bg-white px-3 sm:px-6 py-[1.5rem] rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl text-center sm:text-left  font-bold mb-4 bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">
          Generate Employee Task Report
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" className="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee} value={employee}>
                  {employee}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={generateEmployeeReport}
            disabled={!selectedEmployee}
            className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4 mr-2 " />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
