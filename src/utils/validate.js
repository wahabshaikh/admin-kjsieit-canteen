export default function validate(values) {
  let errors = {};

  // Name Errors
  if (!values.name) {
    errors.name = "Name required";
  } else if (values.name.length < 3) {
    errors.name = "Name must be atleast 3 characters";
  }

  // Price Errors
  if (!values.price) {
    errors.price = "Price required";
  } else if (Number(values.price) <= 0) {
    errors.price = "Price must be greater than 0";
  }

  // Estmated Time Errors
  if (!values.estimated_time) {
    errors.estimated_time = "Estimated time required";
  } else if (Number(values.estimated_time) <= 0) {
    errors.estimated_time = "Estimated time must be greater than 0";
  }

  // Category Errors
  if (!values.category) {
    errors.category = "Category required";
  }

  return errors;
}
