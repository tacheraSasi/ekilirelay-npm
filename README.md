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

Using with Next.js API Routes (recommended):

```typescript
// pages/api/send-email.ts or app/api/send-email/route.ts
import EkiliRelay from 'ekilirelay';

export async function POST(request: Request) {
  try {
    const { to, subject, message, from } = await request.json();
    
    // API key is securely stored in environment variables
    const mailer = new EkiliRelay(process.env.RELAY_API);
    
    const response = await mailer.sendEmail(
      to,
      subject,
      message,
      `From: ${from}`
    );

    return Response.json(response);
  } catch (error) {
    return Response.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

Then in your client-side code:

```typescript
// Your client-side component
async function sendEmail(data) {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

### Express.js Example:

```typescript
import express from 'express';
import EkiliRelay from 'ekilirelay';

const app = express();
app.use(express.json());

app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, message, from } = req.body;
    const mailer = new EkiliRelay(process.env.RELAY_API);
    
    const response = await mailer.sendEmail(to, subject, message, `From: ${from}`);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
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

2. **Input Validation**
   - Validate email addresses
   - Sanitize message content
   - Implement rate limiting

3. **Error Handling**
   - Implement proper error handling
   - Don't expose sensitive information in error messages

## Environment Variables

```env
# .env file
RELAY_API=your-api-key-here
```

## TypeScript Support

This package includes TypeScript types out of the box.

## License

ISC
