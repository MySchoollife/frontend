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

const DiscountPerformance = ({ filter }) => {
  const { country } = useAppContext();
  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();
  const [list, setList] = useState([]);

  const [customer, setCustomer] = useState([]);
  const [customerLine, setCustomerLine] = useState();
  const [driver, setDriver] = useState([]);
  const [driverLine, setDriverLine] = useState();
  const [restaurant, setRestaurant] = useState([]);
  const [restaurantLine, setRestaurantLine] = useState();

  const [data, setData] = useState([]);
  const [revenueRes, setRevenueRes] = useState();
  const [revenueDriver, setRevenueDriver] = useState();
  const [commissionRes, setCommissionRes] = useState();
  const [commissionDriver, setCommissionDriver] = useState();
  const [loading, setLoading] = useState(false);
  const [codPayments, setCodPayments] = useState();
  const [onlinePayments, setOnlinePayments] = useState();

  const [refresh, setRefresh] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0,
  });

  const debouncedSearchText = useDebounce(searchText, 300);

  useEffect(() => {
    setLoading(true);
    fetchData({ ...pagination, current: 1 });
  }, [refresh, filter, country.country_id]);

  const fetchData = () => {
    setLoading(true);
    const queryString = "";

    request({
      url: `${apiPath.report}/delivery-discount${
        queryString ? `?${queryString}` : ""
      }`,
      method: "GET",
      onSuccess: ({ data, status, deliver, pickup, cancel }) => {
        console.log(data, "data");
        setLoading(false);
        if (status) {
          // setList(customer)
          // setData(payment)
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
    if (!customer.length) return setCustomerLine();
    let city = [];
    let restaurant = Array.from({ length: 12 });
    const dataSetsRestaurant = customer.map((item, Index) => {
      const data = restaurant.map((res, index) => {
        const findIndex = item.monthData.find(
          ({ month }) => index + 1 == month,
        );
        if (findIndex) return findIndex.count;
        return null;
      });
      return {
        label: `${item.city.name}`,
        data: data,
        borderColor: getRandomColor(Index),
        tension: 0.1,
        spanGaps: true,
      };
    });
    setCustomerLine({ ...dummy, datasets: dataSetsRestaurant });
  }, [customer]);

  useEffect(() => {
    if (!driver.length) return setDriverLine();
    let city = [];
    let restaurant = Array.from({ length: 12 });
    const dataSetsRestaurant = driver.map((item, Index) => {
      const data = restaurant.map((res, index) => {
        const findIndex = item.monthData.find(
          ({ month }) => index + 1 == month,
        );
        if (findIndex) return findIndex.count;
        return null;
      });
      return {
        label: `${item.city.name}`,
        data: data,
        borderColor: getRandomColor(Index),
        tension: 0.1,
        spanGaps: true,
      };
    });
    setDriverLine({ ...dummy, datasets: dataSetsRestaurant });
  }, [driver]);

  // useEffect(() => {
  //     if (!restaurant.length) return
  //     let city = []
  //     let restaurant1 = Array.from({ length: 12 })
  //     const dataSetsRestaurant = restaurant.map((item) => {
  //         const data = restaurant1.map((res, index) => {
  //             const findIndex = item.monthData.find(({ month }) => index + 1 == month)
  //             if (findIndex) return findIndex.count
  //             return null
  //         })
  //         return {
  //             label: `${item.city.name}`,
  //             data: data,
  //             borderColor: '#F3E008',
  //             tension: 0.1,
  //             spanGaps: true,
  //         }
  //     })
  //     setDriverLine({ ...dummy, datasets: dataSetsRestaurant })
  // }, [restaurant])

  return (
    <>
      <Col xs={24} xl={12} lg={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <h4 className="chart-tital">
            {" "}
            {`${lang("Delivery Trend /City")} ${
              customer?.[0]?.allDelivers ? customer?.[0]?.allDelivers : "0"
            }`}
          </h4>
          <LineChart borderColor="#1EB564" data={customerLine} />
        </Card>
      </Col>

      <Col xs={24} xl={12} lg={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <h4 className="chart-tital">
            {" "}
            {`${lang("Pickup Trend /City------")} ${
              driver?.[0]?.allPickup ? driver?.[0]?.allPickup : "0"
            }`}
          </h4>
          <LineChart borderColor="#1EB564" data={driverLine} />
        </Card>
      </Col>
    </>
  );
};

export default DiscountPerformance;
