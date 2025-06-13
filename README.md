# My Portfolio Backend

This is the backend for my portfolio website. It is built with Node.js, Express, and MongoDB (via Mongoose). The backend provides RESTful APIs for managing portfolio content such as About, Head, Skills, Projects, and Certificates, as well as user authentication.

## Table of Contents

- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
  - [About](#about)
  - [Head](#head)
  - [Skills](#skills)
  - [Projects](#projects)
  - [Certificates](#certificates)
  - [Authentication](#authentication)
- [Utilities](#utilities)
- [Error Handling](#error-handling)
- [License](#license)

---

## Project Structure

```
my_portfolio_backend/
├── config/
│   └── db.js
├── controllers/
│   ├── aboutController.js
│   ├── authController.js
│   ├── certificateController.js
│   ├── headController.js
│   ├── projectController.js
│   └── skillController.js
├── models/
│   ├── AboutSection.js
│   ├── Certification.js
│   ├── HeadSection.js
│   ├── ProjectSection.js
│   ├── SkillSection.js
│   └── UserModel.js
├── routes/
│   ├── aboutRoutes.js
│   ├── certificateRoute.js
│   ├── headRoutes.js
│   ├── projectRoutes.js
│   └── skillRoute.js
├── utils/
│   └── sendEmail.js
├── index.js
├── package.json
└── .env (not committed)
```

## Setup Instructions

1. **Clone the repository:**

   ```sh
   git clone https://github.com/lord-joeh/portfolio-backend.git
   cd my_portfolio_backend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory with the following variables:

     ```env
     PORT=10000
     NODE_ENV=development
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     SMTP_HOST=your_smtp_host
     SMTP_PORT=your_smtp_port
     SMTP_USER=your_smtp_user
     SMTP_PASS=your_smtp_pass
     SMTP_FROM=your_email_from_address
     ```

4. **Start the server:**

   ```sh
   npm run dev
   ```

   The server will run on `http://localhost:10000` by default.

## API Endpoints

### About

- `GET /about/info` — Get about section information
- `POST /about/add-content` — Add or update about section content
- `PUT /about/edit-content` — Edit existing about section

### Head

- `GET /head/image` — View head image
- `POST /head/add-image` — Add head image
- `PUT /head/update-image` — Update head image
- `DELETE /head/delete-image` — Delete head image

### Skills

- `GET /skills/` — Get all skills
- `POST /skills/create` — Add a new skill
- `PUT /skills/update/:id` — Update a skill by ID
- `DELETE /skills/delete/:id` — Delete a skill by ID

### Projects

- `GET /projects/` — Get all projects
- `POST /projects/` — Add a new project
- `PUT /projects/:id` — Update a project by ID
- `DELETE /projects/:id` — Delete a project by ID

### Certificates

- `GET /certificates/` — Get all certificates
- `POST /certificates/` — Add a new certificate
- `PUT /certificates/:id` — Update a certificate by ID
- `DELETE /certificates/:id` — Delete a certificate by ID

### Authentication

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login user

## Utilities

- **sendEmail.js**: Utility for sending emails using Nodemailer. Requires SMTP configuration in environment variables.

## Error Handling

- All endpoints return JSON responses with `status` and `message` fields.
- Validation errors return HTTP 400.
- Not found errors return HTTP 404.
- Server errors return HTTP 500.

## License

This project is licensed under the ISC License.
