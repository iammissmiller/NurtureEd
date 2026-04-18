import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Pages that don't require login
const PUBLIC_PAGES = ["index.html", "login.html"];

onAuthStateChanged(auth, async (user) => {
  const path = window.location.pathname;
  const isPublic = PUBLIC_PAGES.some(p => path.includes(p)) || path === "/" || path.endsWith("/");

  if (!user) {
    // If not logged in and on a protected page, send to login
    if (!isPublic) {
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

    const role = userDoc.data().role.toLowerCase().replace(/^["']|["']$/g, "");

    console.log("CLEANED ROLE:", role);

    // If logged in and on login page, redirect to their dashboard
    if (path.includes("login.html")) {
      window.location.href = role === "teacher" ? "teacher.html" : "student.html";
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
