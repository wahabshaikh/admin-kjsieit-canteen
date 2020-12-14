export default function validateLogin(email, password) {
  let errors = {};

  // Email Errors
  if (!email) {
    errors.email = "Email required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.email = "Invalid email address";
  }

  // Password Errors
  if (!password) {
    errors.password = "Password required";
  }

  return errors;
}
