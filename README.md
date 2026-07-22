# Adkar_Garden-versionWeb-
# 🌸 Adkar Garden | حديقة الأذكار 🌿

> A lightweight, elegant Arabic Adkar counter web application with customizable lists, daily/lifetime tracking, automated reminders, and local JSON/CSV import & export capabilities.

![Version](https://img.shields.io/badge/version-1.0.0-purple.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Language](https://img.shields.io/badge/language-HTML%2FCSS%2FJS-orange.svg)

---

## ✨ Features

* **📿 Dynamic Adkar Counter:** Easily track daily and lifetime dhikr repetitions with automatic midnight resets.
* **⏰ Hourly Reminders:** Automated hourly pop-up notifications displaying a randomly chosen dhikr.
* **✍️ Custom Dhikr Addition:** Add custom phrases with built-in validation for modern Arabic text.
* **📁 JSON & CSV File Support:** 
  * Import custom dhikr lists from standard `.json` or `.csv` files.
  * Export your personal dhikr collection to `.csv` for offline backups.
* **📱 Desktop & Mobile Responsive:** Clean dark-mode UI styled with modern gradients and responsive controls.
* **🔒 Privacy-Focused & Offline First:** Uses browser `localStorage` to keep all user progress strictly on the device.

---

## 🛠️ Built With

* **HTML5** — Native RTL (Right-to-Left) structural layout.
* **CSS3** — Custom styled dark-theme (`#232345`), linear gradients, and CSS grid/flexbox.
* **JavaScript (Vanilla)** — LocalStorage API, FileReader API, Blob file generation, and DOM manipulation.

---

## 📂 Data & File Integration

In web browser environments, direct filesystem read/writes are restricted for security. This app solves data handling via standard web-native formats:

| Format | Role | Description |
| :--- | :--- | :--- |
| **`adkar.json`** | Initial Load | Fetched via the modern `fetch()` API on startup to supply default options. |
| **`localStorage`** | Persistence | Saves daily count, lifetime total, and current date locally inside the browser. |
| **`JSON / CSV`** | File Import | Handled using `FileReader API` so users can upload their custom lists. |
| **`CSV Export`** | File Export | Generated client-side using UTF-8 `Blob` objects for cross-platform compatibility. |

---

## 🚀 Getting Started

### Option 1: Run Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/adkar-garden.git](https://github.com/your-username/adkar-garden.git)
   cd adkar-garden
