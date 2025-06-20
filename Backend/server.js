// const express = require('express');
// const cors = require('cors');

// require('dotenv').config();

// const app = express();

// // Added more detailed logging
// console.log('Starting server initialization...');

// app.use(cors());
// app.use(express.json());

// // // Backend Route
// // app.get('/getData', (req, res) => {
// //     // Example of sending role and username data from backend
// //     const roleFromSession = sessionStorage.getItem("role");
// //     const roleFromLocal = localStorage.getItem("role");
// //     const usernameFromSession = sessionStorage.getItem("username");
// //     const usernameFromLocal = localStorage.getItem("username");

// //     const responseData = {
// //         role: roleFromSession || roleFromLocal || "guest",  // Default to 'guest' if no role
// //         username: usernameFromSession || usernameFromLocal || "Guest User"
// //     };

// //     res.json(responseData);  // Send back JSON data
// // });

//  app.get("/getData", (req,res) => {
//     res.send("Users!");
//  })

// // Basic error handling
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(500).json({ message: 'Server error' });
// });

// const PORT = process.env.PORT || 5000;

// // Wrap server startup in try-catch
// try {
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// } catch (error) {
//     console.error('Failed to start server:', error);
// }

// require("dotenv").config();
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const bodyParser = require("body-parser");

// // Initialize Express
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(bodyParser.json()); // For parsing application/json

// // Mock database (this will contain hashed passwords)
// let users = [];

// // Hash passwords before starting the server
// const hashPasswords = async () => {
//   const saltRounds = 10;

//   // Define users with plaintext passwords
//   const plainUsers = [
//     {
//       username: "ADMIN",
//       password: "password123", // plaintext password
//       role: "admin",
//     },
//     {
//       username: "prem",
//       password: "prem123", // plaintext password
//       role: "employee",
//     },
//   ];

//   // Hash passwords and populate users array
//   for (let user of plainUsers) {
//     const hashedPassword = await bcrypt.hash(user.password, saltRounds);
//     users.push({
//       username: user.username,
//       password: hashedPassword,
//       role: user.role,
//     });
//   }

//   // Start the server after hashing passwords
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
// };

// // User login route
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   // Find the user by username
//   const user = users.find((u) => u.username === username);
//   if (!user) {
//     return res.status(400).json({ message: "Invalid credentials" });
//   }

//   // Compare the provided password with the hashed password in the database
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(400).json({ message: "Invalid credentials" });
//   }

//   // Generate JWT token
//   const token = jwt.sign(
//     { username: user.username, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1h" }
//   );

//   // Return the token and user role
//   res.json({
//     token,
//     role: user.role,
//   });
// });

// // Sample protected route (Example: user dashboard)
// app.get("/", (req, res) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ message: "Authorization token missing" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.json({ message: `Welcome to the dashboard, ${decoded.username}` });
//   } catch (error) {
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// });

// // Start password hashing process
// hashPasswords();

// const express = require("express");
// const bodyParser = require("body-parser");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors()); // Enable CORS for frontend to communicate

// // Hardcoded credentials for Admin and Employee
// const ADMIN_CREDENTIALS = {
//   username: "ADMIN",
//   password: "ADMIN", // Simple static password
//   role: "admin",
// };

// const EMPLOYEE_CREDENTIALS = {
//   username: "prem",
//   password: "prem", // Simple static password
//   role: "employee",
// };

// // Secret key for JWT token
// const JWT_SECRET = "your_jwt_secret_key";

// // Helper function to generate JWT token
// const generateToken = (username, role) => {
//   return jwt.sign({ username, role }, JWT_SECRET, { expiresIn: "1h" });
// };

// // Login route
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;

//   // Check if credentials are valid
//   if (
//     username === ADMIN_CREDENTIALS.username &&
//     password === ADMIN_CREDENTIALS.password
//   ) {
//     // Admin login - generate token
//     const token = generateToken(username, ADMIN_CREDENTIALS.role);
//     return res.json({
//       message: "Admin login successful",
//       token,
//       role: ADMIN_CREDENTIALS.role,
//       username: ADMIN_CREDENTIALS.username,
//     });
//   } else if (
//     username === EMPLOYEE_CREDENTIALS.username &&
//     password === EMPLOYEE_CREDENTIALS.password
//   ) {
//     // Employee login - generate token
//     const token = generateToken(username, EMPLOYEE_CREDENTIALS.role);
//     return res.json({
//       message: "Employee login successful",
//       token,
//       role: EMPLOYEE_CREDENTIALS.role,
//       username: EMPLOYEE_CREDENTIALS.username,
//     });
//   } else {
//     // Invalid credentials
//     return res.status(401).json({ message: "Invalid username or password" });
//   }
// });

