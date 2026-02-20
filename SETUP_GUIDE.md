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
If you want real email OTP:
1. Use Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `.env.local`:
```dotenv
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```
