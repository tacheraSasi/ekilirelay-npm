// src/index.ts
var EkiliRelay = class {
  apiUrl;
  constructor() {
    this.apiUrl = "https://relay.ekilie.com/api/index.php";
    console.log("EkiliRelay connected");
  }
  /**
   * Sends an email using EkiliRelay.
   * @param {string} to Email address of the recipient.
   * @param {string} subject Subject of the email.
   * @param {string} body Body content of the email.
   * @param {string} from Sender's email address.
   * @param {string} [headers] Optional headers for the email.
   * @returns {Promise<object>} A promise resolving to the response object.
   */
  async sendEmail(to, subject, body, from, headers = "") {
    const data = {
      to,
      subject,
      body,
      from,
      headers
    };
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return { status: "error", message: error.message };
      } else {
        return { status: "error", message: "An unknown error occurred" };
      }
    }
  }
};
var src_default = EkiliRelay;
export {
  src_default as default
};
