# Health Checker API & UI

Simple Node.js + Express API to check the health of services, with a web UI for CRUD management.  
MySQL is used for storing services.

---

## Features

- REST API to check if a service is online:
  ```
  GET /check/:service_name
  ```
  Returns:
  - **200** → if `online: true`
  - **404** → if `online: false` or request fails
- Web UI to manage services (add, update, delete)
- Auto-creates database & table if missing
- Dockerized, configurable via `.env`
- Separate API and UI ports for flexibility

---

## Setup

1. Copy `.env.example` to `.env` and configure:
   ```env
   API_PORT=2008
   UI_PORT=2009
   API_HOST=localhost

   DB_HOST=your_mysql_host
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=health_checker
   ```

2. Build & run Docker container:
   ```bash
   docker compose up --build -d
   ```

3. Ports mapping example (defined in `docker-compose.yml`):
   ```
   Host port 2008 → Container API 2008
   Host port 2009 → Container UI  2009
   ```

---

## Usage

### API
Check service health:
```bash
GET http://localhost:2008/check/YourServiceName
```

### UI
Open web UI in your browser:
```
http://localhost:2009
```
- Add new services
- Edit or delete existing services
- Click "Check" to call the API endpoint for a service

---

## Notes

- No authentication is included in the UI; it’s intended for trusted environments.
- Database is automatically created if it doesn’t exist.
- UI and API run in the same container but on different ports for simplicity.