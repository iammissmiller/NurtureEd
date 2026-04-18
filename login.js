import { loginUser, registerUser } from "./auth.js";

document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) return alert("Please fill in all fields.");

  try {
    await loginUser(email, password);
    // auth-state.js handles redirect once Firebase confirms login
  } catch (err) {
    console.error(err);
    alert("Login failed: " + err.message);
  }
};

document.getElementById("registerBtn").onclick = async () => {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  if (!name || !email || !password) return alert("Please fill in all fields.");

  try {
    await registerUser(name, email, password);
    alert("Student account created! They can now log in.");
    // Switch back to login tab
    document.getElementById("regName").value = "";
    document.getElementById("regEmail").value = "";
    document.getElementById("regPassword").value = "";
  } catch (err) {
    console.error(err);
    alert("Registration failed: " + err.message);
  }
};
