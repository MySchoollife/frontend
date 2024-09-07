import { UndoOutlined } from "@ant-design/icons";
import { Button, Input, Select, Table, Tabs, Tooltip } from "antd";
import React, { useContext, useEffect, useState } from "react";
import Currency from "../../components/Currency";
import apiPath from "../../constants/apiPath";
import { Months } from "../../constants/var";
import { AppStateContext } from "../../context/AppContext";
import { dateString } from "../../helper/functions";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import moment from "moment";
import { Link } from "react-router-dom";
import { DownloadExcel } from "../../components/ExcelFile";
const Search = Input.Search;
const { TabPane } = Tabs;

const RestaurantPending = ({}) => {
  const sectionName = lang("New");
  const { country } = useContext(AppStateContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { request } = useRequest();
  const api = {
    status: apiPath.statusQuote,
    list: apiPath.history,
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [restaurants, setRestaurant] = useState([]);
  const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    restaurant_id: undefined,
    city_id: undefined,
    year: undefined,
    month: undefined,
  });

  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  const onChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const checkFilterValue = () => {
    if (filter.year && filter.month) {
      DownloadExcel(excelData, sectionName);
    } else {
      ShowToast(lang("Please select a year and months"), Severty.ERROR);
    }
  };

  const getFilter = () => {
    request({
      url: `${apiPath.finance}/filters`,
      method: "GET",
      onSuccess: (res) => {
        const { data, months, years, restaurants } = res;
        setCities(data);
        setYears(years);
        setRestaurant(restaurants);
        const m = Months.filter((item) => months.includes(item.value));
        setMonths(m);
      },
    });
  };

  const handleChange = (pagination, sorter, filters) => {
    if (!sorter) {
      fetchData(pagination);
    }
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
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    request({
      url:
        `${apiPath.finance}/pending` +
        `${queryString ? `?${queryString}` : ""}`,
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
    getFilter();
  }, [refresh, country.country_id, filter]);

  const columns = [
    {
      title: lang("Service Id"),
      dataIndex: "id",
      render: (_, { restaurant_id }) =>
        `#${restaurant_id ? restaurant_id.uid : ""}`,
    },
    {
      title: lang("customer name"),
      dataIndex: "name",
      key: "name",
      render: (_, { restaurant_id }) => `${restaurant_id?.name}`,
    },

    {
      title: lang("Service Provider Name"),
      dataIndex: "country",
      key: "country",
      render: (_, { country_id }) => `${country_id?.name}`,
    },
    {
      title: "Requested Date",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (_, { created_at }) => `${dateString(created_at, "ll")}`,
    },

    {
      title: lang("Status"),
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            <Tooltip
              title={lang("View Detail")}
              color={"purple"}
              key={"viewDetail"}
            >
              <Link
                className="ant-btn ant-btn-default ms-sm-2 mt-xs-2 btnStyle btnOutlineDelete"
                to={`/finance/${record._id}/invoice`}
              >
                {lang("View Detail")}
              </Link>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const excelData = list.map((row) => ({
    Restaurant_id: row?.restaurant_id?.uid || "-",
    Restaurant_name: row.restaurant_id?.name || "-",
    Country: row?.country_id?.name || "-",
    City: row?.city_id?.name || "-",
    Area: row?.restaurant_id?.area?.name || "-",
    Total_payment: row?.this_month_amount || "-",
    Paid_amount: row?.paid_amount || "-",
    Remaining_amount: row?.remaining_amount || "-",
    Invoice_date: row?.created_at
      ? moment(row?.created_at).format("DD-MM-YYYY")
      : "-",
  }));

  return (
    <>
      <div className="tab_inner_tit">
        <div className="tab-upload-wrap d-flex align-items-center justify-content-between">
          <h3>{lang("New")}</h3>
          <div className="d-flex align-items-center gap-3">
            <div className="btn_grp">
              <Button
                className="primary_btn btnStyle"
                onClick={() => checkFilterValue()}
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
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", "50"],
          }}
          onChange={handleChange}
          className="ant-border-space"
        />
      </div>
    </>
  );
};

export default RestaurantPending;
