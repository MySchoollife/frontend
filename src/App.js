import React, { Suspense, useContext } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import { AuthContext, AuthProvider } from "./context/AuthContext";

import { I18nextProvider } from "react-i18next";
import i18n from "./config/i18n";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/custom.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Loader from "./components/Loader";
import PrivateRoute from "./components/PrivateRoute";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Auth/Home";
import SignIn from "./pages/Auth/SignIn";
import Error from "./pages/Error";

import { PATH_HEADING_MAP } from "./constants/path-heading-map.constants";
import ViewAttribute from "./pages/Attribute/View";
import AddProvider from "./pages/Provider/AddProvider";

import {
  Category,
  CmsManagement,
  Collector,
  Student,
  DeliveryHistory,
  Discount,
  Notifications,
  Order,
  Ratings,
  Register,
  // Reports,
  Provider,
  ViewProviderService,
  ViewProviderPackage,
  Teacher,
  SubCategory,
  EventType,
  Service,
  ProfileManager,
  QuotationRequest,
  ProfileProvider,
  Blog,
  ViewProvider,
  TwoAuthentication,
  Lead,
  Employee,
} from "./pages";

import DeliveryCharge from "./pages/DeliveryCharges/Index";

import EmailEdit from "./pages/EmailTemplate/Edit";
import EmailTemplate from "./pages/EmailTemplate/Index";
import Finance from "./pages/QuotationRequests.js/Index";
import ServiceLocation from "./pages/ServiceLocation/Index";
import ServiceLocationView from "./pages/ServiceLocation/View";
import ServiceLocationAreaView from "./pages/ServiceLocation/ViewArea";
import CollectorView from "./pages/User/Collector/View";
import InvoiceView from "./pages/QuotationRequests.js/InvoiceView";
import Attribute from "./pages/Attribute/Index";
import AddStudent from "./pages/User/Student/AddStudent";
import AddTeacher from "./pages/User/Teacher/AddForm";
import AddBlog from "./pages/Blog/Edit";
import CollectFees from "./pages/Fees/CollectFees";
import AllClass from "./pages/Masters/AllClass";
import AllSection from "./pages/Masters/AllSection";

window.Buffer = window.Buffer || require("buffer").Buffer;
function App() {
  return (
    <AuthProvider>
      <AppContextProvider>
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<Loader />}>
            <BrowserRouter>
              <ScrollToTop />
              <ToastContainer closeOnClick={false} />
              <AppRoutes />
            </BrowserRouter>
          </Suspense>
        </I18nextProvider>
      </AppContextProvider>
    </AuthProvider>
  );
}

const AppRoutes = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/sign-up" element={<Register />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Auth Routes */}
        <Route exact path="/" element={<Home />} />
        <Route exact path="/dashboard" element={<Home />} />
        {/* <Route exact path="/profile" element={<Profile />} /> */}
        {/* Student Routes */}
        <Route exact path="/student" element={<Student />} />
        <Route exact path="/add-student" element={<AddStudent />} />
        <Route exact path="/add-student/:id" element={<AddStudent />} />
        {/* Teacher Routes */}
        <Route exact path="/teacher" element={<Teacher />} />
        <Route exact path="/teacher/add-teacher" element={<AddTeacher />} />
        <Route exact path="/teacher/add-teacher/:id" element={<AddTeacher />} />
        {/* employee Routes */}
        <Route exact path="/employee" element={<Employee />} />
        <Route exact path="/employee/add-employee" element={<Employee />} />
        <Route exact path="/employee/add-employee/:id" element={<Employee />} />

        {/* Lead Routes */}
        <Route exact path="/lead" element={<Lead />} />
        <Route exact path="/lead/add-lead" element={<Lead />} />
        <Route exact path="/lead/add-lead/:id" element={<Lead />} />

        {/* Fees Routes */}
        <Route exact path="/collect-fees" element={<CollectFees />} />

        {/* Master Routes */}
        <Route exact path="/all-classes" element={<AllClass />} />
        <Route exact path="/all-section" element={<AllSection />} />

        {/* category */}
        <Route exact path="/category" element={<Category />} />
        <Route
          exact
          path="/two-authentication"
          element={<TwoAuthentication />}
        />

        {/* ProfileManager Routes */}
        <Route exact path="/profile" element={<ProfileManager />} />
        {/* sub category */}
        <Route exact path="/sub-category" element={<SubCategory />} />
        {/* Event Type */}
        <Route exact path="/event-type" element={<EventType />} />
        {/* services */}
        <Route exact path="/service" element={<Service />} />
        {/* Provider */}
        <Route exact path="/profile" element={<ProfileProvider />} />
        <Route exact path="/service-provider" element={<Provider />} />
        <Route exact path="/service-provider/add" element={<AddProvider />} />
        <Route
          exact
          path="/service-provider/view-service/:id"
          element={<ViewProviderService />}
        />
        <Route
          exact
          path="/service-provider/view-package/:id"
          element={<ViewProviderPackage />}
        />
        <Route
          exact
          path="/service-provider/add/:id"
          element={<ViewProvider />}
        />
        {/* cms manager */}
        <Route exact path="/cms" element={<CmsManagement />} />
        {/* quote Templete manager */}
        {/* <Route exact path="/quote-templates" element={<QuoteTemplate />} /> */}
        {/* delivery manager */}
        <Route exact path="/delivery" element={<DeliveryHistory />} />
        {/* Attribute Manager  */}
        <Route exact path="/attributes" element={<Attribute />} />
        {/* view Attribute */}
        <Route
          exact
          path="/attributes/:category_id/:service_id"
          element={<ViewAttribute />}
        />
        {/* finance */}
        <Route exact path="/quotation-request" element={<QuotationRequest />} />
        <Route exact path="/finance/:id/invoice" element={<InvoiceView />} />
        {/* ratings */}
        <Route exact path="/ratings" element={<Ratings />} />
        {/* notification */}
        <Route exact path="/notification" element={<Notifications />} />
        {/* blog */}
        <Route exact path="/blog" element={<Blog />} />
        <Route exact path="/blog/add" element={<AddBlog />} />
        <Route exact path="/blog/:id/edit" element={<AddBlog />} />
        {/* reports */}
        {/* <Route exact path="/reports" element={<Reports />} /> */}
        {/* discount */}
        <Route exact path="/discount" element={<Discount />} />
        {/* collector */}
        <Route exact path="/collector" element={<Collector />} />
        {/* view collector */}
        <Route exact path="/collector/:id" element={<CollectorView />} />
        <Route exact path="/locations" element={<ServiceLocation />} />
        <Route exact path="/locations/:id" element={<ServiceLocationView />} />
        <Route
          exact
          path="/locations/:id/area"
          element={<ServiceLocationAreaView />}
        />
        <Route exact path="/delivery-charge" element={<DeliveryCharge />} />
        <Route exact path="/email-templates" element={<EmailTemplate />} />
        <Route exact path="/email-templates/:id/edit" element={<EmailEdit />} />
        {/* order */}
        <Route exact path="/order" element={<Order />} />
      </Route>

      <Route path="*" element={<Error />} />
    </Routes>
  );
};

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default App;
