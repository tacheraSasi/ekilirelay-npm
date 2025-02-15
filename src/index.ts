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
 * The EkiliRelay class is designed to handle email sending and file upload functionality
 * using a provided API key. It connects to remote API endpoints and sends requests based
 * on the given parameters.
 *
 * This class should be initialized with an API key which is used for authenticating
 * requests to the email service.
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
     * Sends an email using the provided details.
     * 
     * @param to - The recipient's email address
     * @param subject - The subject of the email
     * @param message - The body of the email
     * @param headers - Optional additional headers for the email
     * @returns Promise<EmailResponse> A promise that resolves to the result of the email sending operation
     * @throws {ApiError} If validation fails or request fails
     */
    async sendEmail(
        to: string,
        subject: string,
        message: string,
        headers?: string
    ): Promise<EmailResponse> {
        try {
            // Validate request
            this.validateRequest({ to, subject, message, headers });

            // Sanitize inputs
            const sanitizedTo = this.sanitizeInput(to);
            const sanitizedSubject = this.sanitizeInput(subject);
            const sanitizedMessage = this.sanitizeInput(message);
            const sanitizedHeaders = headers ? this.sanitizeInput(headers) : undefined;

            // Prepare form data
            const formData = new FormData();
            formData.append('to', sanitizedTo);
            formData.append('subject', sanitizedSubject);
            formData.append('message', sanitizedMessage);
            formData.append('apikey', this.apikey);
            if (sanitizedHeaders) {
                formData.append('headers', sanitizedHeaders);
            }

            // Make request
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = new Error(`HTTP error! status: ${response.status}`) as ApiError;
                error.statusCode = response.status;
                throw error;
            }

            const result = await response.json();
            return result as EmailResponse;
        } catch (error) {
            // Log error (but don't expose internal details in the response)
            console.error('Error sending email:', error);

            if ((error as ApiError).statusCode) {
                throw error;
            }

            // For unexpected errors, return a generic error
            return {
                status: 'error',
                message: 'An unexpected error occurred while sending the email'
            };
        }
    }
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
  async sendEmail(
    to: string,
    subject: string,
    message: string,
    headers: string = ""
  ): Promise<{ status: string; message: string }> {
    const data = {
      to,
      subject,
      message,
      headers,
      apikey: this.apikey,
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    } catch (error) {
      return { status: "error", message: (error as Error).message };
    }
  }

  /**
   * Uploads a file to the remote storage API.
   *
   * @param file - The file to be uploaded.
   * @returns A promise that resolves to the result of the upload operation.
   */
  async uploadFile(file: any): Promise<{ status: string; message: string; [key: string]: any }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("apikey", this.apikey);

    try {
      const response = await fetch(
        "https://relay.ekilie.com/api/storage/v1/index.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    } catch (error) {
      return { status: "error", message: (error as Error).message };
    }
  }
}

export default EkiliRelay;
export type { EmailResponse, EmailRequest, ApiError };
