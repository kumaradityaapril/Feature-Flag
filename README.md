# Feature Flag Service 

## Overview
This project is a **Feature Flag Service** built as part of an OJT project.

A Feature Flag system allows developers to **enable or disable features dynamically without redeploying the application**. This helps teams release features safely, perform experiments, and quickly disable problematic functionality.

---

## Problem Statement
Modern applications frequently release new features. Deploying code every time a feature needs to be enabled or disabled increases risk and downtime.

A **Feature Flag Engine** solves this problem by allowing features to be controlled dynamically based on rules such as:

- User targeting
- Country targeting
- App version targeting
- Percentage rollout
- Environment control (dev / staging / production)

---

## Tech Stack

### Backend
- Go (Golang)
- Gin Web Framework
- PostgreSQL
- pgx PostgreSQL Driver

### Tools
- Git & GitHub
- Postman / Thunder Client
- Docker (planned)
- React Admin Dashboard (planned)

---

## System Architecture

```
Client Application
        │
        ▼
   REST API (Gin)
        │
        ▼
  Business Logic Layer
        │
        ▼
 Repository Layer
        │
        ▼
   PostgreSQL Database
```

The backend follows a **layered architecture**:

```
Handlers → Services → Repository → Database
```

---

## Project Structure

```
feature-flag/
│
├── backend
│
│   ├── cmd
│   │   └── main.go
│
│   ├── config
│   │   └── db.go
│
│   ├── models
│   │   └── feature_flag.go
│
│   ├── handlers
│   │   └── flag_handler.go
│
│   ├── services
│   │   └── flag_service.go
│
│   ├── repository
│   │   └── flag_repository.go
│
│   └── router
│       └── router.go
```

---

## Database Schema

Table: `feature_flags`

| Column | Type | Description |
|------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR | Feature flag name |
| enabled | BOOLEAN | Global flag state |
| environment | VARCHAR | dev / staging / prod |
| rollout_percentage | INT | Percentage rollout |
| rules | JSONB | Targeting rules |
| kill_switch | BOOLEAN | Emergency disable |
| created_at | TIMESTAMP | Creation time |

---

## API Endpoints

### Health Check

```
GET /health
```

Response

```json
{
  "message": "Feature Flag Service is running"
}
```

---

### Create Feature Flag

```
POST /flags
```

Example Request

```json
{
  "name": "new_ui",
  "enabled": true,
  "environment": "production",
  "rollout_percentage": 50,
  "rules": "{}",
  "kill_switch": false
}
```

---

### Get All Feature Flags

```
GET /flags
```

---

## Running the Project

### Clone Repository

```
git clone https://github.com/YOUR_USERNAME/feature-flag-service.git
```

---

### Navigate to Backend

```
cd backend
```

---

### Install Dependencies

```
go mod tidy
```

---

### Run the Server

```
go run cmd/main.go
```

Server runs on:

```
http://localhost:8081
```

---

## Testing APIs

You can test APIs using:

- Postman
- Thunder Client
- cURL

Example

```
GET http://localhost:8081/flags
```

---

## Current Progress

Completed

- Backend project setup
- Gin server setup
- PostgreSQL database integration
- Feature flags table
- Create feature flag API
- Get feature flags API

Upcoming Features

- Get feature flag by ID
- Update feature flags
- Delete flags
- Rule evaluation engine
- Percentage rollout logic
- React Admin Dashboard
- Docker deployment
- Cloud deployment

---

## Author

**Kumar Aditya**  
OJT Project – Feature Flag Service
