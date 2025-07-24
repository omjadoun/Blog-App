# 🚀 DevBlog — A Full-Stack Developer-Centric Blogging Platform

**DevBlog** is a modern, full-featured blogging application designed specifically for developers. It allows users to create, manage, and publish blog content with ease, offering a smooth and secure user experience. Powered by **React.js** and **Appwrite**, and enhanced with **TinyMCE** for a rich writing experience, this platform is built for performance, scalability, and ease of use.

---

## ✅ Core Functionality

Users can effortlessly:

- ✍️ **Create** new blog posts with rich text and images  
- 🛠️ **Edit** existing blog posts anytime  
- 👀 **View** all posts in a clean, responsive layout  
- 🧹 **Delete** posts permanently with confirmation  
- 🔎 **Search** blog posts (coming soon)

---

## 🔐 Authentication & Authorization

Integrated with **Appwrite Authentication**:

- 🔑 **Register** using email & password  
- 🔒 **Login** securely  
- 🚪 **Logout** anytime  
- 🧑‍💻 Protected routes for logged-in users only  
- 🛡️ Session-based login system

---

## 🖼️ Content Creation with Rich Media

- 📝 **TinyMCE Rich Text Editor** for formatting blog content  
- 📸 **Direct Image Uploads** into the editor via Appwrite's Storage API  
- 👁️ **Live Preview** of formatted posts while writing  

---

## 🧱 Tech Stack

| Technology | Description |
|------------|-------------|
| **React.js** | Frontend UI built with reusable components |
| **HTML/CSS** | Semantic HTML and responsive CSS styling |
| **Appwrite** | Backend-as-a-Service for database, auth, and file storage |
| **TinyMCE** | WYSIWYG rich-text editor with media support |
| **Vercel** | CI/CD and deployment platform |

---

## ✨ Features

- 🔐 Full authentication (Sign Up, Login, Logout)
- 📝 Blog post creation with formatting
- 🧾 Real-time **CRUD operations** (Create, Read, Update, Delete)
- 📸 Image uploads stored securely with Appwrite
- 🌓 Clean, responsive, mobile-first UI
- 🧰 Developer-friendly code structure
- 💬 More features planned soon...

---

## 🌐 Live Demo

👉 [Live App](https://blog-app-beta-umber.vercel.app)

---

## 💻 Source Code

📂 [GitHub Repository](https://github.com/omjadoun/Blog-App)

---

## ⚙️ Getting Started

### 🔧 Prerequisites

- Node.js and npm installed
- Appwrite account with a project set up

### 📦 Installation

```bash
git clone https://github.com/omjadoun/Blog-App.git
cd Blog-App
npm install
npm run dev
