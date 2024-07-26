declare class EkiliRelay {
    private apiUrl;
    constructor();
    /**
     * Sends an email using EkiliRelay.
     * @param {string} to Email address of the recipient.
     * @param {string} subject Subject of the email.
     * @param {string} body Body content of the email.
     * @param {string} from Sender's email address.
     * @param {string} [headers] Optional headers for the email.
     * @returns {Promise<object>} A promise resolving to the response object.
     */
    sendEmail(to: string, subject: string, body: string, from: string, headers?: string): Promise<object>;
}

export { EkiliRelay as default };
