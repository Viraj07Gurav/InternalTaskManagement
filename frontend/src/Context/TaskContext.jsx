import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSessionContext } from './SessionContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [taskMetrics, setTaskMetrics] = useState({
    totalTasks: 0,
    totalSubtasks: 0,
    pendingSubtasks: 0,
    completedSubtasks: 0,
    dailyTasksTotal: 0,
    dailyTasksCompleted: 0
  });
  const { accessToken, username, role } = useSessionContext();
  const today = new Date().toISOString().split('T')[0];

  // Calculate metrics whenever tasks change
  const updateMetrics = (currentTasks) => {
    const metrics = {
      totalTasks: currentTasks.length,
      totalSubtasks: 0,
      completedSubtasks: 0,
      dailyTasksTotal: 0,
      dailyTasksCompleted: 0
    };

    currentTasks.forEach((task) => {
      metrics.totalSubtasks += task.totalSubtasks || task.total_subtasks || 0;
      metrics.completedSubtasks += task.completedSubtasks || task.completed_subtasks || 0;

      const todayTasks = task.dailyCompletions?.[today] || {};
      metrics.dailyTasksTotal += Object.keys(todayTasks).length;
      metrics.dailyTasksCompleted += Object.values(todayTasks).filter(Boolean).length;
    });

    metrics.pendingSubtasks = metrics.totalSubtasks - metrics.completedSubtasks;
    setTaskMetrics(metrics);
  };

  // Fetch tasks based on user role
  const fetchTasks = async () => {
    try {
      const endpoint = role === 'admin'
        ? 'http://localhost:5000/tasks'
        : `http://localhost:5000/tasks/employee/${username}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch tasks');

      const data = await response.json();
      const processedTasks = data.tasks.map(task => ({
        ...task,
        dailyCompletions: task.dailyCompletions || {
          [today]: {
            posts: false,
            reels: false,
            mockups: false
          }
        }
      }));

      setTasks(processedTasks);
      updateMetrics(processedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Handle task completion updates
  const handleTaskCompletion = async (taskId, taskType) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedCompletions = {
        ...task.dailyCompletions?.[today],
        [taskType]: !task.dailyCompletions?.[today]?.[taskType]
      };

      const response = await fetch(`http://localhost:5000/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          completedTasks: updatedCompletions,
          date: today
        })
      });

      if (!response.ok) throw new Error('Failed to update task');

      // Update local state
      const updatedTasks = tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            dailyCompletions: {
              ...t.dailyCompletions,
              [today]: updatedCompletions
            },
            completed_subtasks: Object.values(updatedCompletions).filter(Boolean).length
          };
        }
        return t;
      });

      setTasks(updatedTasks);
      updateMetrics(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  useEffect(() => {
    if (accessToken && (username || role === 'admin')) {
      fetchTasks();
    }
  }, [accessToken, username, role]);

  return (
    <TaskContext.Provider value={{
      tasks,
      setTasks,
      taskMetrics,
      handleTaskCompletion,
      fetchTasks,
      updateMetrics
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;