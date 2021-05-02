// const baseUrl = 'http://192.168.43.44:5000/api';
const baseUrl = 'https://olhs.herokuapp.com/api';

export default {
  // POST
  LOGIN: baseUrl + '/users/auth/login-user',
  REGISTER: baseUrl + '/users/auth/register/register-user',
  CHANGE_CUSTOMER_STATUS: baseUrl + '/users/customer/status/change-customer-status/',
  SEND_CODE: baseUrl + '/users/auth/send-code/',
  POST_CASE: baseUrl + '/cases/add/',

  // GET
  VERIFY_USER_NAME: baseUrl + '/users/auth/verify-user/',
  USER_BY_ID: baseUrl + '/users/get-user/id/user-by-id/',
  USERS_BY_STATUS: baseUrl + '/users/all-users/page/limit/by-status/',
  USERS_SEARCH_BY_STATUS: baseUrl + '/users/all-users/search/by-status/',
  USER_BY_USERNAME: baseUrl + '/users/get-user/id/user/by-username/',
  ALL_APPROVED_LAWYERS: baseUrl + "/users/all/users/lawyers/approved",
  ALL_CUSTOMERS: baseUrl + "/users/all/users/customers",
  GET_ALL_CASES: baseUrl + '/cases/all-cases',
  GET_LAWYER_CASES: baseUrl + '/cases/get-lawyer-cases/',
  GET_CUSTOMER_CASES: baseUrl + '/cases/get-customer-cases/',

  // PUT
  UPDATE_PASSWORD: baseUrl + '/users/reset-password/',
  UPDATE_PROFILE: baseUrl + '/users/profile/id/update/',
  UPLOAD_AVATAR: baseUrl + '/users/user-avatar/',
  ADD_REVIEW: baseUrl + '/users/add/review/',
  UPDATE_CASE: baseUrl + '/cases/update/',
  SEND_OFFER: baseUrl + '/cases/send-offer/',
  ACCEPT_OFFER: baseUrl + '/cases/accept-offer/',
  DECLINE_OFFER: baseUrl + '/cases/decline-offer/',
  END_CASE: baseUrl + '/cases/end-case/',

  // DELETE
}