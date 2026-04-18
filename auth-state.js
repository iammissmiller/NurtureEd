import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  const path = window.location.pathname;

  if (!user) {
    // Only redirect AFTER Firebase confirms no user
    if (!path.includes("login.html")) {
      window.location.href = "login.html";
    }
    return;
  }

  const uid = user.uid;

  try {
    const userDoc = await getDoc(doc(db, "users", uid));

    if (!userDoc.exists()) {
      console.error("User doc missing in Firestore for uid:", uid);
      return;
    }

    const role = userDoc.data().role.toLowerCase();

    console.log("RAW ROLE:", userDoc.data().role);
    console.log("LOWER:", role);

    // Redirect away from login page based on role
    if (path.includes("login.html")) {
      if (role === "teacher") {
        window.location.href = "teacher.html";
      } else {
        window.location.href = "index.html";
      }
      return;
    }

    // Protect teacher page from non-teachers
    if (path.includes("teacher.html") && role !== "teacher") {
      window.location.href = "index.html";
    }

  } catch (err) {
    console.error("Auth state error:", err);
  }
});