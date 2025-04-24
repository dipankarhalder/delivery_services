const end_points = {
  /* base route */
  base: '/api',
  v1Base: '/v1',

  /* auth */
  signup: '/auth/signup',
  signin: '/auth/signin',
  signout: '/auth/signout',

  /* profile */
  profile_details: '/profile/me',
  update_password: '/profile/update-password',
};

module.exports = {
  end_points,
};