// // Protected route example (for testing authentication)
// app.get("/profile", (req, res) => {
//   const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }
//     res.json({ message: "Profile data", user: decoded });
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });



require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const { format } = require("date-fns");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err);
  } else {
    console.log("MySQL connected");
  }
});

// Helper function to generate JWT tokens
const generateAccessToken = (username, role) => {
  return jwt.sign({ username, role }, JWT_SECRET, { expiresIn: "1d" }); //short lived
};

const generateRefreshToken = (username) => {
  return jwt.sign({ username }, REFRESH_SECRET, { expiresIn: "7d" }); //long lived
};

// Login route
// Admin credentials (username and password fixed)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check for fixed admin credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const accessToken = generateAccessToken(username, "admin");
    const refreshToken = generateRefreshToken(username);

    // Store the refresh token in the database for future use (optional, can be skipped for fixed admin)
    db.execute(
      "UPDATE employees SET refresh_token = ? WHERE username = ?",
      [refreshToken, username],
      (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error storing refresh token" });
        }

        res.json({
          message: "Admin login successful",
          accessToken,
          refreshToken,
          role: "admin",
          username,
        });
      }
    );
  } else {
    db.execute(
      "SELECT * FROM employees WHERE username = ?",
      [username],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        if (results.length === 0) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        const employee = results[0];

        bcrypt.compare(password, employee.password, (err, isPasswordValid) => {
          if (err) {
            return res.status(500).json({ message: "An error occurred" });
          }

          if (!isPasswordValid) {
            return res
              .status(401)
              .json({ message: "Invalid username or password" });
          }

          const accessToken = generateAccessToken(username, employee.role);
          const refreshToken = generateRefreshToken(username);

          // Store the refresh token in the database
          db.execute(
            "UPDATE employees SET refresh_token = ? WHERE username = ?",
            [refreshToken, username],
            (err) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Error storing refresh token" });
              }

              res.json({
                message: "Login successful",
                accessToken,
                refreshToken,
                role: employee.role,
                username: employee.username,
              });
            }
          );
        });
      }
    );
  }
});

// Refresh Token Route
app.put("/resetPassword/:username", async (req, res) => {
  const { username } = req.params;
  const { newPassword } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const [result] = await db
      .promise()
      .execute("UPDATE employees SET password = ? WHERE username = ?", [
        hashedPassword,
        username,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Return success response with the temporary password only for auto-generated passwords
    res.json({
      message: "Password reset successful",
      temporaryPassword: newPassword, // This will only be shown for auto-generated passwords
    });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

//Reset Password
app.put("/resetPassword/:username", async (req, res) => {
  const { username } = req.params;
  const { newPassword } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const [result] = await db
      .promise()
      .execute("UPDATE employees SET password = ? WHERE username = ?", [
        hashedPassword,
        username,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Return success response with the temporary password
    res.json({
      message: "Password reset successful",
      temporaryPassword: newPassword,
    });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

// Admin route to add a new employee
app.post("/addEmployee", async (req, res) => {
  const { username, password } = req.body;

  // Ensure the admin is logged in (you should verify JWT here)
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token || jwt.decode(token).role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  // Hash the password before storing it
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Failed to hash password" });
    }

    // Add new employee
    db.execute(
      "INSERT INTO employees (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, "employee"],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Failed to add employee", error: err });
        }

        res.status(200).json({ message: "Employee added successfully" });
      }
    );
  });
});

// Admin route to Get all employees
app.get("/employees", (req, res) => {
  // Verify admin authentication
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Fetch employees from database
    db.execute(
      "SELECT id, username, password, role, created_at FROM employees ORDER BY created_at DESC",
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Failed to fetch employees" });
        }
        res.json({ employees: results });
      }
    );
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Delete employee
app.delete("/deleteEmployee/:username", (req, res) => {
  const { username } = req.params;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Delete employee from database
    db.execute(
      "DELETE FROM employees WHERE username = ?",
      [username],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Failed to delete employee" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ message: "Employee deleted successfully" });
      }
    );
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Protected route example (for testing authentication)
app.get("/profile", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    res.json({ message: "Profile data", user: decoded });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});

//---------------Admin Dashboard to add task to employees---------------------------------

// Add task endpoint with validation
app.post("/tasks", async (req, res) => {
  const { assignee_username, client, package, start_date } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Verify employee exists and get their ID
    const [employee] = await db
      .promise()
      .execute("SELECT id FROM employees WHERE username = ?", [
        assignee_username,
      ]);

    if (!employee.length) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Validate package type
    const validPackages = ["Starter", "Premium", "Super Pro"];
    if (!validPackages.includes(package)) {
      return res.status(400).json({ message: "Invalid package type" });
    }

    // Calculate total subtasks based on package
    const packageDetails = {
      Starter: { subtasks: 29 }, // 12 posts + 5 reels + 12 mockups
      Premium: { subtasks: 49 }, // 21 posts + 10 reels + 18 mockups
      "Super Pro": { subtasks: 80 }, // 30 posts + 20 reels + 30 mockups
    };

    const total_subtasks = packageDetails[package].subtasks;

    // Properly format the date
    let formatted_date;
    try {
      // Check if date is in DD-MM-YYYY format
      if (start_date.includes("-")) {
        const [day, month, year] = start_date
          .split("-")
          .map((num) => parseInt(num, 10));
        formatted_date = `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`;
      } else {
        // If date is already in YYYY-MM-DD format
        formatted_date = start_date;
      }

      // Validate the date
      const dateObj = new Date(formatted_date);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date");
      }
    } catch (error) {
      return res
        .status(400)
        .json({
          message:
            "Invalid date format. Please use DD-MM-YYYY or YYYY-MM-DD format",
        });
    }

    // Insert task
    const [result] = await db
      .promise()
      .execute(
        "INSERT INTO tasks (assignee_id, assignee_username, client, package, start_date, total_subtasks) VALUES (?, ?, ?, ?, ?, ?)",
        [
          employee[0].id,
          assignee_username,
          client,
          package,
          formatted_date,
          total_subtasks,
        ]
      );

      // Create a notification for the employee
    await createNotification(
      employee[0].id,
      assignee_username,
      `New task assigned for client ${client}`,
      "task_assigned"
    );

    res.status(201).json({
      message: "Task added successfully",
      taskId: result.insertId,
    });
  } catch (err) {
    console.error("Error adding employee:", err);
    res.status(500).json({ message: "Error adding employee" });
  }
});

