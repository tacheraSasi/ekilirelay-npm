// Types for request and response
interface EmailResponse {
  status: 'success' | 'error';
  message?: string;
  data?: any;
}

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  headers?: string;
}

interface ApiError extends Error {
  statusCode?: number;
}

/**
 * The EkiliRelay class handles email sending and file upload functionality
 * using a provided API key. It connects to remote API endpoints and sends requests
 * based on the given parameters.
 */
class EkiliRelay {
  private apikey: string;
  private apiUrl: string;

  /**
   * Constructs an instance of the EkiliRelay class.
   * @param apikey - The API key required for authenticating requests.
   */
  constructor(apikey: string) {
    this.apikey = apikey;
    this.apiUrl = "https://relay.ekilie.com/api/index.php";
    console.log("EkiliRelay connected");
  }

  /**
   * Sends an email using the provided details
   * @param to - Recipient's email address
   * @param subject - Email subject
   * @param message - Email body content
   * @param headers - Optional email headers
   * @returns Promise with email sending result
   */
  async sendEmail(
    to: string,
    subject: string,
    message: string,
    headers?: string
  ): Promise<EmailResponse> {
    try {
      const requestData = {
        apikey: this.apikey,
        to,
        subject,
        message,
        headers,
      };

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send email');
      }
      return result;
    } catch (error) {
      return {//TODO:Use the interfaces in the types
        status: "error", 
        message: (error as Error).message 
      };
    }
  }

  /**
   * Uploads a file to the remote storage API
   * @param file - File to be uploaded
   * @returns Promise with upload operation result
   */
  async uploadFile(file: any): Promise<{ status: string; message: string; [key: string]: any }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("apikey", this.apikey);

    try {
      const response = await fetch(
        "https://relay.ekilie.com/api/storage/v1/index.php",
        { method: "POST", body: formData }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    } catch (error) {
      return { 
        status: "error", 
        message: (error as Error).message 
      };
    }
  }
}

export default EkiliRelay;
export type { EmailResponse, EmailRequest, ApiError };