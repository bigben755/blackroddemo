# Blackrod Now Community Alliance Demo

A private sandbox demonstration inspired by the Blackrod Now platform.

This repository exists so Community Alliance members can explore what a local community platform could feel like without touching Blackrod Now production data.

## Core principles

- **No real Blackrod data.** All starter organisations, events, venues, contact details, volunteering opportunities and feed posts are synthetic demonstration records.
- **Private access.** The demo is protected by a shared password configured only in the deployment environment.
- **Personal sandbox.** Once inside, content edits are stored in the visitor's own browser using `localStorage`. One visitor cannot alter another visitor's demo.
- **Easy reset.** Sandbox Studio can restore the fictional starter dataset at any time.
- **Custom first-run setup.** Visitors enter their proposed platform name and the homepage/header immediately adopt that name.
- **No production integrations.** There is no production database, Resend mailbox, Facebook account, Blackrod Now API or live Community Alliance data attached to this build.

## What visitors can explore

- Configurable homepage with the familiar **What's New / What's On / What's Next** framing
- Event directory, filters, event detail and saved events
- Organisation directory and organisation profile pages
- Simulated profile claiming
- Local feed and likes
- Venue directory
- Volunteering directory
- Notifications
- **Organisation dashboard** showing how a local group can edit its profile, publish events and post community updates
- **Site admin preview** with Control, Content, Organisations, Messages, Claims and Accuracy views
- **Sandbox Studio** for creating, editing and deleting fictional organisations, events, venues, volunteer roles and feed posts
- Reset controls so the demo can always return to its starter state

## Deployment environment variables

### Backend

Set these in the deployment platform — **never commit the real values to GitHub**.

```env
DEMO_ACCESS_PASSWORD=choose-the-shared-password-here
DEMO_SESSION_SECRET=use-a-long-random-secret-here
CORS_ORIGINS=https://demo.blackrodnow.com
```

`DEMO_ACCESS_PASSWORD` is the shared password visitors enter.

`DEMO_SESSION_SECRET` signs the HttpOnly access cookie. It should be long and random and should not be the same as the visitor password.

For local development you can use:

```env
CORS_ORIGINS=http://localhost:3000
```

### Frontend

If frontend and backend are served through different origins, set:

```env
REACT_APP_BACKEND_URL=https://your-demo-backend.example
```

If `/api` is proxied to the backend on the same host, this can be omitted.

## Run locally

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

Frontend:

```bash
cd frontend
npm install
npm start
```

## Branches

`main` remains the stable repository root while the first functional demo is being built on `demo-v1`.
