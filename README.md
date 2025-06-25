
##  `backend `

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

### 4. Access the API

* API Root: [http://localhost](http://localhost)
* Admin Panel: [http://localhost/admin](http://localhost/admin)

---

## How Backend Was Deployed on AWS EC2

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

###  Tips

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

##  Step-by-Step EC2 Scheduler Setup

---

###  Step 1: Tag Your EC2 Instance

1. Go to your EC2 instance in AWS Console.
2. Under the **Tags** tab, click **Add Tag**.
3. Add:

```
Key: Schedule
Value: OfficeHours
```

> This will be used by the Lambda function to identify which instance(s) to start/stop.

---

###  Step 2: Create IAM Role for Lambda

1. Go to **IAM → Roles → Create Role**.
2. Choose **Trusted entity**: AWS Service → Lambda
3. Attach these policies:

   * `AmazonEC2FullAccess`
   * `CloudWatchEventsFullAccess`
   * `AWSLambdaBasicExecutionRole`
4. Name it something like: `EC2SchedulerLambdaRole`

---

###  Step 3: Create Start Lambda Function

1. Go to **Lambda → Create function**
2. Name: `start_ec2_office_hours`
3. Runtime: Python 3.12
4. Execution Role: use `EC2SchedulerLambdaRole`
5. Paste the code below:

```python
import boto3

def lambda_handler(event, context):
    ec2 = boto3.client('ec2')
    
    # Filter EC2 instances with tag Schedule=OfficeHours
    filters = [{
        'Name': 'tag:Schedule',
        'Values': ['OfficeHours']
    }]

    instances = ec2.describe_instances(Filters=filters)
    instance_ids = [
        instance['InstanceId']
        for reservation in instances['Reservations']
        for instance in reservation['Instances']
        if instance['State']['Name'] == 'stopped'
    ]

    if instance_ids:
        ec2.start_instances(InstanceIds=instance_ids)
        print(f"Started instances: {instance_ids}")
    else:
        print("No instances to start.")
```

---

###  Step 4: Create Stop Lambda Function

Repeat the same process and name it `stop_ec2_office_hours`. Use this code:

```python
import boto3

def lambda_handler(event, context):
    ec2 = boto3.client('ec2')
    
    filters = [{
        'Name': 'tag:Schedule',
        'Values': ['OfficeHours']
    }]

    instances = ec2.describe_instances(Filters=filters)
    instance_ids = [
        instance['InstanceId']
        for reservation in instances['Reservations']
        for instance in reservation['Instances']
        if instance['State']['Name'] == 'running'
    ]

    if instance_ids:
        ec2.stop_instances(InstanceIds=instance_ids)
        print(f"Stopped instances: {instance_ids}")
    else:
        print("No instances to stop.")
```

---

###  Step 5: Create EventBridge (CloudWatch) Rules

#### 🔔 Rule 1: Start at 8:00 AM IST

1. Go to **Amazon EventBridge → Rules → Create rule**
2. Name: `start-instance-8am-ist`
3. Schedule type: **Schedule**
4. Choose **Cron expression**:

```
cron(30 2 * * ? *)   # IST 8:00 AM = UTC 2:30 AM
```

5. Target: Select the **start lambda function**

---

#### 🔕 Rule 2: Stop at 8:00 PM IST

1. Create another rule
2. Name: `stop-instance-8pm-ist`
3. Cron:

```
cron(30 14 * * ? *)  # IST 8:00 PM = UTC 2:30 PM
```

4. Target: **stop lambda function**

---



# 🧠 Task Manager Frontend (React)

A React.js frontend application to manage tasks, register/login users, and interact with the Django backend using JWT authentication.

---

## 🚀 Tech Stack

- **React.js** (via Create React App)
- **React Router DOM** – client-side routing
- **Axios** – for API requests
- **JWT Auth** – handled via localStorage

---

## 📦 Setup & Run

1. Clone the repo and install dependencies:
   ```bash
   cd frontend
   npm install
````

2. Create a `.env` file:

   ```env
   REACT_APP_API_BASE_URL=http://<your-ec2-ip-or-domain>/api
   ```

3. Start the development server:

   ```bash
   npm start
   ```

---

## 🔐 Routes

| Path        | Page            | Auth Required |
| ----------- | --------------- | ------------- |
| `/register` | Register        | ❌ No          |
| `/login`    | Login           | ❌ No          |
| `/tasks`    | Task Management | ✅ Yes         |

---

---

## 🌐 API Endpoints (used)

* `POST /users/register/` – Register user
* `POST /users/login/` – Login, receive JWT
* `GET /tasks/` – List tasks (with ?status=)
* `POST /tasks/` – Create task
* `PUT /tasks/:id/` – Update task
* `DELETE /tasks/:id/` – Delete task

---
