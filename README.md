# Advanced URL Shortener API

## Installation

Installation for Development

```bash
  npm i

  npm run dev
```

## Overview

This is an **Advanced URL Shortener API** designed for creating short URLs with advanced analytics, custom aliases, and Google Sign-In authentication. The API includes endpoints for shortening URLs, viewing analytics, and managing links by topics. The solution also implements rate limiting and caching for performance and scalability.

## Features

- **User Authentication**: Google Sign-In authentication.
- **Create Short URL**: Allows users to shorten long URLs, with an option for custom aliases and grouping under specific topics.
- **Analytics**: Provides detailed analytics such as total clicks, unique users, clicks by date, OS type, and device type.
- **Rate Limiting**: Rate limits are implemented to avoid abuse of the URL shortening service.
- **Caching**: Redis is used for caching short and long URLs to improve performance.
- **Dockerized**: The application is dockerized for easy deployment.

## Technologies Used

- **Node.js**: Backend framework for handling API requests.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing URL data and analytics.
- **Redis**: In-memory data structure store used for caching.
- **JWT**: JSON Web Tokens for secure user authentication.
- **Docker**: For containerization and deployment.
- **Swagger**: API documentation.
- **Rate Limiting**: Implemented using middlewares.

## Environment Variables

# Server

PORT=
BASE_URL=<Your Base Url>
CLIENT_URL=<Your Client Url>

# MongoDB

MONGO_URI=<Your mongo Uri>

# Redis

REDIS_URL=<Your Redis Url>

# JWT

JWT_SECRET=<Your Jwt Secret>

# Google OAuth

GOOGLE_CLIENT_ID=<Your Google Client ID>

GOOGLE_CLIENT_SECRET=<Your Google Client Secret>

# Optional GeoIP (if using a paid service)

GEOAPI_KEY=<Your GeoApi Key>

### URL Endpoints

### Authentication Endpoints

**Google OAuth Authentication**

- `GET https://url-shortener-ijzt.onrender.com/api/auth/google`: Initiates Google Sign-In.
- `GET https://url-shortener-ijzt.onrender.com/api/auth/google`: Handles the Google Sign-In callback.

**Important**: When you access the `GET https://url-shortener-ijzt.onrender.com/api/auth/google` endpoint, After successfully logging in with Google, Google will redirect you to a callback URL (e.g., `https://url-shortener-ijzt.onrender.com/api/auth/google/callback`). You can use `curl` to check the response:

```bash
curl -v https://url-shortener-ijzt.onrender.com/api/auth/google
```

### ShortUrl Endpoints

**Create a Short URL**

- `POST /api/url/shorten`: Create a new short URL.
- **Request Body**:
  ```json
  {
    "longUrl": "https://example.com/ajnjnjbcdede5874r545fkuygy00-987",
    "customAlias": "mylink45",
    "topic": "marketing45"
  }
  ```
- **Response**:

  ```json
  {
    "message": "Success",
    "data": {
      "longUrl": "https://example.com/ajnjnjbcdede5874r545fkuygy00-987",
      "shortUrl": "http://localhost:3000/mylink45",
      "alias": "mylink45",
      "user": "679d19cca73e27eb3ce575e1",
      "topic": "marketing45",
      "_id": "679e3b474ae9b9ff194c777e",
      "createdAt": "2025-02-01T15:18:31.432Z",
      "__v": 0
    }
  }
  ```

  **Redirect to the Original URL**

  - `GET /api/url/{alias}`: Redirects to the original URL based on the short URL alias.

### Analytics Endpoints

**Get Analytics for a Short URL**

- `GET /api/analytics/{alias}`: Retrieves analytics for a specific short URL.
- **Response**:

  ```json
  {
    "totalClicks": 1,
    "uniqueUsers": 1,
    "clicksByDate": [
      {
        "date": "2025-01-26",
        "clicks": 0
      },
      {
        "date": "2025-01-27",
        "clicks": 0
      },
      {
        "date": "2025-01-28",
        "clicks": 0
      },
      {
        "date": "2025-01-29",
        "clicks": 0
      },
      {
        "date": "2025-01-30",
        "clicks": 0
      },
      {
        "date": "2025-01-31",
        "clicks": 0
      },
      {
        "date": "2025-02-01",
        "clicks": 1
      }
    ],
    "osType": [
      {
        "osName": "Other",
        "uniqueClicks": 1,
        "uniqueUsers": 1
      }
    ],
    "deviceType": [
      {
        "deviceName": "Desktop",
        "uniqueClicks": 1,
        "uniqueUsers": 1
      }
    ]
  }
  ```

  **Get Analytics for a Specific Topic**

  - `GET /api/analytics/topic/{topic}`: Retrieves analytics for all short URLs grouped under a specific topic.

  - **Response**:

  ```json
  {
    "totalClicks": 2,
    "uniqueUsers": 2,
    "clicksByDate": [
      {
        "date": "2025-01-26",
        "clicks": 0
      },
      {
        "date": "2025-01-27",
        "clicks": 0
      },
      {
        "date": "2025-01-28",
        "clicks": 0
      },
      {
        "date": "2025-01-29",
        "clicks": 0
      },
      {
        "date": "2025-01-30",
        "clicks": 0
      },
      {
        "date": "2025-01-31",
        "clicks": 0
      },
      {
        "date": "2025-02-01",
        "clicks": 2
      }
    ],
    "urls": [
      {
        "shortUrl": "http://localhost:3000/mylink",
        "totalClicks": 2,
        "uniqueUsers": 2
      }
    ]
  }
  ```

  **Get Overall Analytics**

  - `GET /api/analytics/overall`: Retrieves overall analytics for all short URLs created by the authenticated user.
  - **Response**:

  ```json
  {
    "totalUrls": 21,
    "totalClicks": 8,
    "uniqueUsers": 2,
    "clicksByDate": [
      {
        "date": "2025-01-26",
        "clicks": 0
      },
      {
        "date": "2025-01-27",
        "clicks": 0
      },
      {
        "date": "2025-01-28",
        "clicks": 0
      },
      {
        "date": "2025-01-29",
        "clicks": 0
      },
      {
        "date": "2025-01-30",
        "clicks": 0
      },
      {
        "date": "2025-01-31",
        "clicks": 0
      },
      {
        "date": "2025-02-01",
        "clicks": 8
      }
    ],
    "osType": [
      {
        "osName": "Windows",
        "uniqueClicks": 1,
        "uniqueUsers": 1
      },
      {
        "osName": "Other",
        "uniqueClicks": 1,
        "uniqueUsers": 1
      }
    ],
    "deviceType": [
      {
        "deviceName": "Desktop",
        "uniqueClicks": 2,
        "uniqueUsers": 2
      }
    ]
  }
  ```

### Security

- All routes that require authentication use **JWT** (JSON Web Token).
- Use the **BearerAuth** security scheme to authenticate API requests.

### Rate Limiting

- Rate limiting is implemented to prevent abuse of the API endpoints, such as:
  - **URL shortening**: Limits how many URLs a user can shorten within a time frame.
  - **Analytics**: Limits the number of requests to fetch analytics to prevent overuse.

## Setup and Installation

### Prerequisites

- **Docker**: Make sure Docker is installed on your system.
- **Node.js**: Version 14 or higher.
- **MongoDB**: Ensure you have MongoDB installed or use a MongoDB service like MongoDB Atlas.
- **Redis**: Ensure Redis is installed or use a managed Redis service.

### Clone the Repository

```bash
git clone https://github.com/sojitrakartik02/url-shortener
cd url-shortener
```
