# mytodo App

A full-stack ToDo list application built with:

- **Frontend**: React (Create React App)
- **Backend**: ASP.NET Core Web API
- **Database**: SQLite with Entity Framework Core
- **Auth**: JWT (JSON Web Tokens)

---

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/panchda/mytodo.git
cd mytodo
```

## Backend Setup (ASP.NET Core)

### 2. Install backend dependencies

```bash
cd backend/MyTODO_API
dotnet restore
```

### 3. Apply database migrations

This will create the SQLite database file (`app.db`).

`dotnet ef database update`

If the Program.cs includes a seed user, it will be created automatically.

### 4. Run the backend

`dotnet run`

Backend should be available at:
http://localhost:5027

## Frontend Setup (React)

### 5. Install frontend dependencies

Open new window in terminal.

```bash
cd client
npm install
```

### 6. Start the frontend

`npm start`

Frontend will run on:
http://localhost:3000

## Authentication

Users can register and log in.

JWT token is stored via localStorage.

Protected routes are used to restrict access to /tasks.

## Testing API manually

Use Postman or similar tools to test endpoints:

1. POST /api/auth/register

2. POST /api/auth/login

3. GET /api/tasks (requires JWT in Authorization header)

In Postman you can test:

1. POST /api/auth/register
   click "New HTTP Request"
   in dropdown select POST
   In a URL input paste this: http://localhost:5027/api/auth/register
   Select Body tab,
   select raw,
   in dropdown select JSON
   and in textarea insert some info (you can write your own created data):

{
"username": "testuser",
"email": "test@example.com",
"passwordHash": "123456"
}

then click Send

If everything was OK it will write to you: "User registered successfully."

2. POST /api/auth/login
   Create "New HTTP request"
   POST → http://localhost:5027/api/auth/login
   Body → raw → JSON:
   {
   "username": "testuser",
   "passwordHash": "123456"
   }
   click Send

in the response you will receive:
{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..." (this token will be bigger)
}

You need to copy this token.

3. GET /api/tasks (requires JWT in Authorization header)
   Create one more request by clicking on "New HTTP request"
   GET → http://localhost:5027/api/tasks
   select Headers tab
   add in "Key" column: Authorization
   add in "Value" column: Bearer paste_your_token
   click Send

You will get you list of tasks
