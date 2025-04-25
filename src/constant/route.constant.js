const end_points = {
  /* base route */
  base: '/api',
  v1Base: '/v1',

  /* auth */
  sign_up: '/auth/sign-up',
  sign_in: '/auth/sign-in',
  sign_out: '/auth/sign-out',

  /* profile */
  profile_details: '/profile/me',
  update_password: '/profile/update-admin-password',

  /* category */
  new_category: '/category/add-new',
  all_categories: '/category/lists',
  get_category: '/category/:id',

  /* sub category */
  new_sub_category: '/subcategory/add-new',
  all_sub_category: '/subcategory/lists',
};

module.exports = {
  end_points,
};
