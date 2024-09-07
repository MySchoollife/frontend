import { UndoOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Select,
  Table,
  Tooltip,
  Col,
  Row,
  Tabs,
  Image,
  Card,
  Input,
  DatePicker,
} from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";

import EditIcon from "../../../assets/images/edit.svg";
import deleteWhiteIcon from "../../../assets/images/icon/deleteWhiteIcon.png";
import Plus from "../../../assets/images/plus.svg";
import ConfirmationBox from "../../../components/ConfirmationBox";
import DeleteModal from "../../../components/DeleteModal";
import SectionWrapper from "../../../components/SectionWrapper";
import ViewLogs from "../../../components/ViewLogs";
import apiPath from "../../../constants/apiPath";
import {
  BlockCustomerReasons,
  DeleteCustomerReasons,
} from "../../../constants/reasons";
import { Months } from "../../../constants/var";
import { AppStateContext, useAppContext } from "../../../context/AppContext";
import lang from "../../../helper/langHelper";
import { Severty, ShowToast } from "../../../helper/toast";
import useDebounce from "../../../hooks/useDebounce";
import useRequest from "../../../hooks/useRequest";
import AddFrom from "./AddStudent";
import notfound from "../../../assets/images/not_found.png";
import { useNavigate, useParams } from "react-router";
import ChangeModal from "./_ChangeModal";
import { DownloadExcel } from "../../../components/ExcelFile";
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

