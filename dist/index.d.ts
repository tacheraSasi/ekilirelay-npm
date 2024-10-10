/**
 * The EkiliRelay class is designed to handle email sending functionality
 * using a provided API key. It connects to a remote API endpoint and sends
 * email requests based on the given parameters.
 *
 * This class should be initialized with an API key which is used for
 * authenticating requests to the email service.
 */
declare class EkiliRelay {
    private apikey;
    private apiUrl;
    /**
     * Constructs an instance of the EkiliRelay class.
     * @param apikey - The API key required for authenticating requests
     */
    constructor(apikey: string);
    /**
     * Sends an email using the provided details.
     *
     * @param to - The recipient's email address.
     * @param subject - The subject of the email.
     * @param message - The body of the email.
     * @param headers - Optional additional headers for the email.
     * @returns A promise that resolves to the result of the email sending operation.
     */
    sendEmail(to: string, subject: string, message: string, headers?: string): Promise<{
        status: string;
        message: string;
    }>;
}

export { EkiliRelay as default };
