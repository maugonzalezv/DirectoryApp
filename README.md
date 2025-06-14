# 📇 Contact Directory Application

A **modern, full-stack contact management system** designed for efficient personal and professional contact organization. This application provides a seamless experience for managing contacts with advanced features like search, filtering, favorites, and responsive design.

## 🎯 What It Does

The Contact Directory Application is a comprehensive contact management solution that allows users to:

- **Store and organize contacts** with complete information (personal, professional, and address details)
- **Search and filter** contacts instantly across multiple fields (name, phone, email, company)
- **Mark favorites** with persistent storage for quick access to important contacts
- **Sort contacts** alphabetically by any field (ascending/descending)
- **Navigate with pagination** for large contact lists with URL-shareable states
- **Manage contacts** with full CRUD operations (Create, Read, Update, Delete)
- **Access from any device** with responsive design optimized for mobile, tablet, and desktop

## 🛠️ How It Works

### **Architecture**

- **Frontend**: Single Page Application (SPA) built with React and TypeScript
- **Backend**: RESTful API server built with Python Flask
- **State Management**: Redux Toolkit for centralized state management
- **Data Flow**: Client-server architecture with HTTP API communication
- **Persistence**: In-memory storage on backend + localStorage for favorites

### **Key Technologies**

- **Frontend**: React 18, TypeScript, Material-UI, Redux Toolkit, React Router, React Hook Form
- **Backend**: Flask, Flask-CORS, Python 3.x
- **HTTP Client**: Axios for API communication
- **Icons**: Lucide React for modern iconography
- **Build Tool**: Vite for fast development and optimized builds

### **Core Features Implementation**

- **Real-time Search**: Client-side filtering with instant results
- **URL Pagination**: Shareable URLs with search and pagination state
- **Favorites System**: Persistent favorites using localStorage
- **Form Validation**: Frontend validation with React Hook Form + backend validation
- **Responsive Design**: CSS Grid and Flexbox with Material-UI breakpoints
- **Error Handling**: Comprehensive error states and user feedback

## 📦 Installation Requirements

### **System Requirements**

- **Node.js**: Version 16.x or higher
- **Python**: Version 3.8 or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **pip**: Python package installer

### **Backend Dependencies**

Create a virtual environment and install Python packages:

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install required packages
pip install flask==2.3.3
pip install flask-cors==4.0.0
```

**Or install from requirements.txt:**

```bash
pip install -r requirements.txt
```

**Backend requirements.txt:**

```
Flask==2.3.3
Flask-CORS==4.0.0
```

### **Frontend Dependencies**

Install Node.js packages:

```bash
cd frontend
npm install
```

## 🚀 Quick Start

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd DirectoryApp
```

### **2. Backend Setup**

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python server.py
```

**Backend will run on:** `http://localhost:5000`

### **3. Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

### **4. Access the Application**

Open your browser and navigate to `http://localhost:5173`

## 📋 Features Overview

## Project Structure

```
DirectoryApp/
├── backend/
│   ├── app.py              # Main Flask server
│   ├── contacts.py         # Contact management logic
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Virtual environment
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── styles/        # Organized CSS files
    │   │   ├── global.css     # Global styles and variables
    │   │   └── components.css # Component-specific styles
    │   └── App.tsx        # Main router
    ├── package.json       # Node.js dependencies
    └── vite.config.ts     # Vite configuration
```
