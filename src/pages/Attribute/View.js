import {
  Button,
  Card,
  Col,
  Image,
  Row,
  Select,
  Table,
  Tabs,
  Tooltip,
  Input,
  Switch,
} from "antd";
import moment from "moment";
import { UndoOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import deleteWhiteIcon from "../../assets/images/icon/deleteWhiteIcon.png";
import notfound from "../../assets/images/not_found.png";
import Plus from "../../assets/images/plus.svg";
import ConfirmationBox from "../../components/ConfirmationBox";
import SectionWrapper from "../../components/SectionWrapper";
import apiPath from "../../constants/apiPath";
import { BlockDriver, Last20Years, Months } from "../../constants/var";
import { AppStateContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
import DeleteModal from "../../components/DeleteModal";
import AddForm from "./AddForm";
import EditIcon from "../../assets/images/edit.svg";
import ViewLogs from "../../components/ViewLogs";
import { DeleteSubadmin } from "../../constants/reasons";
import { DownloadExcel } from "../../components/ExcelFile";

const { TabPane } = Tabs;

function Attribute() {
  const heading = lang("Service Attribute") + " " + lang("Management");
  const { setPageHeading, country } = useContext(AppStateContext);

  const sectionName = "Service Attribute";
  const routeName = "attributes";
  const params = useParams();

  const urlParams = new URLSearchParams(window.location.search);
  const path = urlParams.get("status");

  const api = {
    list: apiPath.listAttributePerCategory,
    status: apiPath.statusAttribute,
    addEdit: apiPath.listAttribute,
  };

  const [searchText, setSearchText] = useState("");

  const { request } = useRequest();
  const navigate = useNavigate();
  const { showConfirm } = ConfirmationBox();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [logs, showLogs] = useState(false);
  const [selected, setSelected] = useState();
  const [showDelete, setShowDelete] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("all");
  const debouncedSearchText = useDebounce(searchText, 300);
  const [searchCity, setSearchCity] = useState("");
  const debouncedSearchCity = useDebounce(searchCity, 300);
  const [showMessage, setShowMessage] = useState(false);
  const [countries, setCountries] = useState([]);
  const [categories, setCategory] = useState([]);
  const [showStatusMessage, setShowStatusMessage] = useState(false);
  const [paramsIds, setParamsIds] = useState({});
  const [exportLoading, setExportLoading] = useState(false);
  const [filter, setFilter] = useState({
    country_id: undefined,
    year: undefined,
    category: undefined,
  });

  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  const getFilter = () => {
    request({
      url: `${api.list}/filters`,
      method: "GET",
      onSuccess: (res) => {
        const { data, months, years } = res;
        setCategory(data);
        setYears(years);
        const m = Months.filter((item) => months.includes(item.value));
        setMonths(m);
      },
    });
  };

  const handleTabChange = (status) => {
    setSelectedTab(status);
    // fetchData(pagination, '', status)
  };

  const onDelete = (id) => {
    request({
      url: api.addEdit + "/" + id,
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
      url: api.status + "/" + id,
      method: "PUT",
      data: { message },
      onSuccess: (data) => {
        setLoading(false);
        setRefresh((prev) => !prev);
        ShowToast(data.message, Severty.SUCCESS);
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
      title: lang("Name"),
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (_, { name }) =>
        name ? <span className="cap">{name}</span> : "-",
    },
    {
      title: lang("arabic Name"),
      dataIndex: "ar_name",
      key: "ar_name",
      width: 200,
      render: (_, { ar_name }) =>
        ar_name ? <span className="cap">{ar_name}</span> : "-",
    },
    {
      title: lang("Attribute Sort Order"),
      dataIndex: "sort",
      key: "sort",
      width: 200,
      render: (_, { sort }) =>
        sort ? <span className="cap">{sort}</span> : "-",
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
          <>
            <Tooltip
              title={lang("Edit")}
              color={"purple"}
              key={"Edit" + routeName}
            >
              <Button
                title="Edit"
                className="edit-cls btnStyle primary_btn"
                onClick={() => {
                  setSelected(record);
                  setVisible(true);
                }}
              >
                <img src={EditIcon} />
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
          </>
        );
      },
    },
    {
      title: lang("Status"),
      key: "is_active",
      dataIndex: "is_active",
      filters: [
        {
          text: "Active",
          value: "true",
        },
        {
          text: "InActive",
          value: "false",
        },
      ],
      render: (_, { _id, is_active, have_active_item }) => {
        return (
          <Switch
            onChange={() => {
              if (have_active_item) {
                return setShowStatusMessage(true);
              }
              handleChangeStatus(_id);
            }}
            checked={is_active}
          />
        );
      },
    },
  ];

  const onChange = (key, value) => {
    if (key == "country_id") {
      setFilter((prev) => ({ ...prev, city_id: undefined, country_id: value }));
    } else {
      setFilter((prev) => ({ ...prev, [key]: value }));
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData({ ...pagination, current: 1 });
    getFilter();
  }, [refresh, debouncedSearchText, filter, country.country_id]);

  useEffect(() => {
    setPageHeading(heading);
  }, [setPageHeading]);

  const fetchData = (pagination, filters) => {
    const filterActive = filters ? filters.is_active : null;

    const queryString = Object.entries(filter)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");

    request({
      url:
        api.list +
        `/${params.category_id}/${params.service_id}?status=${
          filterActive ? filterActive.join(",") : ""
        }&page=${pagination ? pagination.current : 1}&pageSize=${
          pagination.pageSize ?? 10
        }&search=${debouncedSearchText}${queryString ? `&${queryString}` : ""}${
          path ? `&status=${path}` : ""
        }`,
      method: "GET",
      onSuccess: ({ data, status, total }) => {
        setLoading(false);
        console.log(data, "data11");
        if (status) {
          setList(data.docs);
          setPagination((prev) => ({
            ...prev,
            current: pagination.current,
            total: total,
          }));
        }
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const handleChange = (pagination, filters) => {
    fetchData(pagination, filters);
  };

  const onSearch = (e) => {
    setSearchText(e.target.value);
    setPagination({ current: 1 });
  };

  const getExportData = async (pagination, filters, sorter) => {
    try {
      const filterActive = filters ? filters.is_active : null;
      const queryString = Object.entries(filter)
        .filter(([_, v]) => v != undefined)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        )
        .join("&");
      setExportLoading(true);
      request({
        url:
          api.list +
          `/${params.category_id}/${params.service_id}?status=${
            filterActive ? filterActive.join(",") : ""
          }&page=${
            pagination ? pagination.current : 1
          }&search=${debouncedSearchText}${
            queryString ? `&${queryString}` : ""
          }${path ? `&status=${path}` : ""}`,
        method: "GET",
        onSuccess: ({ data, status, total, message }) => {
          setExportLoading(false);
          if (status) {
            excelData(data.docs ?? []);
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
      Name: row?.name || "-",
      Category: row?.category_id ? row?.category_id.name : "-",
      // Services: row?.service_id ? row.service_id.map((item) => item.name) : "-",
      Type: row?.type ? row?.type : "-",
      Sort: row?.sort ? row?.sort : "-",

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
                cardHeading={lang(
                  `All Attributes of ${
                    list.length ? list?.[0]?.category_id?.name : ""
                  } and  ${
                    list.length ? list?.[0]?.service_id?.[0]?.name : ""
                  }`,
                )}
                cardSubheading={""}
                extra={
                  <>
                    {/* <div className="button_group justify-content-end w-100"> */}
                    <div className="w-100 text-head_right_cont">
                      <div className="pageHeadingSearch">
                        <Input.Search
                          className="searchInput"
                          placeholder={lang("Search by attribute name")}
                          onChange={onSearch}
                          allowClear
                        />
                      </div>
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
                        className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                        onClick={(e) => {
                          setVisible(true);
                          setParamsIds(params);
                        }}
                      >
                        <span className="add-Ic">
                          <img src={Plus} />
                        </span>
                        {lang("Add")} {lang("Attribute")}
                      </Button>
                      <Button
                        className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                        onClick={(e) => {
                          navigate(-1);
                        }}
                      >
                        <span className="add-Ic"></span>
                        {lang("Back")}
                      </Button>
                    </div>
                  </>
                }
              >
                <div className="table-responsive customPagination">
                  <Table
                    loading={loading}
                    columns={columns}
                    dataSource={list}
                    pagination={{
                      defaultPageSize: 10,
                      responsive: true,
                      total: pagination.total,
                      ///showSizeChanger: true,
                      // showQuickJumper: true,
                      // pageSizeOptions: ["10", "20", "30", "50"],
                    }}
                    onChange={handleChange}
                    className="ant-border-space"
                  />
                </div>
              </SectionWrapper>
            </Card>
          </Col>
        </Row>
      </div>

      {visible && (
        <AddForm
          section={sectionName}
          api={api}
          show={visible}
          paramsIds={paramsIds}
          hide={() => {
            setSelected();
            setVisible(false);
          }}
          data={selected}
          refresh={() => setRefresh((prev) => !prev)}
        />
      )}
      {showMessage && (
        <DeleteModal
          title={lang("Delete Attribute")}
          subtitle={lang(
            "This Attribute contains Quote Template, please remove  this  from Quote Template before deleting Attribute",
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
          title={lang("Inactive Attribute")}
          subtitle={lang(
            "This Attribute contains  Active Quote Template, please inactive Quote Template before deactivating  Attribute",
          )}
          show={showStatusMessage}
          hide={() => {
            setShowStatusMessage(false);
          }}
          onOk={() => setShowStatusMessage(false)}
          reasons={[]}
        />
      )}
      {showDelete && (
        <DeleteModal
          title={lang("Delete  Attribute")}
          subtitle={lang(`Are you sure you want to Delete this Attribute?`)}
          show={showDelete}
          hide={() => {
            setShowDelete(false);
            setSelected();
          }}
          onOk={() => onDelete(selected?._id)}
          reasons={DeleteSubadmin}
        />
      )}

      {showStatus && (
        <DeleteModal
          title={`${
            selected?.is_active ? lang(`Suspend`) : lang(`Reactive`)
          } ${lang("Drive")}`}
          subtitle={`${lang("Are you sure you want to")} ${
            selected?.is_active ? lang(`suspend`) : lang(`reactivate`)
          } ${lang("this user ?")}`}
          show={showStatus}
          hide={() => {
            setShowStatus(false);
            setSelected();
          }}
          reasons={selected?.is_active ? BlockDriver : []}
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
    </>
  );
}

export default Attribute;
