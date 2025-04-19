# 📰 Article Management API (IBLOG-API)

A RESTful API for managing articles, developed with **Express**, **Sequelize**, and **PostgreSQL**.
This project uses **Docker** for streamlined setup and deployment.

---

## 📋 Prerequisites

- **Docker**: Ensure Docker is installed and running on your machine.

> **Note**:  
> If `make` is not available on your system, refer to the `Makefile` to find the equivalent Docker commands.

---

## 🚀 Getting Started

### 🏁 Launch the Application

To build and start the application, simply run:

```bash
make
```

Or execute the Docker commands manually:

```bash
docker compose build
docker compose install
docker compose up
```

---

### 🔗 API Access

- **API Base URL**: [http://localhost:3000](http://localhost:3000)
- **Swagger API Documentation**: [http://localhost:3000/docs-api](http://localhost:3000/docs-api)
- **Adminer (Database Management)**: [http://localhost:8080](http://localhost:8080)

---

## 🛠 Makefile Commands

| Command        | Description                           |
|----------------|---------------------------------------|
| `make build`   | Build the project                     |
| `make install` | Install dependencies                  |
| `make up`      | Start the project                     |
| `make down`    | Stop and remove containers            |
| `make exec`    | Execute a command inside a container  |

