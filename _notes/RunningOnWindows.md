Since you are on **Windows without WSL2**, you can't use `make`. But you can manually run the equivalent commands in **PowerShell or CMD**.

---

### **🔹 Running `make init` Manually**

Instead of `make init`, run:

```powershell
docker volume create tint-pgdata
docker volume create tint-test-pgdata
npm install
```

---

### **🔹 Running `make start` Manually**

Instead of `make start`, run:

```powershell
docker-compose -p tint-senior-swe-technical-test-dev -f ./docker-compose.development.yaml up -d
npm run dev
```

If you get errors with `docker-compose`, try running PowerShell as **Administrator**.

---

### **🔹 Running Migrations**

Instead of `make db-migrate`, run:

```powershell
npm run db:migrate
```

If you need to generate migrations:

```powershell
./node_modules/.bin/drizzle-kit generate:pg
```

---

### **🔹 Running Tests**

Instead of `make test`, run:

```powershell
docker-compose -p tint-senior-swe-technical-test-dev -f ./docker-compose.test.yaml up -d
.\bin\wait-for-it.sh -h localhost -p 15432 -t 60  # Only if needed
npm run db:migrate:test
npm test
docker-compose -p tint-senior-swe-technical-test-dev -f ./docker-compose.test.yaml down
```

For **watch mode**:

```powershell
npm run test:watch
```

---

### **🔹 Running SQL Shell**

Instead of `make sql`, run:

```powershell
docker exec -it tint-db psql postgres://tint:tint@localhost:5432/tint
```

---

### **🎯 Summary**

You **don’t need WSL2** but must **run the equivalent commands manually**. Let me know if you get any errors! 🚀

