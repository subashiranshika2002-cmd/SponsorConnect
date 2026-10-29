# SponsorConnect – Sponsorship Management Portal

**Connect events with opportunities.**

A full-stack web application that helps event organizers find sponsors, submit proposals, and communicate with company representatives.

## Project Overview

SponsorConnect brings company information, sponsorship proposals, and conversations into one application. Organizers can explore potential sponsors and share event details with proposal documents. Administrators maintain the company directory, while assigned company managers can update their own company profiles and reply to organizers.

The project uses the **MERN stack** and demonstrates persistent **Create, Read, Update, and Delete (CRUD)** operations through company management.

## Main Features

| Category | Features |
| --- | --- |
| Accounts and Security | Registration, login, password hashing, JWT authentication, and role-based access. |
| Company Management | Administrator company CRUD; managers edit only their assigned company. |
| Company Discovery | Contact details, search, location filtering, alphabetical sorting, and expandable details. |
| Sponsorship Proposals | Event details, requested support, sponsor benefits, and PDF proposal uploads. |
| Communication | Request-linked conversations and configured email notifications. |
| Writing Assistance | User message drafting; paid AI generation requires available API credit. |
| Dashboard | Overview, Companies, My requests, Messages, and Profile. |

## Account Roles

| Role | Responsibilities |
| --- | --- |
| User / Event Organizer | Browse companies, submit proposals, view submitted requests, and message relevant company representatives. |
| Company Manager | Edit their assigned company's details and communicate with organizers about requests for that company. |
| Administrator | Manage company records and submit sponsorship requests. |

New accounts are registered as normal users. Administrator privileges and company assignments are managed through trusted backend scripts. Companies with linked requests or user accounts cannot be deleted.

## Technologies Used

**Frontend**

- React
- Vite
- JavaScript, HTML, and CSS

**Backend**

- Node.js
- Express.js
- REST APIs

**Database**

- MongoDB Atlas
- Mongoose

**Authentication**

- JSON Web Tokens (JWT)
- bcryptjs for password hashing

**File Uploads and Email**

- Multer for PDF uploads
- Nodemailer for email notifications

**Development and Testing**

- Visual Studio Code
- Postman

**Version Control**

- Git and GitHub

## Project Structure

```text
SponsorConnect/
├── backend/
│   ├── config/                   # Database configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── companyController.js
│   │   └── requestController.js
│   ├── middleware/               # Authentication and upload validation
│   ├── models/
│   │   ├── Company.js
│   │   ├── Message.js
│   │   ├── SponsorshipRequest.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── messageRoutes.js
│   │   └── requestRoutes.js
│   ├── scripts/                  # Admin and company account assignment
│   ├── services/
│   │   └── emailService.js
│   ├── tests/                    # Backend tests
│   ├── .env                      # Local configuration; excluded from Git
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js                 # Backend entry point
│   └── testConnection.js
├── frontend/
│   ├── src/
│   │   ├── assets/               # Login background and overview images
│   │   ├── App.css
│   │   ├── App.jsx               # Login and registration
│   │   ├── Companies.css
│   │   ├── Companies.jsx         # Company directory and management
│   │   ├── Dashboard.css
│   │   ├── Dashboard.jsx         # Navigation and overview
│   │   ├── index.css
│   │   ├── main.jsx              # React entry point
│   │   ├── Messages.css
│   │   ├── Messages.jsx          # Conversations and writing assistance
│   │   ├── Requests.css
│   │   └── Requests.jsx          # Sponsorship proposals
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md                 # Frontend documentation
│   └── vite.config.js
├── .gitignore
└── README.md                     # Main project documentation
```

Dependency folders (`node_modules`) and generated frontend build files (`frontend/dist`) are omitted from this overview. They are created by installation and build commands.

## Installation and Setup

### 1. Clone the repository

Install Node.js and npm before starting.

```bash
git clone https://github.com/subashiranshika2002-cmd/SponsorConnect.git
cd SponsorConnect
```

### 2. Configure and start the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```dotenv
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
EMAIL_ENABLED=false
```

Replace the placeholders with your own configuration and allow your current IP address in MongoDB Atlas Network Access. Keep `.env` and all credentials out of Git.

For email delivery, set `EMAIL_ENABLED=true` and configure `EMAIL_USER` and `EMAIL_APP_PASSWORD`. Optional `EMAIL_TEST_TO` redirects notifications to a test inbox.

```bash
npm run dev
```

The backend runs at **http://localhost:5000**. Confirm the successful database connection in the terminal.

### 3. Start the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally **http://localhost:5173**. Keep both servers running.

### 4. Prepare account roles

Register separate accounts through the application. The project owner can run these commands from `backend`:

```bash
node scripts/makeAdmin.js "YOUR_ADMIN_EMAIL"
node scripts/assignCompany.js "YOUR_COMPANY_ACCOUNT_EMAIL" "COMPANY_ID"
```

**Replace these placeholders only when running the commands:** use the registered account emails and the company's MongoDB `_id`. Create the company before assigning its representative. Log out and sign in again after changing a role.

## Testing

Use the interface and Postman to verify:

- Registration, login, and invalid credential handling.
- Company creation, viewing, editing, and deletion.
- Saved company records remaining after a page refresh and appearing in MongoDB Atlas.
- Search, filtering, and sorting.
- Managers editing their own company and being denied access to other companies.
- Proposal submission, PDF handling, and configured email delivery.
- Messages being visible to the correct organizer and company representative after refreshing.

These are verification steps; results should be recorded for the version being demonstrated.

```bash
# Run from backend/
npm test

# Run from frontend/
npm run lint
npm run build
```

## Real-World Example

SponsorConnect was used to request sponsorship for the **Xbotics event**. A company replied by email that its sponsorship budget had already been allocated.

This demonstrates practical use of the proposal and email workflow. It does not represent sponsorship approval. Email replies remain separate from in-app conversations.

## Future Development

- Real-time messaging and notifications.
- A complete sponsorship review and status update workflow.
- Public hosting of the frontend and backend.
- Improved company discovery and pagination.
- Expanded writing assistance with an affordable AI option.

Currently, the frontend and backend run locally, while MongoDB Atlas provides cloud database storage. Conversations require manual refresh, and paid AI drafting requires available API credit.

## Academic Information

**Module:** EC4307 Web Application Development  
**Institution:** Faculty of Engineering, University of Ruhuna  
**Project Type:** Individual Mini Project

---

**SponsorConnect — Your next partnership starts here.**
