let appMode = process.env.REACT_APP_ENV;
let ASSET_URL = "http://localhost:7900/api/";
let URL;

console.log("appMode", appMode);

// 3.20.147.34

if (appMode === "development") {
  URL = "http://localhost:4200/api/";
} else {
  URL = "http://localhost:4200/api/";
}

let apiPath = {
  baseURL: URL,
  assetURL: ASSET_URL,
  dashboard: "admin/dashboard",

  listOrder: "admin/order/list",
  viewOrder: "admin/order/view",
  statusOrder: "admin/status",

  listTransaction: "admin/transaction/list",
  viewTransaction: "admin/transaction/view",

  // Auth API
  logout: "admin/auth/logout",
  login: "admin/auth/login",

  profile: "admin/auth/get-profile",
  updateProfile: "admin/auth/update-profile",
  changePassword: "admin/auth/change-password",
  updateAppSetting: "admin/auth/update-app-setting",

  forgotPassword: "admin/auth/forgot-password",
  verifyOTP: "admin/auth/verify-otp",
  resetPassword: "admin/auth/reset-password",

  // Customer APIs
  listCustomer: "admin/student",
  addEditCustomer: "admin/student",
  deleteCustomer: "admin/delete",
  statusCustomer: "admin/student/status",
  viewStudent: "admin/student/view",
  importCustomer: "admin/student/import-file",

  // Teacher APIs
  subAdmin: "admin/teacher",
  addEditTeacher: "admin/teacher",
  statusSubAdmin: "admin/teacher/status",
  viewTeacher: "admin/teacher/view",
  getModule: "admin/teacher/module-list",
  addPermission: "admin/teacher/add-permission",

  // Lead API'S
  listSource: "admin/source",
  addEditSource: "admin/source",
  listLeadStatus: "admin/status",
  addEditLeadStatus: "admin/status",
  listLead: "admin/lead",

  //Master API'S
  listClass: "admin/class",
  listSection: "admin/section",

  // Roll APIs
  role: "admin/role",
  statusRole: "admin/role/status",

  // Profile APIS
  listProfile: "/admin/provider-profile",
  statusProfile: "/admin/provider-profile/status",

  //collector
  collector: "admin/collector",
  location: "admin/service-location",

  // driver APIs
  driver: "admin/driver",
  importDealer: "admin/dealer/import-file",

  checkCode: "admin/discount/check-code",
  discount: "admin/discount",
  revenue: "admin/revenue",
  report: "admin/report",
  request: "admin/request",

  //bannner API
  banner: "admin/banner",
  statusBanner: "admin/banner/status",
  history: "admin/delivery-history",
  checkOrder: "admin/banner/check-order",

  // Content APIs
  content: "admin/content",
  notification: "admin/notification",
  notificationUser: "admin/notification/user-notification",
  rating: "admin/rating",

  finance: "admin/finance",

  // EmailTemplate APIs
  listEmailTemplate: "admin/email-template/list",
  addEditEmailTemplate: "admin/email-template/add-edit",
  statusEmailTemplate: "admin/email-template/status",
  viewEmailTemplate: "admin/email-template/view",

  // Blog APIs
  listBlog: "admin/blog",
  addEditBlog: "admin/blog",
  statusBlog: "admin/blog/status",
  viewBlog: "admin/blog/view",

  //category
  listCategory: "admin/category",
  statusCategory: "admin/category/status",

  // sub category
  listSubCategory: "admin/sub-category",
  statusSubCategory: "admin/sub-category/status",

  //event Types
  listEventType: "admin/event-type",
  statusEventType: "admin/event-type/status",

  //Services
  listService: "admin/service",
  statusService: "admin/service/status",

  //attribute
  listAttribute: "admin/attribute",
  statusAttribute: "admin/attribute/status",
  listAttributePerCategory: "admin/attribute/view",

  //quote-template
  listQuoteTemplate: "admin/quote-template",
  statusQuoteTemplate: "admin/quote-template/status",

  //restaurant
  providerList: "admin/restaurant",

  getAppSetting: "common/app-setting",

  // Size APIs
  size: "admin/size",

  //order
  order: "admin/order",

  //log
  log: "admin/activity-log",

  // delivery charge
  deliveryCharge: "admin/delivery-charge",

  //Vendor apis

  common: {
    class: "common/class",
    leadSource: "common/lead-source",
    classSection: "common/class-section",
    leadStatus: "common/lead-status",
  },

  //Common apis
  adminCommon: "admin/common",
  allCategory: "admin/common/categories",
  allSubCategory: "admin/common/sub-category",
  allRole: "admin/common/role",
  allSubAdmin: "admin/common/sub-admin",
  allServices: "admin/common/services",
  Services: "admin/common/all-services",
  allProivder: "admin/common/provider",
  allAttribute: "admin/common/attribute",
  allAttributeByCategory: "admin/common/attribute-by-category",
  allEventType: "admin/common/event-type",

  // Auth API
  logout: "admin/auth/logout",
  signUp: "vendor/auth/sign-up",
};

export default apiPath;
