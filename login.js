import { loginUser, registerUser } from "./auth.js";

document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await loginUser(email, password);
    // auth-state.js will handle redirect once Firebase confirms auth
  } catch (err) {
    console.error(err);
    alert("Login failed: " + err.message);
  }
};

document.getElementById("registerBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name") ? document.getElementById("name").value : "Student";

  try {
    await registerUser(name, email, password);
    alert("Registered! You can now log in.");
  } catch (err) {
    console.error(err);
    alert("Registration failed: " + err.message);
  }
};