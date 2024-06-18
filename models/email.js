const { defaultEmailSender } = require("../constants/global");

class Email {
  constructor(sendSmtpEmail, apiInstance) {
    this.sendSmtpEmail = sendSmtpEmail;
    this.apiInstance = apiInstance;
  }

  async send({
    subject = "Without subject",
    content,
    sender = defaultEmailSender,
    replyTo = defaultEmailSender,
    destinataries = []
  }) {
    try {
      this.sendSmtpEmail.subject = subject;
      this.sendSmtpEmail.htmlContent = content;
      this.sendSmtpEmail.sender = sender;
      this.sendSmtpEmail.to = destinataries;
      this.sendSmtpEmail.replyTo = replyTo;
      await this.apiInstance.sendTransacEmail(this.sendSmtpEmail);
    } catch (error) {
        console.info(error)
    }
  }
}

module.exports = Email;
