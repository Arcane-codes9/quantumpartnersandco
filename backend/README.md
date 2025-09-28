# BitPro24 Backend API

A full-featured Node.js backend API for a cryptocurrency trading platform built with Express, MongoDB, and Mongoose.

## 🚀 Features

- **User Authentication & Management**
  - User registration with email activation
  - JWT-based authentication
  - Password reset functionality
  - Account activation system

- **Trading Operations**
  - Trade initiation and management
  - Deposit and withdrawal requests
  - Trading history and statistics
  - Activity logging

- **Email System**
  - Professional HTML email templates
  - Promotional emails
  - Transaction notifications
  - Security alerts
  - Bulk email capabilities

- **Security Features**
  - Password hashing with bcrypt
  - JWT token authentication
  - Input validation
  - Rate limiting
  - CORS protection
  - Helmet security headers

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit the .env file with your configuration
   nano .env
   ```

4. **Configure Environment Variables**
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/bitpro24
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d
   
   # Email Configuration (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=em24investments@gmail.com
   
   # Security
   BCRYPT_ROUNDS=12
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # CORS Origins
   ALLOWED_ORIGINS=http://localhost:8080,https://em24investment.com
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "nationality": "US",
  "fullname": "John Doe",
  "password": "SecurePass123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "john@example.com",
  "password": "SecurePass123"
}
```

#### Activate Account
```http
POST /api/auth/activate
Content-Type: application/json

{
  "activationKey": "ABC123"
}
```

#### Request Activation Key
```http
POST /api/auth/actkeyrequest
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Forgot Password
```http
GET /api/auth/forgotpwd?email=john@example.com
```

#### Change Password (with reset token)
```http
POST /api/auth/changepwd
Content-Type: application/json

