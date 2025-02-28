# **🚀 Tint Senior SWE Technical Test - Windows Setup Guide**

This guide helps you set up and run the project **without WSL2** using **PowerShell or CMD**.

---

## **📌 Table of Contents**

- [🚀 Getting Started](#-getting-started)
- [🔹 Initialize the Project](#-initialize-the-project)
- [🔹 Start the Development Server](#-start-the-development-server)
- [🔹 Running Database Migrations](#-running-database-migrations)
- [🔹 Running Tests](#-running-tests)
- [🔹 Running SQL Shell](#-running-sql-shell)
- [🎯 Summary](#-summary)
- [🧪 Demo & Testing](#-demo--testing)

---

## **🚀 Getting Started**

### **🔹 Prerequisites**

Make sure you have the following installed:  
✅ **Docker** (Ensure Docker Desktop is running)  
✅ **Node.js & npm** (Install from [nodejs.org](https://nodejs.org/))  
✅ **Stripe CLI** (For testing webhooks - [Install Here](https://stripe.com/docs/cli))

---

## **🔹 Initialize the Project**

Since you are on **Windows without WSL2**, you can't use `make`. Instead, run:

```powershell
docker volume create tint-pgdata
docker volume create tint-test-pgdata
npm install
```

---

## **🔹 Start the Development Server**

Instead of `make start`, use:

```powershell
docker-compose -p tint-senior-swe-technical-test-dev -f ./docker-compose.development.yaml up -d
npm run dev
```

🛠 **If you get Docker errors:**

- Run **PowerShell as Administrator**
- Make sure Docker Desktop is running

---

## **🔹 Running Database Migrations**

### **Run Existing Migrations**

```powershell
npm run db:migrate
```

### **Generate New Migrations**

```powershell
npx drizzle-kit generate
```

### **Push Migrations to the Database**

```powershell
npx drizzle-kit push
```

---

## **🔹 Running Tests**

### **Run Tests with Database Setup**

```powershell
docker-compose -p tint-senior-swe-technical-test-dev -f ./docker-compose.test.yaml up -d
.\bin\wait-for-it.sh -h localhost -p 15432 -t 60  # Run only if needed
npm run db:migrate:test
npm test
docker-compose -p tint-senior-swe-technical-test-dev -f ./docker-compose.test.yaml down
```

### **Run Tests in Watch Mode**

```powershell
npm run test:watch
```

---

## **🔹 Running SQL Shell**

Instead of `make sql`, use:

```powershell
docker exec -it tint-db psql postgres://tint:tint@localhost:5432/tint
```

Or manually enter the PostgreSQL shell:

```powershell
docker exec -it tyriquedaniel-db-1 psql -U tint -d postgres
```

---

## **🎯 Summary**

✅ **Windows Setup Without WSL2** (All commands run via PowerShell)  
✅ **Project Initialization** (`npm install` + Docker volumes)  
✅ **Database Migrations** (Drizzle ORM commands)  
✅ **Testing & Debugging** (Database migrations for tests)  
✅ **Stripe CLI Integration**

---

## **🧪 Demo & Testing**

### **Demo User Credentials**

| **Email**         | **Password** |
| ----------------- | ------------ |
| admin@example.com | password     |
| johndoe@email.com | password     |

### **Stripe Webhook & Payment Testing**

#### **Listen for Stripe Events**

```powershell
stripe listen --forward-to localhost:3000/api/webhook
```

#### **Trigger a Stripe Checkout Session Completion**

```powershell
stripe trigger checkout.session.completed
```

---

## **🔥 Additional Features & Updates**

- **Stripe CLI doesn't support metadata**, so we use **mock data** for user lookup.
- **Demo user login added** (Can be extended to support OAuth or password storage).
- **Updated package versions** and **enabled Windows support**.

🚀 **Now you're ready to run the project smoothly on Windows!** Let me know if you run into any issues. 🎯🔥
