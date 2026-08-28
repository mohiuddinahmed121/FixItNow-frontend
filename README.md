# FixItNow

FixItNow is a home service marketplace that connects customers with technicians for different home services.

## Features

- Customer, Technician, and Admin roles
- JWT authentication
- Service browsing and management
- Booking management
- Technician booking status updates
- Stripe online payment
- Stripe webhook handling
- Customer reviews
- Role-based access control
- Server-side validation and error handling

## Tech Stack

**Frontend:** Next.js, React, TypeScript, TanStack Query, Tailwind CSS

**Backend:** Node.js, Express.js, TypeScript, Prisma, PostgreSQL, JWT, Stripe

## User Roles

**Customer**
- Browse services
- Create and manage bookings
- Make payments
- Submit reviews

**Technician**
- Manage booking requests
- Accept or decline bookings
- Update booking status

**Admin**
- Manage users
- Manage services and categories
- Manage the platform

## Payment Flow

Customer → Booking → Technician Accepts → Stripe Checkout → Stripe Webhook → Payment Completed → Booking Paid


## Author

Mohiuddin Ahmed

Computer Science & Engineering  
University of Asia Pacific
