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
  Select,
  Tabs,
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
import TabPane from "antd/lib/tabs/TabPane";
import {
  DeliveryMonthlyChart,
  PickUpMonthlyChart,
} from "../../../components/_MonthlyChart";
import {
  PickUpWeeklyChart,
  DeliveryWeeklyChart,
} from "../../../components/_Weeklychart";
import {
  DeliveryQuarterlyChart,
  PickUpQuarterlyChart,
} from "../../../components/_QuartlyChart";
import SectionWrapper from "../../../components/SectionWrapper";

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

const DiscountPerformance = () => {
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
  const [years, setYears] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [filter, setFilter] = useState({
    country_id: undefined,
    city_id: undefined,
    year: undefined,
    month: undefined,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0,
  });

  const debouncedSearchText = useDebounce(searchText, 300);

  useEffect(() => {
    setLoading(true);
    // fetchData({ ...pagination, current: 1 });
    getFilters();
  }, [refresh, filter, country.country_id]);

  const getFilters = () => {
    request({
      url: `${apiPath.dashboard}/sales/filters`,
      method: "GET",
      onSuccess: (res) => {
        if (res.status) {
          const { data, months, years } = res;
          setYears(years);
        }
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR);
      },
    });
  };

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

  const onChange = (key, value) => {};

  return (
    <>
      <Col xs={24} xl={12} lg={24} className="mb-24">
        <SectionWrapper
          cardHeading={lang("Delivery Discount performance")}
          extra={
            <>
              <div className="w-100 text-head_right_cont">
                <div className="role-wrap">
                  {/* <Select
                    width="110px"
                    placeholder={lang("year")}
                    showSearch
                    value={filter.year}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    }
                    options={years.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    onChange={(value) => onChange("year", value)}
                  /> */}
                </div>
              </div>
            </>
          }
        >
          <Tabs className="main_tabs">
            <TabPane tab={lang("weekly")} key="Weekly">
              <div style={{ padding: "25px" }}>
                <DeliveryWeeklyChart year={filter.year} />
              </div>
            </TabPane>
            <TabPane tab={lang("monthly")} key="Monthly">
              <div style={{ padding: "25px" }}>
                <DeliveryMonthlyChart year={filter.year} />
              </div>
            </TabPane>
            <TabPane tab={lang("quarterly")} key="Quarterly">
              <div style={{ padding: "25px" }}>
                <DeliveryQuarterlyChart year={filter.year} />
              </div>
            </TabPane>
          </Tabs>
        </SectionWrapper>
      </Col>

      <Col xs={24} xl={12} lg={24} className="mb-24">
        <SectionWrapper
          cardHeading={lang("Restaurants Discount performance")}
          extra={
            <>
              <div className="w-100 text-head_right_cont">
                <div className="role-wrap">
                  {/* <Select
                    width="110px"
                    placeholder={lang("year")}
                    showSearch
                    // value={filter.year}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    }
                    // options={years.map((item) => ({
                    //   value: item,
                    //   label: item,
                    // }))}
                    // onChange={(value) => onChange("year", value)}
                  /> */}
                </div>
              </div>
            </>
          }
        >
          <Tabs className="main_tabs">
            <TabPane tab={lang("weekly")} key="Weekly">
              <div style={{ padding: "25px" }}>
                <PickUpWeeklyChart />
              </div>
            </TabPane>
            <TabPane tab={lang("monthly")} key="Monthly">
              <div style={{ padding: "25px" }}>
                <PickUpMonthlyChart />
              </div>
            </TabPane>

            <TabPane tab={lang("quarterly")} key="Quarterly">
              <div style={{ padding: "25px" }}>
                <PickUpQuarterlyChart />
              </div>
            </TabPane>
          </Tabs>
        </SectionWrapper>
        {/* <Card bordered={false} className="criclebox h-full">
          <h4 className="chart-tital">
            {" "}
            {`${lang("Pickup Trend /City------")} ${
              driver?.[0]?.allPickup ? driver?.[0]?.allPickup : "0"
            }`}
          </h4>
          <LineChart borderColor="#1EB564" data={driverLine} />
        </Card> */}
      </Col>
    </>
  );
};

export default DiscountPerformance;
