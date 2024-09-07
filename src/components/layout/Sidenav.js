import { Image, Menu, Modal, Skeleton } from "antd";
import { Children, useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import Logo from "../../assets/images/Logo.png";
import Bio from "../../assets/images/side_nav/bi_collection.svg";
import Blog from "../../assets/images/side_nav/blog.svg";
import Cath from "../../assets/images/side_nav/cath.svg";
import Chat from "../../assets/images/side_nav/chat.svg";
import Cms from "../../assets/images/side_nav/cms.svg";
import Coust from "../../assets/images/side_nav/customer.svg";
import Dash from "../../assets/images/side_nav/dash.svg";
import Disk from "../../assets/images/side_nav/discount.svg";
import File from "../../assets/images/side_nav/file.svg";
import Log from "../../assets/images/side_nav/log.svg";
import Bell from "../../assets/images/side_nav/notification.svg";
import Order from "../../assets/images/side_nav/order.svg";
import Rest from "../../assets/images/side_nav/resturant.svg";
import Star from "../../assets/images/side_nav/star.svg";
import Sub from "../../assets/images/side_nav/sub.svg";
import Service from "../../assets/images/side_nav/sub.svg";
import User from "../../assets/images/side_nav/user.svg";
import { AuthContext } from "../../context/AuthContext";
import lang from "../../helper/langHelper";
import DeleteModal from "../DeleteModal";
import { useAppContext } from "../../context/AppContext";
import moment, { isMoment } from "moment";
import { Severty, ShowToast } from "../../helper/toast";

export const countryWithAreas = [
  "646b2e0f46865f1f65565346", //Palestine
];

export const menuItems = [
  {
    key: "dashboard-management",
    path: "/dashboard",
    icon: Dash,
    label: lang("Dashboard"),
    isShow: true,
  },

  {
    key: "/lead-manager",
    path: "/lead",
    icon: Sub,
    label: `${lang("Leads")} ${lang("Management")}`,
  },

  {
    key: "teacher-manager",
    path: "/teacher",
    icon: Sub,
    label: `${lang("Teacher")} ${lang("Management")}`,
  },
  {
    key: "student-manager",
    path: "/student",
    label: `${lang("Student")} ${lang("Management")}`,
    icon: Coust, //
  },

  {
    key: "employee-manager",
    path: "/employee",
    icon: File,
    label: `${lang("Employee")} ${lang("Management")}`,
  },
  {
    label: `${lang("Attendance")} ${lang("Management")}`,
    icon: File,
    children: [
      {
        key: "student-attendance",
        path: "/student-attendance",

        label: `${lang("Student")} ${lang("Attendance")}`,
      },
      {
        key: "student-attendance",
        path: "/student-attendance",
        label: `${lang("Student")} ${lang("Attendance")}`,
      },
    ],
  },
  {
    label: `${lang("Fees")} ${lang("Management")}`,
    icon: File,
    children: [
      {
        key: "collect-fees",
        path: "/collect-fees",
        label: `${lang("Collect")} ${lang("Fees")}`,
      },
      {
        key: "fees-defaulters",
        path: "/fees-defaulters",

        label: `${lang("Fees")} ${lang("Defaulters")}`,
      },
      {
        key: "collect-fees-log",
        path: "/collect-fees-log",
        label: `${lang("Collect")} ${lang("Fees Log")}`,
      },
      {
        key: "fees-collection-report",
        path: "/fees-collection-report",

        label: `${lang("Fees")} ${lang("Collection Report")}`,
      },
      {
        key: "student-fees-structure",
        path: "/student-fees-structure",
        label: `${lang("Student Fees")} ${lang("Structure")}`,
      },
      {
        key: "fees-structure",
        path: "/fees-structure",
        label: `${lang("Fees")} ${lang("Structure")}`,
      },
      {
        key: "fees-structure-report",
        path: "/fees-structure-report",
        label: `${lang("Fees")} ${lang("Structure Report")}`,
      },
      {
        key: "transport-structure",
        path: "/transport-structure",

        label: `${lang("Transport")} ${lang("Structure")}`,
      },
      {
        key: "online-payment",
        path: "/online-payment",
        label: `${lang("Online")} ${lang("Payment")}`,
      },
    ],
  },
  {
    label: `${lang("Expenses")} ${lang("Management")}`,
    icon: File,
    children: [
      {
        key: "all-expenses",
        path: "/all-expenses",

        label: `${lang("All")} ${lang("Expenses")}`,
      },
      {
        key: "expenses-type",
        path: "/expenses-type",
        label: `${lang("Expenses")} ${lang("Types")}`,
      },
      {
        key: "expenses-player",
        path: "/expenses-player",
        label: `${lang("Expenses")} ${lang("Player")}`,
      },
    ],
  },
  {
    label: `${lang("Income")} ${lang("Management")}`,
    icon: File,
    children: [
      {
        key: "all-income",
        path: "/all-income",

        label: `${lang("All")} ${lang("Incomes")}`,
      },
      {
        key: "income-type",
        path: "/income-type",
        label: `${lang("Income")} ${lang("Types")}`,
      },
      {
        key: "income-parties",
        path: "/income-parties",
        label: `${lang("Income")} ${lang("parties")}`,
      },
    ],
  },
  {
    key: "ledger-manager",
    path: "/ledger",
    icon: File,
    label: `${lang("Ledgers")} ${lang("Management")}`,
  },
  {
    key: "id-card-manager",
    path: "/id-card",
    icon: File,
    label: `${lang("ID Cards")} ${lang("Management")}`,
  },
  {
    key: "sms-manager",
    path: "/sms",
    icon: File,
    label: `${lang("SMS")} ${lang("Management")}`,
  },
  {
    key: "notice-manager",
    path: "/notice",
    icon: File,
    label: `${lang("Notice")} ${lang("Management")}`,
  },
  {
    label: `${lang("Admit Card")} ${lang("Management")}`,
    icon: File,
    children: [
      {
        key: "admit-card",
        path: "/admit-card",

        label: `${lang("Admit")} ${lang("Cards")}`,
      },
      {
        key: "income-type",
        path: "/income-type",
        label: `${lang("Income")} ${lang("Types")}`,
      },
      {
        key: "exam-time-table",
        path: "/exam-time-table",
        label: `${lang("Exam Time")} ${lang("Table")}`,
      },
    ],
  },
  {
    key: "tc-manager",
    path: "/tc",
    icon: File,
    label: `${lang("TC")} ${lang("Management")}`,
  },
  {
    label: `${lang("Marksheet")} ${lang("Management")}`,
    icon: File,
    children: [
      {
        key: "all-marksheets",
        path: "/all-marksheets",

        label: `${lang("All")} ${lang("MarkSheets")}`,
      },
      {
        key: "bulk-markupdate",
        path: "/bulk-markupdate",
        label: `${lang("Bulk")} ${lang("Marks Updates")}`,
      },
    ],
  },
  {
    label: `${lang("Masters")} ${lang("Management")}`,
    icon: File,
    children: [
      {
        key: "all-classes",
        path: "/all-classes",
        label: `${lang("All")} ${lang("Classes")}`,
      },
      {
        key: "all-section",
        path: "/all-section",
        label: `${lang("All")} ${lang("Sections")}`,
      },
      {
        key: "all-streams",
        path: "/all-streams",
        label: `${lang("All")} ${lang("Streams")}`,
      },
      {
        key: "all-subjects",
        path: "/all-subjects",
        label: `${lang("All")} ${lang("Subjects")}`,
      },
      {
        key: "all-books",
        path: "/all-books",
        label: `${lang("All")} ${lang("Books")}`,
      },
      {
        key: "discount-heads",
        path: "/discount-heads",
        label: `${lang("Discount")} ${lang("Heads")}`,
      },
      {
        key: "discount-types",
        path: "/discount-types",
        label: `${lang("Discount")} ${lang("types")}`,
      },
      {
        key: "department",
        path: "/department",
        label: `${lang("department")}`,
      },
      {
        key: "time-table",
        path: "/time-table",
        label: `${lang("Time")} ${lang("Table")}`,
      },
    ],
  },
  {
    label: `${lang("Custom Forms")} ${lang("Management")}`,
    icon: File,
    children: [
      {
        key: "custom-forms",
        path: "/custom-forms",

        label: `${lang("Custom")} ${lang("Form")}`,
      },
      {
        key: "create-forms",
        path: "/create-forms",
        label: `${lang("Create")} ${lang("Form")}`,
      },
    ],
  },
  {
    label: `${lang("Study Metrials")} ${lang("Management")}`,
    icon: File,
    children: [
      {
        key: "video-lectures",
        path: "/video-lectures",

        label: `${lang("Video")} ${lang("lectures")}`,
      },
      {
        key: "notes-pdf",
        path: "/notes-pdf",
        label: `${lang("Notes")} ${lang("PDF/Images")}`,
      },
    ],
  },
  {
    key: "event-gallary-manager",
    path: "/event-gallary",
    icon: File,
    label: `${lang("Event-Gallary")} ${lang("Management")}`,
  },
  {
    key: "setting-manager",
    path: "/setting",
    icon: File,
    label: `${lang("Settings")} ${lang("Management")}`,
  },
  {
    key: "profile-manager",
    path: "/profile",
    icon: File,
    label: `${lang("Edit Profile")} ${lang("Management")}`,
  },
  {
    key: "authentication-manager",
    path: "/two-authentication",
    icon: File,
    label: `${lang("Two Authentication")} ${lang("Management")}`,
  },
  {
    key: "cms-manager",
    path: "/cms",
    icon: Cms,
    label: `${lang("CMS")} ${lang("Management")}`,
  },

  // {
  //   key: "rating-manager",
  //   path: "/ratings",
  //   icon: Star,
  //   label: `${lang("Rating and Reviews")}`,
  // },
  {
    key: "Notifications",
    path: "/notification",
    icon: Bell,
    label: `${lang("Notifications")}`,
  },
  {
    key: "email-template-manager",
    path: "/email-templates",
    icon: Disk,
    label: `${lang("Email Template")} ${lang("Management")}`,
  },
];

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const { userProfile, logout, setUserProfile } = useContext(AuthContext);
  const { country } = useAppContext();

  const [collapsed, setCollapsed] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuLinks, setMenuLinks] = useState([]);
  const [menuMode, setMenuMode] = useState("vertical");
  const [currentDateTime, setCurrentDateTime] = useState(moment());

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const showDeleteConfirm = (record) => {
    setIsLogoutModalVisible(true);
    // logout();
  };

  const renderTitle = (item) => {
    return (
      <>
        <Image preview={false} src={item.icon} />
        <span className="label">{item.label}</span>
      </>
    );
  };

  useEffect(() => {
    setLoading(true);
    if (!userProfile) return;
    if (userProfile.type == "Admin") {
      const items =
        country &&
        country?.country_id &&
        countryWithAreas.includes(country?.country_id)
          ? [...menuItems]
          : menuItems;

      setMenuLinks(items);
      setLoading(false);
      return;
    }

    const items =
      country &&
      country?.country_id &&
      countryWithAreas.includes(country?.country_id)
        ? [...menuItems]
        : menuItems;

    const newArray = items.filter((item) => {
      if (item.isShow) {
        return true;
      } else {
        return userProfile?.permission?.includes(item.key);
      }
    });

    const links = newArray.filter((item) => {
      if (item?.children?.length) {
        return true;
      } else if (!item?.children) {
        return true;
      } else {
        return false;
      }
    });

    setMenuLinks(links);
    setLoading(false);
    setRefresh((x) => !x);
  }, [userProfile, country]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setMenuMode("inline");
      } else {
        setMenuMode("vertical");
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {loading ? (
        [1, 2, 3, 4, 5, 6].map((item) => <Skeleton active key={item} />)
      ) : (
        <>
          <div className="brand-logo">
            <NavLink to="" className="imgOuter">
              <img className="" src={Logo} alt="" />
            </NavLink>
          </div>
          <Menu inlineCollapsed={false} mode={menuMode} className="sideNavMain">
            {menuLinks.map((item) => {
              if (item.children) {
                return (
                  <>
                    <Menu.SubMenu
                      key={item.key}
                      title={
                        <>
                          <span className="icon">
                            <Image preview={false} src={item.icon} />
                          </span>
                          <span className="label">{item.label}</span>
                        </>
                      }
                    >
                      {item.children.map((child) => (
                        <Menu.Item key={child.key}>
                          <NavLink to={child.path}>{child.label}</NavLink>
                        </Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  </>
                );
              }

              return (
                <Menu.Item key={item.key}>
                  <NavLink to={item.path}>{renderTitle(item)}</NavLink>
                </Menu.Item>
              );
            })}

            <Menu.Item onClick={showDeleteConfirm}>
              <NavLink to={"#"}>
                <>
                  <Image preview={false} src={Log} />
                  <span className="label">Logout</span>
                </>
              </NavLink>
            </Menu.Item>
          </Menu>
        </>
      )}
      {isLogoutModalVisible && (
        <DeleteModal
          title={"Logout"}
          subtitle={`Are you sure you want to Logout the Application?`}
          show={isLogoutModalVisible}
          hide={() => {
            setIsLogoutModalVisible(false);
          }}
          onOk={async () => {
            setIsLogoutModalVisible(false); // Close the modal
            try {
              await logout();
            } catch (error) {
              console.error("Logout error:", error);
              ShowToast("Logout failed", Severty.ERROR);
            }
          }}
        />
      )}
    </>
  );
}

export default Sidenav;