{
  "token": "reset-token-here",
  "newPassword": "NewSecurePass123"
}
```

#### Update Password (authenticated)
```http
POST /api/auth/updatepwd
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass123"
}
```

#### Update User Info
```http
POST /api/auth/updateinfo
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "phone": "+1234567890",
  "nationality": "US",
  "fullname": "John Updated Doe"
}
```

### Trading Endpoints

#### Initiate Trade
```http
POST /api/trading/inittrade
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "type": "buy",
  "asset": "BTC",
  "amount": 0.5,
  "price": 45000,
  "notes": "Buying Bitcoin"
}
```

#### Get Trading History
```http
GET /api/trading/trades?page=1&limit=10&status=pending&type=buy&asset=BTC
Authorization: Bearer <jwt-token>
```

#### Create Deposit
```http
POST /api/trading/deposit
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "amount": 1000,
  "method": "Bank Transfer",
  "currency": "USD",
  "walletAddress": "wallet-address-here",
  "reference": "Deposit reference"
}
```

#### Create Withdrawal
```http
POST /api/trading/withdraw
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "amount": 500,
  "method": "Bank Transfer",
  "currency": "USD",
  "walletAddress": "withdrawal-address",
  "reference": "Withdrawal reference"
}
```

#### Get Activities
```http
GET /api/trading/activities?page=1&limit=20&type=deposit
Authorization: Bearer <jwt-token>
```

#### Mark Notifications as Read
```http
POST /api/trading/notifications/read
Authorization: Bearer <jwt-token>
```

#### Get Trading Statistics
```http
GET /api/trading/stats
Authorization: Bearer <jwt-token>
```

### Email Endpoints

#### Send Promotional Email
```http
POST /api/email/promotional
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "to": "user@example.com",
  "userName": "John Doe",
  "customData": {
    "offer": "50% off trading fees"
  }
}
```

#### Send Withdrawal Notification
```http
POST /api/email/withdrawal
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "to": "user@example.com",
  "userName": "John Doe",
  "transactionId": "TXN123456789",
  "amount": 500,
  "currency": "USD",
  "date": "2024-01-15T10:30:00Z",
  "status": "approved"
}
```

#### Send Deposit Confirmation
```http
POST /api/email/deposit
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "to": "user@example.com",
  "userName": "John Doe",
  "amount": 1000,
  "currency": "USD",
  "walletId": "WALLET123456",
  "date": "2024-01-15T10:30:00Z"
}
```

#### Send Password Change Alert
```http
POST /api/email/password-alert
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "to": "user@example.com",
  "userName": "John Doe",
  "ipAddress": "192.168.1.1",
  "timestamp": "2024-01-15T10:30:00Z",
  "deviceInfo": "Chrome on Windows"
}
```

#### Send Activation Email
```http
POST /api/email/activation
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "to": "user@example.com",
  "userName": "John Doe",
  "activationKey": "ABC123"
}
```

#### Send Custom Email
```http
POST /api/email/custom
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Custom Email Subject",
  "template": "promotional",
  "html": "<h1>Custom HTML content</h1>"
}
```

#### Send Bulk Promotional Emails
```http
POST /api/email/bulk-promotional
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "recipients": [
    {
      "email": "user1@example.com",
      "userName": "User One"
    },
    {
      "email": "user2@example.com",
      "userName": "User Two"
    }
  ],
  "customData": {
    "offer": "Special promotion"
  }
}
```

#### Get Email Templates
```http
GET /api/email/templates
Authorization: Bearer <jwt-token>
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  username: String,
  email: String,
  phone: String,
  nationality: String,
  fullname: String,
  password: String (hashed),
  isActivated: Boolean,
  activationKey: String,
  resetPasswordToken: String,
  resetTokenExpiry: Date,
  createdAt: Date,
  updatedAt: Date,
  notifications: [
    {
      type: String,
      message: String,
      date: Date,
      read: Boolean
    }
  ]
}
```

### Trades Collection
```javascript
{
  userId: ObjectId,
  type: String, // 'buy' or 'sell'
  asset: String,
  amount: Number,
  price: Number,
  status: String, // 'pending', 'completed', 'cancelled', 'failed'
  totalValue: Number,
  fees: Number,
  notes: String,
  createdAt: Date
}
```

### Transactions Collection
```javascript
{
  userId: ObjectId,
  type: String, // 'deposit' or 'withdrawal'
  amount: Number,
  status: String, // 'pending', 'approved', 'rejected', 'cancelled'
  method: String,
  currency: String,
  transactionId: String,
  walletAddress: String,
  reference: String,
  notes: String,
  processedAt: Date,
  processedBy: ObjectId,
  createdAt: Date
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/bitpro24 |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `SMTP_HOST` | SMTP server host | smtp.gmail.com |
| `SMTP_PORT` | SMTP server port | 587 |
| `SMTP_USER` | SMTP username | - |
| `SMTP_PASS` | SMTP password | - |
| `EMAIL_FROM` | From email address | - |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `ALLOWED_ORIGINS` | CORS allowed origins | http://localhost:8080,https://em24investment.com |

## 🚀 Deployment

### Production Setup

1. **Set environment variables for production**
   ```bash
   NODE_ENV=production
   JWT_SECRET=your-production-secret-key
   MONGODB_URI=your-production-mongodb-uri
   ```

2. **Install PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "bitpro24-api"
   pm2 save
   pm2 startup
   ```

3. **Set up reverse proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔒 Security Features

- **Password Security**: bcrypt hashing with configurable rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Configurable rate limiting to prevent abuse
- **CORS Protection**: Restrictive CORS configuration
- **Security Headers**: Helmet.js for security headers
- **Error Handling**: Comprehensive error handling and logging

## 📧 Email Templates

The application includes professional HTML email templates for:

- **Promotional Emails**: Crypto investment opportunities
- **Withdrawal Notifications**: Transaction status updates
- **Deposit Confirmations**: Fund receipt confirmations
- **Password Change Alerts**: Security notifications
- **Activation Emails**: Account activation instructions

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": [
    {
      "field": "field_name",
      "message": "Validation error message",
      "value": "invalid_value"
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Email: support@em24investment.com
- Documentation: [API Documentation](docs/api.md)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete authentication system
- Trading operations
- Email system with templates
- Security features
- Comprehensive API documentation 