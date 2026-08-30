# Fairstudy

Fairstudy is a frontend application for educational services, tutoring, and student support workflows.

## Roles and responsibilities

The platform is organized around role-based access and routing. The main roles are:

- Student: Access to student-facing pages and learning-related features.
- Tutor: Access to tutor-specific pages, lessons, appointment management, and related teaching workflows.
- Enterprise: Access to company or business-oriented pages.
- Finance: Access to billing, payments, and finance-related information.
- Admin: Full administrative access across platform management functions.
- Support: Support-focused workflows for user assistance and service requests.

## Getting started

### Prerequisites

- Node.js
- pnpm
- A valid local `.env` file for project configuration

### Installation and local run

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Set up the `.env` file in the project root.
3. Start the app locally:
   ```bash
   pnpm run start
   ```

## Development notes

- The app is built with Vite.
- Routing includes role-protected pages.
- Authentication is restored from local storage after reload.

## PayPal test account

For test payments, the current demo account is:

- Email: `wfubu-test@web.de`
- Password: `Wunderlichertest2025`

## Summary

This project is a role-based educational platform frontend focused on learning support, tutoring management, and administrative operations.
