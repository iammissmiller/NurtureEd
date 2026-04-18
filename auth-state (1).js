import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const PUBLIC_PAGES = ["index.html", "login.html"];

onAuthStateChanged(auth, async (user) => {
  const path = window.location.pathname;
  const isPublic = PUBLIC_PAGES.some(p => path.includes(p)) || path === "/" || path.endsWith("/");

  if (!user) {
    if (!isPublic) window.location.href = "login.html";
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return;

    const role = snap.data().role.replace(/['"]/g, "").toLowerCase();

    // ── FROM LOGIN PAGE ──────────────────────────────────────────
    if (path.includes("login.html")) {
      if (role === "teacher") window.location.href = "class-setup.html";
      else                    window.location.href = "student.html";
      return;
    }

    // ── ROLE GUARDS (no extra redirects beyond these) ────────────
    // Non-teachers blocked from teacher pages
    const teacherPages = ["teacher.html", "class-setup.html"];
    if (teacherPages.some(p => path.includes(p)) && role !== "teacher") {
      window.location.href = "student.html";
      return;
    }

    // Teachers blocked from student page
    if (path.includes("student.html") && role === "teacher") {
      window.location.href = "class-setup.html";
      return;
    }

    // ── TEACHER ON teacher.html: restore sessionStorage if empty ─
    // This handles page refresh without re-running class-setup
    if (path.includes("teacher.html") && role === "teacher") {
      if (!sessionStorage.getItem("classId")) {
        // Try to restore from Firestore classId on user doc
        const classId = snap.data().classId;
        if (classId) {
          const classSnap = await getDoc(doc(db, "classes", classId));
          if (classSnap.exists()) {
            const d = classSnap.data();
            sessionStorage.setItem("classId",      classId);
            sessionStorage.setItem("className",    d.className  || "");
            sessionStorage.setItem("section",      d.section    || "");
            sessionStorage.setItem("studentCount", d.studentCount || "");
          }
        } else {
          // No class ever created → send to setup
          window.location.href = "class-setup.html";
        }
      }
      return;
    }

    // ── TEACHER ON class-setup.html: skip if class already exists ─
    // Prevents double class-setup when navigating back
    if (path.includes("class-setup.html") && role === "teacher") {
      const classId = snap.data().classId;
      if (classId && sessionStorage.getItem("classId")) {
        // Class already set up this session — go straight to dashboard
        window.location.href = "teacher.html";
      }
      // else: let them set up normally
      return;
    }

  } catch(err) {
    console.error("Auth state error:", err);
  }
});
