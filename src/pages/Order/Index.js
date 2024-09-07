import { UndoOutlined } from "@ant-design/icons";
import { Badge, Button, Input, Select, Table, Tag, Tooltip } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EditIcon from "../../assets/images/edit.svg";
import CancelIcon from "../../assets/images/icon/CancelIcon.png";
import DeleteModal from "../../components/DeleteModal";
import SectionWrapper from "../../components/SectionWrapper";
import apiPath from "../../constants/apiPath";
import { CancelOrder, Months } from "../../constants/var";
import { AppStateContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
import EditForm from "./EditModal";
import ViewModal from "./_ViewModal";
import { AddFood } from "./_AddFood";
import moment from "moment";

export const OrderStatus = {
  ACCEPT: "accepted",
  PENDING: "pending",
  PROCESSING: "processing",
  READY: "ready to pickup",
  PICKUP: "picked up",
  CANCEL: "cancelled",
  DELIVERED: "delivered",
};

export const Order = {
  scheduled: "Scheduled",
  "scheduled confirmed": "Scheduled confirmed",
  accepted: "Preparing Order",
  pending: "New Order",
  processing: "processing",
  "ready to pickup": "Ready for Pick Up",
  "picked up": "picked up",
  "out for delivery": "out for delivery",
  cancelled: "cancelled",
  delivered: "delivered",
};

export const RestOrderStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  READY: "ready to pickup",
  PICKUP: "picked up",
  CANCEL: "cancelled",
  DELIVERED: "delivered",
};

export const DriverOrderStatus = {
  CANCEL: "cancelled",
  PENDING: "pending",
  ACCEPT: "confirmed",
  ARRIVED: "arrived at restaurant",
  PICKUP: "picked up",
  DROP: "arrived at drop location",
  OUT: "out for delivery",
  DELIVERED: "delivered",
};

