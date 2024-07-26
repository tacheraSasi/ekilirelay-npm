# ekiliRelay SDK

## Installation | JS

To get started with `ekiliRelay`, download the SDK as a zip file and include it in your project.

1. **Download the SDK from the button below:**
   [Download SDK](https://relay.ekilie.com/sdk/ekiliRelay-js-sdk-v.0.0.zip) 


   **Npm**

    ```javascript
    npm i ekili-relay;
    ```


2. **Unzip the downloaded file.**

3. **Import the SDK into your project:**

    ```javascript
    import EkiliRelay from '../path-to/sdk/js/ekiliRelay.js';
    ```

## Usage | JS

After including the SDK, you can start using `ekiliRelay` to send emails. Here's a quick example:

```html
<script type="module">
  const sendBtn = document.getElementById("send"); // Some button
  import EkiliRelay from '../path-to/sdk/js/ekiliRelay.js'; // Importing EkiliRelay

  // Initialize the SDK  
  const sdk = new EkiliRelay();

  sendBtn.addEventListener("click", () => { // Listening to a click event
    // Send an email
    sdk.sendEmail('email@example.com', 'Test Subject', 'This is a test message.', 'From: some-email@example.com')
      .then(response => {
        if (response.status === 'success') {
          console.log('Email sent successfully.');
        } else {
          console.log('Failed to send email: ' + response.message);
          console.log(response);
        }
      })
      .catch(error => {
        console.log('Error:', error);
      });
  });
</script>
