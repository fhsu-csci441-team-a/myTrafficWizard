// responsible for controlling request for email & sms messages
// routes for gmail messages through gmailController.js

const nodemailer = require('nodemailer');
require('dotenv').config();
const MessageModel = require('../models/messageModel');

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
const gmailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILAPPPASSWORD,
    },
});

// /**
//  * Create the mailOptions object. It is our actual email or SMS.
//  * This is part of the nodemailer package.
//  * It identifies the email as coming from myTrafficWizard and uses the email 
//  * address associated with the project.
//  * 
//  * The object accepts email addresses and email objects, a list of email addresses 
//  * and email objects, or an array of email addresses and email objects.
//  * 
//  * The list of fields used below is not exhaustive. To include additional fields 
//  * see the nodemailer message documentation at https://nodemailer.com/message/
//  */
// const mailOptions = {
//     from: {
//         name: 'myTrafficWizard',
//         address: process.env.GMAILUSER,
//     },
//     to: [process.env.TESTEMAILADDRESS],
//     subject: 'Email from myTrafficWizard',
//     text: message.getTextMessage(),
//     html: message.getHTMLMessage(),
//     /*  cc: [list of addresses],
//         bcc: [list of addresses], 
//         and 
//         attachments: [
//             {
//                 filename: 'filename.ext',
//                 path: path.join(dir, 'filename.ext'),
//                 contentType: 'application/filetype'
//             },
//             // additional files here with above format
//         ] 
//         can be included here
//     */
// }

// const sendGMail = async () => {
//     try {
//         await transporter.sendMail(mailOptions);
//         console.log('Email sent!');
//     } catch (error) {
//         console.log(error);
//     }
// }

/**
 * 'gmailController' provides a connection to GMail for sending email and SMS 
 * messages from myTrafficWizard to recipients provided to it. A messageModel 
 * object provides the formatted content of the message to be sent.
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
     * @param {string or Object} recipientList one or more email addresses or SMS 
     *                                         numbers (formatted as an email address) 
     *                                         This can be a comma separated list of 
     *                                         emails or an array of emails or an 
     *                                         array of comma separated list of 
     * @param {Object} transporter a tranporter object containing the necessary 
     *                             connection details to communicate with gmail
     *                                         emails or address objects
     * @param {Object} message a messageModel object containing the formatted 
     *                         notification output to be sent to the user
     */
    constructor(recipientList, message) {
        this.#message = message;

        this.#gmailTransporter = gmailTransporter;

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

    async sendGMail() {
        try {
            const info = await this.#gmailTransporter.sendMail(this.#mailOptions);
            console.log('Email sent!');
            return info;
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = GmailController;