function Index() {
  const { setPageHeading, country } = useContext(AppStateContext);
  const heading = lang("Order") + " " + lang("Management");

  const urlParams = new URLSearchParams(window.location.search);
  const path = urlParams.get("status");
  const params = useParams();

  const api = {
    status: apiPath.order,
    addEdit: apiPath.order,
    list: apiPath.order,
    importFile: apiPath.order + "/" + params.type,
  };

  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [viewModal, showViewModal] = useState(false);
  const [selected, setSelected] = useState();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const debouncedSearchText = useDebounce(searchText, 300);
  const [cancelModal, showCancelModal] = useState(false);

  const [isAddFoodModal, setIsAddFoodModal] = useState(false);

  const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    country_id: undefined,
    city_id: undefined,
    year: undefined,
    month: undefined,
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

  const getCities = (id, page, search = false) => {
    if (!id) return;
    request({
      url: `/country-city/${id}?page=${page}&pageSize=200${
        search ? `&search=${search}` : ""
      }`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        console.log(data, "setCities");
        if (data) {
          setCities((prev) => [...data]);
        }
      },
    });
  };

  const handleChangeStatus = ({ id, reason }) => {
    request({
      url: api.status + "/" + id + "/" + "cancelled",
      method: "POST",
      data: { cancelation_reason: reason },
      onSuccess: (data) => {
        setLoading(false);
        setRefresh(true);
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
        } else {
          ShowToast(data.message, Severty.ERROR);
        }
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
      title: lang("Order id"),
      dataIndex: "index",
      key: "index",
      render: (_, { uid }) => (uid ? <span className="cap">#{uid}</span> : "-"),
    },

    {
      title: lang("Restaurant Name"),
      dataIndex: "name",
      key: "name",
      render: (_, { restaurant_id }) =>
        restaurant_id ? <span className="cap">{restaurant_id.name}</span> : "-",
    },
    {
      title: lang("Customer Name"),
      dataIndex: "name",
      key: "name",
      render: (_, { customer_id }) =>
        customer_id ? (
          <div style={{ display: "flex", gap: 2, flexDirection: "column" }}>
            {customer_id?.name && (
              <span className="cap">{customer_id.name}</span>
            )}
            {customer_id?.country_code && customer_id?.mobile_number && (
              <span className="cap" style={{ fontSize: "14px", color: "gray" }}>
                ({customer_id.country_code}) {customer_id.mobile_number}
              </span>
            )}
            {customer_id?.email && (
              <span style={{ fontSize: "14px", color: "gray" }}>
                {customer_id.email}
              </span>
            )}
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: lang("order Status"),
      className: "status-bedge",
      key: "created_at",
      render: (_, { status, restaurant_status, driver_status }) => {
        let color;
        let text;
        color = "warning";
        text = Order[status];
        if (status === OrderStatus.ACCEPT) {
          if (restaurant_status === RestOrderStatus.PROCESSING) {
            color = "lime";
            text = "Preparing Order";
          } else {
            text = "New Order";
          }
        } else if (status === OrderStatus.PROCESSING) {
          color = "processing";
          text = "Preparing";
        } else if (status === OrderStatus.READY) {
          color = "cyan";
        } else if (status === OrderStatus.PICKUP) {
          color = "blue";
          text = "Picked up by driver";
        } else if (status === OrderStatus.DELIVERED) {
          color = "green";
        } else if (status === OrderStatus.CANCEL) {
          color = "error";
          text = "Rejected";
        } else {
          color = "warning";
          if (driver_status == "arrived at drop location")
            text = "Driver arrived at customer";
        }
        return status ? (
          <Tag color={color}>{<span className="cap">{text}</span>}</Tag>
        ) : (
          "-"
        );
      },
    },

    {
      title: lang("Delivery Status"),
      className: "status-bedge",
      key: "created_at",
      render: (_, { driver_status, cancelled_by, status: OrderStatus }) => {
        let color;
        let status = "Driver not assigned";
        if (
          driver_status === DriverOrderStatus.ACCEPT ||
          driver_status == "accepted"
        ) {
          color = "lime";
          status = "Driver assigned";
        } else if (driver_status === DriverOrderStatus.ARRIVED) {
          color = "processing";
          status = "Driver at restaurant";
        } else if (driver_status === DriverOrderStatus.DROP) {
          color = "cyan";
          status = "Arrived at customer";
        } else if (driver_status === DriverOrderStatus.PICKUP) {
          color = "blue";
          status = "Order Picked Up";
        } else if (driver_status === DriverOrderStatus.DELIVERED) {
          color = "green";
          status = "Delivered";
        } else if (driver_status === DriverOrderStatus.CANCEL) {
          color = "error";
          if (cancelled_by == "Vendor") status = "Rejected by Restaurant";
          else status = "Cancelled";
        } else {
          color = "warning";
          // status = driver_status;
          if (OrderStatus == "processing") status = "Looking for driver";
          if (OrderStatus == "cancelled") {
            color = "error";
            status = "Cancelled";
          }
          if (OrderStatus == "cancelled" && cancelled_by == "Vendor") {
            color = "error";
            status = "Rejected by Restaurant";
          }
        }
        return driver_status ? (
          <Tag color={color}>{<span className="cap">{status}</span>}</Tag>
        ) : (
          "-"
        );
      },
    },
    {
      title: lang("Delivery Agent Name"),
      key: "created_at",
      render: (_, { driver_id }) =>
        driver_id ? (
          <span className="cap">{driver_id.name}</span>
        ) : (
          <Badge status="warning" text="Not Assigned" />
        ),
    },
    {
      title: lang("Action"),
      fixed: "right",
      key: "action",
      render: (_, record) => {
        return (
          <div div className="d-flex justify-contenbt-start">
            {/* {(record.status === OrderStatus.PENDING ||
              record.status === OrderStatus.ACCEPT ||
              record.status === OrderStatus.PROCESSING) && (
              <Tooltip title={lang("Edit")} color={"purple"} key={"update"}>
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
            )} */}

            <Tooltip
              title={lang("View Details")}
              color={"purple"}
              key={"View Details"}
            >
              <Button
                title="View Details"
                className="btnStyle btnOutlineDelete"
                onClick={() => {
                  setSelected(record);
                  showViewModal(true);
                }}
              >
                <span>{lang("View Details")}</span>
              </Button>
            </Tooltip>
            {record.status !== OrderStatus.CANCEL && (
              <Tooltip
                title={lang("Cancel Order")}
                color={"purple"}
                key={"Cancel Order"}
              >
                <Button
                  title={lang("Cancel Order")}
                  className="btnStyle deleteDangerbtn"
                  onClick={() => {
                    setSelected(record);
                    showCancelModal(true);
                  }}
                >
                  <img src={CancelIcon} />
                  <span>{lang("Cancel Order")}</span>
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

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
        }&pageSize=${
          pagination ? pagination.pageSize : 10
        }&search=${debouncedSearchText}${queryString ? `&${queryString}` : ""}${
          path ? `&delivery_status=${path}` : ""
        }`,
      method: "GET",
      onSuccess: ({ data, status, total }) => {
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
  };

  const onChange = (key, value) => {
    if (key == "country_id") {
      setCities([]);
      setFilter((prev) => ({ ...prev, city_id: undefined, country_id: value }));
    } else {
      setFilter((prev) => ({ ...prev, [key]: value }));
    }
  };

  useEffect(() => {
    if (!country.country_id) return;
    // setCities([]);
    // getCities(country.country_id, 1);
  }, [country.country_id]);

  useEffect(() => {
    setLoading(true);
    fetchData({ ...pagination, current: 1 });
  }, [refresh, debouncedSearchText, filter, country.country_id]);

  useEffect(() => {
    setPageHeading(heading);
    getFilter();
  }, []);

  return (
    <>
      <SectionWrapper
        cardHeading={lang("Ongoing Orders List")}
        extra={
          <>
            <div className="w-100 text-head_right_cont">
              <div className="role-wrap">
                <Select
                  width="110px"
                  placeholder={lang("City")}
                  showSearch
                  value={filter.city_id}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  options={cities.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                  onChange={(value) => onChange("city_id", value)}
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
              <div className="pageHeadingSearch">
                <Input.Search
                  className="searchInput"
                  placeholder={lang(
                    "Search by customer name, Phone number, email",
                  )}
                  onChange={onSearch}
                  allowClear
                />
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
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["10", "20", "30", "50"],
            }}
            onChange={handleChange}
            className="ant-border-space"
          />
        </div>
      </SectionWrapper>

      {visible && (
        <EditForm
          api={api}
          show={visible}
          hide={() => {
            setSelected();
            setVisible(false);
          }}
          data={selected}
          refreshList={() => {
            setRefresh((prev) => !prev);
            //fetchData({ ...pagination, current: 1 });
          }}
          isAddFoodModal={isAddFoodModal}
          setIsAddFoodModel={setIsAddFoodModal}
          setSelected={setSelected}
        />
      )}

      {/* {isAddFoodModal && (
        <AddFood
          refresh={() => setIsAddFoodModal(false)}
          order={selected}
          // setOrderedItems={setOrderedItems}
          show={isAddFoodModal}
          hide={() => {
            setIsAddFoodModal(false);
          }}
        />
      )} */}

      {viewModal && (
        <ViewModal
          api={api}
          show={viewModal}
          hide={() => {
            setSelected();
            showViewModal(false);
          }}
          data={selected}
          refresh={() => setRefresh((prev) => !prev)}
          refreshList={() => {
            setRefresh((prev) => !prev);
            //fetchData({ ...pagination, current: 1 });
          }}
        />
      )}

      {cancelModal && (
        <DeleteModal
          title={lang("Cancel Order")}
          subtitle={lang(`Are you sure you want to cancel this order?`)}
          show={cancelModal}
          hide={() => {
            showCancelModal(false);
            setSelected();
          }}
          reasons={CancelOrder}
          onOk={(cancelationReason) => {
            handleChangeStatus({
              id: selected?._id,
              reason: cancelationReason,
            });
          }}
        />
      )}
    </>
  );
}

export default Index;
