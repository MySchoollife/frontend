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
import { getRandomColor } from "../../../helper/functions";
import Currency from "../../../components/Currency";
import LineChart from "../../../components/charts/LineCart";

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

const TotalRevenue = ({ filter }) => {
  const { country } = useAppContext();
  const { request } = useRequest();
  const [list, setList] = useState([]);
  const [revenue, setRevenue] = useState();
  const [commission, setCommission] = useState();
  const [loading, setLoading] = useState(false);

  const [listTwo, setListTwo] = useState([]);
  const [data, setData] = useState([]);
  const [revenueRes, setRevenueRes] = useState();
  const [revenueDriver, setRevenueDriver] = useState();
  const [commissionRes, setCommissionRes] = useState();
  const [commissionDriver, setCommissionDriver] = useState();
  const [codPayments, setCodPayments] = useState();
  const [onlinePayments, setOnlinePayments] = useState();

  useEffect(() => {
    setLoading(true);
    fetchData();
    fetchDataTwo();
  }, [filter, country.country_id]);

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
      url: `${apiPath.report}/revenue-commission${
        queryString ? `?${queryString}` : ""
      }`,
      method: "GET",
      onSuccess: ({ data, status, total, message }) => {
        setLoading(false);
        if (status) {
          setList(data);
          console.log("Revenue /City", data);
        }
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const fetchDataTwo = () => {
    setLoading(true);

    const queryString = Object.entries(filter)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");

    request({
      url: `${apiPath.report}/revenue-trends${
        queryString ? `?${queryString}` : ""
      }`,
      method: "GET",
      onSuccess: ({ data, status, total, message, payment }) => {
        setLoading(false);
        if (status) {
          setListTwo(data);
          setData(payment);
          console.log("DATA112", payment);
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
    if (!list.length) {
      setRevenue();
      setCommission();
      return;
    }

    let city = [];
    let restaurant = [];
    let driver = [];
    let restaurant_comm = [];
    let driver_comm = [];

    list.map((item) => {
      city.push(item.city_id.name);
      restaurant.push(item.restaurant_revenue);
      driver.push(item.driver_revenue);

      restaurant_comm.push(item.restaurant_commission);
      driver_comm.push(item.driver_commission);
    });

    const rev = {
      labels: city,
      datasets: [
        {
          label: `${lang("Restaurant Revenue")}`,
          data: restaurant,
          backgroundColor: getRandomColor(0),
        },
        {
          label: `${lang("Driver Revenue")}`,
          data: driver,
          backgroundColor: getRandomColor(1),
        },
      ],
    };

    const comm = {
      labels: city,
      datasets: [
        {
          label: `${lang("Restaurant Commission")}`,
          data: restaurant_comm,
          backgroundColor: getRandomColor(0),
        },
        {
          label: `${lang("Driver Commission")}`,
          data: driver_comm,
          backgroundColor: getRandomColor(1),
        },
      ],
    };

    setRevenue(rev);
    setCommission(comm);
  }, [list]);

  useEffect(() => {
    if (!listTwo.length) {
      setRevenueRes();
      setRevenueDriver();
      setCommissionRes();
      setCommissionDriver();
      return;
    }
    let city = [];
    let restaurant = Array.from({ length: 12 });
    let driver = Array.from({ length: 12 });
    let restaurant_comm = Array.from({ length: 12 });
    let driver_comm = Array.from({ length: 12 });

    const dataSetsRestaurant = listTwo.map((item, Index) => {
      const data = restaurant.map((res, index) => {
        const findIndex = item.monthData.find(
          ({ month }) => index + 1 == month,
        );
        if (findIndex) return findIndex.restaurant_revenue;
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
    setRevenueRes({ ...dummy, datasets: dataSetsRestaurant });

    const dataSetsDriver = listTwo.map((item, Index) => {
      const data = driver.map((res, index) => {
        const findIndex = item.monthData.find(
          ({ month }) => index + 1 == month,
        );
        if (findIndex) return findIndex.driver_revenue;
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
    setRevenueDriver({ ...dummy, datasets: dataSetsDriver });

    const dataSetsRestaurantComm = listTwo.map((item, Index) => {
      const data = restaurant_comm.map((res, index) => {
        const findIndex = item.monthData.find(
          ({ month }) => index + 1 == month,
        );
        if (findIndex) return findIndex.restaurant_commission;
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
    setCommissionRes({ ...dummy, datasets: dataSetsRestaurantComm });

    const dataSetsDriverComm = listTwo.map((item, Index) => {
      const data = driver_comm.map((res, index) => {
        const findIndex = item.monthData.find(
          ({ month }) => index + 1 == month,
        );
        if (findIndex) return findIndex.driver_commission;
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
    setCommissionDriver({ ...dummy, datasets: dataSetsDriverComm });
  }, [listTwo]);

  useEffect(() => {
    if (!data.length) {
      setCodPayments();
      setOnlinePayments();
      return;
    }
    let city = [];
    let cod_payments = Array.from({ length: 12 });
    let online_payments = Array.from({ length: 12 });

    const cod = listTwo.map((item, Index) => {
      const data = cod_payments.map((res, index) => {
        const findIndex = item.monthData.find(
          ({ month }) => index + 1 == month,
        );
        if (findIndex) return findIndex.restaurant_revenue;
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

    setCodPayments({ ...dummy, datasets: cod });

    const online = listTwo.map((item, Index) => {
      const data = online_payments.map((res, index) => {
        const findIndex = item.monthData.find(
          ({ month }) => index + 1 == month,
        );
        if (findIndex) return findIndex.driver_revenue;
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
    setOnlinePayments({ ...dummy, datasets: online });
  }, [data]);

  return (
    <>
      <Col xs={24} xl={12} lg={24} className="mb-24">
        <Col span={24}>
          <div className="revenue-h">
            <h6>Summary</h6>
          </div>
          <div className="revenue-header">
            <div className="revenue-header-text">
              <h6>Total Revenue</h6>
              <h6>(Restaurant & Drivers)</h6>
              <h5>
                {
                  <Currency
                    price={list?.reduce((totalRevenue, item) => {
                      return totalRevenue + item.total_revenue;
                    }, 0)}
                  />
                }
              </h5>
            </div>
            <div className="revenue-header-text">
              <h6>Total Commission</h6>
              <h6>(Restaurant & Drivers)</h6>
              <h5>
                {
                  <Currency
                    price={list?.reduce((totalRevenue, item) => {
                      return totalRevenue + item.total_commission;
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
              <h4 className="chart-tital"> {lang("Revenue /City")}</h4>

              <BarChart borderColor="#1EB564" data={revenue} />
            </Card>
          </Col>
          <Col xs={24} xl={12} lg={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <h4 className="chart-tital"> {lang("Commission /City")}</h4>
              <BarChart borderColor="#1EB564" data={commission} />
            </Card>
          </Col>
        </Row>
      </Col>

      <Col xs={24} xl={12} lg={24} className="mb-24">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={12} lg={24} className="mb-24">
            <Card bordered={false} className="criclebox ">
              <h4 className="chart-tital">
                {lang("Restaurant Revenue Trend /City")}
              </h4>
              {/* <h4 className="chart-tital">
                {
                  <Currency
                    price={listTwo?.reduce((totalRevenue, totalMonth) => {
                      if (totalMonth && totalMonth.monthData) {
                        return (
                          totalRevenue +
                          totalMonth.monthData.reduce((acc, item) => {
                            return acc + (item.restaurant_revenue || 0);
                          }, 0)
                        );
                      } else {
                        return totalRevenue;
                      }
                    }, 0)}
                  />
                }
              </h4> */}
              <LineChart borderColor="#1EB564" data={revenueRes} />
            </Card>
          </Col>
          <Col xs={24} xl={12} lg={24} className="mb-24">
            <Card bordered={false} className="criclebox ">
              <h4 className="chart-tital">
                {" "}
                {lang("Driver Revenue Trend /City")}
              </h4>
              {/* <h4 className="chart-tital">
                {
                  <Currency
                    price={listTwo?.reduce((totalRevenue, totalMonth) => {
                      if (totalMonth && totalMonth.monthData) {
                        return (
                          totalRevenue +
                          totalMonth.monthData.reduce((acc, item) => {
                            return acc + (item.driver_revenue || 0);
                          }, 0)
                        );
                      } else {
                        return totalRevenue;
                      }
                    }, 0)}
                  />
                }
              </h4> */}

              <LineChart borderColor="#1EB564" data={revenueDriver} />
            </Card>
          </Col>
          <Col xs={24} xl={12} lg={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <h4 className="chart-tital">
                {lang(" Restaurant Commission Trend /City")}
              </h4>
              {/* <h4 className="chart-tital">
                {
                  <Currency
                    price={listTwo?.reduce((totalRevenue, totalMonth) => {
                      if (totalMonth && totalMonth.monthData) {
                        return (
                          totalRevenue +
                          totalMonth.monthData.reduce((acc, item) => {
                            return acc + (item.restaurant_commission || 0);
                          }, 0)
                        );
                      } else {
                        return totalRevenue;
                      }
                    }, 0)}
                  />
                }
              </h4> */}

              <LineChart borderColor="#1EB564" data={commissionRes} />
            </Card>
          </Col>

          <Col xs={24} xl={12} lg={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <h4 className="chart-tital">
                {" "}
                {lang("Driver Commission Trend /City")}
              </h4>
              {/* <h4 className="chart-tital">
                {
                  <Currency
                    price={listTwo?.reduce((totalRevenue, totalMonth) => {
                      if (totalMonth && totalMonth.monthData) {
                        return (
                          totalRevenue +
                          totalMonth.monthData.reduce((acc, item) => {
                            return acc + (item.driver_commission || 0);
                          }, 0)
                        );
                      } else {
                        return totalRevenue;
                      }
                    }, 0)}
                  />
                }
              </h4> */}
              <LineChart borderColor="#1EB564" data={commissionDriver} />
            </Card>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default TotalRevenue;
