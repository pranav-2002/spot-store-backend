const Support = require("../../models/support/SupportModal");
const z = require("zod");
const { throwError } = require("../../middleware/errors/errorhandler");

const contactSupport = async (req, res) => {
  const contactSupportBody = z.object({
    email: z.string(),
    subject: z.string(),
    message: z.string(),
  });

  const { success } = contactSupportBody.safeParse(req.body);

  if (!success) {
    return throwError(res, 400, "Bad Request (Invalid Payload)");
  }

  const { email, subject, message } = req.body;

  try {
    const ticket = await Support.create({
      email,
      subject,
      message,
    });
    return res.status(200).json({
      message: "Message sent successfully",
      id: ticket._id,
    });
  } catch (error) {
    console.log(error);
    throwError(res, 500, "Internal Server Error");
  }
};

module.exports = { contactSupport };
