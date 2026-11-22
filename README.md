# ⏳ TimeVerse
### Your Time. Your Goals. Your Universe.

**TimeVerse** is a full-stack student productivity and academic scheduling application designed to help students take control of their academic lives.

It provides a centralized platform where students can organize courses, manage schedules, track exams and assignments, and build structured study plans — all in one place.

Our goal is simple: **Help students spend less time organizing their responsibilities and more time achieving their goals.**

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Future Enhancements](#-future-enhancements)
- [Team](#-team)

---

## 🌟 Overview

Managing university life can become overwhelming. Students often have to deal with multiple courses, different schedules, upcoming exams, assignments, and deadlines.

TimeVerse brings these responsibilities together into one organized environment.

Unlike traditional scheduling tools, TimeVerse focuses on the complete student workflow — from organizing academic commitments to planning study sessions and tracking progress.

**TimeVerse is built around three main ideas:**

- **Organize:** Keep academic information and responsibilities in one place.
- **Plan:** Create structured study plans and manage deadlines.
- **Track:** Monitor tasks, study sessions, and academic progress.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Student registration and login.
- Secure password hashing.
- JWT-based authentication.
- Protected API endpoints.

### 📚 Course Management
- Create and manage courses.
- Store course descriptions.
- View courses associated with the student.

### 🗓️ Schedule Management
- Organize weekly course schedules.
- Set days, start times, and end times.
- Add course locations.

### 📝 Exam Management
- Add upcoming exams.
- Specify exam dates and locations.
- Store additional exam notes.

### ✅ Task Management
- Create and manage academic tasks.
- Set task descriptions and deadlines.
- Assign task priorities: Low, Medium, and High.
- Track task statuses: Pending, In Progress, and Completed.

### 🎯 Study Planning
- Create study plans with start and end dates.
- Organize individual study sessions.
- Set session durations.
- Track study session completion.

### 🔔 Notifications & Reminders
- Manage student notifications.
- Schedule reminders for important activities.
- Track read and unread notifications.
- Use background job processing for scheduled tasks.

### 📊 Dashboard & Calendar
- Designed to provide a centralized overview of academic responsibilities.
- Intended to make schedules, deadlines, and study activities easier to visualize.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | Styling and responsive layouts |
| JavaScript | User interactions and API integration |

### Backend

| Technology | Purpose |
|---|---|
| C# | Backend programming language |
| .NET 10 | Application framework |
| ASP.NET Core Web API | RESTful API development |
| Entity Framework Core | ORM and database operations |
| SQL Server | Relational database |
| JWT | Authentication and authorization |
| FluentValidation | Request validation |
| Hangfire | Background jobs and scheduled reminders |
| Swagger / OpenAPI | API documentation and testing |

---

## 🏛️ System Architecture

TimeVerse follows **Clean Architecture** principles to achieve separation of concerns, maintainability, and scalability.

The system consists of two main parts:

### 1. Frontend — Client Side

Built using HTML, CSS, and JavaScript.

Responsible for:
- Displaying the user interface.
- Handling user interactions.
- Collecting and validating user input on the client side.
- Communicating with the backend through HTTP requests.
- Processing API responses and updating the interface.

### 2. Backend — Server Side

Built using ASP.NET Core Web API and organized into four layers.

#### 🔹 Domain Layer
The core of the application.

Responsible for:
- Business entities.
- Enums.
- Core business rules.
- BaseEntity and shared domain concepts.

#### 🔹 Application Layer
Contains the application's use cases and business operations.

Responsible for:
- Application services.
- DTOs.
- Repository interfaces.
- Business workflows.
- Request validation using FluentValidation.

#### 🔹 Infrastructure Layer
Responsible for implementing external dependencies and technical operations.

Responsible for:
- Entity Framework Core.
- SQL Server database access.
- ApplicationDbContext.
- Repository implementations.
- Unit of Work implementation.
- Password hashing and JWT services.
- Database configurations.
- Hangfire integration.

#### 🔹 API Layer
The entry point of the backend.

Responsible for:
- Controllers and HTTP endpoints.
- Request and response handling.
- Routing.
- Authentication and authorization configuration.
- Dependency injection registration.
- Swagger configuration.

### 3. Database Layer

SQL Server is used as the relational database, while Entity Framework Core manages database operations and entity relationships.

---

## 📂 Project Structure

```text
TimeVerse/
│
├── Frontend/
│   ├── HTML files
│   ├── CSS/
│   ├── JavaScript/
│   └── Assets/
│
├── Backend/
│   └── TimeVerse/
│       │
│       ├── TimeVerse.Api/
│       │   ├── Controllers/
│       │   ├── Extensions/
│       │   └── Program.cs
│       │
│       ├── TimeVerse.Application/
│       │   ├── Features/
│       │   ├── DTOs/
│       │   ├── Interfaces/
│       │   └── Validators/
│       │
│       ├── TimeVerse.Domain/
│       │   ├── Entities/
│       │   ├── Enums/
│       │   └── Common/
│       │
│       ├── TimeVerse.Infrastructure/
│       │   ├── Data/
│       │   ├── Repositories/
│       │   ├── Services/
│       │   └── Configurations/
│       │
│       └── TimeVerse.sln
│
├── .gitignore
└── README.md
```

---

## 🔄 How It Works

TimeVerse uses a client-server architecture.

The frontend communicates with the backend through RESTful API endpoints, exchanging data in JSON format.

**Example: Creating a Course**

1. The student fills in the course information in the frontend.
2. JavaScript sends an HTTP POST request to the backend.
3. The API Controller receives the request.
4. The Application Layer validates the data and executes the use case.
5. The Infrastructure Layer handles persistence through the repository.
6. Entity Framework Core saves the course in SQL Server.
7. The API returns an appropriate HTTP response.
8. The frontend updates the interface based on the response.

---

## 🚀 Getting Started

Follow these instructions to set up and run TimeVerse locally.

### Prerequisites

Make sure you have installed:

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server)
- [Visual Studio](https://visualstudio.microsoft.com/)
- [Git](https://git-scm.com/)
- A modern web browser.

### 1. Clone the Repository

```bash
git clone https://github.com/Mariam-Mohamedali/TimeVerse.git
```

### 2. Navigate to the Backend

```bash
cd TimeVerse/Backend/TimeVerse
```

### 3. Configure Application Settings

Create an `appsettings.Development.json` file inside the `TimeVerse.Api` project.

Add your local configuration:

```json
{
  "JwtSettings": {
    "SecretKey": "YOUR_OWN_SECRET_KEY",
    "Issuer": "TimeVerse",
    "Audience": "TimeVerseUsers",
    "ExpiryInMinutes": 60
  },
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_SQL_SERVER_CONNECTION_STRING"
  }
}
```

Replace the placeholders with your own configuration values.

**Important:** Never commit actual secret keys, passwords, or private connection strings to the repository.

### 4. Restore Dependencies

```bash
dotnet restore
```

### 5. Apply Database Migrations

```bash
dotnet ef database update --project TimeVerse.Infrastructure --startup-project TimeVerse.Api
```

If Entity Framework Core tools are not installed:

```bash
dotnet tool install --global dotnet-ef
```

### 6. Run the Backend

```bash
dotnet run --project TimeVerse.Api
```

### 7. Run the Frontend

Open the frontend's main HTML file in your browser, or use the VS Code Live Server extension if the frontend is configured for it.

Make sure the frontend API base URL points to the backend's running address.

---

## 📖 API Documentation

TimeVerse provides RESTful API endpoints for its main application features.

The API can be explored and tested through **Swagger UI** while the backend is running.

Main API modules include:

| Module | Description |
|---|---|
| Authentication | Registration and login |
| Courses | Course management |
| Schedules | Weekly schedule management |
| Exams | Exam management |
| Student Tasks | Academic task management |
| Study Plans | Study planning |
| Study Sessions | Study session tracking |
| Notifications | Notifications and reminders |

---

## 🔒 Security

Security is an important part of TimeVerse.

The backend incorporates:

- JWT-based authentication.
- Authorization for protected endpoints.
- Password hashing rather than storing plain-text passwords.
- Request validation.
- Separation of sensitive configuration from committed source code.

---

## 🔮 Future Enhancements

Potential improvements that could expand the TimeVerse experience include:

- Advanced dashboard analytics.
- Interactive calendar visualization.
- Personalized study recommendations.
- Enhanced notification preferences.
- Productivity reports and progress statistics.
- Additional integrations with external calendar services.

---

## 👩‍💻 Team

**TimeVerse** is a collaborative software development project focused on building a practical student productivity platform.

The project combines frontend development, backend engineering, database design, API development, and software architecture.

---

<p align="center">

  **TimeVerse**

  *Plan Smarter. Study Better. Make Every Moment Count.* ⏳

</p>
