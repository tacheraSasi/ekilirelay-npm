class EkiliRelay {
    private apiUrl: string;

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
    async sendEmail(to: string, subject: string, body: string, from: string, headers: string = ''): Promise<object> {
        const data = {
            to: to,
            subject: subject,
            body: body,
            from: from,
            headers: headers
        };

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
            }
            const result = await response.json();
            return result;
        } catch (error) {
            if (error instanceof Error) {
                return { status: 'error', message: error.message };
            } else {
                return { status: 'error', message: 'An unknown error occurred' };
            }
        }
    }
}

export default EkiliRelay;
// End of EkiliRelay SDK implementation
