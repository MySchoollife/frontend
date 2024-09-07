import {
  Button,
  Card,
  Dropdown,
  Image,
  Input,
  Rate,
  Table,
  Col,
  Row,
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

const WalletAmount = ({ filter }) => {
  const { country } = useAppContext();
  const { request } = useRequest();
  const [customer, setCustomer] = useState([]);
  const [customerMonth, setCustomerMonth] = useState([]);
  const [customerBar, setCustomerBar] = useState();
  const [customerLine, setCustomerLine] = useState();
  const [driver, setDriver] = useState([]);
  const [driverMonth, setDriverMonth] = useState([]);
  const [driverBar, setDriverBar] = useState();
  const [driverLine, setDriverLine] = useState();
  const [loading, setLoading] = useState(true);
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
      url: `${apiPath.report}/revenue-wallet${
        queryString ? `?${queryString}` : ""
      }`,
      method: "GET",
      onSuccess: ({
        data,
        status,
        customerMonth,
        customer,
        driver,
        driverMonth,
      }) => {
        setLoading(false);
        if (status) {
          setCustomer(customer);
          setDriver(driver);
          setCustomerMonth(customerMonth);
          setDriverMonth(driverMonth);
          //setList(banner)
          /// setList(data)
          console.log(
            "Customer Wallet Trend /City",
            customer,
            driver,
            customerMonth,
            driverMonth,
          );
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
    //Bar Graph
    if (!customer.length) return setCustomerBar();

    let add = [];
    let city = [];

    customer.map((item) => {
      city.push(item.city.name);
      add.push(item.totalBalance);
    });

    const rev = {
      labels: city,
      datasets: [
        {
          label: `${lang("Customer Wallet Balance")}`,
          data: add,
          backgroundColor: getRandomColor(0),
        },
      ],
    };
    console.log(rev, "Rev");
    setCustomerBar(rev);
  }, [customer]);

  useEffect(() => {
    //Bar Graph
    if (!driver.length) return setDriverBar();

    let add = [];
    let city = [];

    driver.map((item) => {
      city.push(item.city.name);
      add.push(item.totalBalance);
    });
    const rev = {
      labels: city,
      datasets: [
        {
          label: `${lang("Driver Wallet Balance")}`,
          data: add,
          backgroundColor: getRandomColor(0),
        },
      ],
    };
    setDriverBar(rev);
  }, [driver]);

  useEffect(() => {
    if (!customerMonth.length) return setCustomerLine();
    let city = [];
    let restaurant = Array.from({ length: 12 });

    const dataSetsRestaurant = customerMonth.map((item, Index) => {
      const data = restaurant.map((res, index) => {
        const findIndex = item.monthData.find(
          ({ month }) => index + 1 == month,
        );
        if (findIndex) return findIndex.totalBalance;
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
  }, [customerMonth]);

  useEffect(() => {
    if (!driverMonth.length) return setDriverLine();
    let city = [];
    let restaurant = Array.from({ length: 12 });

    const dataSetsRestaurant = driverMonth.map((item, Index) => {
      const data = restaurant.map((res, index) => {
        const findIndex = item.monthData.find(
          ({ month }) => index + 1 == month,
        );
        if (findIndex) return findIndex.totalBalance;
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
  }, [driverMonth]);

  return (
    <>
      <Col xs={24} xl={12} lg={24}>
        <Col span={24}>
          <div className="revenue-h">
            <h6>Summary</h6>
          </div>
          <div className="revenue-header">
            <div className="revenue-header-text">
              <h6>Customers Wallets</h6>
              <h5>
                {
                  <Currency
                    price={customer.reduce((total, index) => {
                      return total + (index.totalBalance || 0);
                    }, 0)}
                  />
                }
              </h5>
            </div>
            <div className="revenue-header-text">
              <h6>Drivers Wallets</h6>
              <h5>
                {
                  <Currency
                    price={driver.reduce((total, index) => {
                      return total + (index.totalBalance || 0);
                    }, 0)}
                  />
                }
              </h5>
            </div>
          </div>
        </Col>
        <Row>
          <Col xs={24} xl={12} lg={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <h4 className="chart-tital">
                {" "}
                {lang("Customers  Wallets /City")}
              </h4>
              <BarChart borderColor="#1EB564" data={customerBar} />
            </Card>
          </Col>

          <Col xs={24} xl={12} lg={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <h4 className="chart-tital">
                {" "}
                {lang("Drivers  Wallets  /City")}
              </h4>
              <BarChart borderColor="#1EB564" data={driverBar} />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xs={24} xl={12} lg={24}>
        <Row>
          <Col xs={24} xl={12} lg={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <h4 className="chart-tital">
                {" "}
                {lang("Customer  Wallet Trend /City")}
              </h4>
              {/* <h4 className="chart-tital">
                {
                  <Currency
                    price={customerMonth?.reduce((totalRevenue, totalMonth) => {
                      if (totalMonth && totalMonth.monthData) {
                        return (
                          totalRevenue +
                          totalMonth.monthData.reduce((acc, item) => {
                            return acc + (item.totalBalance || 0);
                          }, 0)
                        );
                      } else {
                        return totalRevenue;
                      }
                    }, 0)}
                  />
                }{" "}
              </h4> */}
              <LineChart borderColor="#1EB564" data={customerLine} />
            </Card>
          </Col>

          <Col xs={24} xl={12} lg={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <h4 className="chart-tital">
                {" "}
                {lang("Driver  Wallet Trend /City")}
              </h4>
              {/* <h4 className="chart-tital">
                {
                  <Currency
                    price={driverMonth?.reduce((totalRevenue, totalMonth) => {
                      if (totalMonth && totalMonth.monthData) {
                        return (
                          totalRevenue +
                          totalMonth.monthData.reduce((acc, item) => {
                            return acc + (item.totalBalance || 0);
                          }, 0)
                        );
                      } else {
                        return totalRevenue;
                      }
                    }, 0)}
                  />
                }{" "}
              </h4> */}
              <LineChart borderColor="#1EB564" data={driverLine} />
            </Card>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default WalletAmount;
