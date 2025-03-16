# ekiliRelay SDK

## ⚠️ Security Notice

**IMPORTANT:** Never expose your API key in client-side code! The API key should always be kept secure on your server.

## Installation

To get started with `ekiliRelay` use npm to install and include it in your project:

```bash
npm i ekilirelay
```

## Usage

### ✅ Recommended: Server-side Implementation (Secure)

#### 1. Create an API Route

First, create a secure API route on your server. Here are examples for different frameworks:

##### Next.js API Route (App Router):
```typescript
// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import EkiliRelay from 'ekilirelay';

// [SECURITY] Add rate limiting
import { rateLimit } from '@/lib/rate-limit';

// [SECURITY] Add request validation
const validateEmailRequest = (data: any) => {
  if (!data.to || !data.subject || !data.message) {
    return false;
  }
  // Add more validation as needed
  return true;
};

export async function POST(request: Request) {
  try {
    // [SECURITY] Implement rate limiting
    const limiter = await rateLimit.check(request);
    if (!limiter.success) {
      return NextResponse.json(
        { status: 'error', message: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // [SECURITY] Validate request body
    const data = await request.json();
    if (!validateEmailRequest(data)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { to, subject, message, from } = data;
    
    // [SECURITY] API key safely stored in environment variables
    const mailer = new EkiliRelay(process.env.RELAY_API);
    
    const response = await mailer.sendEmail(
      to,
      subject,
      message,
      `From: ${from}`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

##### Express.js Example with Security:
```typescript
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import EkiliRelay from 'ekilirelay';

const app = express();

// [SECURITY] Add basic security headers
app.use(helmet());

// [SECURITY] Add rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/send-email', limiter);

// [SECURITY] Add request validation middleware
const validateEmailRequest = (req, res, next) => {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields'
    });
  }
  next();
};

app.post('/api/send-email', 
  express.json(), 
  validateEmailRequest,
  async (req, res) => {
    try {
      const { to, subject, message, from } = req.body;
      const mailer = new EkiliRelay(process.env.RELAY_API);
      
      const response = await mailer.sendEmail(to, subject, message, `From: ${from}`);
      res.json(response);
    } catch (error) {
      console.error('Email sending error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }
);
```

#### 2. Protect Your API Route

To secure your API route, implement these security measures:

1. **Rate Limiting**
   ```bash
   # Next.js
   npm install @/lib/rate-limit

   # Express
   npm install express-rate-limit
   ```

2. **Environment Variables**
   ```env
   # .env.local or .env
   RELAY_API=your-api-key-here
   ```

3. **Request Validation**
   - Validate email format
   - Check required fields
   - Sanitize inputs
   - Set maximum request size

4. **Error Handling**
   - Don't expose internal errors
   - Log errors securely
   - Return appropriate status codes

5. **Security Headers**
   ```bash
   # Express
   npm install helmet
   ```

6. **CORS Configuration** (if needed)
   ```typescript
   // Next.js
   export const config = {
     cors: {
       origin: ['https://your-domain.com'],
       methods: ['POST']
     }
   }

   // Express
   app.use(cors({
     origin: 'https://your-domain.com',
     methods: ['POST']
   }));
   ```

#### 3. Call the API from Client-Side

Then in your client-side code:

```typescript
// Your client-side component
async function sendEmail(data) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### ⚠️ Not Recommended: Client-side Implementation (Insecure)

```javascript
// ⚠️ WARNING: This approach exposes your API key in the client!
// Use server-side implementation instead!
const sdk = new EkiliRelay("Your-EkiliRelay-Api-Key");

sdk.sendEmail(
  'receiver@example.com', 
  'Subject', 
  'Message', 
  'From: Sender <sender@example.com>'
)
  .then(response => {
    if (response.status === 'success') {
      console.log('Email sent successfully.');
    }
  })
  .catch(console.error);
```

## Security Best Practices

1. **Never expose API keys in client-side code**
   - Always keep API keys on the server side
   - Use environment variables to store sensitive data
   - Create an API endpoint to handle email sending

2. **API Route Protection**
   - Implement rate limiting
   - Validate all inputs
   - Use security headers
   - Configure CORS properly
   - Add authentication if needed

3. **Input Validation**
   - Validate email addresses
   - Sanitize message content
   - Check required fields
   - Set maximum content length

4. **Error Handling**
   - Implement proper error handling
   - Don't expose sensitive information in error messages
   - Log errors securely
   - Return appropriate HTTP status codes

## Environment Variables

```env
# .env file
RELAY_API=your-api-key-here

# Optional configuration
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
ALLOWED_ORIGINS=https://your-domain.com
```

## TypeScript Support

This package includes TypeScript types out of the box.

## License

ISC