// Get tasks with proper error handling
app.get("/tasks", async (req, res) => {
  console.log("Fetching tasks...");
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);

    if (decoded.role !== "admin") {
      console.log("Access denied: Not an admin");
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    console.log("Executing SQL query...");
    const [tasks] = await db.promise().execute(`
      SELECT t.*, e.username as assignee_name 
      FROM tasks t 
      JOIN employees e ON t.assignee_id = e.id 
      ORDER BY t.created_at DESC
    `);

    console.log("Tasks fetched from database:", tasks);

    const formattedTasks = tasks.map((task) => ({
      ...task,
      start_date: format(new Date(task.start_date), "dd-MM-yyyy"),
    }));

    const markAsRead = async (notificationId) => {
      try {
        const response = await axios.put(
          `http://localhost:5000/notifications/${notificationId}/read`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
    
        if (response.data.message === "Notification marked as read") {
          // Refresh notifications
          fetchNotifications();
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    };

    res.json({ tasks: formattedTasks });
  } catch (err) {
    console.error("Error in /tasks endpoint:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { client, package, start_date, total_subtasks, status } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Update task in the database
    db.execute(
      "UPDATE tasks SET client = ?, package = ?, start_date = ?, total_subtasks = ?, status = ? WHERE id = ?",
      [client, package, start_date, total_subtasks, status, id],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Failed to update task" });
        }
        res.json({ message: "Task updated successfully" });
      }
    );
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Delete task from the database
    db.execute("DELETE FROM tasks WHERE id = ?", [id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Failed to delete task" });
      }
      res.json({ message: "Task deleted successfully" });
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

//---------------Employee Side---------------------------------

// Backend: new endpoint to fetch tasks by employee username
app.get("/tasks/employee/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await db.promise().execute(
      `SELECT 
        t.*,
        COALESCE(t.daily_completions, '{}') as daily_completions
      FROM tasks t 
      WHERE t.assignee_username = ? 
      ORDER BY t.created_at DESC`,
      [username]
    );

    // Ensure daily_completions is properly parsed
    const tasks = rows.map((task) => ({
      ...task,
      daily_completions:
        typeof task.daily_completions === "string"
          ? JSON.parse(task.daily_completions)
          : task.daily_completions || {},
    }));

    res.json({ tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// PUT endpoint to allow multiple task type selections
app.put("/tasks/:id/complete", async (req, res) => {
  const { id } = req.params;
  const { completedTasks, date, allCompletions } = req.body;

  try {
    if (!completedTasks || !date) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const [rows] = await db
      .promise()
      .execute("SELECT daily_completions FROM tasks WHERE id = ?", [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update database with all historical completions
    const [updateResult] = await db.promise().execute(
      `UPDATE tasks 
       SET daily_completions = ?
       WHERE id = ?`,
      [JSON.stringify(allCompletions), id]
    );

    // Calculate total completed tasks for progress tracking
    const totalCompleted = Object.values(allCompletions)
      .flatMap((day) => Object.values(day))
      .filter(Boolean).length;

    // Update the completed_subtasks count
    await db.promise().execute(
      `UPDATE tasks 
       SET completed_subtasks = ?
       WHERE id = ?`,
      [totalCompleted, id]
    );

    res.json({
      message: "Task completion updated successfully",
      task: {
        daily_completions: allCompletions,
        completed_subtasks: totalCompleted,
      },
    });
  } catch (err) {
    console.error("Error updating task completion:", err);
    res.status(500).json({ message: "Failed to update task completion" });
  }
});


// Complete package endpoint
app.put("/tasks/:id/complete-package", async (req, res) => {
  const { id } = req.params;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify token and get task details
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get the current task details
    const [task] = await db.promise().execute(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );

    if (!task.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify all required tasks are completed
    const taskData = task[0];
    if (taskData.completed_subtasks < taskData.total_subtasks) {
      return res.status(400).json({ 
        message: "Cannot complete package - not all required tasks are finished",
        completed: taskData.completed_subtasks,
        required: taskData.total_subtasks
      });
    }

    // Update task status to completed
    const [updateResult] = await db.promise().execute(
      `UPDATE tasks 
       SET status = 'Completed',
           completed_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [id]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error('Failed to update task status');
    }

    // Create a completion notification
    await createNotification(
      taskData.assignee_id,
      taskData.assignee_username,
      `Package completed for client ${taskData.client}`,
      'completion'
    );

    res.json({
      message: "Package marked as completed successfully",
      taskId: id
    });

  } catch (err) {
    console.error("Error completing package:", err);
    res.status(500).json({ 
      message: "Failed to complete package",
      error: err.message 
    });
  }
});


// ---------------------------Function to create a notification------------------------------------------
const createNotification = async (userId, username, message, type) => {
  try {
    console.log("Creating notification with params:", { userId, username, message, type });
    
    // Create notification for the employee
    const [result] = await db.promise().execute(
      "INSERT INTO notifications (user_id, username, message, type) VALUES (?, ?, ?, ?)",
      [userId, username, message, type]
    );

    // Create notification for the admin
    const [admin] = await db.promise().execute(
      "SELECT id FROM employees WHERE role = 'admin' LIMIT 1"
    );

    if (admin.length > 0) {
      await db.promise().execute(
        "INSERT INTO notifications (user_id, username, message, type) VALUES (?, ?, ?, ?)",
        [admin[0].id, 'admin', message, type]
      );
    }

    console.log("Notification created successfully:", result);
    return result.insertId;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Helper function to format date to YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

// Function to check deadlines and create notifications
const checkDeadlinesAndNotify = async () => {
  try {
    console.log("Checking deadlines and creating notifications...");
    const [tasks] = await db.promise().execute(`
      SELECT t.*, e.id as employee_id, e.username
      FROM tasks t
      JOIN employees e ON t.assignee_id = e.id
      WHERE t.status = 'Pending'
    `);

    const currentDate = new Date();

    for (const task of tasks) {
      const endDate = new Date(task.start_date);
      endDate.setDate(endDate.getDate() + 30); // Assuming a 30-day deadline

      // Check for overdue tasks
      if (endDate < currentDate) {
        console.log(`Creating overdue notification for task ${task.id} (${task.client})`);
        await createNotification(
          task.employee_id,
          task.username,
          `You have incomplete tasks from ${task.start_date} for client ${task.client}.`,
          "overdue"
        );

        // Notify admin
        const [admin] = await db.promise().execute("SELECT id FROM employees WHERE role = 'admin' LIMIT 1");
        if (admin.length > 0) {
          console.log(`Creating overdue notification for admin`);
          await createNotification(
            admin[0].id,
            "admin",
            `Overdue task for ${task.username} (Client: ${task.client})`,
            "overdue"
          );
        }
      }

      // Check for approaching deadlines (within 3 days)
      if (endDate - currentDate <= 3 * 24 * 60 * 60 * 1000 && endDate >= currentDate) {
        console.log(`Creating deadline notification for task ${task.id} (${task.client})`);
        await createNotification(
          task.employee_id,
          task.username,
          `Your task deadline is approaching for client ${task.client}. Due: ${endDate.toISOString().split('T')[0]}`,
          "deadline"
        );

        // Notify admin
        const [admin] = await db.promise().execute("SELECT id FROM employees WHERE role = 'admin' LIMIT 1");
        if (admin.length > 0) {
          console.log(`Creating deadline notification for admin`);
          await createNotification(
            admin[0].id,
            "admin",
            `Approaching deadline for ${task.username} (Client: ${task.client})`,
            "deadline"
          );
        }
      }
    }
  } catch (error) {
    console.error("Error checking deadlines:", error);
  }
};

// Run the deadline check every hour
setInterval(checkDeadlinesAndNotify, 60 * 60 * 1000);

// Modified notifications endpoint with enhanced error handling
app.get("/notifications", async (req, res) => {
  const username = req.query.username;
  const token = req.headers["authorization"]?.split(" ")[1];

  console.log("Notifications request received for username:", username);
  console.log("Token present:", !!token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", { role: decoded.role, username: decoded.username });

    // Validate username
    if (!username) {
      return res.status(400).json({ message: "Username parameter is required" });
    }

    // Debug log for query parameters
    console.log("Querying notifications for:", {
      username,
      userRole: decoded.role
    });

    // Construct query based on role
    let query;
    let queryParams;

    if (decoded.role === "admin") {
      query = `
        SELECT 
          n.*,
          DATE_FORMAT(n.created_at, '%Y-%m-%d %H:%i:%s') as formatted_date 
        FROM notifications n 
        WHERE n.username = ? OR n.username = 'admin'
        ORDER BY n.created_at DESC 
        LIMIT 50`;
      queryParams = [username];
    } else {
      query = `
        SELECT 
          n.*,
          DATE_FORMAT(n.created_at, '%Y-%m-%d %H:%i:%s') as formatted_date 
        FROM notifications n 
        WHERE n.username = ? 
        ORDER BY n.created_at DESC 
        LIMIT 50`;
      queryParams = [username];
    }

    // Debug log the query
    console.log("Executing query:", query);
    console.log("With parameters:", queryParams);

    // Execute query
    const [notifications] = await db.promise().execute(query, queryParams);
    
    console.log("Query results:", {
      count: notifications.length,
      firstNotification: notifications[0] || null
    });

    // Send response
    res.json({
      success: true,
      notifications,
      metadata: {
        total: notifications.length,
        userRole: decoded.role,
        timestamp: new Date().toISOString(),
        query: {
          username,
          role: decoded.role
        }
      }
    });
  } catch (error) {
    console.error("Error in /notifications endpoint:", error);
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
      details: {
        username,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Add a test endpoint to create a notification
app.post("/debug/create-test-notification", async (req, res) => {
  const { username } = req.body;
  
  try {
    // Get user ID from username
    const [users] = await db.promise().execute(
      "SELECT id FROM employees WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a test notification
    const [result] = await db.promise().execute(
      "INSERT INTO notifications (user_id, username, message, type) VALUES (?, ?, ?, ?)",
      [users[0].id, username, "Test notification", "deadline"]
    );

    res.json({
      success: true,
      message: "Test notification created",
      notificationId: result.insertId
    });
  } catch (error) {
    console.error("Error creating test notification:", error);
    res.status(500).json({ message: "Failed to create test notification", error: error.message });
  }
});

// Mark notification as read
app.put("/notifications/:id/read", async (req, res) => {
  const { id } = req.params;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Update notification read status
    const [result] = await db.promise().execute(
      "UPDATE notifications SET read_status = TRUE WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});

// First, let's add a debug endpoint to check the database connection
app.get("/debug/db-status", async (req, res) => {
  try {
    const [result] = await db.promise().execute("SELECT 1");
    res.json({ status: "Database connection is working", result });
  } catch (error) {
    console.error("Database connection test failed:", error);
    res.status(500).json({
      status: "Database connection failed",
      error: error.message,
    });
  }
});



// Helper function to check if notifications table exists
const checkNotificationsTable = async () => {
  try {
    const [tables] = await db.promise().execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'TaskFlowApp' 
      AND TABLE_NAME = 'notifications'
    `);

    if (tables.length === 0) {
      console.log("Notifications table does not exist. Creating it...");
      await db.promise().execute(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          username VARCHAR(255),
          message TEXT NOT NULL,
          type ENUM('deadline', 'overdue', 'completion', 'package_end') NOT NULL,
          read_status BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE
        )
      `);
      console.log("Notifications table created successfully");
    }
  } catch (error) {
    console.error("Error checking/creating notifications table:", error);
    throw error;
  }
};

// Run table check when server starts
checkNotificationsTable().catch(console.error);
