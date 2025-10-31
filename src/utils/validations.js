const validator = require("validator");

const doValidateSignUpData = (req) => {
  const { firstName, lastName, password, emailId } = req.body;
  console.log(req.body);

  if (!firstName || !lastName) {
    throw new Error("Name should not be empty");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name should be within 4-50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email id should be valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password should be valid");
  }
};

module.exports = { doValidateSignUpData };
