const aws = require("aws-sdk");
const config = require("../../../config/server");

const verificationEmailRequest = async (email, username, verificationToken) => {
  const SES_CONFIG = {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: "eu-north-1",
  };

  const verificationUrl = `https://spot-store-backend.vercel.app/api/v1/user/auth/verify/${verificationToken}`;

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
                <h5>Hello ${username}, welcome to Spot Store</h5>
                <h6>Please click on the below url to verify your email</h6>
                <p><a href='${verificationUrl}'>verify your account</a></p>
            `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Verify your Spot Store Account",
      },
    },
    Source: config.email /* required */,
  };

  const mailRequest = new aws.SES(SES_CONFIG).sendEmail(params).promise();
  return mailRequest;
};

module.exports = verificationEmailRequest;
