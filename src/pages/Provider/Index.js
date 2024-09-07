import { UndoOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Modal,
  Radio,
  Row,
  Select,
  Switch,
  Table,
  Tabs,
  Tooltip,
  Input,
  DatePicker,
} from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import notfound from "../../assets/images/not_found.png";
import Plus from "../../assets/images/plus.svg";
import ConfirmationBox from "../../components/ConfirmationBox";
import DeleteModal from "../../components/DeleteModal";
import SectionWrapper from "../../components/SectionWrapper";
import apiPath from "../../constants/apiPath";
import { BlockRest, Months } from "../../constants/var";
import { AppStateContext } from "../../context/AppContext";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
import ViewAndEditModal from "./ViewServices";

import ViewLogs from "../../components/ViewLogs";
import lang from "../../helper/langHelper";
import { DeleteRestaurantReasons } from "../../constants/reasons";
import ImportProvider from "../../components/ImportProvider";
import { DownloadExcel } from "../../components/ExcelFile";

function Index() {
  const sectionName = lang("Provider");
  const routeName = "restaurant";
  const heading = sectionName + " " + lang("Management");
  const { setPageHeading, country } = useContext(AppStateContext);
  const urlParams = new URLSearchParams(window.location.search);
  const cases = urlParams.get("cases");

  const api = {
    status: apiPath.providerList + "/status",
    list: apiPath.providerList,
    category: apiPath.allCategory,
    SubCategory: apiPath.allSubCategory,
  };

  const { request } = useRequest();
  const [list, setList] = useState([]);
  const { showConfirm } = ConfirmationBox();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [visible, setVisible] = useState(false);
  const [logs, showLogs] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [selected, setSelected] = useState();
  const [searchText, setSearchText] = useState("");
  const [deleteModal, showDeleteModal] = useState(false);
  const debouncedSearchText = useDebounce(searchText, 300);
  const [searchCity, setSearchCity] = useState("");
  const debouncedSearchCity = useDebounce(searchCity, 300);
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("Restaurant_List");
  const [statusModal, setstatusModal] = useState(false);
  const [allStatusChangeModal, setAllStatusChangeModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [importModal, showImportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const [filter, setFilter] = useState({
    country_id: undefined,
    city_id: undefined,
    start_date: undefined,
    end_date: undefined,
    status: undefined,
    cases: undefined,
  });

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

  useEffect(() => {
    setLoading(true);
    fetchData({ ...pagination, current: 1 });
    getFilter();
  }, [refresh, debouncedSearchText, filter, country.country_id]);

  const columns = [
    // {
    //   title: lang("S. No"),
    //   dataIndex: "index",
    //   key: "index",
    //   render: (value, item, index) =>
    //     pagination.current === 1
    //       ? index + 1
    //       : (pagination.current - 1) * 10 + (index + 1),
    // },
    {
      title: lang("Business name "),
      dataIndex: "name",
      key: "name",
      render: (_, { name }) => {
        return name ? <span className="cap">{name}</span> : "-";
      },
    },
    {
      title: lang("Email"),
      dataIndex: "email",
      key: "email",
      render: (_, { email }) => {
        return email ? email : "-";
      },
    },
    {
      title: lang("Phone Number"),
      dataIndex: "mobile_number",
      key: "mobile_number",
      render: (_, { mobile_number, country_code }) => {
        return mobile_number && country_code
          ? `+${country_code}-${mobile_number}`
          : "-";
      },
    },
    {
      title: lang("associated manager"),
      dataIndex: "associated_manager",
      key: "associated_manager",
      render: (_, { associated_manager }) => {
        return associated_manager ? associated_manager.name : "-";
      },
    },

    // {
    //   title: "Member Type",
    //   dataIndex: "member_type",
    //   key: "member_type",
    //   render: (_, { member_type }) => {
    //     return member_type ? member_type : "Service Provider";
    //   },
    // },
    // {
    //   title: "Country",
    //   dataIndex: "country",
    //   key: "country",
    //   render: (_, { country_id }) => {
    //     return country_id ? country_id.name : "-";
    //   },
    // },
    {
      title: lang("City"),
      dataIndex: "city",
      key: "city",
      render: (_, { city_id }) => {
        return city_id ? city_id.name : "-";
      },
    },
    {
      title: lang("Country"),
      dataIndex: "city",
      key: "city",
      render: (_, { country_id }) => {
        return country_id ? country_id.name : "-";
      },
    },
    // {
    //   title: lang("Number Of services"),
    //   dataIndex: "number_of_services",
    //   key: "number_of_services",
    //   render: (_, { number_of_service }) => {
    //     return number_of_service ? number_of_service : "-";
    //   },
    // },
    // {
    //   title: lang("Number Of reports"),
    //   dataIndex: "number_of_reports",
    //   key: "number_of_reports",
    //   render: (_, { number_of_reports }) => {
    //     return number_of_reports ? number_of_reports : "-";
    //   },
    // },
    // {
    //   title: lang("Profile completion"),
    //   dataIndex: "profile_completion",
    //   key: "profile_completion",
    //   render: (_, { profile_completion }) => {
    //     return profile_completion ? `${profile_completion}%` : "-";
    //   },
    // },

    // {
    //   title: lang("Joining Date"),
    //   key: "created_at",
    //   dataIndex: "created_at",
    //   render: (_, { created_at }) => {
    //     return moment(created_at).format("DD-MMM-YYYY");
    //   },
    // },
    {
      title: lang("Action"),
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            <Tooltip
              title={lang("View")}
              color={"purple"}
              key={"view" + routeName}
            >
              <Button
                className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                // onClick={(e) => {
                //   setSelected(record);
                //   setViewVisible(true);
                // }}
                onClick={() => navigate(`/service-provider/add/${record._id}`)}
              >
                {lang("View")}{" "}
              </Button>
            </Tooltip>

            <Tooltip
              title={lang("Service")}
              color={"purple"}
              key={"view" + routeName}
            >
              <Button
                className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                // onClick={(e) => {
                //   setSelected(record);
                //   setViewVisible(true);
                // }}
                onClick={() => navigate(`/service-provider/view-service/${record._id}`)}
              >
                {lang("Service")}{" "}
              </Button>
            </Tooltip>

            <Tooltip
              title={lang("Package")}
              color={"purple"}
              key={"view" + routeName}
            >
              <Button
                className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                // onClick={(e) => {
                //   setSelected(record);
                //   setViewVisible(true);
                // }}
                onClick={() => navigate(`/service-provider/view-package/${record._id}`)}
              >
                {lang("Package")}{" "}
              </Button>
            </Tooltip>

            {/* <Tooltip
              title={lang("Logs")}
              color={"purple"}
              key={"view" + routeName}
            >
              <Button
                className="btnStyle btnOutlineDelete"
                onClick={(e) => {
                  setSelected(record);
                  showLogs(true);
                }}
              >
                {lang("Logs")}{" "}
              </Button>
            </Tooltip> */}
          </>
        );
      },
    },
    {
      title: lang("Status"),
      key: "is_active",
      dataIndex: "is_active",
      render: (_, { _id, is_active }) => {
        return (
          <Switch
            onChange={() => {
              setSelected({ _id, is_active });
              showModal();
              //  handleChangeStatus(_id);
            }}
            checked={is_active}
          />
        );
      },
    },
  ];

  useEffect(() => {
    setPageHeading(heading);
  }, []);

  const fetchData = (pagination, filters) => {
    const filterActive = filters ? filters.is_active : null;

    const queryString = Object.entries(filter)
      .filter(([_, v]) => v != undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    request({
      url:
        api.list +
        `?search=${debouncedSearchText}&page=${
          pagination ? pagination.current : 1
        }&pageSize=${pagination ? pagination.pageSize : 10}&cases=${
          cases ? cases : ""
        }${queryString ? `&${queryString}` : ""}`,
      method: "GET",
      onSuccess: ({ data, status, total, message }) => {
        setLoading(false);
        console.log(data, "data");
        // setList(data);
        setList(() => {
          return data.map((item) => {
            return {
              ...item,
              key: item._id,
            };
          });
        });
        setSelectedIds([]);
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

  const onChange = (key, value) => {
    if (key == "country_id") {
      setCities([]);
      setFilter((prev) => ({ ...prev, city_id: undefined, country_id: value }));
    } else {
      setFilter((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleChange = (pagination, filters) => {
    fetchData(pagination, filters);
  };

  const showModal = () => {
    setstatusModal(true);
  };

  const handleCancel = () => {
    setstatusModal(false);
  };

  const handleChangeStatus = (id, message) => {
    request({
      url: `${api.list}/${id}/status`,
      method: "PUT",
      data: { message },
      onSuccess: (data) => {
        setLoading(false);
        setSelected();
        setRefresh((prev) => !prev);
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const onDelete = (id) => {
    request({
      url: api.list + "/" + id,
      method: "DELETE",
      onSuccess: (data) => {
        setLoading(false);
        setRefresh((prev) => !prev);
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };
  const onSearch = (e) => {
    setSearchText(e.target.value);
  };

  const statusChangeAll = () => {
    if (!selectedIds.length) return;
    request({
      url: api.list + "/status-change-all",
      method: "POST",
      data: {
        ids: selectedIds,
      },
      onSuccess: (data) => {
        setLoading(false);
        setRefresh((prev) => !prev);
        ShowToast(data.message, Severty.SUCCESS);
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error?.response?.data?.message, Severty.ERROR);
      },
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedIds(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
      checked: selectedIds.includes(record.key),
    }),
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
          `?status=${
            filterActive ? filterActive.join(",") : ""
          }&search=${debouncedSearchText}&page=${
            pagination ? pagination.current : 1
          }&pageSize=${pagination ? pagination.pageSize : 10}&cases=${
            cases ? cases : ""
          }${queryString ? `&${queryString}` : ""}`,
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
      Name: row?.name || "-",
      Email: row?.email || "-",
      "Mobile Number": row?.mobile_number
        ? `+${row?.country_code}-${row?.mobile_number}`
        : "-",
      "Associated Manager": row.associated_manager
        ? row?.associated_manager?.name
        : "-",
      Category: row?.category_id ? row?.category_id?.name : "0",
      City: row?.city_id ? row?.city_id?.name : "0",

      "Registered On": moment(row.created_at).format("DD-MM-YYYY"),
    }));
    DownloadExcel(data, sectionName);
  };

  return (
    <>
      <SectionWrapper
        cardHeading={lang(`Service Provider List`)}
        extra={
          <>
            <div className=" ">
              <div className="w-100 d-flex align-items-baseline text-head_right_cont">
                <div className="pageHeadingSearch">
                  <Input.Search
                    className="searchInput"
                    placeholder={lang(
                      "Search by provider name, email or number"
                    )}
                    onChange={onSearch}
                    allowClear
                  />
                </div>
                <div className="role-wrap">
                  <DatePicker.RangePicker
                    value={[
                      filter.start_date ? moment(filter.start_date) : undefined,
                      filter.end_date ? moment(filter.end_date) : undefined,
                    ]}
                    onChange={(value) => {
                      if (value) {
                        setFilter((prev) => ({
                          ...prev,
                          start_date: moment(value[0]).format("YYYY-MM-DD"),
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
                    last20Years
                    width="110px"
                    placeholder={lang("City")}
                    showSearch
                    value={filter.city_id}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    }
                    options={cities.map((item) => ({
                      value: item._id,
                      label: item.name,
                    }))}
                    onChange={(value) => onChange("city_id", value)}
                  />
                </div>

                <div className="role-wrap">
                  <Select
                    width="110px"
                    placeholder={lang("Status")}
                    // showSearch
                    value={filter.status}
                    // filterOption={(input, option) =>
                    //   option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                    //   0
                    // }
                    options={[
                      {
                        value: true,
                        label: "Active",
                      },
                      {
                        value: false,
                        label: "InActive",
                      },
                    ]}
                    onChange={(value) => onChange("status", value)}
                  />
                </div>
                <Button
                  onClick={() =>
                    setFilter({
                      country_id: undefined,
                      city_id: undefined,
                      start_date: undefined,
                      end_date: undefined,
                      status: undefined,
                    })
                  }
                  type="primary"
                  icon={<UndoOutlined />}
                >
                  {lang("Reset")}
                </Button>
              </div>
            </div>
          </>
        }
      >
        <div className="button-sec">
          <Button
            disabled={!selectedIds.length}
            className="btnStyle btnOutlineDelete"
            onClick={() => {
              if (!selectedIds.length) return;
              setAllStatusChangeModal(true);
            }}
          >
            {lang("Deactivate All")}
          </Button>

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
              showImportModal(true);
              setSearchText("");
            }}
          >
            {lang("Import")}
          </Button>
          <Button
            className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
            // onClick={(e) => {
            //   setVisible(true);
            //   // setSearchText("");
            // }}
            onClick={() => navigate("/service-provider/add")}
          >
            <span className="add-Ic d-flex">
              <img src={Plus} />
            </span>
            {lang("Add")} {sectionName}
          </Button>
        </div>
        <div className="table-responsive customPagination withOutSearilNo">
          <Table
            loading={loading}
            columns={columns}
            rowSelection={rowSelection}
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

    

      {/* {viewVisible && (
        <ViewAndEditModal
          section={sectionName}
          api={api}
          show={viewVisible}
          hide={() => {
            setSelected();
            setViewVisible(false);
          }}
          data={selected}
          refresh={() => setRefresh((prev) => !prev)}
          deleteRestaurant={() => {
            showDeleteModal(true);
            setViewVisible(false);
          }}
          viewLogs={() => {
            showLogs(true);
          }}
        />
      )} */}

      {allStatusChangeModal && (
        <DeleteModal
          title={lang("Deactivate All")}
          subtitle={lang(
            `Are you sure you want to Deactivate all service provider's?`
          )}
          show={allStatusChangeModal}
          hide={() => {
            setAllStatusChangeModal(false);
            setSelectedIds([]);
          }}
          onOk={() => statusChangeAll()}
        />
      )}

      {logs && (
        <ViewLogs
          data={selected.vendor_id}
          show={logs}
          hide={() => {
            showLogs(false);
            setSelected();
          }}
        />
      )}

      {deleteModal && (
        <DeleteModal
          title={lang("Delete Service Provider")}
          subtitle={lang(
            `Are you sure you want to Delete this Service Provider?`
          )}
          show={deleteModal}
          hide={() => {
            showDeleteModal(false);
            setSelected();
          }}
          reasons={DeleteRestaurantReasons}
          onOk={() => onDelete(selected?._id)}
        />
      )}

      {statusModal && (
        <DeleteModal
          title={lang("Service Provider Status")}
          subtitle={`${lang(`Are you sure you want to`)} ${
            selected?.is_active ? lang(`Deactivate`) : lang("Activate")
          } ${lang(`this Service Provider?`)}`}
          show={statusModal}
          hide={() => {
            handleCancel();
            setSelected();
          }}
          reasons={selected?.is_active ? BlockRest : []}
          onOk={(message) => handleChangeStatus(selected?._id, message)}
        />
      )}
      {importModal && (
        <ImportProvider
          show={importModal}
          sectionName={sectionName}
          hide={() => {
            showImportModal(false);
            setSelected();
          }}
          refresh={() => {
            setRefresh((prev) => !prev);
          }}
        />
      )}
    </>
  );
}

export default Index;
