import {
  Button,
  Card,
  Dropdown,
  Image,
  Input,
  Rate,
  Table,
  Col,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import apiPath from "../../../constants/apiPath";
import { useAppContext } from "../../../context/AppContext";
import lang from "../../../helper/langHelper";
import { Severty, ShowToast } from "../../../helper/toast";
import useDebounce from "../../../hooks/useDebounce";
import useRequest from "../../../hooks/useRequest";
import BarChart from "../../../components/charts/BarChart";
import LineChart from "../../../components/charts/LineCart";
import { getRandomColor } from "../../../helper/functions";
import Currency from "../../../components/Currency";

const dummy = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Dataset 1",
      data: [
        null,
        null,
        null,
        null,
        null,
        16000,
        null,
        5000,
        null,
        null,
        null,
        null,
      ], // Starting from June
      borderColor: "#F3E008",
      tension: 0.1,
      spanGaps: true, // Add this option
    },
    {
      label: "Dataset 2",
      data: [
        null,
        null,
        null,
        null,
        null,
        7000,
        null,
        8000,
        null,
        null,
        null,
        null,
      ], // Starting from June
      borderColor: "#383B42",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      spanGaps: true, // Add this option
      // yAxisID: 'y1',
    },
  ],
};

const BannerRevenue = ({ filter }) => {
  const { country } = useAppContext();
  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [revenue, setRevenue] = useState();
  const [revenueLine, setRevenueLine] = useState();
  const [commission, setCommission] = useState();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0,
  });

  useEffect(() => {
    setLoading(true);
    fetchData({ ...pagination, current: 1 });
  }, [refresh, filter, country.country_id]);

  const fetchData = () => {
    setLoading(true);

    const queryString = Object.entries(filter)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");

    request({
      url: `${apiPath.report}/revenue-banner${
        queryString ? `?${queryString}` : ""
      }`,
      method: "GET",
      onSuccess: ({ data, status, banner, message }) => {
        setLoading(false);
        if (status) {
          setData(data);
          setList(banner);
          /// setList(data)
          console.log("Add Revenue /City", data, banner);
        }
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  useEffect(() => {
    if (!data.length) return setRevenue();

    let add = [];
    let city = [];

    data.map((item) => {
      city.push(item.name);
      add.push(item.total_price);
    });

    const rev = {
      labels: city,
      datasets: [
        {
          label: `${lang("Add Revenue")}`,
          data: add,
          backgroundColor: getRandomColor(0),
        },
      ],
    };
    setRevenue(rev);
  }, [data]);

  useEffect(() => {
    if (!list.length) return setRevenueLine();
    let city = [];
    let restaurant = Array.from({ length: 12 });

    const dataSetsRestaurant = list.map((item, indexI) => {
      const data = restaurant.map((res, index) => {
        const findIndex = item.monthData.find(
          ({ month }) => index + 1 == month,
        );
        if (findIndex) return findIndex.total_price;
        return null;
      });
      return {
        label: `${item.city.name}`,
        data: data,
        borderColor: getRandomColor(indexI),
        tension: 0.1,
        spanGaps: true,
      };
    });

    setRevenueLine({ ...dummy, datasets: dataSetsRestaurant });
  }, [list]);

  return (
    <>
      <Col xs={24} xl={12} lg={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <h4 className="chart-tital"> {lang("Add Revenue  /City")}</h4>
          <h4 className="chart-tital">
            <Currency
              price={data?.reduce((total, index) => {
                return total + index.total_price;
              }, 0)}
            />
          </h4>
          <BarChart borderColor="#1EB564" data={revenue} />
        </Card>
      </Col>

      <Col xs={24} xl={12} lg={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <h4 className="chart-tital">{lang("Add Revenue Trend /City")}</h4>
          {/* <h4 className="chart-tital">
            <Currency
              price={list?.reduce((totalRevenue, totalMonth) => {
                if (totalMonth && totalMonth.monthData) {
                  return (
                    totalRevenue +
                    totalMonth.monthData.reduce((acc, item) => {
                      return acc + (item.total_price || 0);
                    }, 0)
                  );
                } else {
                  return totalRevenue;
                }
              }, 0)}
            />
          </h4> */}
          <LineChart borderColor="#1EB564" data={revenueLine} />
        </Card>
      </Col>
    </>
  );
};

export default BannerRevenue;
