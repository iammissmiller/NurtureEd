import { db } from "./firebase-config.js";
import { auth } from "./firebase-config.js";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function isCodeTaken(code) {
  const snap = await getDoc(doc(db, "classes", code));
  return snap.exists();
}

window.createClass = async function () {
  const className = document.getElementById("className").value.trim();
  if (!className) {
    alert("Please enter a class name.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to create a class.");
    return;
  }

  const btn = document.getElementById("createClassBtn");
  btn.disabled = true;
  btn.textContent = "Creating…";

  try {
    let code;
    let exists = true;

    while (exists) {
      code = generateCode();
      exists = await isCodeTaken(code);
    }

    // Write class doc — code is the document ID for fast lookup
    await setDoc(doc(db, "classes", code), {
      className,
      teacherUid: user.uid,
      students: [],
      createdAt: Date.now()
    });

    // Also store the classId on the teacher's own user doc
    await updateDoc(doc(db, "users", user.uid), {
      classId: code
    });

    // Show the generated code in the UI
    document.getElementById("classCodeDisplay").innerHTML =
      `Class <strong>${className}</strong> created!
       <br>Share this code with your students:
       <span class="class-code-badge">${code}</span>`;

    document.getElementById("className").value = "";

  } catch (err) {
    console.error("Class creation failed:", err);
    alert("Failed to create class: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Create Class";
  }
};
