# 🔨 BidStream - Real-Time Auction Platform

BidStream is a modern, full-stack real-time auction platform built with Spring Boot and integrated React-based frontend. It features live bidding via WebSockets, secure JWT authentication, and a sleek, responsive design.

---

## 🚀 Key Features

-   **⚡ Real-Time Bidding**: Live bid updates using WebSockets (STOMP).
-   **🔐 Secure Authentication**: JWT-based login and signup with Spring Security.
-   **📅 Auction Management**: Scheduled and active auctions with countdown timers.
-   **🔔 Notifications**: In-app notifications for bid activity and auction status.
-   **💳 Payment Integration**: Secure payment tracking and transaction history.
-   **🖼️ Image Management**: Upload and storage for auction item images.
-   **📊 Database Migrations**: Versioned schema management using Flyway.

---

## 🛠️ Tech Stack

### Backend
-   **Framework**: Spring Boot 4.x
-   **Language**: Java 17
-   **Security**: Spring Security & JWT
-   **Database**: Neon PostgreSQL (Production Ready)
-   **Real-time**: Spring WebSocket
-   **Migration**: Flyway

### Frontend
-   **Core**: HTML5, Vanilla CSS, React (JSX)
-   **Design**: Modern Dark Mode UI with Glassmorphism and vibrant gradients.

---

## 📦 Project Structure

```text
├── backend/
│   ├── src/main/java/com/bidstream/       # Java Source Code
│   │   ├── config/                        # Security & WebSocket configs
│   │   ├── controller/                    # REST API Endpoints
│   │   ├── model/                         # JPA Entities
│   │   ├── service/                       # Business Logic
│   │   └── repository/                    # Database Access
│   └── src/main/resources/
│       ├── static/                        # Frontend Assets (HTML, CSS, JSX)
│       └── db/migration/                  # SQL Migration Scripts
└── uploads/                               # Local storage for item images
```

---

## ⚙️ Getting Started

### Prerequisites
-   **Java 17** or higher
-   **Maven 3.6+**
-   **Neon PostgreSQL Account**

### Installation & Run

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Rsbhchauhan/BidStream.git
    cd BidStream/backend
    ```

2.  **Install dependencies**:
    ```bash
    mvn clean install
    ```

3.  **Run the application**:
    ```bash
    mvn spring-boot:run
    ```

4.  **Access the App**:
    Open your browser and navigate to `http://localhost:8080`.

---

## 🔧 Configuration

The application settings can be found in `backend/src/main/resources/application.properties`.

-   **Port**: Defaulted to `8080`.
-   **Database**: Uses Neon PostgreSQL.
-   **JWT Secret**: Configurable via `jwt.secret`.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Developed with ❤️ by Rsbhchauhan**
