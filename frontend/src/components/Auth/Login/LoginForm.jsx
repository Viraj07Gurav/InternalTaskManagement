import React, { useState } from "react";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useSessionContext } from "../../../Context/SessionContext";

const LoginForm = ({ userRole }) => {
  const { login } = useSessionContext(); // Access login from context

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true); // Toggle password visibility
  const [formData, setFormData] = useState({
    username: "", // Username state
  });
  const [errors, setErrors] = useState({
    username: "", // Username error state
  });

  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Handle input change for username and password
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  // Check if password and username are entered (not empty)
  const isPasswordEntered = password.length > 0;
  const isUsernameEntered = formData.username.length > 0;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isUsernameEntered || !isPasswordEntered) {
      setErrors({ username: "Username and password are required" });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the access token and refresh token in context or local storage
        login(data.accessToken, data.refreshToken, data.role, data.username);

        // Navigate based on role
        if (data.role === "admin") {
          navigate("/dashboard"); // Admin dashboard
        } else if (data.role === "employee") {
          navigate("/dashboard"); // Employee dashboard
        }
      } else {
        setErrors({ username: data.message });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrors({ username: "An error occurred. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username" // Change label text to Username
        placeholder="Enter your username"
        name="username" // Update the name to "username"
        value={formData.username} // Update the value to formData.username
        onChange={handleChange}
        error={errors.username} // Display error message if username is invalid
      />

      <div className="space-y-6">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "password" : "text"} // Toggle visibility based on showPassword state
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}{" "}
            {/* Toggle Eye icon */}
          </button>
        </div>

        <Button
          variant="primary"
          className="w-full text-center"
          type="submit"
          disabled={!isUsernameEntered || !isPasswordEntered} // Disable the button if either field is empty
          style={{
            opacity: isUsernameEntered && isPasswordEntered ? 1 : 0.5,
            cursor: isUsernameEntered && isPasswordEntered ? "pointer" : "not-allowed",
          }}
        >
          Login
        </Button>
      </div>

      {errors.username && <div className="text-red-500">{errors.username}</div>}
    </form>
  );
};

export default LoginForm;
