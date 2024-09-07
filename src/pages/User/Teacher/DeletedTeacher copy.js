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

function DeletedTeacher() {
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
      title: lang("UID"),
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
        `?type=deleted&page=${pagination ? pagination.current : 1}&pageSize=${
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
          `?status=${filterActive ? filterActive.join(",") : ""}&page=${
            pagination ? pagination.current : 1
          }&pageSize=${
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
    </>
  );
}

export default DeletedTeacher;
