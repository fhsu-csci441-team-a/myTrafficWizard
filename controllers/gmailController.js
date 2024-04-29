// responsible for controlling request for email & sms messages
// routes for gmail messages through gmailController.js

const nodemailer = require('nodemailer');
require('dotenv').config();
const MessageModel = require('../models/messageModel');

/**
 * 'gmailController' provides a connection to GMail for sending email and SMS 
 * messages from myTrafficWizard to recipients provided to it. A messageModel 
 * object provides the formatted content of the message to be sent.
 * 
 * Example Usage:
 * const gmailController = new GMailController(recipientList, message);
 * gmailController.sendGMail()
 *  .then(message => console.log("Email sent successfully."))
 *  .catch(error => console.error(error));
 * 
 * This is accomplished with the help of the nodemailer package.
 */
class GmailController {
    #message;
    #gmailTransporter;
    #mailOptions;

    /**
     * Constructs an instance of gmailController.
     * The gmailTransporter and mailOptions objects are created and initialized 
     * with data from recipientList and message.
     * 
     * @param {string or Object} recipientList one or more email addresses or phone 
     *                                         numbers (formatted as an email address). 
     *                                         This can be a comma separated list of 
     *                                         emails/phone or an array of emails or an 
     *                                         array of comma separated list of emails.
     * @param {Object} message a messageModel object containing the formatted 
     *                         notification output to be sent to the user
     */
    constructor(recipientList, message) {
        this.#message = message;

        // /**
        //  * Create the transporter object for default SMTP transport.
        //  * The function createTransport accepts configuration information for the 
        //  * transporter and creates a transport configuration object.
        //  * This is part of the nodemailer package.
        //  * It stores the information for the myTrafficWizard GMail account to send email 
        //  * using App Passwords.
        //  * 
        //  * Using OAuth2 is supported by nodemailer and would be more secure.
        //  */
        this.#gmailTransporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAILUSER,
                pass: process.env.GMAILAPPPASSWORD,
            },
        });

        /**
         * Create the mailOptions object. It is our actual email or SMS.
         * This is part of the nodemailer package.
         * It identifies the email as coming from myTrafficWizard and uses the email 
         * address associated with the project.
         * 
         * The object accepts email addresses and email objects, a list of email addresses 
         * and email objects, or an array of email addresses and email objects.
         * 
         * The list of fields used below is not exhaustive. To include additional fields 
         * see the nodemailer message documentation at https://nodemailer.com/message/
         */
        this.#mailOptions = {
            from: {
                name: 'myTrafficWizard',
                address: process.env.GMAILUSER,
            },
            to: recipientList,
            subject: 'Email from myTrafficWizard',
            text: this.#message.getTextMessage(),
            html: this.#message.getHTMLMessage(),
            /*  cc: [list of addresses],
                bcc: [list of addresses], 
                and 
                attachments: [
                    {
                        filename: 'filename.ext',
                        path: path.join(dir, 'filename.ext'),
                        contentType: 'application/filetype'
                    },
                    // additional files here with above format
                ] 
                can be included here
            */
        }
    }

    /**
     * The function sendGMail sends the email or SMS message to the recipients 
     * on the previously provided reciptient list.
     * 
     * @returns {object} The response from the attempt to send the email or SMS, 
     *                   or an error message.
     */
    async sendGMail() {
        try {
            const mailerResponse = await this.#gmailTransporter.sendMail(this.#mailOptions);
            return mailerResponse;
        } catch (error) {
            return { "error": `The following error occurred: ${error}` };
        }
    }

}

module.exports = GmailController;