function AllStudent() {
  const heading = lang("Students") + " " + lang("Management");
  const { setPageHeading } = useContext(AppStateContext);
  const { country } = useAppContext();

  const sectionName = lang("Students");
  const routeName = "Students";
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get("status");
  const year = urlParams.get("year");

  const api = {
    status: apiPath.statusCustomer,
    addEdit: apiPath.addEditCustomer,
    list: apiPath.listCustomer,
    delete: apiPath.listCustomer,
  };

  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();
  const { showConfirm } = ConfirmationBox();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState();
  const [showDelete, setShowDelete] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [logs, showLogs] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const debouncedSearchText = useDebounce(searchText, 300);
  const [exportLoading, setExportLoading] = useState(false);

  const { confirm } = Modal;

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const [filter, setFilter] = useState({
    country_id: undefined,
    city_id: undefined,
    status: status ? status : undefined,
    start_date: undefined,
    end_date: undefined,
  });

  const [searchCity, setSearchCity] = useState("");
  const debouncedSearchCity = useDebounce(searchCity, 300);
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("all");
  const navigate = useNavigate();
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  const getFilter = () => {
    request({
      url: `${api.list}/filters`,
      method: "GET",
      onSuccess: (res) => {
        const { data, months, years } = res;
        setCities(data);
        setYears(years);
        const m = Months.filter((item) => months.includes(item.value));
        setMonths(m);
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

  const onDelete = (id) => {
    request({
      url: api.delete + "/" + id,
      method: "DELETE",
      onSuccess: (data) => {
        setLoading(false);
        setRefresh((prev) => !prev);
        ShowToast(data.message, Severty.SUCCESS);
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const handleChangeStatus = (id, message) => {
    request({
      url: api.list + "/" + id + "/status",
      method: "PUT",
      data: { message },
      onSuccess: (data) => {
        setLoading(false);
        setRefresh((prev) => !prev);
        data?._doc?.is_active == true
          ? ShowToast("Student Unblock Successfully", Severty.SUCCESS)
          : ShowToast("Student block Successfully", Severty.SUCCESS);
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const columns = [
    {
      title: lang("Roll No."),
      dataIndex: "roll_number",
      key: "roll_number",
      width: 200,

      render: (_, { roll_number }) => {
        return roll_number ? roll_number : "-";
      },
    },
    {
      title: lang("Name"),
      dataIndex: "name",
      key: "name",
      width: 200,
      sortDirections: ["ascend", "descend"],
      sorter: true,
      render: (_, { name }) => {
        return name ? name : "-";
      },
    },
    {
      title: lang("Email ID"),
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
      title: lang("date Of Birth"),
      dataIndex: "dob",
      key: "dob",
      width: 200,
      render: (_, { dob }) => {
        return dob ? moment(dob).format("ll") : "-";
      },
    },
    {
      title: lang("Gender"),
      dataIndex: "gender",
      key: "gender",
      render: (_, { gender }) => {
        return gender
          ? gender == "F"
            ? "Female"
            : gender == "M"
            ? "Male"
            : "Others"
          : "-";
      },
    },

    {
      title: lang("Number of events"),
      dataIndex: "number_of_events",
      key: "number_of_events",
      render: (_, { number_of_events }) => {
        return number_of_events ? <span>{number_of_events}</span> : "0";
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
      key: "action",
      render: (_, record) => {
        return (
          <div div className="d-flex justify-contenbt-start">
            {record.is_active ? (
              <>
                <Tooltip title={"Edit"} color={"purple"} key={"edit"}>
                  <Button
                    className="edit-cls btnStyle primary_btn"
                    onClick={() => {
                      navigate(`/add-student/${record?._id}`);
                    }}
                  >
                    <img src={EditIcon} />
                    <span>{lang("Edit")}</span>
                  </Button>
                </Tooltip>

                <Tooltip title={"Delete"} color={"purple"} key={"Delete"}>
                  <Button
                    title="Delete"
                    className="btnStyle deleteDangerbtn"
                    onClick={() => {
                      setSelected(record);
                      setShowDelete(true);
                    }}
                  >
                    <img src={deleteWhiteIcon} />
                    <span>{lang("Delete")}</span>
                  </Button>
                </Tooltip>

                <Tooltip title={"Block"} color={"purple"} key={"Block"}>
                  <Button
                    title="Block"
                    className="block-cls cap"
                    onClick={() => {
                      setSelected(record);
                      setShowStatus(true);
                    }}
                  >
                    {lang("Block")}
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Tooltip title={"UnBlock"} color={"purple"} key={"UnBlock"}>
                <Button
                  title="UnBlock"
                  className="block-cls cap"
                  onClick={() => {
                    setSelected(record);
                    setShowStatus(true);
                  }}
                >
                  {lang("UnBlock")}
                </Button>
              </Tooltip>
            )}
            {/* <Tooltip
              title={lang("View")}
              color={"purple"}
              key={"View" + routeName}
            >
              <Button
                title="View"
                className="btnStyle btnOutlineDelete"
                onClick={() => {
                  setSelected(record);
                  showLogs(true);
                }}
              >
                {lang("View")}
              </Button>
            </Tooltip> */}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    fetchData({ ...pagination, current: 1 });
    getFilter();
  }, [refresh, debouncedSearchText, filter, country?.country_id]);

  useEffect(() => {
    setPageHeading(heading);
  }, [setPageHeading]);

  const fetchData = (pagination, filters, sorter) => {
    const filterActive = filters ? filters.is_active : null;

    const queryString = Object.entries(filter)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    request({
      url:
        api.list +
        `?page=${pagination ? pagination.current : 1}&pageSize=${
          pagination ? pagination.pageSize : 10
        }${sorter ? `&${sorter}` : ""}&search=${debouncedSearchText}${
          queryString ? `&${queryString}` : ""
        }`,
      method: "GET",
      onSuccess: ({ data, status, total, message }) => {
        setLoading(false);
        if (status) {
          setList(data);
          setPagination((prev) => ({
            ...prev,
            current: pagination.current,
            total: total,
          }));
        }
      },
      onError: (error) => {
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

  const handleTabChange = (status) => {
    setSelectedTab(status);
    // fetchData(pagination, '', status)
  };

  const onSearch = (e) => {
    setSearchText(e.target.value);
  };

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
          api.list +
          `?page=${pagination ? pagination.current : 1}&pageSize=${
            pagination ? pagination.pageSize : 10
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
      UID: row?.uid || "-",
      Name: row?.name || "-",
      Email: row?.email || "-",
      "Mobile Number": row?.mobile_number
        ? `+${row?.country_code}-${row?.mobile_number}`
        : "-",
      Gender: row?.gender
        ? row?.gender == "F"
          ? "Female"
          : row?.gender == "M"
          ? "Male"
          : "Others"
        : "-",
      "Date of Birth": moment(row.dob).format("ll"),
      "Number of Events": "0",
      "Registered On": moment(row.created_at).format("DD-MM-YYYY"),
    }));
    DownloadExcel(data, sectionName);
  };

  return (
    <>
      <div className="tabled quoteManagement">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24">
              <SectionWrapper
                cardHeading={lang("Students") + " " + lang("List")}
                extra={
                  <>
                    <div className="w-100 d-flex align-items-baseline text-head_right_cont">
                      <div className="pageHeadingSearch">
                        <Input.Search
                          value={searchText}
                          className="searchInput"
                          placeholder={lang(
                            "Search by user name, email or number"
                          )}
                          onChange={onSearch}
                          allowClear
                        />
                      </div>

                      <div className="role-wrap">
                        <RangePicker
                          value={[
                            filter.start_date
                              ? moment(filter.start_date)
                              : undefined,
                            filter.end_date
                              ? moment(filter.end_date)
                              : undefined,
                          ]}
                          onChange={(value) => {
                            if (value) {
                              setFilter((prev) => ({
                                ...prev,
                                start_date: moment(value[0]).format(
                                  "YYYY-MM-DD"
                                ),
                                end_date: moment(value[1]).format("YYYY-MM-DD"),
                              }));
                            } else {
                              setFilter((prev) => ({
                                ...prev,
                                start_date: undefined,
                                end_date: undefined,
                              }));
                            }
                          }}
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
                        onClick={() => {
                          setFilter({
                            country_id: undefined,
                            city_id: undefined,
                            status: undefined,
                            start_date: undefined,
                            end_date: undefined,
                          });
                          setSearchText("");
                        }}
                        type="primary"
                        icon={<UndoOutlined />}
                      >
                        {lang("Reset")}
                      </Button>
                    </div>
                  </>
                }
              >
                <div className="button-sec">
                  <Button
                    loading={exportLoading}
                    onClick={() => getExportData()}
                    className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                  >
                    {lang("Export to Excel")}
                  </Button>

                  <Button
                    className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                    onClick={(e) => {
                      navigate("/add-student");
                    }}
                  >
                    <span className="add-Ic">
                      <img src={Plus} />
                    </span>
                    {lang("Add")} {sectionName}
                  </Button>
                </div>
                <div className="table-responsive customPagination">
                  <Table
                    loading={loading}
                    columns={columns}
                    dataSource={list}
                    pagination={{
                      defaultPageSize: 10,
                      responsive: true,
                      total: pagination.total,
                      // showSizeChanger: true,
                      // showQuickJumper: true,
                      // pageSizeOptions: ["10", "20", "30", "50"],
                    }}
                    onChange={handleChange}
                    className="ant-border-space"
                  />
                </div>
              </SectionWrapper>
              {/* <Tabs
                className="main_tabs"
                onTabClick={handleTabChange}
                activeKey={selectedTab}
                tabBarStyle={{ color: "green" }}
              >
                <TabPane tab={lang("Students LIST")} key="all">
                  
                </TabPane>

                <TabPane tab={lang("CHANGE REQUEST")} key={`CHANGE_REQUEST`}>
                  <Request />
                </TabPane>
              </Tabs>
             */}
            </Card>
          </Col>
        </Row>
      </div>

      {visible && (
        <AddFrom
          section={sectionName}
          api={api}
          show={visible}
          hide={() => {
            setSelected();
            setVisible(false);
          }}
          data={selected}
          refresh={() => setRefresh((prev) => !prev)}
        />
      )}

      {showDelete && (
        <DeleteModal
          title={lang("Delete User")}
          subtitle={lang(`Are you sure you want to Delete this user?`)}
          show={showDelete}
          hide={() => {
            setShowDelete(false);
            setSelected();
          }}
          onOk={() => onDelete(selected?._id)}
          reasons={DeleteCustomerReasons}
        />
      )}

      {showStatus && (
        <DeleteModal
          title={`${
            selected?.is_active ? lang(`Block`) : lang(`UnBlock`)
          } ${lang("User")}`}
          subtitle={`${lang("Are you sure you want to")} ${
            selected?.is_active ? lang(`block`) : lang(`unblock`)
          } ${lang("this user?")}`}
          show={showStatus}
          hide={() => {
            setShowStatus(false);
            setSelected();
          }}
          onOk={(message) => handleChangeStatus(selected?._id, message)}
          reasons={selected?.is_active ? BlockCustomerReasons : []}
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
    </>
  );
}

export default AllStudent;
