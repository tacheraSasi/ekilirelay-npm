// [SECURITY IMPROVEMENT] Added type definition for API responses
interface EmailResponse {
  status: 'success' | 'error';
  message?: string;
  data?: any;
}

/**
 * The EkiliRelay class is designed to handle email sending functionality
 * using a provided API key. It connects to a remote API endpoint and sends
 * email requests based on the given parameters.
 * 
 * [SECURITY IMPROVEMENT] Added explicit warning about client-side usage
 * ⚠️ SECURITY WARNING:
 * Never use this class directly in client-side code as it would expose your API key.
 * Instead, create a server-side API endpoint that uses this class securely.
 * 
 * [SECURITY IMPROVEMENT] Added server-side example in documentation
 * @example Server-side usage (recommended):
 * ```typescript
 * // In your API route
 * const mailer = new EkiliRelay(process.env.RELAY_API);
 * const response = await mailer.sendEmail(to, subject, message, headers);
 * ```
 */
class EkiliRelay {
    // [SECURITY IMPROVEMENT] Made properties readonly to prevent manipulation
    private readonly apikey: string;
    private readonly apiUrl: string = "https://relay.ekilie.com/api/index.php";

    /**
     * Constructs an instance of the EkiliRelay class.
     * @param apikey - The API key required for authenticating requests
     * [SECURITY IMPROVEMENT] Added error handling for missing API key
     * @throws {Error} If API key is not provided
     */
    constructor(apikey: string) {
        // [SECURITY IMPROVEMENT] Added API key validation
        if (!apikey) {
            throw new Error('API key is required');
        }
        this.apikey = apikey;
    }

    /**
     * [SECURITY IMPROVEMENT] Added email validation method
     * Validates an email address format
     * @param email - The email address to validate
     * @returns boolean indicating if the email format is valid
     */
    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Sends an email using the provided details.
     * 
     * [SECURITY IMPROVEMENT] Added better type definitions and validation
     * @param to - The recipient's email address
     * @param subject - The subject of the email
     * @param message - The body of the email
     * @param headers - Optional additional headers for the email
     * @returns Promise<EmailResponse> A promise that resolves to the result of the email sending operation
     * @throws {Error} If recipient email is invalid or required parameters are missing
     */
    async sendEmail(
        to: string,
        subject: string,
        message: string,
        headers?: string
    ): Promise<EmailResponse> {
        // [SECURITY IMPROVEMENT] Added input validation
        if (!this.validateEmail(to)) {
            throw new Error('Invalid recipient email address');
        }
        if (!subject || !message) {
            throw new Error('Subject and message are required');
        }

        // [SECURITY IMPROVEMENT] Using FormData instead of raw JSON for better data handling
        const formData = new FormData();
        formData.append('to', to);
        formData.append('subject', subject);
        formData.append('message', message);
        formData.append('apikey', this.apikey);
        if (headers) {
            formData.append('headers', headers);
        }

        try {
            // [SECURITY IMPROVEMENT] Added response validation
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result as EmailResponse;
        } catch (error) {
            // [SECURITY IMPROVEMENT] Added better error handling
            console.error('Error sending email:', error);
            return {
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
    
    async uploadFile(file:any){
      let formdata = new FormData()
      formdata.append("file", file)
      formdata.append("apikey",this.apikey)
      
      try{
        
      }catch(error){}
    }
}

// Export the EkiliRelay class so it can be used in other modules
export default EkiliRelay;
