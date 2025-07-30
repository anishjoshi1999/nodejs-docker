# Docker Node.js Express MongoDB API

A RESTful API built with Node.js, Express, and MongoDB, containerized with Docker.

## Features

- Express.js REST API
- MongoDB integration with Mongoose
- Docker containerization
- Environment variable configuration
- Input validation
- Pagination and filtering
- Health check endpoint
- Error handling
- Logging middleware

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository
2. Create a `.env` file in the root directory with the following variables:
```env
PORT=                     # Application port number
MONGODB_URI=             # MongoDB connection string
MONGO_INITDB_ROOT_USERNAME= # MongoDB root username
MONGO_INITDB_ROOT_PASSWORD= # MongoDB root password
```

3. Start the application:
```bash
docker-compose up
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Check API and MongoDB connection status

### Items
- `GET /items` - Get all items (with pagination and filtering)
  - Query parameters:
    - `page` (default: 1)
    - `limit` (default: 10)
    - `category`
    - `isActive`
    - `search`
- `GET /items/:id` - Get a single item by ID
- `POST /items` - Create a new item
- `PUT /items/:id` - Update an item
- `DELETE /items/:id` - Delete an item

### Item Schema

```javascript
{
  name: String,        // Required, 1-100 characters
  description: String, // Optional, max 500 characters
  category: String,    // Optional, defaults to 'general'
  isActive: Boolean,   // Optional, defaults to true
  createdAt: Date,    // Automatically set
  updatedAt: Date     // Automatically updated
}
```

## Docker Configuration

The project includes:
- Multi-container setup with Docker Compose
- Separate containers for the API and MongoDB
- Volume persistence for MongoDB data
- Health checks
- Automatic container restart
- Non-root user security

## Security Features

- Non-root user in Docker container
- Environment variable configuration
- Input validation and sanitization
- Error handling middleware
- MongoDB authentication

## Development

To modify the application:
1. Make changes to the source code
2. Rebuild the Docker containers:
```bash
docker-compose up --build
```

## License

This project is licensed under the ISC License - see below for details:

### ISC License (ISC)

Copyright (c) 2025

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
