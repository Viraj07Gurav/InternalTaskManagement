import React, { useState } from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { format, eachDayOfInterval, parseISO } from "date-fns";

const ReportGenerator = ({ tasks, employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [reportType, setReportType] = useState("daily"); // 'daily' or 'range'
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const generateDailyReport = () => {
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

    return createAndDownloadWorkbook(groupedTasks, "Daily");
  };

  const generateRangeReport = () => {
    const employeeTasks = tasks.filter(
      (task) => task.assignee_username === selectedEmployee
    );

    const dateRangeArray = eachDayOfInterval({
      start: parseISO(dateRange.startDate),
      end: parseISO(dateRange.endDate),
    });

    const groupedTasks = employeeTasks.reduce((acc, task) => {
      const clientPackageKey = `${task.client} - ${task.package}`;
      if (!acc[clientPackageKey]) {
        acc[clientPackageKey] = [];
      }

      dateRangeArray.forEach((date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
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
      });

      return acc;
    }, {});

    // Add summary sheet
    const summary = calculateSummary(groupedTasks);
    groupedTasks["Summary"] = [summary];

    return createAndDownloadWorkbook(groupedTasks, "Range");
  };

  const calculateSummary = (groupedTasks) => {
    let totalTasks = 0;
    let completedPosts = 0;
    let completedReels = 0;
    let completedMockups = 0;

    Object.values(groupedTasks).forEach((taskGroup) => {
      taskGroup.forEach((task) => {
        totalTasks++;
        if (task.Posts === "Completed") completedPosts++;
        if (task.Reels === "Completed") completedReels++;
        if (task.Mockups === "Completed") completedMockups++;
      });
    });

    return {
      "Date Range": `${dateRange.startDate} to ${dateRange.endDate}`,
      "Total Days": Math.floor(
        (new Date(dateRange.endDate) - new Date(dateRange.startDate)) /
          (1000 * 60 * 60 * 24) + 1
      ),
      "Total Tasks": totalTasks,
      "Completed Posts": completedPosts,
      "Completed Reels": completedReels,
      "Completed Mockups": completedMockups,
      "Completion Rate": `${(
        ((completedPosts + completedReels + completedMockups) /
          (totalTasks * 3)) *
        100
      ).toFixed(2)}%`,
    };
  };

  const createAndDownloadWorkbook = (groupedTasks, reportType) => {
    const wb = XLSX.utils.book_new();
    const columnWidths = [
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];

    Object.entries(groupedTasks).forEach(([clientPackage, taskReport]) => {
      const ws = XLSX.utils.json_to_sheet(taskReport);
      ws["!cols"] = columnWidths;
      XLSX.utils.book_append_sheet(wb, ws, clientPackage);
    });

    const fileName = `${selectedEmployee}_${reportType}_Report_${
      reportType === "Daily" ? selectedDate : dateRange.startDate + "_to_" + dateRange.endDate
    }.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="py-3 sm:py-6 px-2 sm:px-6 bg-blue-50 rounded-xl w-full">
      <div className="bg-white px-3 sm:px-6 py-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl text-center sm:text-left font-bold mb-4 bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">
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
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee} value={employee}>
                  {employee}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="daily"
                  checked={reportType === "daily"}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mr-2"
                />
                Daily Report
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="range"
                  checked={reportType === "range"}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mr-2"
                />
                Date Range Report
              </label>
            </div>
          </div>

          {reportType === "daily" ? (
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
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <button
            onClick={reportType === "daily" ? generateDailyReport : generateRangeReport}
            disabled={!selectedEmployee || (reportType === "range" && dateRange.endDate < dateRange.startDate)}
            className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate {reportType === "daily" ? "Daily" : "Range"} Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;