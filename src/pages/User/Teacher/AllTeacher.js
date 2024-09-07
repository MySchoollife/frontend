import { Button, Table, Tooltip, Select, Modal, Input } from "antd";
import React, { useContext, useEffect, useState } from "react";

import Plus from "../../../assets/images/plus.svg";
import DeleteModal from "../../../components/DeleteModal";
import SectionWrapper from "../../../components/SectionWrapper";
import apiPath from "../../../constants/apiPath";
import { AppStateContext } from "../../../context/AppContext";
import lang from "../../../helper/langHelper";
import { Severty, ShowToast } from "../../../helper/toast";
import useDebounce from "../../../hooks/useDebounce";
import useRequest from "../../../hooks/useRequest";
import AddForm from "./AddForm";
import { UndoOutlined } from "@ant-design/icons";
import { BlockSubAdmin, rolesOptions } from "../../../constants/var";
// import CheckIcon from "../../assets/images/check.svg"
import Lottie from "react-lottie";
import ViewLogs from "../../../components/ViewLogs";
import * as success from "../../../assets/animation/success.json";
import { DeleteSubadmin } from "../../../constants/reasons";
import { DownloadExcel } from "../../../components/ExcelFile";

import moment from "moment";
import { useNavigate } from "react-router";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function AllTeacher() {
  const { setPageHeading, country } = useContext(AppStateContext);

  const sectionName = lang("Teacher");
  const routeName = "teacher";

  const api = {
    status: apiPath.statusSubAdmin,
    addEdit: apiPath.addEditSubAdmin,
    subAdmin: apiPath.subAdmin,
    role: apiPath.allRole,
  };

  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [logs, showLogs] = useState(false);
  const [selected, setSelected] = useState();
  const [email, setEmail] = useState();
  const [endDate, setEndDate] = useState();
  const [showDelete, setShowDelete] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const debouncedSearchText = useDebounce(searchText, 300);
  const [searchCity, setSearchCity] = useState("");
  const debouncedSearchCity = useDebounce(searchCity, 300);
  const [showMessage, setShowMessage] = useState(false);
  const [countries, setCountries] = useState([]);
  const [showStatusMessage, setShowStatusMessage] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [role, setRole] = useState([]);
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    country_id: undefined,
    city_id: undefined,
    year: undefined,
    month: undefined,
    status: undefined,
    role_id: undefined,
  });
  const [page, setPage] = useState(1);

  const getFilter = () => {
    request({
      url: `${api.subAdmin}/filters`,
      method: "GET",
      onSuccess: ({ data }) => {
        setRole(data?.role_id);
      },
    });
  };

  const onChange = (key, value) => {
    if (key == "country_id") {
      setCities([]);
      setFilter((prev) => ({ ...prev, city_id: undefined, country_id: value }));
    } else {
      setFilter((prev) => ({ ...prev, [key]: value }));
    }
  };

  const columns = [
    {
      title: lang("S. No"),
      dataIndex: "index",
      key: "index",
      width: "4px",
      render: (value, item, index) =>
        `${
          pagination.current === 1
            ? index + 1
            : (pagination.current - 1) * 10 + (index + 1)
        }`,
    },
    {
      title: lang("User code"),
      dataIndex: "uid",
      key: "uid",
      width: "4px",
      render: (_, { uid }) => {
        return uid ? `${uid}` : "-";
      },
    },
    {
      title: lang("Name"),
      dataIndex: "name",
      key: "name",
      sortDirections: ["ascend", "descend"],
      sorter: true,
      width: "4px",
      render: (_, { name }) => {
        return name;
      },
    },

    {
      title: lang("Email"),
      dataIndex: "email",
      key: "email",
      render: (_, { email }) => {
        return email ? (
          <span style={{ textTransform: "lowercase" }}>{email}</span>
        ) : (
          "-"
        );
      },
    },
    {
      title: lang("Phone Number"),
      render: (_, { mobile_number, country_code }) => {
        return (
          (country_code ? "+" + country_code + "-" : "+965") +
          (mobile_number ? mobile_number : "")
        );
      },
    },
    {
      title: lang("Role"),
      render: (_, { role_title }) => {
        return role_title ? role_title : "-";
      },
    },
    {
      title: lang("Register Date"),
      key: "created_at",
      dataIndex: "created_at",
      render: (_, { created_at }) => {
        return moment(created_at).format("ll");
      },
    },
    {
      title: lang("Action"),
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            {record.is_active ? (
              <>
                <Tooltip
                  title={lang("Edit")}
                  color={"purple"}
                  key={"update" + routeName}
                >
                  <Button
                    title="Edit"
                    className="edit-cl primary_btn"
                    onClick={() =>
                      navigate(`/teacher/add-teacher/${record?._id}`)
                    }
                  >
                    <i class="fa fa-light fa-pen"></i>
                    <span>{lang("Edit")}</span>
                  </Button>
                </Tooltip>

                <Tooltip
                  title={lang("Delete")}
                  color={"purple"}
                  key={"delete" + routeName}
                >
                  <Button
                    className="delete-cls"
                    title={lang("Delete")}
                    // onClick={() => {
                    //   setSelected(record);
                    //   setShowDelete(true);
                    // }}
                    onClick={() => {
                      if (record.have_item) {
                        return setShowMessage(true);
                      }
                      setSelected(record);
                      setShowDelete(true);
                    }}
                  >
                    <i class="fa fa-light fa-trash"></i>
                    <span>{lang("Delete")}</span>
                  </Button>
                </Tooltip>

                <Tooltip
                  title={lang("Block")}
                  color={"purple"}
                  key={"Block" + routeName}
                >
                  <Button
                    className="block-cls"
                    title={lang("Block")}
                    onClick={() => {
                      if (record.have_active_item) {
                        return setShowStatusMessage(true);
                      }
                      setSelected(record);
                      setShowStatus(true);
                    }}
                  >
                    <span>{lang("Block")}</span>
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Tooltip
                title={lang("UnBlock")}
                color={"purple"}
                key={"Block" + routeName}
              >
                <Button
                  className="block-cls"
                  title={lang("UnBlock")}
                  onClick={() => {
                    setSelected(record);
                    setShowStatus(true);
                  }}
                >
                  <span>{lang("UnBlock")}</span>
                </Button>
              </Tooltip>
            )}
            <Tooltip
              title={lang("View")}
              color={"purple"}
              key={"View" + routeName}
            >
              <Button
                title={lang("View")}
                className="btnStyle btnOutlineDelete"
                onClick={() => {
                  setSelected(record);
                  showLogs(true);
                }}
              >
                {lang("View")}
              </Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const onDelete = (id) => {
    request({
      url: api.subAdmin + "/" + id,
      method: "DELETE",
      onSuccess: (data) => {
        setLoading(false);
        ShowToast(data.message, Severty.SUCCESS);
        setRefresh((prev) => !prev);
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const handleChangeStatus = (id, message) => {
    request({
      url: api.subAdmin + "/" + id + "/status",
      method: "PUT",
      data: { message },
      onSuccess: (data) => {
        setLoading(false);
        setRefresh((prev) => !prev);

        data?._doc?.is_active == true
          ? ShowToast("Sub-Admin Unblock Successfully", Severty.SUCCESS)
          : ShowToast("Sub-Admin block Successfully", Severty.SUCCESS);
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const fetchData = (pagination, filters, sorter) => {
    const queryString = Object.entries(filter)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    request({
      url:
        api.subAdmin +
        `?type=all&page=${pagination ? pagination.current : 1}&pageSize=${
          pagination && pagination.pageSize ? pagination.pageSize : 10
        }${sorter ? `&${sorter}` : ""}&search=${debouncedSearchText}${
          queryString ? `&${queryString}` : ""
        }`,
      method: "GET",
      onSuccess: ({ data, status, total, message }) => {
        setLoading(false);

        setList(data);
        console.log(total, "total");
        setPagination((prev) => ({
          ...prev,
          current: pagination.current,
          total: total,
        }));
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const handleChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    let query = undefined;
    if (field && order) {
      query = `${field}=${order}`;
      console.log(query);
    }
    fetchData(pagination, filters, query);
  };

  useEffect(() => {
    setLoading(true);
    fetchData(pagination);
    getFilter();
  }, [refresh, debouncedSearchText, filter, country?.country_id]);

  useEffect(() => {
    setPageHeading(`${lang("Teacher")} ${lang("Management")}`);
  }, []);

  const onSearch = (e) => {
    setSearchText(e.target.value);
  };

  // const excelData = list.map((row) => ({
  // Name: row?.name || "-",
  // Email: row?.email || "-",
  // "Mobile Number": row?.mobile_number
  //   ? `+${row?.country_code}-${row?.mobile_number}`
  //   : "-",
  // Role: row?.role_id?.name || "-",
  // "Registered On": moment(row.created_at).format("DD-MM-YYYY"),
  // }));

  const getExportData = async (pagination, filters, sorter) => {
    try {
      const filterActive = filters ? filters.is_active : null;

      const queryString = Object.entries(filter)
        .filter(([_, v]) => v)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      setExportLoading(true);
      request({
        url:
          api.subAdmin +
          `?type=all&status=${
            filterActive ? filterActive.join(",") : ""
          }&page=${pagination ? pagination.current : 1}&pageSize=${
            pagination && pagination.pageSize ? pagination.pageSize : 10
          }${sorter ? `&${sorter}` : ""}&search=${debouncedSearchText}${
            queryString ? `&${queryString}` : ""
          }`,
        method: "GET",
        onSuccess: ({ data, status, total, message }) => {
          setExportLoading(false);
          if (status) {
            excelData(data ?? []);
          }
        },
        onError: (error) => {
          console.log(error);
          setExportLoading(false);
          ShowToast(error, Severty.ERROR);
        },
      });
    } catch (err) {
      console.log(err);
      setExportLoading(false);
    }
  };

  const excelData = (exportData) => {
    if (!exportData.length) return;

    const data = exportData.map((row) => ({
      "User Code": row?.uid || "-",
      Name: row?.name || "-",
      Email: row?.email || "-",
      "Mobile Number": row?.mobile_number
        ? `+${row?.country_code}-${row?.mobile_number}`
        : "-",
      Role: row?.role_id?.name || "-",
      "Registered On": moment(row.created_at).format("DD-MM-YYYY"),
    }));
    DownloadExcel(data, sectionName);
  };

  return (
    <>
      <SectionWrapper
        cardHeading={lang("Teacher") + " " + lang("List")}
        extra={
          <>
            <div className="w-100 text-head_right_cont">
              <div className="pageHeadingSearch">
                <Input.Search
                  className="searchInput"
                  placeholder={lang("Search by teacher name, email or number")}
                  onChange={onSearch}
                  allowClear
                />
              </div>

              <div className="role-wrap">
                <Select
                  width="110px"
                  placeholder="Role"
                  value={filter.role_id}
                  filterOption={false}
                  options={role?.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                  onChange={(value) => onChange("role_id", value)}
                />
              </div>
              <div className="role-wrap">
                <Select
                  width="110px"
                  placeholder={lang("Status")}
                  value={filter.status}
                  onChange={(value) => onChange("status", value)}
                >
                  <Select.Option value="false">Blocked</Select.Option>
                  <Select.Option value="true">UnBlocked</Select.Option>
                </Select>
              </div>
              <Button
                onClick={() =>
                  setFilter({
                    country_id: undefined,
                    city_id: undefined,
                    year: undefined,
                    month: undefined,
                    status: undefined,
                    role_id: undefined,
                  })
                }
                type="primary"
                icon={<UndoOutlined />}
              >
                {lang("Reset")}
              </Button>
              <div className="btn_grp">
                <Button
                  loading={exportLoading}
                  onClick={() => getExportData()}
                  className="primary_btn btnStyle"
                >
                  {lang("Export to Excel")}
                </Button>
              </div>
              <Button
                className="primary_btn btnStyle"
                onClick={(e) => navigate("/teacher/add-teacher")}
              >
                <span className="add-Ic">
                  <img src={Plus} />
                </span>
                {lang("Add")} {sectionName}
              </Button>
            </div>
          </>
        }
      >
        <div className="table-responsive customPagination withOutSearilNo">
          <Table
            loading={loading}
            columns={columns}
            dataSource={list}
            pagination={{
              defaultPageSize: 10,
              responsive: true,
              total: pagination.total,
            }}
            onChange={handleChange}
            className="ant-border-space"
          />
        </div>
      </SectionWrapper>

      {visible && (
        <AddForm
          section={sectionName}
          api={api}
          show={visible}
          hide={() => {
            setSelected();
            setVisible(false);
          }}
          selected={selected}
          refresh={() => setRefresh((prev) => !prev)}
          setEmail={(data) => {
            setEmail(data);
            setShowLink(true);
          }}
        />
      )}

      {showDelete && (
        <DeleteModal
          title={lang("Delete Teacher")}
          subtitle={lang(`Are you sure you want to Delete this Teacher?`)}
          show={showDelete}
          hide={() => {
            setShowDelete(false);
            setSelected();
          }}
          onOk={() => onDelete(selected?._id)}
          reasons={[]}
        />
      )}

      {showStatus && (
        <DeleteModal
          title={`${
            selected?.is_active ? lang(`Block`) : lang(`UnBlock`)
          } ${lang("Teacher")}`}
          subtitle={`${lang("Are you sure you want to")} ${
            selected?.is_active ? lang(`block`) : lang(`unblock`)
          } ${lang("this Teacher?")}`}
          show={showStatus}
          hide={() => {
            setShowStatus(false);
            setSelected();
          }}
          reasons={[]}
          onOk={(message) => handleChangeStatus(selected?._id, message)}
        />
      )}

      {logs && (
        <ViewLogs
          data={selected}
          show={logs}
          hide={() => {
            showLogs(false);
            setSelected();
          }}
        />
      )}

      {showMessage && (
        <DeleteModal
          title={lang("Delete Sub-Admin")}
          subtitle={lang(
            "This Sub-Admin contains provider associated manager, please remove  this provider from provider before deleting Sub-Admin"
          )}
          show={showMessage}
          hide={() => {
            setShowMessage(false);
          }}
          onOk={() => setShowMessage(false)}
          reasons={[]}
        />
      )}

      {showStatusMessage && (
        <DeleteModal
          title={lang("Block Sub-Admin")}
          subtitle={lang(
            "This Sub-Admin contains provider associated manager, please Deactivate  this provider from provider before Block Sub-Admin"
          )}
          show={showStatusMessage}
          hide={() => {
            setShowStatusMessage(false);
          }}
          onOk={() => setShowStatusMessage(false)}
          reasons={[]}
        />
      )}

      {showLink && (
        <Modal
          width={750}
          open={showLink}
          onOk={() => {}}
          onCancel={() => setShowLink(false)}
          centered
          className="tab_modal deleteWarningModal"
          footer={null}
        >
          <Lottie options={defaultOptions} height={120} width={120} />
          <h4 className="modal_title_cls mb-2 mt-3">{`Link Send Successfully`}</h4>
          <p className="modal_link_inner mb-0 mt-3">
            Link sent to your email address{" "}
            <span>
              {email?.slice(0, 4) + "XXXX" + email?.slice(email?.indexOf("@"))}.
            </span>
          </p>
          <p className="modal_link_inner">{`Please check email and set your password.`}</p>

          <div className="d-flex align-items-center gap-3 justify-content-center mt-5">
            <Button
              onClick={() => {
                setRefresh((prev) => !prev);
                setShowLink(false);
              }}
              className="primary_btn btnStyle "
            >
              Okay
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default AllTeacher;
