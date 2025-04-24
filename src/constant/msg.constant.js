/* database msg */
const db_msg = {
  db_success: 'Database successfully connected on port : 27017.',
  db_failed: 'Database failed to connect.',
};

/* server msg */
const server = {
  serve_success: 'Server successfully started on port : ',
};

/* common application msg */
const app_msg = {
  some_thing_wrong: 'Something went wrong, please try again later.',
  internal_server_error: 'Internal Server Error.',
  api_not_found: 'The API url not found.',
};

const user_msg = {
  require_first_name: 'First name should not be blank.',
  require_last_name: 'last name should not be blank.',
  require_phone: 'Phone number should not be blank.',
  require_email: 'Email address should not be blank.',
  require_password: 'Password should not be blank.',
  require_role: 'Role should be select a option.',
  require_old_password: 'Old password should not be blank.',
  require_new_password: 'New password should not be blank.',

  validate_user_email: 'Please enter a valid email address',
  email_already_exist: 'Provided email is already associated with another user.',
  exist_user_email: 'Provided email address is not exist!',

  user_login_successfully: 'You are successfully logged-in.',
  user_logout_successfully: 'You are Logged-out successfully.',

  minimum_phone: 'Phone must be at least 10 characters.',
  minimum_password: 'Password must be at least 6 characters.',
  old_minimum_password: 'Old password should be at least 6 characters.',
  new_minimum_password: 'New password should be at least 6 characters.',
  user_wrong_password: 'Entered password is invalid, please try again.',
  compare_both_password: 'New password should be different from old password',

  updated_user_password: 'Password successfully updated.',
  updated_user_profile: 'Profile successfully updated.',
  new_user_created: 'New user created successfully.',
  user_not_found: 'The user is not found.',

  invalid_token: 'Invalid token, please login again.',
  access_denied: 'Access denied. No token provided.',
};

module.exports = {
  db_msg,
  server,
  app_msg,
  user_msg,
  // deliveryMsg,
};
