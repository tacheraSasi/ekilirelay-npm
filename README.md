# ekiliRelay package

The **ekiliRelay package** is a lightweight JavaScript/TypeScript library designed to simplify email sending and file uploading via the EkiliRelay API. Authenticate your requests with your API key and integrate our services seamlessly into your application.

## Installation

Install the package using npm:

```bash
npm install ekilirelay
```

Then, import the package into your project:

```javascript
import EkiliRelay from 'ekilirelay';
```

---

## Usage

### Vanilla JavaScript

You can use the package in any project that supports ES modules or a bundler. Below are two examples: one for sending emails and one for file uploads.

#### Sending an Email (Vanilla JS)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ekiliRelay Email Test</title>
</head>
<body>
  <button id="sendEmailBtn">Send Email</button>
  <script type="module">
    import EkiliRelay from 'ekilirelay';

    // Initialize the package with your API key
    const relay = new EkiliRelay("Your-EkiliRelay-Api-Key");

    document.getElementById("sendEmailBtn").addEventListener("click", () => {
      relay.sendEmail(
        'receiver@example.com',
        'Test Subject',
        'This is a test message.',
        'From: senderName <sender@example.com>'
      )
      .then(response => {
        if (response.status === 'success') {
          console.log('Email sent successfully.');
        } else {
          console.error('Failed to send email:', response.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  </script>
</body>
</html>
```

#### Uploading a File (Vanilla JS)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ekiliRelay File Upload</title>
</head>
<body>
  <input type="file" id="fileInput" />
  <script type="module">
    import EkiliRelay from 'ekilirelay';

    // Initialize the package with your API key
    const relay = new EkiliRelay("Your-EkiliRelay-Api-Key");

    document.getElementById('fileInput').addEventListener('change', async () => {
      const fileInput = document.getElementById('fileInput');
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        try {
          const result = await relay.uploadFile(file);
          if (result.status === "success") {
            console.log("File uploaded successfully:", result);
            // You can use result.filename and result.url here
          } else {
            console.error("File upload failed:", result.message);
          }
        } catch (error) {
          console.error("Unexpected error:", error);
        }
      }
    });
  </script>
</body>
</html>
```

---

### ReactJS

In a React application, you can use the package within your components. Below is an example using a functional component with hooks.

#### Example Component for Sending an Email

```jsx
// EmailSender.jsx
import React, { useState } from 'react';
import EkiliRelay from 'ekilirelay';

const EmailSender = () => {
  const [status, setStatus] = useState('');
  const [apiKey, setApiKey] = useState('');
  const relay = new EkiliRelay(apiKey);

  const handleSendEmail = async () => {
    if (!apiKey) {
      setStatus("Please enter your API key.");
      return;
    }
    try {
      const response = await relay.sendEmail(
        'receiver@example.com',
        'Test Subject',
        'This is a test message.',
        'From: senderName <sender@example.com>'
      );
      setStatus(response.status === 'success' ? "Email sent successfully." : `Failed: ${response.message}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your API key"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
      />
      <button onClick={handleSendEmail}>Send Email</button>
      <p>{status}</p>
    </div>
  );
};

export default EmailSender;
```

#### Example Component for Uploading a File

```jsx
// FileUploader.jsx
import React, { useState } from 'react';
import EkiliRelay from 'ekilirelay';

const FileUploader = () => {
  const [apiKey, setApiKey] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const relay = new EkiliRelay(apiKey);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!apiKey) {
      setUploadStatus("Please enter your API key.");
      return;
    }
    if (!file) {
      setUploadStatus("No file selected.");
      return;
    }
    setUploadStatus("Uploading...");
    try {
      const result = await relay.uploadFile(file);
      setUploadStatus(result.status === 'success' ? `Uploaded: ${result.filename}, URL: ${result.url}` : `Upload failed: ${result.message}`);
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your API key"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <p>{uploadStatus}</p>
    </div>
  );
};

export default FileUploader;
```

---

### Next.js

When using Next.js, you can create pages or components that utilize the package. Since Next.js supports both server-side and client-side code, you should use the package on the client side (e.g., within components or pages rendered on the client).

#### Example Next.js Page for Sending an Email

```jsx
// pages/send-email.js
import { useState } from 'react';
import EkiliRelay from 'ekilirelay';

export default function SendEmailPage() {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const relay = new EkiliRelay(apiKey);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey) {
      setMessage("Please enter your API key.");
      return;
    }
    try {
      const response = await relay.sendEmail(
        'receiver@example.com',
        'Test Subject',
        'This is a test message.',
        'From: senderName <sender@example.com>'
      );
      setMessage(response.status === 'success' ? "Email sent successfully." : `Failed: ${response.message}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Send Email</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          required
        />
        <button type="submit">Send Email</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
```

#### Example Next.js Page for Uploading a File

```jsx
// pages/upload-file.js
import { useState } from 'react';
import EkiliRelay from 'ekilirelay';

export default function UploadFilePage() {
  const [apiKey, setApiKey] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const relay = new EkiliRelay(apiKey);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!apiKey) {
      setUploadMessage("Please enter your API key.");
      return;
    }
    if (!file) {
      setUploadMessage("No file selected.");
      return;
    }
    setUploadMessage("Uploading...");
    try {
      const result = await relay.uploadFile(file);
      setUploadMessage(result.status === 'success' ? `Uploaded: ${result.filename}, URL: ${result.url}` : `Upload failed: ${result.message}`);
    } catch (error) {
      setUploadMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Upload File</h1>
      <input
        type="text"
        placeholder="Enter your API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        required
      />
      <input type="file" onChange={handleFileChange} />
      <p>{uploadMessage}</p>
    </div>
  );
}
```

---

## API Reference

### `new EkiliRelay(apiKey: string)`
Creates a new instance of the EkiliRelay package.

- **Parameters:**
  - `apiKey`: Your EkiliRelay API key used for authenticating requests.

### `sendEmail(to: string, subject: string, message: string, headers?: string): Promise<{ status: string; message: string }>`
Sends an email using the provided details.

- **Parameters:**
  - `to`: Recipient's email address.
  - `subject`: Email subject.
  - `message`: Email body.
  - `headers` (optional): Additional email headers.
- **Returns:** A promise that resolves with the API response.

### `uploadFile(file: File): Promise<{ status: string; message: string; [key: string]: any }>`
Uploads a file to the EkiliRelay storage endpoint.

- **Parameters:**
  - `file`: The file to be uploaded.
- **Returns:** A promise that resolves with the upload result (e.g., filename and URL).
