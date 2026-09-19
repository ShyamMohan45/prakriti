# DxAssist Setup Guide

## Quick Start

### 1. Start MySQL
Open Command Prompt and run:
```bash
mysql -u root -p
```

If you don't have MySQL installed:
- Download from: https://www.mysql.com/downloads/
- Or use: `choco install mysql` (if you have Chocolatey)

### 2. Set Correct Password
Check what password you set during MySQL installation. Update `.env.local`:

```dotenv
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASS=your_actual_mysql_password
DATABASE_NAME=dxassist
```

### 3. Create Database
Run in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS dxassist;
```

### 4. Test Setup
Visit: http://localhost:3000/api/setup/health

This shows the status of all connections.

### 5. Sign Up
- Go to http://localhost:3000/signup
- Fill in the form
- Click "Sign Up"
- OTP will be sent to your email
- Check your email for OTP code
- Enter OTP to complete registration

## Common Issues

### "Access denied for user 'root'"
- MySQL password in `.env.local` is wrong
- Fix: Use correct MySQL password

### "Failed to send OTP: Connection closed"
- Database connection issue
- Fix: Make sure MySQL is running

### "EMAIL_USER or EMAIL_PASS not configured"
- Email credentials missing
- Fix: Add valid Gmail credentials to `.env.local`

## Email Setup (Optional)
To send OTP to any registered email address, configure one SMTP sender account. Gmail is shown below, but any SMTP provider can be used:
1. For Gmail, generate an App Password: https://myaccount.google.com/apppasswords
2. Update `.env.local`:
```dotenv
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=sender@example.com
EMAIL_PASS=your-smtp-password-or-app-password
EMAIL_FROM=sender@example.com
```
`EMAIL_FROM` is optional and defaults to `EMAIL_USER`. The address entered by each user is used as the OTP recipient.

## Admin Dashboard
The `/dashboard` page is restricted to an admin login. Add separate local admin credentials to `.env.local`:
```dotenv
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose-a-local-admin-password
```
Restart Next.js after changing these values, then sign in at `/login` with the configured admin credentials.
