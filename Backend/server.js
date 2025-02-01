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





const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const { format } = require('date-fns');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
}));


const JWT_SECRET = "your_jwt_secret_key";
const REFRESH_SECRET = "your_refresh_secret_key";  // Secret for refresh tokens



// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",        
  user: "root",            
  password: "1020",            
  database: "TaskFlowApp",   
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
  return jwt.sign({ username, role }, JWT_SECRET, { expiresIn: "1d" }); // Short-lived access token
};

const generateRefreshToken = (username) => {
  return jwt.sign({ username }, REFRESH_SECRET, { expiresIn: "7d" }); // Long-lived refresh token
};

// Login route
// Admin credentials (username and password fixed)
const ADMIN_USERNAME = "admin";  
const ADMIN_PASSWORD = "adminpassword";  // Use a hashed password in production, not plain text

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
          return res.status(500).json({ message: "Error storing refresh token" });
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
          return res.status(500).json({ message: "Database error", error: err });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: "Invalid username or password" });
        }

        const employee = results[0];

        bcrypt.compare(password, employee.password, (err, isPasswordValid) => {
          if (err) {
            return res.status(500).json({ message: "An error occurred" });
          }

          if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
          }

          const accessToken = generateAccessToken(username, employee.role);
          const refreshToken = generateRefreshToken(username);

          // Store the refresh token in the database
          db.execute(
            "UPDATE employees SET refresh_token = ? WHERE username = ?",
            [refreshToken, username],
            (err) => {
              if (err) {
                return res.status(500).json({ message: "Error storing refresh token" });
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
    const [result] = await db.promise().execute(
      "UPDATE employees SET password = ? WHERE username = ?",
      [hashedPassword, username]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Return success response with the temporary password only for auto-generated passwords
    res.json({ 
      message: "Password reset successful",
      temporaryPassword: newPassword  // This will only be shown for auto-generated passwords
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
    const [result] = await db.promise().execute(
      "UPDATE employees SET password = ? WHERE username = ?",
      [hashedPassword, username]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Return success response with the temporary password
    res.json({ 
      message: "Password reset successful",
      temporaryPassword: newPassword
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
    db.execute("INSERT INTO employees (username, password, role) VALUES (?, ?, ?)", 
    [username, hashedPassword, "employee"], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Failed to add employee", error: err });
      }

      res.status(200).json({ message: "Employee added successfully" });
    });
  });
});


// Admin route to Get all employees
app.get('/employees', (req, res) => {
  // Verify admin authentication
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Fetch employees from database
    db.execute(
      'SELECT id, username, password, role, created_at FROM employees ORDER BY created_at DESC',
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Failed to fetch employees' });
        }
        res.json({ employees: results });
      }
    );
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Delete employee
app.delete('/deleteEmployee/:username', (req, res) => {
  const { username } = req.params;
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Delete employee from database
    db.execute(
      'DELETE FROM employees WHERE username = ?',
      [username],
      (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Failed to delete employee' });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.json({ message: 'Employee deleted successfully' });
      }
    );
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
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
    const [employee] = await db.promise().execute(
      "SELECT id FROM employees WHERE username = ?",
      [assignee_username]
    );

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
      if (start_date.includes('-')) {
        const [day, month, year] = start_date.split('-').map(num => parseInt(num, 10));
        formatted_date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      } else {
        // If date is already in YYYY-MM-DD format
        formatted_date = start_date;
      }

      // Validate the date
      const dateObj = new Date(formatted_date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid date format. Please use DD-MM-YYYY or YYYY-MM-DD format" });
    }

    // Insert task
    const [result] = await db.promise().execute(
      "INSERT INTO tasks (assignee_id, assignee_username, client, package, start_date, total_subtasks) VALUES (?, ?, ?, ?, ?, ?)",
      [employee[0].id, assignee_username, client, package, formatted_date, total_subtasks]
    );

    res.status(201).json({ 
      message: "Task added successfully", 
      taskId: result.insertId 
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

    const formattedTasks = tasks.map(task => ({
      ...task,
      start_date: format(new Date(task.start_date), 'dd-MM-yyyy')
    }));

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
    db.execute(
      "DELETE FROM tasks WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Failed to delete task" });
        }
        res.json({ message: "Task deleted successfully" });
      }
    );
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
    const tasks = rows.map(task => ({
      ...task,
      daily_completions: typeof task.daily_completions === 'string' 
        ? JSON.parse(task.daily_completions)
        : (task.daily_completions || {})
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
  const { completedTasks, date } = req.body;

  try {
    // Validate input
    if (!completedTasks || !date) {
      return res.status(400).json({ 
        message: "Missing required fields",
        receivedData: { completedTasks, date }
      });
    }

    const [rows] = await db.promise().execute(
      "SELECT daily_completions, total_subtasks FROM tasks WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    let dailyCompletions = {};
    try {
      dailyCompletions = rows[0].daily_completions 
        ? JSON.parse(rows[0].daily_completions) 
        : {};
    } catch (parseError) {
      console.error("Failed to parse daily_completions:", parseError);
      dailyCompletions = {};
    }

    // Ensure date entry exists with default structure
    dailyCompletions[date] = dailyCompletions[date] || {
      posts: false,
      reels: false,
      mockups: false
    };

    // Merge completions, prioritizing existing true values
    dailyCompletions[date] = {
      posts: dailyCompletions[date].posts || completedTasks.posts || false,
      reels: dailyCompletions[date].reels || completedTasks.reels || false,
      mockups: dailyCompletions[date].mockups || completedTasks.mockups || false
    };

    // Recalculate total completed subtasks
    let totalCompleted = Object.values(dailyCompletions)
      .flatMap(day => Object.values(day))
      .filter(Boolean).length;

    // Update database
    const [updateResult] = await db.promise().execute(
      `UPDATE tasks 
       SET daily_completions = ?,
           completed_subtasks = ?
       WHERE id = ?`,
      [JSON.stringify(dailyCompletions), totalCompleted, id]
    );

    res.json({
      message: "Task completion updated successfully",
      task: { daily_completions: dailyCompletions }
    });

  } catch (err) {
    console.error("Detailed error updating task completion:", {
      message: err.message,
      stack: err.stack,
      requestBody: { completedTasks, date }
    });

    res.status(500).json({ 
      message: "Failed to update task completion", 
      error: err.message,
      details: err.stack
    });
  }
});
