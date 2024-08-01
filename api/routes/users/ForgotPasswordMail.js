const aws = require("aws-sdk");
const config = require("../../../config/server");

const ForgotPasswordLink = async (email, username, verificationToken) => {
  const SES_CONFIG = {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: "eu-north-1",
  };

  const passwordResetLink = `https://spot-store.netlify.app/reset-password/${verificationToken}`;

  const params = {
    Destination: {
      /* required */
      ToAddresses: [
        email,
        /* more items */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `
                <h4>Hello ${username}</h4>,
                <h5>Please click on the below url to reset your password</h5>
                <p><a href='${passwordResetLink}'>Reset Password</a></p>
            `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Reset your Spot Store Account Password",
      },
    },
    Source: config.email /* required */,
  };

  const mailRequest = new aws.SES(SES_CONFIG).sendEmail(params).promise();
  return mailRequest;
};

module.exports = ForgotPasswordLink;
