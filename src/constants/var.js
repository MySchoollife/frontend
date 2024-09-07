export const Last20Years = Array.from({ length: 20 }, (_, index) =>
  (new Date().getFullYear() - index).toString()
);
export const Months = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

export const deleteAccount = [
  "I am getting better deal somewhere else.",
  "I am not getting the service I was promised.",
  "I am not getting proper support from the team.",
  "I am not getting the features I want.",
  "I want some customization according to my need.",
  "Other",
];

export const BlockRest = [
  "Quality and Safety Issues",
  "Chronic Order Delays",
  "Misrepresentation",
  "Violation of Platform Policies",
  "Illegal Activities",
];

export const BlockDriver = [
  "Consistent Order Delays",
  "Poor Customer Service",
  "Reckless Driving",
  "Fraudulent Activity",
  "Violation of Platform Policies",
];

export const CancelOrder = [
  "Payment Issues",
  "Unavailability of Items",
  "Delivery Address Inaccuracy",
  "Security or Fraud Concerns",
  "Violation of Platform Policies",
  "Customer Not Accept",
  "Customer Absent",
];

export const BlockSubAdmin = [
  "Violation of Company Policies",
  "Breach of Security Protocols",
  "Misuse of Administrative Privileges",
  "Failure to Fulfill Assigned Responsibilities",
  "Engagement in Unethical Behavior",
];

export const DeleteBanner = [
  "Expired Promotion or Event",
  "Incorrect Information",
  "Inappropriate Content",
  "Rebranding or Campaign Change",
  "Design or Layout Issues",
];

export const religion = [
  { name: "hindu", label: "HINDU" },
  { name: "muslim", label: "MUSLIM" },
  { name: "sikh", label: "SIKH" },
  { name: "Christian", label: "CHRRISTIAN" },
  { name: "buddhist", label: "BUDDHIST" },
  { name: "jain", label: "JAIN" },
  { name: "dawoodi_bohra", label: "DAWOODI BOHRA" },
  { name: "other", label: "OTHER" },
];

export const nationality = [
  { name: "indian", label: "INDIAN" },
  { name: "nepalese", label: "NEPALESE" },
  { name: "other", label: "OTHER" },
];

export const castCategory = [
  { name: "general", label: "GENERAL" },
  { name: "obc", label: "OBC" },
  { name: "sbc", label: "SBC" },
  { name: "sc", label: "SC" },
  { name: "st", label: "ST" },
  { name: "ews", label: "EWS" },
  { name: "other", label: "OTHER" },
];

export const rolesOptions = [
  { name: "dashboard-management", label: "Dashboard Management" },
  { name: "student-manager", label: "Student Management" },
  { name: "teacher-manager", label: "Teacher Management" },
  { name: "event-manager", label: "Event Type Management" },
  { name: "service-manager", label: "Service Management" },
  { name: "category-management", label: "Category Management" },
  { name: "sub-category-management", label: "Sub Category Management" },
  { name: "quotation-request", label: "Quotation Request Management" },
  { name: "cms-manager", label: "CMS Management" },
  // { name: "delivery-manager", label: "Delivery History Management" },
  // { name: "rating-manager", label: "Rating and Reviews Management" },
  // { name: "report-manager", label: "Reports Management" },
  // { name: "banner-manager", label: "Banner Management" },
  // { name: "finance-manager", label: "Financial Management" },
  // { name: "collector-manager", label: "Collection Management" },
  // { name: "service-location-manager", label: "Service Location  Management" },
  // { name: "delivery-charge-manager", label: "Delivery charge  Management" },
  { name: "Notifications", label: "Notifications Management" },
  { name: "email-template-manager", label: "Email Template Management" },
];

export const Palestine = {
  id: "646b2e0f46865f1f65565346",
  name: "Palestine",
};

export const ProfileOptions = [
  // General---->
  {
    name: "name",
    label: "Business Name",
    is_selected: true,
    is_required: true,
    is_disable: true,
  },
  {
    name: "ar_name",
    label: "Business Name Arabic",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },
  {
    name: "description",
    label: "Business Description",
    is_selected: true,
    is_required: true,
    is_disable: true,
  },
  {
    name: "ar_description",
    label: "Business Description Arabic",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },

  {
    name: "country_id",
    label: "Country",
    is_selected: true,
    is_required: true,
    is_disable: true,
  },
  {
    name: "city_id",
    label: "City",
    is_selected: true,
    is_required: true,
    is_disable: true,
  },

  {
    name: "sub_category_id",
    label: "Sub Category Name",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },
  {
    name: "associated_manager",
    label: "Associated manager",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },

  // { name: "address", label: "Address", is_selected: false, is_required: false, is_disable: false},
  // { name: "ar_address",label: "Address Arabic",is_selected: false,is_required: false, is_disable: false},

  // Contact----->
  {
    name: "contact_person_name",
    label: "Contact Person Name",
    is_selected: true,
    is_required: true,
    is_disable: true,
  },
  {
    name: "email",
    label: "Email ID",
    is_selected: true,
    is_required: true,
    is_disable: true,
  },
  {
    name: "mobile",
    label: "Contact Person Phone Number",
    is_selected: true,
    is_required: true,
    is_disable: true,
  },
  {
    name: "password",
    label: "Create Password",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },

  // Media---->
  {
    name: "website_url",
    label: "Website Url",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },
  {
    name: "logo",
    label: "Upload Logo",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },

  {
    name: "image",
    label: "Upload Image",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },
  {
    name: "cover_photo",
    label: "Upload Cover Image",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },
  {
    name: "location",
    label: "Location",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },
  {
    name: "working_days",
    label: "Working day's",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },

  // Event ----->
  {
    name: "eventtype_id",
    label: "Event",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },

  // offerrings---->

  // { name: "category-name", label: "Category Name" ,is_selected:false,is_required:false},
  {
    name: "service_id",
    label: "Service Name",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },
  {
    name: "packages",
    label: "Package",
    is_selected: false,
    is_required: false,
    is_disable: false,
  },

  // {
  //   name: "images_per_service",
  //   label: "Number of Images per service",
  //   is_selected: false,
  //   is_required: false,
  //   is_disable: false,
  // },
  // {
  //   name: "number_of_service",
  //   label: "Number of services",
  //   is_selected: false,
  //   is_required: false,
  //   is_disable: false,
  // },
];
