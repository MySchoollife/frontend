import { UndoOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Select, Tabs, DatePicker } from "antd";
import React, { useContext, useEffect, useState } from "react";
import SectionWrapper from "../../components/SectionWrapper";
import apiPath from "../../constants/apiPath";
import { Months } from "../../constants/var";
import { AppStateContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import useRequest from "../../hooks/useRequest";
import BannerRevenue from "./charts/BannerRevenue";
import GrowthOrder from "./charts/GrowthOrder";
import GrowthUser from "./charts/GrowthUser";
import RevenueTrends from "./charts/RevenueTrends";
import TotalRevenue from "./charts/TotalRevenue";
import WalletAmount from "./charts/WalletAmount";
import moment from "moment";
import DiscountRevenue from "./charts/DiscountRevenue";
import DiscountPerformance from "./charts/DiscountPerformance";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

function Index() {
  const heading = lang("Reports");
  const { setPageHeading } = useContext(AppStateContext);

  const [selectedTab, setSelectedTab] = useState("FinancialDashboard");

  useEffect(() => {
    setPageHeading(heading);
  }, []);

  const handleTabChange = (status) => {
    setSelectedTab(status);
  };

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
                <TabPane
                  tab={lang("Financial Dashboard")}
                  key="FinancialDashboard"
                >
                  <RestaurantList />
                </TabPane>

                <TabPane
                  tab={lang("Operational Dashboard")}
                  key={"Operational_Dashboard"}
                >
                  <Approval />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

const RestaurantList = () => {
  const heading = lang("Reports");
  const { setPageHeading, country } = useContext(AppStateContext);

  const api = {
    status: apiPath.restaurant + "/status",
    list: apiPath.restaurant,
  };

  const { request } = useRequest();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    country_id: undefined,
    end_date: undefined,
    year: undefined,
    start_date: undefined,
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
    getFilter();
    setFilter((prev) => ({ ...prev, country_id: country.country_id }));
  }, [country.country_id]);

  useEffect(() => {
    setPageHeading(heading);
  }, []);

  const onChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <SectionWrapper
        cardHeading={lang(`Financial Dashboard`)}
        extra={
          <>
            {/* <div className="button_group justify-content-end w-100"> */}
            <div className="w-100 d-flex align-items-baseline text-head_right_cont">
              {/* <div className="role-wrap">
                                <Select
                                    last20Years
                                    width="110px"
                                    placeholder={lang("City")}
                                    showSearch
                                    value={filter.city_id}
                                    //filterOption={false}

                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={cities.map((item) => ({
                                        value: item._id,
                                        label: item.name,
                                    }))}
                                    // onPopupScroll={handleScroll}
                                    // onSearch={(newValue) => setSearchCity(newValue)}
                                    onChange={(value) => onChange("city_id", value)}
                                />
                            </div> */}
              {/* <div className="role-wrap">
                                <Select
                                    width="110px"
                                    placeholder={lang("Year")}
                                    showSearch
                                    value={filter.year}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={years.map((item) => ({
                                        value: item,
                                        label: item,
                                    }))}
                                    onChange={(value) => onChange("year", value)}
                                />
                            </div> */}
              <div className="role-wrap">
                {/* <Select
                                    width="110px"
                                    placeholder={lang("Month")}
                                    showSearch
                                    value={filter.month}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={months.map((item) => ({ ...item }))}
                                    onChange={(value) => onChange("month", value)}
                                /> */}

                <RangePicker
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
              {/* <Button
                                onClick={() =>
                                    setFilter({
                                        country_id: undefined,
                                        start_date: undefined,
                                        year: undefined,
                                        start_date: undefined,
                                    })
                                }
                                type="primary"
                                icon={<UndoOutlined />}
                            >
                                {lang("Reset")}
                            </Button> */}
            </div>
          </>
        }
      >
        <div>
          <Row className="mt-3 p-3" gutter={[24, 0]}>
            <TotalRevenue filter={filter} />

            <RevenueTrends filter={filter} />
            <DiscountRevenue filter={filter} />

            <WalletAmount filter={filter} />

            <BannerRevenue filter={filter} />

            <DiscountPerformance />
          </Row>
        </div>
      </SectionWrapper>
    </>
  );
};

const Approval = () => {
  const { country } = useContext(AppStateContext);

  const api = {
    list: apiPath.restaurant,
  };
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    country_id: undefined,
    end_date: undefined,
    year: undefined,
    start_date: undefined,
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

  const onChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setLoading(true);
    getFilter();
    setFilter((prev) => ({ ...prev, country_id: country.country_id }));
  }, [country.country_id]);

  return (
    <>
      <SectionWrapper
        cardHeading={lang(`Operational Dashboard`)}
        cardSubheading={""}
        extra={
          <>
            <div className="w-100 d-flex align-items-baseline text-head_right_cont">
              {/* <div className="role-wrap">
                                <Select
                                    last20Years
                                    width="110px"
                                    placeholder={lang("City")}
                                    showSearch
                                    value={filter.city_id}
                                    //filterOption={false}

                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={cities.map((item) => ({
                                        value: item._id,
                                        label: item.name,
                                    }))}
                                    // onPopupScroll={handleScroll}
                                    // onSearch={(newValue) => setSearchCity(newValue)}
                                    onChange={(value) => onChange("city_id", value)}
                                />
                            </div> */}
              {/* <div className="role-wrap">
                                <Select
                                    width="110px"
                                    placeholder={lang("Year")}
                                    showSearch
                                    value={filter.year}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={years.map((item) => ({
                                        value: item,
                                        label: item,
                                    }))}
                                    onChange={(value) => onChange("year", value)}
                                />
                            </div> */}
              <div className="role-wrap">
                {/* <Select
                                    width="110px"
                                    placeholder={lang("Month")}
                                    showSearch
                                    value={filter.month}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={months.map((item) => ({ ...item }))}
                                    onChange={(value) => onChange("month", value)}
                                /> */}

                <RangePicker
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
              {/* <Button
                                onClick={() =>
                                    setFilter({
                                        country_id: undefined,
                                        start_date: undefined,
                                        year: undefined,
                                        start_date: undefined,
                                    })
                                }
                                type="primary"
                                icon={<UndoOutlined />}
                            >
                                {lang("Reset")}
                            </Button> */}
            </div>
          </>
        }
      >
        <div>
          <Row className="mt-3 p-3" gutter={[24, 0]}>
            <GrowthUser filter={filter} />

            <GrowthOrder filter={filter} />
          </Row>
        </div>
      </SectionWrapper>
    </>
  );
};

export default Index;
