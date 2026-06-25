# 🎓 Student Enrollment Form

A web-based student enrollment management system built with JSONPowerDB, allowing users to **insert** and **update** student records in real time.

---

## 📋 Description

This form interfaces directly with **JSONPowerDB (JPDB)** to manage student records stored in `SCHOOL-DB → STUDENT-TABLE`. It supports looking up existing students by Roll No and saving or updating their details — all without a traditional backend server.

---

## 🛠️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | HTML5, Bootstrap 5                |
| Scripting   | JavaScript (ES5), jQuery 3.6      |
| Database    | JSONPowerDB (login2explore.com)   |
| API Style   | REST (IRL for reads, IML for writes) |

---

## ✨ Features

- **Search by Roll No** — looks up an existing student via `GET_BY_KEY`
- **Save** — inserts a new record with `PUT` if Roll No is not found
- **Update** — edits an existing record with `UPDATE` using the internal record number
- **Reset** — clears the form and returns to the initial state
- Smart button states — Save, Update, and Reset enable/disable automatically based on context
- Inline status messages for user feedback

---

## 📁 Project Structure

```
├── index.html   # UI — Bootstrap 5 form layout and styling
├── index.js     # Logic — JPDB request builders, search, save, update, reset
└── README.md
```

---

## 🚀 Getting Started

1. Clone or download the repository.
2. Open `index.html` directly in a browser — no build step or server required.
3. Enter a Roll No and press **Enter** or click **Search**.
   - If the Roll No is **new** → fill in details and click **Save**.
   - If the Roll No **exists** → edit fields and click **Update**.

> ⚠️ The app communicates with `http://api.login2explore.com:5577` over plain HTTP. Ensure your browser allows mixed-content requests, or serve the file via HTTP (not `file://`).

---

## 🗃️ Database Schema

| Field            | Type   | Role        |
|------------------|--------|-------------|
| Roll-No          | String | Primary Key |
| Full-Name        | String |             |
| Class            | String |             |
| Birth-Date       | Date   |             |
| Address          | String |             |
| Enrollment-Date  | Date   |             |

**Database:** `SCHOOL-DB` &nbsp;|&nbsp; **Relation:** `STUDENT-TABLE`

---

## 📜 License

This project is intended for educational purposes.
