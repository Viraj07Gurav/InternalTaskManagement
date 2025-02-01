
export const calculateTimeLeftUntilEndOfDay = () => {
    const now = new Date(); // Current time
    const endOfDay = new Date(); // End of day (23:59:59)
    endOfDay.setHours(23, 59, 59, 999); // Set to end of day
  
    const timeLeft = endOfDay - now; // Difference in milliseconds
  
    // Convert milliseconds to hours, minutes, and seconds
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
    return `${hours}h ${minutes}m ${seconds}s`;
  };