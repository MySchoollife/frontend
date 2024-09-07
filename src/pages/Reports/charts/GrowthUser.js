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

const GrowthUser = ({ filter }) => {
  const { country } = useAppContext();
  const { request } = useRequest();

  const [customer, setCustomer] = useState([]);
  const [customerLine, setCustomerLine] = useState();
  const [driver, setDriver] = useState([]);
  const [driverLine, setDriverLine] = useState();
  const [restaurant, setRestaurant] = useState([]);
  const [restaurantLine, setRestaurantLine] = useState();
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
      url: `${apiPath.report}/growth-wallet${queryString ? `?${queryString}` : ""
        }`,
      method: "GET",
      onSuccess: ({ data, status, customer, driver, restaurant }) => {
        setLoading(false);
        if (status) {
          setCustomer(customer);
          setDriver(driver);
          setRestaurant(restaurant);
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

  useEffect(() => {
    if (!restaurant.length) return setRestaurantLine();
    let city = [];
    let restaurant1 = Array.from({ length: 12 });
    const dataSetsRestaurant = restaurant.map((item, Index) => {
      const data = restaurant1.map((res, index) => {
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
    setRestaurantLine({ ...dummy, datasets: dataSetsRestaurant });
  }, [restaurant]);

  return (
    <>
      <Col xs={24} xl={8} lg={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <h4 className="chart-tital">
            {" "}
            {`${lang("Customer Growth Trend /City")} ${customer?.[0]?.allCustomer ? customer?.[0]?.allCustomer : "0"
              }`}
          </h4>
          <LineChart borderColor="#1EB564" data={customerLine} />
        </Card>
      </Col>

      <Col xs={24} xl={8} lg={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <h4 className="chart-tital">
            {" "}
            {`${lang("Driver Growth Trend /City")} ${driver?.[0]?.allDriver ? driver?.[0]?.allDriver : "0"
              }`}
          </h4>
          <LineChart borderColor="#1EB564" data={driverLine} />
        </Card>
      </Col>

      <Col xs={24} xl={8} lg={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <h4 className="chart-tital">
            {" "}
            {`${lang("Restaurant Growth Trend /City")} ${restaurant?.[0]?.allRestaurants
              ? restaurant?.[0]?.allRestaurants
              : "0"
              }`}
          </h4>
          <LineChart borderColor="#1EB564" data={restaurantLine} />
        </Card>
      </Col>
    </>
  );
};

export default GrowthUser;
