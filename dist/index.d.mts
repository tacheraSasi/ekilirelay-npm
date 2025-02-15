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
declare class EkiliRelay {
    private readonly apikey;
    private readonly apiUrl;
    private readonly maxMessageSize;
    /**
     * Constructs an instance of the EkiliRelay class.
     * @param apikey - The API key required for authenticating requests
     * @throws {ApiError} If API key is not provided
     */
    constructor(apikey: string);
    /**
     * Validates an email address format
     * @param email - The email address to validate
     * @returns boolean indicating if the email format is valid
     */
    private validateEmail;
    /**
     * Get the size of a string in bytes
     * @param str - The string to measure
     * @returns number of bytes
     */
    private getStringSizeInBytes;
    /**
     * Validates the request payload
     * @param request - The email request to validate
     * @throws {ApiError} If validation fails
     */
    private validateRequest;
    /**
     * Sanitizes input to prevent injection attacks
     * @param input - The string to sanitize
     * @returns Sanitized string
     */
    private sanitizeInput;
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
    sendEmail(to: string, subject: string, message: string, headers?: string): Promise<{
        status: string;
        message: string;
    }>;
    uploadFile(file: any): Promise<void>;
}

export { type ApiError, type EmailRequest, type EmailResponse, EkiliRelay as default };
