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
 * The EkiliRelay class is designed to handle email sending functionality
 * using a provided API key. It connects to a remote API endpoint and sends
 * email requests based on the given parameters.
 * 
 * ⚠️ SECURITY WARNING:
 * Never use this class directly in client-side code as it would expose your API key.
 * Instead, create a server-side API endpoint that uses this class securely.
 * 
 * @example Server-side usage (recommended):
 * ```typescript
 * // In your API route
 * const mailer = new EkiliRelay(process.env.RELAY_API);
 * const response = await mailer.sendEmail(to, subject, message, headers);
 * ```
 */
class EkiliRelay {
    private readonly apikey: string;
    private readonly apiUrl: string = "https://relay.ekilie.com/api/index.php";
    private readonly maxMessageSize: number = 10 * 1024 * 1024; // 10MB limit in bytes

    /**
     * Constructs an instance of the EkiliRelay class.
     * @param apikey - The API key required for authenticating requests
     * @throws {ApiError} If API key is not provided
     */
    constructor(apikey: string) {
        if (!apikey) {
            const error = new Error('API key is required') as ApiError;
            error.statusCode = 401;
            throw error;
        }
        this.apikey = apikey;
    }

    /**
     * Validates an email address format
     * @param email - The email address to validate
     * @returns boolean indicating if the email format is valid
     */
    private validateEmail(email: string): boolean {
        // RFC 5322 compliant email regex
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email);
    }

    /**
     * Get the size of a string in bytes
     * @param str - The string to measure
     * @returns number of bytes
     */
    private getStringSizeInBytes(str: string): number {
        return new TextEncoder().encode(str).length;
    }

    /**
     * Validates the request payload
     * @param request - The email request to validate
     * @throws {ApiError} If validation fails
     */
    private validateRequest(request: EmailRequest): void {
        const errors: string[] = [];

        if (!request.to || !this.validateEmail(request.to)) {
            errors.push('Invalid recipient email address');
        }

        if (!request.subject || request.subject.trim().length === 0) {
            errors.push('Subject is required');
        }

        if (!request.message || request.message.trim().length === 0) {
            errors.push('Message is required');
        }

        // Check message size using TextEncoder instead of Buffer
        if (request.message && this.getStringSizeInBytes(request.message) > this.maxMessageSize) {
            errors.push('Message exceeds maximum size limit');
        }

        if (errors.length > 0) {
            const error = new Error(errors.join(', ')) as ApiError;
            error.statusCode = 400;
            throw error;
        }
    }

    /**
     * Sanitizes input to prevent injection attacks
     * @param input - The string to sanitize
     * @returns Sanitized string
     */
    private sanitizeInput(input: string): string {
        return input
            .replace(/[<>]/g, '') // Remove < and >
            .trim();
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

export default EkiliRelay;
export type { EmailResponse, EmailRequest, ApiError };
