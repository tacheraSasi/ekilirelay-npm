// src/index.ts
var EkiliRelay = class {
  apikey;
  // The API key required for authenticating requests
  apiUrl;
  // The URL of the API endpoint for sending emails
  /**
   * Constructs an instance of the EkiliRelay class.
   * @param apikey - The API key required for authenticating requests
   */
  constructor(apikey) {
    this.apikey = apikey;
    this.apiUrl = "https://relay.ekilie.com/api/index.php";
    console.log("EkiliRelay connected");
  }
  /**
   * Sends an email using the provided details.
   * 
   * @param to - The recipient's email address.
   * @param subject - The subject of the email.
   * @param message - The body of the email.
   * @param headers - Optional additional headers for the email.
   * @returns A promise that resolves to the result of the email sending operation.
   */
  async sendEmail(to, subject, message, headers = "") {
    const data = {
      to,
      // Recipient's email address
      subject,
      // Subject line of the email
      message,
      // Body of the email
      headers,
      // Optional additional headers
      apikey: this.apikey
      // API key for authentication
    };
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        // HTTP method to use
        headers: {
          "Content-Type": "application/json"
          // Specify that we are sending JSON data
        },
        body: JSON.stringify(data)
        // Convert the data object to a JSON string
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }
};
var src_default = EkiliRelay;
export {
  src_default as default
};
