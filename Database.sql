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
    ADD INDEX idx_start_date (start_date),
    ADD INDEX idx_status (status),
    ADD INDEX idx_package (package);
    
ALTER TABLE tasks 
ADD COLUMN total_posts_completed INT DEFAULT 0,
ADD COLUMN total_reels_completed INT DEFAULT 0,
ADD COLUMN total_mockups_completed INT DEFAULT 0;

ALTER TABLE tasks 
MODIFY COLUMN daily_completions JSON NULL;


DESCRIBE tasks;
DESCRIBE employees;


ALTER TABLE tasks 
ADD INDEX idx_assignee_username (assignee_username);

ALTER TABLE tasks
ADD COLUMN completed_at TIMESTAMP NULL;


SELECT * FROM tasks;


CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    username VARCHAR(255),
    message TEXT NOT NULL,
    type ENUM('deadline', 'overdue', 'completion', 'package_end') NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE
);




SELECT * FROM notifications;


SELECT * FROM tasks WHERE assignee_username = 'prem' ORDER BY created_at DESC;

SHOW TABLES;

DESCRIBE tasks;


-- Check if the table exists
DESCRIBE notifications;

-- Insert sample data for testing
INSERT INTO notifications (user_id, username, message, type, read_status)
VALUES 
  (26, 'prem', 'Test notification for employee', 'deadline', FALSE);
 

-- Fetch all notifications
SELECT * FROM notifications;





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
    AND start_date >= '2025-01-01'  -- Start date (you can adjust this)
    AND start_date <= '2025-02-03'  -- End date (you can adjust this)
    AND status = 'Pending'  -- Only completed tasks
GROUP BY 
    assignee_username, package
ORDER BY 
    completed_tasks DESC;


SELECT daily_completions
FROM tasks 
WHERE assignee_username = 'prem' 
    AND start_date BETWEEN '2025-01-01' AND '2025-02-03' 
    AND status = 'Pending';


