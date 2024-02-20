const axios = require("axios");
const config = require("../../../config/server");

const verificationEmailRequest = async (email, username, verificationToken) => {
  const verificationUrl = `https://spot-store-backend.onrender.com/api/v1/user/auth/verify/${verificationToken}`;
  const postData = {
    Recipients: [
      {
        Email: email,
      },
    ],
    Content: {
      From: `Vitspot <${config.elasticEmailMailId}>`,
      Body: [
        {
          ContentType: "HTML",
          Content: `
                <h5>Hello ${username}, welcome to Spot Store</h5>
                <h6>Please click on the below url to verify your email</h6>
                <p><a href='${verificationUrl}'>verify your account</a></p>
            `,
        },
      ],
      Subject: "Verify your Spot Store Account",
    },
  };

  const mailRequest = await axios.post(
    "https://api.elasticemail.com/v4/emails",
    postData,
    {
      headers: {
        "Content-Type": "application/json",
        "X-ElasticEmail-ApiKey": `${config.elasticEmailApiKey}`,
      },
    }
  );
  return mailRequest;
};

module.exports = verificationEmailRequest;
