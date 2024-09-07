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
    status: apiPath.statusAttribute,
    list: apiPath.listAttribute,
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
      url: api.list + "/" + id,
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
      title: lang("category Name"),
      dataIndex: "category_id",
      key: "category_id",
      width: 200,
      render: (_, { _id }) =>
        _id.category_id && _id.category_id.name ? (
          <span className="cap">{_id.category_id.name}</span>
        ) : (
          "-"
        ),
    },
    {
      title: lang("Service Name"),
      dataIndex: "service_id",
      key: "service_id",
      width: 200,
      render: (_, { _id }) =>
        _id.service_id && _id.service_id.name ? (
          <span className="cap">{_id.service_id.name}</span>
        ) : (
          "-"
        ),
    },
    {
      title: lang("Total Attributes"),
      dataIndex: "attributes",
      key: "attributes",
      width: 200,
      render: (_, { attributes }) =>
        attributes ? <span className="cap">{attributes?.length}</span> : "0",
    },
    // {
    //   title: lang("Register Date"),
    //   key: "created_at",
    //   dataIndex: "created_at",
    //   render: (_, { created_at }) => {
    //     return moment(created_at).format("ll");
    //   },
    // },

    {
      title: lang("Action"),
      fixed: "right",
      key: "action",
      render: (_, { _id }) => {
        return (
          <>
            <Tooltip
              title={lang("View")}
              color={"purple"}
              key={"View" + routeName}
            >
              <Button
                title="View"
                className="edit-cls btnStyle primary_btn"
                onClick={() => {
                  navigate(
                    `/attributes/${_id?.category_id?._id}/${_id?.service_id?._id}`,
                  );
                }}
              >
                {/* <img src={EditIcon} /> */}
                <span>{lang("View")}</span>
              </Button>
            </Tooltip>
            {/* <Tooltip
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
            </Tooltip> */}
          </>
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
        `?status=${filterActive ? filterActive.join(",") : ""}&page=${
          pagination ? pagination.current : 1
        }&pageSize=${pagination.pageSize ?? 10}&search=${debouncedSearchText}${
          queryString ? `&${queryString}` : ""
        }${path ? `&status=${path}` : ""}`,
      method: "GET",
      onSuccess: ({ data, status, total }) => {
        setLoading(false);
        console.log(data, "total11");
        if (status) {
          setList(data.docs);
          setPagination((prev) => ({
            ...prev,
            current: pagination.current,
            total: data.total,
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

  return (
    <>
      <div className="tabled quoteManagement">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24">
              <SectionWrapper
                cardHeading={lang(`Service Attribute List`)}
                cardSubheading={""}
                extra={
                  <>
                    {/* <div className="button_group justify-content-end w-100"> */}
                    <div className="w-100 text-head_right_cont">
                      {/* <div className="pageHeadingSearch">
                        <Input.Search
                          className="searchInput"
                          placeholder={lang("Search by attribute name")}
                          onChange={onSearch}
                          allowClear
                        />
                      </div> */}
                      <div className="role-wrap">
                        <Select
                          last20Years
                          width="110px"
                          placeholder={lang("Category")}
                          showSearch
                          value={filter.category_id}
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          options={categories.map((item) => ({
                            value: item._id,
                            label: item.name,
                          }))}
                          onChange={(value) => onChange("category_id", value)}
                        />
                      </div>
                      <Button
                        onClick={() =>
                          setFilter({
                            country_id: undefined,
                            category_id: undefined,
                          })
                        }
                        type="primary"
                        icon={<UndoOutlined />}
                      >
                        {lang("Reset")}
                      </Button>
                      <Button
                        className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                        onClick={(e) => {
                          setVisible(true);
                          setSearchText("");
                        }}
                      >
                        <span className="add-Ic">
                          <img src={Plus} />
                        </span>
                        {lang("Add")} {lang("Attribute")}
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
                      showSizeChanger: true,
                      showQuickJumper: true,
                      pageSizeOptions: ["10", "20", "30", "50"],
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
            "This Attribute contains Service Provider, please remove  this Provider from service provider before deleting Attribute",
          )}
          show={showMessage}
          hide={() => {
            setShowMessage(false);
          }}
          onOk={() => setShowMessage(false)}
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
