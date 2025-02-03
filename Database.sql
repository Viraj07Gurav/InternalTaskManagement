CREATE DATABASE IF NOT EXISTS TaskFlowApp;

USE TaskFlowApp;

/*Employee Table is Created which stores the id,username,password,role,created_at */

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/*Employees to store the refresh token */
ALTER TABLE employees ADD COLUMN refresh_token VARCHAR(255);


USE TaskFlowApp;

SELECT * FROM employees;


USE TaskFlowApp;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignee_id INT NOT NULL, -- Foreign key to employees table
  assignee_username VARCHAR(255) NOT NULL, -- Assignee's username
  client VARCHAR(255) NOT NULL,
  package VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  status ENUM('Pending', 'Completed') DEFAULT 'Pending',
  completed_subtasks INT DEFAULT 0,
  total_subtasks INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignee_id) REFERENCES employees(id) ON DELETE CASCADE
);

ALTER TABLE tasks ADD COLUMN daily_completions JSON;

ALTER TABLE tasks 
MODIFY COLUMN daily_completions JSON NULL;




ALTER TABLE tasks 
ADD INDEX idx_assignee_username (assignee_username);


SELECT * FROM tasks;


SELECT * FROM tasks WHERE assignee_username = 'prem' ORDER BY created_at DESC;

SHOW TABLES;

DESCRIBE tasks;





-- for testing

SELECT * FROM tasks WHERE assignee_username = 'prem';

SELECT 
    assignee_username, 
    package, 
    COUNT(*) AS completed_tasks
FROM 
    tasks
WHERE 
    assignee_username = 'prem'  -- Specify the employee's username
    AND start_date >= '2025-01-31'  -- Start date (you can adjust this)
    AND start_date <= '2025-02-02'  -- End date (you can adjust this)
    AND status = 'Pending'  -- Only completed tasks
GROUP BY 
    assignee_username, package
ORDER BY 
    completed_tasks DESC;


SELECT * 
FROM tasks 
WHERE assignee_username = 'prem' 
    AND start_date BETWEEN '2025-01-31' AND '2025-02-02' 
    AND status = 'Pending';


