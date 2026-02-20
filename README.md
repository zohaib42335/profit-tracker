# 📊 HHC Pro Tracker

### A High-Performance Financial Dashboard for E-Commerce Scaling

---

## 🚀 Project Overview

**HHC Pro Tracker** is a reactive financial dashboard designed for dropshippers and e-commerce entrepreneurs who need accurate, real-time insights into their product performance.

Unlike traditional spreadsheets, this application provides **automated scaling intelligence**, helping users decide whether to:

* ✅ Scale
* ❌ Kill
* ⚙ Optimize

based on real-time calculations of **Net Profit, ROAS (Return on Ad Spend), and RTO (Return to Origin)**.

The goal of this project is to combine financial clarity with high-performance frontend architecture using Angular Signals.

---

## ✨ Key Features

### ⚡ Reactive Dashboard

Built using **Angular Signals**, enabling instantaneous UI updates across all components without unnecessary re-renders.

### 📈 Intelligent Analytics

Automatically calculates:

* Net Profit
* ROAS
* RTO Rate

based on:

* Unit selling price
* HHC cost
* Quantity sold
* Total ad spend

### 🧠 Scaling Insights Engine

A built-in logic engine evaluates product performance and generates actionable recommendations:

* “Scale”
* “Kill”
* “Optimize”

### 📊 Data Visualization

Interactive **Profit Trend Charts** powered by Chart.js for monthly and daily tracking.

### 📱 Mobile-First Design

* Fully responsive grid layout
* Collapsible sidebar
* Mobile hamburger menu with backdrop overlay

### 💾 Data Persistence

Automatic synchronization using **LocalStorage** for a local-first experience.

### 📤 Export Capabilities

Generate and download **CSV reports** for daily or monthly bookkeeping.

---

## 🛠 Tech Stack

* **Framework:** Angular 18+ (Signals, Computed State, Standalone Components)
* **Language:** TypeScript
* **UI Framework:** Bootstrap 5 (Customized with CSS3)
* **Charts:** Chart.js
* **Icons:** FontAwesome 6

---

## 📐 Architecture & Logic

This project follows a clean, reactive architecture with a strong focus on performance and scalability.

### 🔹 State Management

* Angular Signals used as the reactive state layer
* Computed state for derived financial metrics
* No heavy state libraries (optimized for local-first architecture)

### 🔹 Profit Formula

The application ensures financial accuracy by calculating profit at the batch level:

```
Net Profit = (Selling Price − HHC Cost) × Quantity − Total Ad Spend
```

### 🔹 ROAS Formula

```
ROAS = Revenue / Total Ad Spend
```

Edge cases (e.g., division by zero) are handled to maintain data integrity.

---

## 🖼 Screenshots

* Dashboard Overview
  ![33](https://github.com/user-attachments/assets/044e6d75-9ae5-4bc1-b6ec-4c5a981bd2f1)

* Profit Trend Chart
  <img width="721" height="276" alt="image" src="https://github.com/user-attachments/assets/f381a11b-1d88-439d-b654-3fa6cdb7b8db" />

* Scaling Recommendation Panel
* Mobile View Layout

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/hhc-pro-tracker.git
cd hhc-pro-tracker
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run the development server

```bash
ng serve
```

Navigate to:

```
http://localhost:4200/
```

The app will automatically reload when source files are modified.

---

## 🧠 What I Learned

### State Management

Implemented Angular Signals to manage complex financial data flows efficiently without the overhead of RxJS or NgRx for a local-first app.

### Responsive Architecture

Designed a scalable layout that smoothly transitions between:

* Desktop sidebar navigation
* Mobile hamburger menu with backdrop overlay

### Data Integrity

Handled financial edge cases, including:

* Preventing division by zero in ROAS calculations
* Ensuring accurate batch-level profit computation

---

## 🎯 Project Purpose

This project demonstrates:

* Real-world financial logic implementation
* Scalable Angular architecture
* Clean state management using Signals
* Production-ready UI structure
