# API Hooks Documentation

This directory contains React hooks for interacting with the backend API endpoints. All hooks are built using `@tanstack/react-query` for efficient data fetching, caching, and state management.

## Available Hooks

### 1. `useAuth` - Authentication Hook

Handles all authentication-related operations.

#### Features:
- User registration and login
- Account activation
- Password management (reset, update)
- User profile updates
- Authentication state management

#### Usage:

```tsx
import { useAuth } from '@/hooks';

function LoginComponent() {
  const {
    login,
    isLoggingIn,
    loginError,
    user,
    isAuthenticated,
    logout
  } = useAuth();

  const handleLogin = () => {
    login({
      identifier: 'user@example.com', // email or username
      password: 'password123'
    });
  };

  if (isLoggingIn) return <div>Logging in...</div>;
  if (loginError) return <div>Error: {loginError.message}</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.fullname}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

#### Available Methods:

**Authentication:**
- `register(data)` - Register new user
- `login(data)` - Login user
- `logout()` - Logout user
- `activate(activationKey)` - Activate account

**Password Management:**
- `forgotPassword(email)` - Request password reset
- `changePassword({ token, newPassword })` - Change password with reset token
- `updatePassword({ currentPassword, newPassword })` - Update password when authenticated

**Account Management:**
- `requestActivationKey(email)` - Request new activation key
- `updateInfo(data)` - Update user profile information

**State:**
- `user` - Current user object
- `isAuthenticated` - Authentication status
- `isLoadingUser` - Loading state for user data

### 2. `useTrading` - Trading Operations Hook

Handles all trading-related operations including trades, deposits, withdrawals, and activities.

#### Features:
- Trade initiation
- Deposit and withdrawal requests
- Trading history and statistics
- Activity feed
- Notification management

#### Usage:

```tsx
import { useTrading } from '@/hooks';

function TradingComponent() {
  const {
    initiateTrade,
    isInitiatingTrade,
    useTrades,
    useTradingStats,
    createDeposit,
    createWithdrawal
  } = useTrading();

  // Get trading data
  const { data: tradesData, isLoading: isLoadingTrades } = useTrades({
    page: 1,
    limit: 10,
    status: 'completed'
  });

  const { data: statsData } = useTradingStats();

  const handleTrade = () => {
    initiateTrade({
      type: 'buy',
      asset: 'BTC',
      amount: 0.1,
      price: 50000,
      notes: 'Long-term investment'
    });
  };

  const handleDeposit = () => {
    createDeposit({
      amount: 1000,
      method: 'bank_transfer',
      currency: 'USD',
      walletAddress: '0x123...',
      reference: 'REF123'
    });
  };

  if (isInitiatingTrade) return <div>Processing trade...</div>;

  return (
    <div>
      <button onClick={handleTrade}>Buy BTC</button>
      <button onClick={handleDeposit}>Deposit Funds</button>
      
      {tradesData && (
        <div>
          <h3>Trading History</h3>
          {tradesData.data.trades.map(trade => (
            <div key={trade._id}>
              {trade.type} {trade.amount} {trade.asset} at ${trade.price}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Available Methods:

**Trading Operations:**
- `initiateTrade(data)` - Create new trade
- `createDeposit(data)` - Create deposit request
- `createWithdrawal(data)` - Create withdrawal request
- `markNotificationsAsRead()` - Mark all notifications as read

**Data Queries:**
- `useTrades(params)` - Get trading history with pagination and filters
- `useActivities(params)` - Get user activities and notifications
- `useTradingStats()` - Get trading and transaction statistics

### 3. `useEmail` - Email Operations Hook

Handles all email-related operations for sending various types of emails.

#### Features:
- Promotional emails
- Transaction notifications
- Security alerts
- Account activation emails
- Custom emails
- Bulk email campaigns

#### Usage:

```tsx
import { useEmail } from '@/hooks';

function EmailComponent() {
  const {
    sendPromotional,
    sendWithdrawalNotice,
    useEmailTemplates,
    isSendingPromotional
  } = useEmail();

  const { data: templatesData } = useEmailTemplates();

  const handlePromotionalEmail = () => {
    sendPromotional({
      to: 'user@example.com',
      userName: 'John Doe',
      customData: {
        offer: '20% off',
        expiryDate: '2024-12-31'
      }
    });
  };

  const handleWithdrawalNotice = () => {
    sendWithdrawalNotice({
      to: 'user@example.com',
      userName: 'John Doe',
      transactionId: 'TXN123',
      amount: 500,
      currency: 'USD',
      date: '2024-01-15',
      status: 'completed'
    });
  };

  if (isSendingPromotional) return <div>Sending email...</div>;

  return (
    <div>
      <button onClick={handlePromotionalEmail}>Send Promotional</button>
      <button onClick={handleWithdrawalNotice}>Send Withdrawal Notice</button>
      
      {templatesData && (
        <div>
          <h3>Available Email Templates</h3>
          {templatesData.data.templates.map(template => (
            <div key={template.name}>
              <strong>{template.name}</strong>: {template.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Available Methods:

**Email Sending:**
- `sendPromotional(data)` - Send promotional email
- `sendWithdrawalNotice(data)` - Send withdrawal notification
- `sendDepositNotice(data)` - Send deposit confirmation
- `sendPasswordAlert(data)` - Send password change alert
- `sendActivationNotice(data)` - Send activation email
- `sendCustomEmail(data)` - Send custom email
- `sendBulkPromotional(data)` - Send bulk promotional emails

**Data Queries:**
- `useEmailTemplates()` - Get available email templates

## Configuration

### Environment Variables

Set the following environment variable in your `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

### Query Client Setup

Make sure to wrap your app with `QueryClient` and `QueryClientProvider`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  );
}
```

## Error Handling

All hooks provide error states that you can use to handle errors:

```tsx
const { login, loginError } = useAuth();

if (loginError) {
  console.error('Login failed:', loginError.message);
  // Show error message to user
}
```

## Loading States

All mutations provide loading states:

```tsx
const { login, isLoggingIn } = useAuth();

if (isLoggingIn) {
  return <div>Logging in...</div>;
}
```

## TypeScript Support

All hooks are fully typed with TypeScript interfaces for:
- Request data
- Response data
- Error states
- Loading states

## Best Practices

1. **Use the hooks in components that need the data**
2. **Handle loading and error states appropriately**
3. **Use the async versions of mutations when you need to handle the response**
4. **Invalidate queries when data changes**
5. **Use the provided pagination parameters for large datasets**

## Example: Complete Trading Dashboard

```tsx
import { useAuth, useTrading } from '@/hooks';

function TradingDashboard() {
  const { user, isAuthenticated } = useAuth();
  const {
    useTrades,
    useTradingStats,
    initiateTrade,
    createDeposit
  } = useTrading();

  const { data: tradesData } = useTrades({ page: 1, limit: 10 });
  const { data: statsData } = useTradingStats();

  if (!isAuthenticated) {
    return <div>Please login to access trading</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.fullname}!</h1>
      
      {statsData && (
        <div>
          <h2>Trading Statistics</h2>
          <p>Total Trades: {statsData.data.trades.totalTrades}</p>
          <p>Total Volume: ${statsData.data.trades.totalVolume}</p>
          <p>Win Rate: {statsData.data.trades.winRate}%</p>
        </div>
      )}

      {tradesData && (
        <div>
          <h2>Recent Trades</h2>
          {tradesData.data.trades.map(trade => (
            <div key={trade._id}>
              {trade.type} {trade.amount} {trade.asset} at ${trade.price}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
``` 