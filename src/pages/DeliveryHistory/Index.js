import { UndoOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Tabs,
  Tooltip,
} from "antd";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import React, { useContext, useEffect, useState, useRef } from "react";
import Currency from "../../components/Currency";
import apiPath from "../../constants/apiPath";
import { Last20Years, Months } from "../../constants/var";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";

import notfound from "../../assets/images/not_found.png";
import { AppStateContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { DownloadExcel } from "../../components/ExcelFile";
const Search = Input.Search;
const { TabPane } = Tabs;

export const QuoteStatus = {
  REQUEST: "request",
  RECEIVED: "received",
  COMPLETE: "complete",
  FULLFILL: "fulfill",
  ADDONS: "addons",
  ITEMDEALS: "itemdeals",
};

function Index() {
  const { setPageHeading, country } = useContext(AppStateContext);

  const api = {
    status: apiPath.statusQuote,
    list: apiPath.history,
  };

  const { request } = useRequest();

  const [selectedTab, setSelectedTab] = useState("all");
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [filters, setFilter] = useState({});

  const getFilter = () => {
    request({
      url: `${api.list}/filters`,
      method: "GET",
      onSuccess: (res) => {
        const { restaurants, customers, drivers, months, years } = res;
        //setYears(years);
        const m = Months.filter((item) => months.includes(item.value));
        //setMonths(m);
        setFilter({ restaurants, customers, drivers, years, months: m });
      },
    });
  };

  const handleTabChange = (status) => {
    setSelectedTab(status);
  };

  useEffect(() => {
    setPageHeading(lang("Delivery History"));
  }, [setPageHeading]);

  useEffect(() => {
    getFilter();
  }, []);

  return (
    <>
      <div className="tabled quoteManagement">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24">
              <Tabs
                className="main_tabs"
                onTabClick={handleTabChange}
                activeKey={selectedTab}
                tabBarStyle={{ color: "green" }}
              >
                <TabPane tab={lang("Delivery Agent history")} key="all">
                  <DriverOrder filters={filters} />
                </TabPane>

                <TabPane
                  tab={lang("Customer order history")}
                  key={QuoteStatus.REQUEST}
                >
                  <CustomerOrder filters={filters} />
                </TabPane>

                <TabPane
                  tab={lang("Restaurant order history")}
                  key={QuoteStatus.RECEIVED}
                >
                  <RestaurantOrder filters={filters} />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

const DriverOrder = ({ filters }) => {
  const sectionName = "DeliverHistory";
  const { setPageHeading, country } = useContext(AppStateContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selected, setSelected] = useState();
  const { request } = useRequest();

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  const { restaurants, customers, drivers, months, years } = filters;

  const [filter, setFilter] = useState({
    year: undefined,
    month: undefined,
    driver: undefined,
  });

  const api = {
    status: apiPath.statusQuote,
    list: apiPath.history,
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const checkFilterValue = () => {
    console.log("filtervalue", filter, filter.year);
    if (filter.year && filter.month) {
      DownloadExcel(excelData, sectionName);
    } else {
      ShowToast("Please select a year and months", Severty.ERROR);
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <h6
          onClick={() => {
            handlePrint(null, () => contentToPrint.current);
          }}
        >
          PDF
        </h6>
      ),
    },
    {
      key: "2",
      label: (
        <h6 onClick={() => DownloadExcel(excelData1, sectionName)}>Excel</h6>
      ),
    },
  ];

  const fetchData = (pagination, status) => {
    setLoading(true);

    const payload = { ...filter };
    payload.page = pagination ? pagination.current : 1;
    payload.pageSize = pagination ? pagination?.pageSize : 10;

    const queryString = Object.entries(payload)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");

    request({
      url: api.list + `${queryString ? `?${queryString}` : ""}`,
      method: "GET",
      onSuccess: ({ data, total, status }) => {
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

  const handleChange = (pagination, filters) => {
    fetchData(pagination, filters);
  };

  const columns = [
    {
      title: lang("Driver id"),
      dataIndex: "id",
      render: (_, { driver_id }) =>
        driver_id && driver_id?.uid ? (
          <span className="cap">#{driver_id.uid}</span>
        ) : (
          "-"
        ),
    },
    {
      title: lang("DRIVER NAME"),
      dataIndex: "name",
      key: "name",
      render: (_, { driver_id }) =>
        driver_id ? (
          <>
            <Image
              width={40}
              height={40}
              src={driver_id?.image ? driver_id.image : notfound}
              className="table-img"
            />
            {driver_id?.name ? (
              <span className="cap">{driver_id?.name}</span>
            ) : (
              "-"
            )}
          </>
        ) : (
          "-"
        ),
    },
    {
      title: lang("date & time"),
      dataIndex: "created_at",
      key: "created_at",
      render: (_, { created_at }) =>
        created_at ? moment(created_at).format("lll") : "-",
    },
    {
      title: lang("Pickup point"),
      dataIndex: "pickup_point",
      key: "pickup_point",
      render: (_, { restaurant_id }) =>
        restaurant_id && restaurant_id?.name && restaurant_id.address ? (
          <span className="cap">
            {restaurant_id.name} ,<p>{restaurant_id.address}</p>
          </span>
        ) : (
          "-"
        ),
    },
    {
      title: lang("payment Method"),
      dataIndex: "payment_Method",
      key: "payment_Method",
      render: (_, { payment_mod }) =>
        payment_mod ? <span className="cap">{payment_mod}</span> : "-",
    },
    {
      title: lang("delivery status"),
      dataIndex: "delivery_status",
      key: "delivery_status",
      render: (_, { status }) =>
        status ? <span className="cap">{status}</span> : "-",
    },
    {
      title: lang("Item Description"),
      dataIndex: "Item_Description",
      key: "Item_Description",
      render: (_, { items }) =>
        items.length
          ? items.map((item, idx) => (
              <span key={idx} className="cap">
                {item?.qty} X {item?.food_id?.name ?? item?.food?.name}
              </span>
            ))
          : "-",
    },
    {
      title: lang("Action"),
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            <Tooltip title="View" color={"purple"} key={"viewDetail"}>
              <Button
                className="ms-sm-2 mt-xs-2 primary_btn btnStyle "
                onClick={() => {
                  setSelected(record);
                  setIsModalOpen(true);
                }}
              >
                {lang("View Detail")}
              </Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setLoading(true);
    // fetchData(pagination);
    fetchData({ ...pagination, current: 1 });
  }, [refresh, country.country_id, filter]);

  const hide = () => {
    setSelected();
    setIsModalOpen(false);
  };

  const excelData = list.map((row) => ({
    Driver: row?.driver_id?.name || "-",
    "Pickup Point": row.restaurant_id?.name || "-",
    // "Country Code": row.country_code ? row.country_code : "-",
    "Item Description": row.items?.length
      ? row.items?.map((itm) => itm?.food_id?.name || "-").join("")
      : "-",
    Status: row.is_active ? "Active" : "Inactive",
    // Location: row.location ? row.location : "-",
    "Registered On": moment(row.created_at).format("DD-MM-YYYY"),
  }));

  const excelData1 = [
    {
      "Driver Profile": selected?.driver_id?.image || "-",
      "Driver Name": selected?.driver_id?.name || "-",
      "Driver ID": selected?.driver_id?.uid
        ? "#" + selected?.driver_id?.uid
        : "-",
      "Pickup Point":
        `${selected?.restaurant_id?.name} ${selected?.restaurant_id?.address}` ||
        "-",
      "Payment Method":
        (selected?.payment_mod == "cod"
          ? `Cash On Delivery`
          : selected?.payment_mod) || "-",
      "Item Description": selected?.items?.length
        ? selected?.items?.map((itm) => itm?.food_id?.name || "-").join("")
        : "-",
      "Delivery Fees": selected?.delivery_fee || "-",
      "Delivery Status": selected?.status || "-",
      Price: selected?.total_payable || "-",
      "Tawasi Commission": selected?.platform_commission?.restaurant || "-",
      "Date & Time": moment(selected?.created_at)?.format("lll"),
    },
  ];

  return (
    <>
      <div className="tab_inner_tit">
        <div className="tab-upload-wrap d-flex align-items-center justify-content-between">
          <h3>{lang("Delivery Agent List")}</h3>
          <div className="d-flex align-items-center gap-3">
            <div className="city-wrap">
              <Select
                width="250"
                style={{ minWidth: "150px" }}
                placeholder={lang("Select Agent")}
                showSearch
                value={filter.driver}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={
                  drivers?.length
                    ? drivers.map((item) => ({
                        value: item._id,
                        label: item.name,
                      }))
                    : []
                }
                onChange={(value) => onChange("driver", value)}
              />
            </div>
            <div className="role-wrap">
              <Select
                width="110px"
                placeholder={lang("Year")}
                showSearch
                value={filter.year}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={years?.map((item) => ({
                  value: item,
                  label: item,
                }))}
                onChange={(value) => onChange("year", value)}
              />
            </div>
            <div className="role-wrap">
              <Select
                width="110px"
                placeholder={lang("Month")}
                showSearch
                value={filter.month}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={months?.map((item) => ({
                  ...item,
                }))}
                onChange={(value) => onChange("month", value)}
              />
            </div>

            <Button
              onClick={() =>
                setFilter({
                  driver: undefined,
                  country_id: undefined,
                  city_id: undefined,
                  year: undefined,
                  month: undefined,
                })
              }
              type="primary"
              icon={<UndoOutlined />}
            >
              {lang("Reset")}
            </Button>
            <div className="btn_grp">
              <Button
                onClick={() => checkFilterValue()}
                className="primary_btn btnStyle"
              >
                {lang("Export to Excel")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive customPagination withOutSearilNo">
        <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={{
            defaultPageSize: 10,
            responsive: true,
            total: pagination.total,
            // showSizeChanger: true,
            // pageSizeOptions: ["10", "20", "30", "50"],
          }}
          onChange={handleChange}
          className="ant-border-space"
        />
      </div>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onOk={hide}
          onCancel={hide}
          width={750}
          footer={null}
          okText="Okay"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="tab_modal"
        >
          <h4 className="modal_title_cls border-title">
            {lang("Delivery Agent History")}
          </h4>
          <div className="delivery_agent_dtl">
            <div style={{ padding: "10px" }} ref={contentToPrint}>
              <div className="delivery_single_agent">
                <h5>{lang("Driver Profile")} : </h5>
                <div className="agent-right">
                  <div className="driver-img">
                    <img src={selected?.driver_id?.image} />
                  </div>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Driver Name")} : </h5>
                <div className="agent-right">
                  <h6>{selected?.driver_id?.name}</h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Driver ID")} : </h5>
                <div className="agent-right">
                  <h6>#{selected?.driver_id?.uid}</h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Date & Time")} : </h5>
                <div className="agent-right">
                  <h6>{moment(selected?.created_at).format("lll")}</h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Pickup Point")} : </h5>
                <div className="agent-right">
                  <h6>
                    {selected?.restaurant_id?.name}
                    <span>{selected?.restaurant_id?.address}</span>
                  </h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Payment Method")} : </h5>
                <div className="agent-right">
                  <h6>
                    {selected?.payment_mod == "cod"
                      ? `Cash On Delivery`
                      : selected?.payment_mod}
                  </h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Delivery Status")} : </h5>
                <div className="agent-right">
                  <h6>{selected?.status}</h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Item Description")} : </h5>
                <div className="agent-right">
                  {selected?.items.map((item, idx) => (
                    <h6 key={idx}>
                      {item?.qty} x {item.food_id?.name}
                    </h6>
                  ))}
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Price")} : </h5>
                <div className="agent-right">
                  <h6>
                    <Currency price={selected?.total_payable} />{" "}
                  </h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Delivery fees ")}: </h5>
                <div className="agent-right">
                  <h6>
                    <Currency price={selected?.delivery_fee} />
                  </h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Tawasi Commission")} : </h5>
                <div className="agent-right">
                  <h6>
                    <Currency
                      price={selected?.platform_commission?.restaurant ?? 0}
                    />{" "}
                    <Currency price={selected?.tip} />
                  </h6>
                </div>
              </div>
              {selected?.tip ? (
                <div className="delivery_single_agent">
                  <h5>{lang("Tip")}: </h5>
                  <div className="agent-right">
                    <h6>
                      <Currency price={selected?.tip} />
                    </h6>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <div className="modal-footer-cls">
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  className="notification-box"
                  placement="top"
                >
                  <Button className="btn btn_primary">
                    {lang(" Export as")}{" "}
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="down"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
                    </svg>
                  </Button>
                </Dropdown>
                <Button onClick={hide} className="btn btn_primary">
                  {lang("Ok")}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

const CustomerOrder = ({ filters }) => {
  const sectionName = "CustomerHistory";
  const { setPageHeading, country } = useContext(AppStateContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { request } = useRequest();
  const api = {
    status: apiPath.statusQuote,
    list: apiPath.history,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState();
  const { customers, months, years } = filters;

  const [filter, setFilter] = useState({
    year: undefined,
    month: undefined,
    customer: undefined,
  });

  const checkFilterValue = () => {
    console.log("filtervalue", filter, filter.year);
    if (filter.year && filter.month) {
      DownloadExcel(excelData, sectionName);
    } else {
      ShowToast("Please select a year and months", Severty.ERROR);
    }
  };
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  const items = [
    {
      key: "1",
      label: (
        <h6
          onClick={() => {
            handlePrint(null, () => contentToPrint.current);
          }}
        >
          PDF
        </h6>
      ),
    },
    {
      key: "2",
      label: (
        <h6 onClick={() => DownloadExcel(excelData1, sectionName)}>Excel</h6>
      ),
    },
  ];

  const onChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleChange = (pagination, filters) => {
    fetchData(pagination, filters);
  };

  const fetchData = (pagination, status) => {
    setLoading(true);

    const payload = { ...filter };
    payload.page = pagination ? pagination.current : 1;
    payload.pageSize = pagination ? pagination?.pageSize : 10;

    const queryString = Object.entries(payload)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");

    request({
      url: api.list + `${queryString ? `?${queryString}` : ""}`,
      method: "GET",
      onSuccess: ({ data, total, status }) => {
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

  useEffect(() => {
    setLoading(true);
    fetchData(pagination);
  }, [refresh, country.country_id, filter]);

  const columns = [
    {
      title: lang("order id"),
      dataIndex: "id",
      render: (_, { uid }) => (uid ? <span className="cap">#{uid}</span> : "-"),
    },
    {
      title: lang("Customer NAME"),
      dataIndex: "name",
      key: "name",
      render: (_, { customer_id }) =>
        customer_id && customer_id?.name ? (
          <>
            <Image
              width={40}
              height={40}
              src={customer_id.image ? customer_id.image : notfound}
              className="table-img"
            />
            {customer_id?.name ? (
              <span className="cap">{customer_id.name}</span>
            ) : (
              "-"
            )}
          </>
        ) : (
          "-"
        ),
    },
    {
      title: lang("order date & time"),
      dataIndex: "dateTime",
      key: "dateTime",
      render: (_, { created_at }) =>
        created_at ? moment(created_at).format("lll") : "-",
    },
    {
      title: lang("Restaurant NAME"),
      dataIndex: "name",
      key: "name",
      render: (_, { restaurant_id }) =>
        restaurant_id && restaurant_id?.name && restaurant_id?.address ? (
          <span className="cap">
            {restaurant_id.name} ,<p>{restaurant_id.address}</p>
          </span>
        ) : (
          "-"
        ),
    },

    {
      title: lang("payment Method"),
      dataIndex: "payment_Method",
      key: "payment_Method",
      render: (_, { payment_mod }) =>
        payment_mod ? <span className="cap">{payment_mod}</span> : "-",
    },
    {
      title: lang("delivery status"),
      dataIndex: "delivery_status",
      key: "delivery_status",
      render: (_, { status }) =>
        status ? <span className="cap">{status}</span> : "-",
    },
    {
      title: lang("Item Description"),
      dataIndex: "Item_Description",
      key: "Item_Description",
      render: (_, { items }) =>
        items.length
          ? items.map((item, idx) => (
              <span key={idx} className="cap">
                {item?.qty} X {item?.food_id?.name ?? item?.food?.name}
              </span>
            ))
          : "-",
    },
    {
      title: lang("Action"),
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            <Tooltip title="View Detail" color={"purple"} key={"viewDetail"}>
              <Button
                className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                onClick={() => {
                  setSelected(record);
                  setIsModalOpen(true);
                }}
              >
                {lang("View Detail")}
              </Button>
            </Tooltip>
          </>
        );
      },
    },
  ];
  const hide = () => {
    setSelected();
    setIsModalOpen(false);
  };

  const excelData = list.map((row) => ({
    Driver: row?.driver_id?.name || "-",
    "Pickup Point": row.restaurant_id?.name || "-",
    // "Country Code": row.country_code ? row.country_code : "-",
    "Item Description": row.items?.length
      ? row.items?.map((itm) => itm?.food_id?.name || "-").join("")
      : "-",
    Status: row.is_active ? "Active" : "Inactive",
    // Location: row.location ? row.location : "-",
    "Registered On": moment(row.created_at).format("DD-MM-YYYY"),
  }));

  const excelData1 = [
    {
      "Customer Profile": selected?.customer_id?.image || "-",
      "Customer Name": selected?.customer_id?.name || "-",
      "Order Id": `#${selected?.uid}` || "-",
      "Restaurant name":
        `${selected?.restaurant_id?.name} ${selected?.restaurant_id?.address}` ||
        "-",
      "Payment Method":
        (selected?.payment_mod == "cod"
          ? `Cash On Delivery`
          : selected?.payment_mod) || "-",
      "Item Description": selected?.items?.length
        ? selected?.items?.map((itm) => itm?.food_id?.name || "-").join("")
        : "-",
      "Delivery Status ": selected?.status || "-",
      "Total Amount": selected?.total_payable || "-",
      "Date & Time": moment(selected?.created_at)?.format("lll"),
    },
  ];

  return (
    <>
      <div className="tab_inner_tit">
        <div className="tab-upload-wrap d-flex align-items-center justify-content-between">
          <h3>{lang("Customer Order List")}</h3>
          <div className="d-flex align-items-center gap-3">
            <div className="city-wrap">
              <Select
                width="250"
                style={{ minWidth: "150px" }}
                placeholder={lang("Select Customer")}
                showSearch
                value={filter.customer}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={
                  customers?.length
                    ? customers.map((item) => ({
                        value: item._id,
                        label: item.name,
                      }))
                    : []
                }
                onChange={(value) => onChange("customer", value)}
              />
            </div>
            <div className="role-wrap">
              <Select
                width="110px"
                placeholder={lang("Year")}
                value={filter.year}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={years?.map((item) => ({
                  value: item,
                  label: item,
                }))}
                onChange={(value) => onChange("year", value)}
              />
            </div>
            <div className="role-wrap">
              <Select
                width="110px"
                placeholder={lang("Month")}
                showSearch
                value={filter.month}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={months?.map((item) => ({
                  ...item,
                }))}
                onChange={(value) => onChange("month", value)}
              />
            </div>

            <Button
              onClick={() =>
                setFilter({
                  country_id: undefined,
                  city_id: undefined,
                  year: undefined,
                  month: undefined,
                })
              }
              type="primary"
              icon={<UndoOutlined />}
            >
              {lang("Reset")}
            </Button>
            <div className="btn_grp">
              <Button
                onClick={() => checkFilterValue()}
                className="primary_btn btnStyle"
              >
                {lang("Export to Excel")}
              </Button>
            </div>
          </div>
        </div>
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
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", "50"],
          }}
          onChange={handleChange}
          className="ant-border-space"
        />
      </div>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onOk={hide}
          onCancel={hide}
          footer={null}
          width={750}
          okText="Okay"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="tab_modal"
        >
          <h4 className="modal_title_cls border-title">
            {lang("Customer History")}
          </h4>
          <div className="delivery_agent_dtl">
            <div style={{ padding: "10px" }} ref={contentToPrint}>
              <div className="delivery_single_agent">
                <h5>{lang("Customer Profile")} : </h5>
                <div className="agent-right">
                  <div className="driver-img">
                    <img src={selected?.customer_id?.image} />
                  </div>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Customer Name")} : </h5>
                <div className="agent-right">
                  <h6>{selected?.customer_id?.name}</h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Order ID")} : </h5>
                <div className="agent-right">
                  <h6>#{selected?.uid}</h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Date & Time ")}: </h5>
                <div className="agent-right">
                  <h6>{moment(selected?.created_at).format("lll")}</h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Restaurant Name")} : </h5>
                <div className="agent-right">
                  <h6>
                    {selected?.restaurant_id?.name}
                    <span>{selected?.restaurant_id?.address}</span>
                  </h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Payment Method")} : </h5>
                <div className="agent-right">
                  <h6>
                    {selected?.payment_mod == "cod"
                      ? `Cash On Delivery`
                      : selected?.payment_mod}
                  </h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Delivery Status")} : </h5>
                <div className="agent-right">
                  <h6>{selected?.status}</h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Item Description")} : </h5>
                <div className="agent-right">
                  {selected?.items.map((item, idx) => (
                    <h6 key={idx}>
                      {item?.qty} x {item.food_id?.name}
                    </h6>
                  ))}
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Total Amount")} : </h5>
                <div className="agent-right">
                  <h6>
                    <Currency price={selected?.total_payable} />{" "}
                  </h6>
                </div>
              </div>
            </div>
            <div>
              <div className="modal-footer-cls">
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  className="notification-box"
                  placement="top"
                >
                  <Button className="btn btn_primary">
                    {lang(" Export as")}{" "}
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="down"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
                    </svg>
                  </Button>
                </Dropdown>
                <Button onClick={hide} className="btn btn_primary">
                  {lang("Ok")}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

const RestaurantOrder = ({ filters }) => {
  const sectionName = "RestaurantHistory";
  const { setPageHeading, country } = useContext(AppStateContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { request } = useRequest();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState();
  const { restaurants, months, years } = filters;

  const [filter, setFilter] = useState({
    year: undefined,
    month: undefined,
    restaurant: undefined,
  });
  const checkFilterValue = () => {
    console.log("filtervalue", filter, filter.year);
    if (filter.year && filter.month) {
      DownloadExcel(excelData, sectionName);
    } else {
      ShowToast("Please select a year and months", Severty.ERROR);
    }
  };

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  const items = [
    {
      key: "1",
      label: (
        <h6
          onClick={() => {
            handlePrint(null, () => contentToPrint.current);
          }}
        >
          PDF
        </h6>
      ),
    },
    {
      key: "2",
      label: (
        <h6 onClick={() => DownloadExcel(excelData1, sectionName)}>Excel</h6>
      ),
    },
  ];

  const onChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const api = {
    status: apiPath.statusQuote,
    list: apiPath.history,
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleChange = (pagination, filters) => {
    fetchData(pagination, filters);
  };

  const fetchData = (pagination, status) => {
    setLoading(true);

    const payload = { ...filter };
    payload.page = pagination ? pagination.current : 1;
    payload.pageSize = pagination ? pagination?.pageSize : 10;

    const queryString = Object.entries(payload)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");

    request({
      url: api.list + `${queryString ? `?${queryString}` : ""}`,
      method: "GET",
      onSuccess: ({ data, total, status }) => {
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

  const columns = [
    {
      title: lang("Restro id"),
      dataIndex: "id",
      render: (_, { restaurant_id }) =>
        restaurant_id ? (
          <span className="cap">#{restaurant_id?.uid}</span>
        ) : (
          "-"
        ),
    },
    {
      title: lang("Restaurant NAME"),
      dataIndex: "name",
      key: "name",
      render: (_, { restaurant_id }) =>
        restaurant_id ? (
          <>
            <Image
              width={40}
              height={40}
              src={restaurant_id?.logo ? restaurant_id?.logo : notfound}
              className="table-img"
            />
            {restaurant_id.name ? (
              <span className="cap">{restaurant_id?.name}</span>
            ) : (
              "-"
            )}
          </>
        ) : (
          "-"
        ),
    },
    {
      title: lang("order date & time"),
      dataIndex: "dateTime",
      key: "dateTime",
      render: (_, { created_at }) =>
        created_at ? moment(created_at).format("lll") : "-",
    },
    {
      title: lang("Customer NAME"),
      dataIndex: "name",
      key: "name",
      render: (_, { customer_id }) =>
        customer_id ? (
          <>
            <Image
              width={40}
              height={40}
              src={customer_id?.image ? customer_id.image : notfound}
              className="table-img"
            />
            {customer_id?.name ? (
              <span className="cap">{customer_id?.name}</span>
            ) : (
              "-"
            )}
          </>
        ) : (
          "-"
        ),
    },
    {
      title: lang("payment Method"),
      dataIndex: "payment_Method",
      key: "payment_Method",
      render: (_, { payment_mod }) =>
        payment_mod ? <span className="cap">{payment_mod}</span> : "-",
    },
    {
      title: lang("delivery status"),
      dataIndex: "delivery_status",
      key: "delivery_status",
      render: (_, { status }) =>
        status ? <span className="cap">{status}</span> : "-",
    },
    {
      title: lang("Item Description"),
      dataIndex: "Item_Description",
      key: "Item_Description",
      render: (_, { items }) =>
        items && items.length
          ? items.map((item, idx) => (
              <span key={idx} className="cap">
                {item?.qty} X {item?.food_id?.name ?? item?.food?.name}
              </span>
            ))
          : "-",
    },
    {
      title: lang("Action"),
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            <Tooltip title="View Detail" color={"purple"} key={"viewDetail"}>
              <Button
                className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                onClick={() => {
                  setSelected(record);
                  setIsModalOpen(true);
                }}
              >
                {lang("View Detail")}
              </Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    fetchData(pagination);
  }, [refresh, country.country_id, filter]);

  const hide = () => {
    setSelected();
    setIsModalOpen(false);
  };

  const excelData = list.map((row) => ({
    Driver: row?.driver_id?.name || "-",
    "Pickup Point": row.restaurant_id?.name || "-",
    // "Country Code": row.country_code ? row.country_code : "-",
    "Item Description": row.items?.length
      ? row.items?.map((itm) => itm?.food_id?.name || "-").join("")
      : "-",
    Status: row.is_active ? "Active" : "Inactive",
    // Location: row.location ? row.location : "-",
    "Registered On": moment(row.created_at).format("DD-MM-YYYY"),
  }));

  const excelData1 = [
    {
      "Restaurant Profile": selected?.restaurant_id?.logo || "-",
      "Restaurant Name": selected?.restaurant_id?.name || "-",
      "Restaurant ID": selected?.restaurant_id?.uid
        ? "#" + selected?.restaurant_id?.uid
        : "-",
      "Customer Detail": selected?.customer_id?.name || "-",
      "Payment Method":
        (selected?.payment_mod == "cod"
          ? `Cash On Delivery`
          : selected?.payment_mod) || "-",
      "Item Description": selected?.items?.length
        ? selected?.items?.map((itm) => itm?.food_id?.name || "-").join("")
        : "-",
      "Delivery Fees": selected?.delivery_fee || "-",
      "Delivery Status": selected?.status || "-",
      "Price ": selected?.total_payable || "-",
      "Tawasi Commission": selected?.platform_commission?.restaurant || "-",
      "Date & Time": moment(selected?.created_at)?.format("lll"),
    },
  ];

  return (
    <>
      <div className="tab_inner_tit">
        <div className="tab-upload-wrap d-flex align-items-center justify-content-between">
          <h3>{lang("Restaurant Order List")}</h3>
          <div className="d-flex align-items-center gap-3">
            <div className="city-wrap">
              <Select
                width="250"
                style={{ minWidth: "150px" }}
                placeholder={lang("Select Restaurant")}
                showSearch
                value={filter.restaurant}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={
                  restaurants?.length
                    ? restaurants.map((item) => ({
                        value: item._id,
                        label: item.name,
                      }))
                    : []
                }
                onChange={(value) => onChange("restaurant", value)}
              />
            </div>
            <div className="role-wrap">
              <Select
                width="110px"
                placeholder={lang("Year")}
                showSearch
                value={filter.year}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={years?.map((item) => ({
                  value: item,
                  label: item,
                }))}
                onChange={(value) => onChange("year", value)}
              />
            </div>
            <div className="role-wrap">
              <Select
                width="110px"
                placeholder={lang("Month")}
                showSearch
                value={filter.month}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={months?.map((item) => ({
                  ...item,
                }))}
                onChange={(value) => onChange("month", value)}
              />
            </div>

            <Button
              onClick={() =>
                setFilter({
                  country_id: undefined,
                  city_id: undefined,
                  year: undefined,
                  month: undefined,
                })
              }
              type="primary"
              icon={<UndoOutlined />}
            >
              {lang("Reset")}
            </Button>
            <div className="btn_grp">
              <Button
                onClick={() => checkFilterValue()}
                className="primary_btn btnStyle"
              >
                {lang("Export to Excel")}
              </Button>
            </div>
          </div>
        </div>
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
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", "50"],
          }}
          onChange={handleChange}
          className="ant-border-space"
        />
      </div>

      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onOk={hide}
          onCancel={hide}
          footer={null}
          width={750}
          okText="Okay"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="tab_modal"
        >
          <h4 className="modal_title_cls border-title">
            {lang("Restaurant Order History")}
          </h4>
          <div className="delivery_agent_dtl">
            <div style={{ padding: "10px" }} ref={contentToPrint}>
              <div className="delivery_single_agent">
                <h5>{lang("Restaurant Profile")} : </h5>
                <div className="agent-right">
                  <div className="driver-img">
                    <img src={selected?.restaurant_id?.logo} />
                  </div>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Restaurant Name")} : </h5>
                <div className="agent-right">
                  <h6>{selected?.restaurant_id?.name}</h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Restro ID")} : </h5>
                <div className="agent-right">
                  <h6>#{selected?.restaurant_id?.uid}</h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Date & Time")} : </h5>
                <div className="agent-right">
                  <h6>{moment(selected?.created_at).format("lll")}</h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Customer Detail")} : </h5>
                <div className="agent-right">
                  <h6>
                    {selected?.customer_id?.name}
                    <span>{selected?.address?.address}</span>
                  </h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Payment Method")} : </h5>
                <div className="agent-right">
                  <h6>
                    {selected?.payment_mod == "cod"
                      ? `Cash On Delivery`
                      : selected?.payment_mod}
                  </h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Delivery Status")} : </h5>
                <div className="agent-right">
                  <h6>{selected?.status}</h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Item Description")} : </h5>
                <div className="agent-right">
                  {selected?.items.map((item, idx) => (
                    <h6 key={idx}>
                      {item?.qty} x {item.food_id?.name}
                    </h6>
                  ))}
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Price")} : </h5>
                <div className="agent-right">
                  <h6>
                    <Currency price={selected?.total_payable} />{" "}
                  </h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Delivery fees")} : </h5>
                <div className="agent-right">
                  <h6>
                    <Currency price={selected?.delivery_fee} />
                  </h6>
                </div>
              </div>
              <div className="delivery_single_agent">
                <h5>{lang("Tawasi Commission")} : </h5>
                <div className="agent-right">
                  <h6>
                    <Currency
                      price={selected?.platform_commission?.restaurant ?? 0}
                    />
                  </h6>
                </div>
              </div>
            </div>
            <div>
              <div className="modal-footer-cls">
                <Dropdown
                  menu={{ items }}
                  trigger={["click"]}
                  className="notification-box"
                  placement="top"
                >
                  <Button className="btn btn_primary">
                    {lang("Export as")}{" "}
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="down"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
                    </svg>
                  </Button>
                </Dropdown>
                <Button onClick={hide} className="btn btn_primary">
                  {lang("Ok")}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Index;
