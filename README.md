
## ✅ `backend `

```markdown
# 📝 Task Manager - Backend

This is the **Django REST API backend** for the Task Manager application, built to handle user authentication and task CRUD operations.

---

## 🚀 Tech Stack Used

- **Backend Framework**: Django + Django REST Framework
- **Authentication**: JWT (via `djangorestframework-simplejwt`)
- **Database**: SQLite (for local & Docker use)
- **Containerization**: Docker, Docker Compose
- **Deployment**: AWS EC2 (Ubuntu 22.04)
- **Web Server**: Gunicorn (inside container)

---

## 🧱 Project Structure

```

task-manager/
├── backend/
│   ├── backend/              # Django project folder
│   ├── tasks/                # Task app
│   ├── users/                # Custom user app
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── requirements.txt
│   ├── manage.py
├── docker-compose.yml

````

---

## 🐳 Run Locally with Docker

### 📦 Prerequisites

- Docker & Docker Compose installed
- Port `80` is free (or use another if needed)

---

### 🛠 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-management
````

---

### 🔧 2. Build and Run the Containers

```bash
docker compose up --build
```

This will:

* Build the Django backend container
* Run `migrate` via `entrypoint.sh`
* Start the app on **[http://localhost](http://localhost)** (port 80)

> If you're not running as root, you might need:
> `sudo docker compose up --build`

---

---

### 🌐 4. Access the API

* API Root: [http://localhost](http://localhost)
* Admin Panel: [http://localhost/admin](http://localhost/admin)

---

## ☁️ How Backend Was Deployed on AWS EC2

### 1. Launch EC2 Instance

* Ubuntu 22.04 LTS (t2.micro)
* Open ports: **80**, **22**

### 2. SSH into Instance

```bash
ssh -i "your-key.pem" ubuntu@your-ec2-ip
```

---

### 3. Install Docker

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker

Referred document link: https://docs.docker.com/engine/install/ubuntu/
```

---

### 4. Clone Your Project Repo

```bash
git clone https://github.com/your-username/task-manager.git
cd task-management
```

---

### 5. Run the App

```bash
docker compose up --build
```

Now your app is running on:
**http\://<your-ec2-public-ip>**

---

### ✅ Tips

* Make sure port **80** is allowed in **EC2 Security Group**
* To keep the server running after SSH logout:

```bash
docker compose up --build -d
```

---

## 🧪 API Endpoints

| Method | Endpoint                   | Description       |
| ------ | -------------------------- | ----------------- |
| POST   | `/api/users/register/`     | Register user     |
| POST   | `/api/users/login/`        | Login + JWT token |
| GET    | `/api/tasks/`              | List tasks        |
| POST   | `/api/tasks/`              | Create task       |
| PUT    | `/api/tasks/:id/`          | Update task       |
| DELETE | `/api/tasks/:id/`          | Delete task       |
| GET    | `/api/tasks/?status=To Do` | Filter by status  |

---