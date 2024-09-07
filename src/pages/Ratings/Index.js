import {
  Button,
  Card,
  Col,
  Progress,
  Rate,
  Row,
  Select,
  Skeleton,
  Switch,
  Table,
  Tabs,
  Image,
} from "antd";
import { UndoOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import notfound from "../../assets/images/not_found.png";
import android from "../../assets/images/android.png";
import apple from "../../assets/images/apple.png";
import Rating from "../../assets/images/face-6.jpeg";
import SectionWrapper from "../../components/SectionWrapper";
import apiPath from "../../constants/apiPath";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import lang from "../../helper/langHelper";

import { AppStateContext } from "../../context/AppContext";
import useDebounce from "../../hooks/useDebounce";
import { Months } from "../../constants/var";
import moment from "moment";
import DeleteModal from "../../components/DeleteModal";

const { TabPane } = Tabs;

const Ratings = {
  Restaurant: "Restaurant",
  Driver: "Driver",
  Customer: "Customer",
  Food: "Food",
  App: "App",
};

function Index() {
  const { setPageHeading, country } = useContext(AppStateContext);

  const [selectedTab, setSelectedTab] = useState("AppRating");

  useEffect(() => {
    setPageHeading(lang("Ratings And Reviews"));
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
              <div className="tab_inner_tit">
                <div className="tab-upload-wrap d-flex align-items-center justify-content-between">
                  <h3>{lang("App Rating and Feedback")}</h3>
                  <div className="d-flex align-items-center gap-3">
                    {/* Rating */}
                    <div className="role-wrap">
                      <Select
                        width="110px"
                        placeholder={lang("Rating")}
                        showSearch
                        options={[
                          { value: "4", label: "4 rate" },
                          { value: "3", label: "2-3 rate" },
                          { value: "2", label: "below 2" },
                        ]}
                        // onChange={(value) => onChange("rate", value)}
                      />
                    </div>
                    <div className="city-wrap">
                      <Select
                        width="100"
                        style={{ minWidth: "100px" }}
                        placeholder={lang("City")}
                        showSearch
                        // value={filter.city_id}
                        // filterOption={(input, option) =>
                        //   option.label
                        //     .toLowerCase()
                        //     .indexOf(input.toLowerCase()) >= 0
                        // }
                        // options={cities?.map((item) => ({
                        //   value: item._id,
                        //   label: item.name,
                        // }))}
                        // onChange={(value) => onChange("city_id", value)}
                      />
                    </div>

                    <div className="role-wrap">
                      <Select
                        width="110px"
                        placeholder={lang("Year")}
                        showSearch
                        // value={filter.year}
                        // filterOption={(input, option) =>
                        //   option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // }
                        // options={years?.map((year) => ({
                        //   value: year,
                        //   label: `${year}`,
                        // }))}
                        // onChange={(value) => onChange("year", value)}
                      />
                    </div>
                    <div className="role-wrap">
                      <Select
                        width="110px"
                        placeholder={lang("Month")}
                        showSearch
                        // value={filter.month}
                        // filterOption={(input, option) =>
                        //   option.label
                        //     .toLowerCase()
                        //     .indexOf(input.toLowerCase()) >= 0
                        // }
                        // options={months?.map((item) => ({
                        //   ...item,
                        // }))}
                        // onChange={(value) => onChange("month", value)}
                      />
                    </div>
                    <Button
                      // onClick={() =>
                      //   setFilter({
                      //     country_id: undefined,
                      //     city_id: undefined,
                      //     year: undefined,
                      //     month: undefined,
                      //   })
                      // }
                      type="primary"
                      icon={<UndoOutlined />}
                    >
                      {lang("Reset")}
                    </Button>
                  </div>
                </div>
                <div className="Review-wrap">
                  <Row gutter={20}>
                    <Col span={24} md={3} lg={3} className="first-col">
                      <div className="ratingCard">
                        <h5>{lang("Overall Ratings")}</h5>
                        <div className="mobile_review_cls">
                          {/* <h2>{top?.averageRating?.toFixed(1) ?? 0}/5</h2> */}
                          <div className="view_rate_wrap">
                            <Rate disabled defaultValue={0} />
                            <p>{/* {top?.total ?? 0} {lang("Reviews")} */}</p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="rating_review_list">
                  <Row gutter={24}>
                    {/* {all?.map((item, index) => ( */}
                    <Review
                    // key={index}
                    // item={item}
                    // refresh={() => setRefresh((prev) => !prev)}
                    />
                    {/* )) */}
                  </Row>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

const RatingCard = ({ item }) => {
  const result = {};

  item.ratingsCount.forEach((item) => {
    result[item.rating] = item.count;
  });

  return (
    <div className="top_rating">
      <h4>{"item.user.name"}</h4>
      <div className="rating-cls">
        <div className="ratingCard">
          <h2>{item.averageRating.toFixed(1)}/5</h2>
          <Rate
            disabled
            allowHalf
            // defaultValue={item.averageRating}
            count={5}
          />
          {/* <Rate disabled allowHalf value={4}  count={5}/> */}
          <p>
            {item.total} {lang("Reviews")}
          </p>
        </div>
        <div className="ratingright-cls">
          <span className="main-rating-cls">
            <span className="rating-no-left">5</span>
            <Progress
              percent={((result[`5`] ?? 0) / item.total) * 100}
              showInfo={false}
            />
            <span className="rating-no">{result[`5`] ?? 0}</span>
          </span>
          <span className="main-rating-cls">
            <span className="rating-no-left">4</span>
            <Progress
              percent={((result[`4`] ?? 0) / item.total) * 100}
              showInfo={false}
            />
            <span className="rating-no">{result[`4`] ?? 0}</span>
          </span>
          <span className="main-rating-cls">
            <span className="rating-no-left">3</span>
            <Progress
              percent={((result[`3`] ?? 0) / item.total) * 100}
              showInfo={false}
            />
            <span className="rating-no">{result[`3`] ?? 0}</span>
          </span>
          <span className="main-rating-cls">
            <span className="rating-no-left">2</span>
            <Progress
              percent={((result[`2`] ?? 0) / item.total) * 100}
              showInfo={false}
            />
            <span className="rating-no">{result[`2`] ?? 0}</span>
          </span>
          <span className="main-rating-cls">
            <span className="rating-no-left">1</span>
            <Progress
              percent={((result[`1`] ?? 0) / item.total) * 100}
              showInfo={false}
            />
            <span className="rating-no">{result[`1`] ?? 0}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const AppRating = ({}) => {
  const { country } = useContext(AppStateContext);
  const [searchText, setSearchText] = useState("");
  const [top, setTop] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [cities, setCities] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [rates, setRates] = useState([]);
  const [list, setList] = useState([]);
  const debouncedSearchText = useDebounce(searchText, 300);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filter, setFilter] = useState({
    country_id: undefined,
    city_id: undefined,
    year: undefined,
    month: undefined,
    rates: undefined,
  });
  const { request } = useRequest();
  const urlParams = new URLSearchParams(window.location.search);
  const path = urlParams.get("status");

  const api = {
    list: apiPath.rating,
  };

  const columns = [
    {
      title: lang("Review"),
      dataIndex: "review",
      key: "review",
      render: (_, { review }) => {
        return review ? <span className="cap">{review}</span> : "-";
      },
    },
    {
      title: lang("Rating"),
      dataIndex: "rating",
      key: "rating",
      render: (_, { rating }) => {
        return rating ? <span className="cap">{rating}</span> : "-";
      },
    },
    {
      title: lang("Reviewer"),
      dataIndex: "reviewer_id",
      key: "reviewer_id",
      render: (_, { reviewer_id }) => {
        return reviewer_id ? (
          <span className="cap">{reviewer_id.name}</span>
        ) : (
          "-"
        );
      },
    },
    {
      title: lang("Reviewee"),
      dataIndex: "reviewee_id",
      key: "reviewee_id",
      render: (_, { reviewee_id }) => {
        return reviewee_id ? (
          <span className="cap">{reviewee_id?.name}</span>
        ) : (
          "-"
        );
      },
    },
  ];
  const getFilter = () => {
    request({
      url: `${api.list}/filters?rating_for=${Ratings.App}&rate=${filter.rate}`,
      method: "GET",
      onSuccess: (res) => {
        const { data, months, years, city } = res;
        setCities(city);
        setYears(years);
        setRates(rates);
        const m = Months.filter((item) => months.includes(item.value));
        setMonths(m);
      },
    });
  };

  const onChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };
  const handleChange = (pagination, filters) => {
    fetchDataOfAppRating(pagination, filters);
  };

  const fetchData = (status) => {
    setLoading(true);

    const queryString = Object.entries(filter)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    request({
      url: api.list + `/app` + `${queryString ? `?${queryString}` : ""}`,
      method: "GET",
      onSuccess: (res) => {
        const { data } = res;
        console.log(data, "data");
        setLoading(false);
        if (data.top) setTop(data.top);
        setAll(data.all);
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const fetchDataOfAppRating = (pagination, filters) => {
    const filterActive = filters ? filters?.is_active : null;
    request({
      url:
        api.list +
        `/app/rate?status=${filterActive ? filterActive.join(",") : ""}&page=${
          pagination ? pagination.current : 1
        }&pageSize=${
          pagination ? pagination.pageSize : 10
        }&search=${debouncedSearchText}${path ? `&status=1` : ""}&start_date=${
          startDate ? startDate : ""
        }&end_date=${endDate ? endDate : ""}&rate=${filter.rate}`,
      method: "GET",
      onSuccess: ({ data, status, total }) => {
        setLoading(false);
        if (status) {
          setList(data);

          setPagination((prev) => ({
            ...prev,
            current: pagination?.current,
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
    fetchData();
    fetchDataOfAppRating();
    getFilter();
  }, [filter, country.country_id, refresh]);

  return (
    <>
      <div className="tab_inner_tit">
        <div className="tab-upload-wrap d-flex align-items-center justify-content-between">
          <h3>{lang("App Rating and Feedback")}</h3>
          <div className="d-flex align-items-center gap-3">
            {/* Rating */}
            <div className="role-wrap">
              <Select
                width="110px"
                placeholder={lang("Rating")}
                showSearch
                options={[
                  { value: "4", label: "4 rate" },
                  { value: "3", label: "2-3 rate" },
                  { value: "2", label: "below 2" },
                ]}
                onChange={(value) => onChange("rate", value)}
              />
            </div>
            <div className="city-wrap">
              <Select
                width="100"
                style={{ minWidth: "100px" }}
                placeholder={lang("City")}
                showSearch
                value={filter.city_id}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={cities?.map((item) => ({
                  value: item._id,
                  label: item.name,
                }))}
                onChange={(value) => onChange("city_id", value)}
              />
            </div>

            <div className="role-wrap">
              <Select
                width="110px"
                placeholder={lang("Year")}
                showSearch
                // value={filter.year}
                // filterOption={(input, option) =>
                //   option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // }
                options={years?.map((year) => ({
                  value: year,
                  label: `${year}`,
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
          </div>
        </div>
        <div className="Review-wrap">
          <Row gutter={20}>
            <Col span={24} md={3} lg={3} className="first-col">
              <div className="ratingCard">
                <h5>{lang("Overall Ratings")}</h5>
                <div className="mobile_review_cls">
                  <h2>{top?.averageRating?.toFixed(1) ?? 0}/5</h2>
                  <div className="view_rate_wrap">
                    <Rate disabled defaultValue={top?.averageRating ?? 0} />
                    <p>
                      {top?.total ?? 0} {lang("Reviews")}
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            {/* <Col span={24} md={14} lg={14} className="secound-col">
              <div className="rating-card">
                <div className="rating-card-cont">
                  <h4>{lang("App Ratings")}</h4>
                  <Row gutter={20}>
                    <Col span={24} lg={24} xl={12} className="mb-3">
                      <div className="rating-row">
                        <div className="rating-left progress-retting-inner">
                          <Progress
                            type="circle"
                            percent={85}
                            showInfo={false}
                          />
                          <div className="progress-retting-text">
                            <img src={android} />
                            <h4>4/5</h4>
                            <p>{lang("Android Ratings")}</p>
                          </div>
                        </div>
                        <div className="rating-right">
                          <Rate disabled defaultValue={5} />
                          <span className="main-rating-cls">
                            <span className="rating-no-left">5</span>
                            <Progress percent={60} showInfo={false} />
                            <span className="rating-no">800</span>
                          </span>
                          <span className="main-rating-cls">
                            <span className="rating-no-left">4</span>
                            <Progress percent={95} showInfo={false} />
                            <span className="rating-no">1289</span>
                          </span>
                          <span className="main-rating-cls">
                            <span className="rating-no-left">3</span>
                            <Progress percent={40} showInfo={false} />
                            <span className="rating-no">421</span>
                          </span>
                          <span className="main-rating-cls">
                            <span className="rating-no-left">2</span>
                            <Progress percent={20} showInfo={false} />
                            <span className="rating-no">147</span>
                          </span>
                          <span className="main-rating-cls">
                            <span className="rating-no-left">1</span>
                            <Progress percent={5} showInfo={false} />
                            <span className="rating-no">100</span>
                          </span>
                        </div>
                      </div>
                    </Col>
                    <Col span={24} lg={24} xl={12} className="mb-3">
                      <div className="rating-row">
                        <div className="rating-left progress-retting-inner">
                          <Progress
                            type="circle"
                            percent={85}
                            showInfo={false}
                          />
                          <div className="progress-retting-text">
                            <img src={apple} />
                            <h4>3.9/5</h4>
                            <p>{lang("IOS Ratings")}</p>
                          </div>
                        </div>
                        <div className="rating-right">
                          <Rate disabled defaultValue={5} />
                          <span className="main-rating-cls">
                            <span className="rating-no-left">5</span>
                            <Progress percent={60} showInfo={false} />
                            <span className="rating-no">800</span>
                          </span>
                          <span className="main-rating-cls">
                            <span className="rating-no-left">4</span>
                            <Progress percent={95} showInfo={false} />
                            <span className="rating-no">1289</span>
                          </span>
                          <span className="main-rating-cls">
                            <span className="rating-no-left">3</span>
                            <Progress percent={40} showInfo={false} />
                            <span className="rating-no">421</span>
                          </span>
                          <span className="main-rating-cls">
                            <span className="rating-no-left">2</span>
                            <Progress percent={20} showInfo={false} />
                            <span className="rating-no">147</span>
                          </span>
                          <span className="main-rating-cls">
                            <span className="rating-no-left">1</span>
                            <Progress percent={5} showInfo={false} />
                            <span className="rating-no">100</span>
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col> */}
            {/* <Col span={24} md={24} lg={7} className="third-col">
              <div className="rating-card">
                <div className="restaurant-rating">
                  <h4>{lang("Restaurant Ratings")}</h4>
                  <div className="restaurant-rating-cls">
                    <div className="rating-top-wrap">
                      <span className="rating-no-left">{lang("Meals")}</span>
                      <span className="rating-no">4/5</span>
                    </div>
                    <Progress percent={60} showInfo={false} />
                  </div>
                  <div className="restaurant-rating-cls">
                    <div className="rating-top-wrap">
                      <span className="rating-no-left">
                        {lang("Restaurant")}
                      </span>
                      <span className="rating-no">3.5/5</span>
                    </div>
                    <Progress percent={70} showInfo={false} />
                  </div>
                </div>
              </div>
            </Col> */}
          </Row>
        </div>
        <div className="rating_review_list">
          <Row gutter={24}>
            {all.map((item, index) => (
              <Review
                key={index}
                item={item}
                refresh={() => setRefresh((prev) => !prev)}
              />
            ))}
          </Row>
        </div>
      </div>

      <SectionWrapper cardHeading={"App Rating List"}>
        <div className="table-responsive customPagination checkBoxSrNo">
          <Table
            loading={loading}
            columns={columns}
            dataSource={list}
            pagination={{
              defaultPageSize: 10,
              responsive: true,
              total: pagination.total,
              pageSizeOptions: ["10", "20", "30", "50"],
            }}
            onChange={handleChange}
            className="ant-border-space"
          />
        </div>
      </SectionWrapper>
    </>
  );
};

const Review = ({ item, refresh }) => {
  const [loading, setLoading] = useState(true);
  const [showStatus, setShowStatus] = useState(false);
  const [selected, setSelected] = useState();

  const api = {
    list: apiPath.rating,
  };
  const { request } = useRequest();

  const handleChangeStatus = (id) => {
    request({
      url: api.list + "/" + id,
      method: "PUT",
      onSuccess: (data) => {
        setLoading(false);
        if (refresh) refresh();
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const onDelete = (id) => {
    let payload = {};
    payload.is_delete = true;
    request({
      url: api.list + "/" + id,
      method: "DELETE",
      data: payload,
      onSuccess: (data) => {
        setLoading(false);
        ShowToast(data.message, Severty.SUCCESS);
        if (refresh) refresh();
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const [showFullReview, setShowFullReview] = useState(false);

  return (
    <>
      <Col span={24} md={12}>
        <div className="rating_card">
          <div className="rating_inner_card">
            <div className="rating-user-img">
              <img
                // src={item.user.image}
                onError={(e) => (e.target.src = notfound)}
              />
            </div>
            <div className="rating_user_cont">
              <div className="rating_user_head">
                <div className="rating_left rating-right">
                  {/* <h4>{item.user.name}</h4> */}
                  {/* <p>{moment(item.created_at).format("lll")}</p> */}
                  {/* <Rate disabled defaultValue={item.rating} /> */}
                </div>
                <div className="rating_right">
                  <Switch
                  // checked={item.is_active}
                  // onChange={() => handleChangeStatus(item._id)}
                  />
                  <Button
                    className="btn btn_dlt"
                    onClick={() => {
                      setSelected(item);
                      setShowStatus(true);
                    }}
                  >
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.01302 3.33333H9.67969C9.67969 2.97971 9.53921 2.64057 9.28916 2.39052C9.03911 2.14048 8.69998 2 8.34635 2C7.99273 2 7.65359 2.14048 7.40355 2.39052C7.1535 2.64057 7.01302 2.97971 7.01302 3.33333ZM6.01302 3.33333C6.01302 3.02692 6.07337 2.7235 6.19064 2.44041C6.3079 2.15731 6.47977 1.90009 6.69644 1.68342C6.91311 1.46675 7.17033 1.29488 7.45343 1.17761C7.73652 1.06035 8.03994 1 8.34635 1C8.65277 1 8.95619 1.06035 9.23928 1.17761C9.52238 1.29488 9.7796 1.46675 9.99627 1.68342C10.2129 1.90009 10.3848 2.15731 10.5021 2.44041C10.6193 2.7235 10.6797 3.02692 10.6797 3.33333H14.513C14.6456 3.33333 14.7728 3.38601 14.8666 3.47978C14.9603 3.57355 15.013 3.70072 15.013 3.83333C15.013 3.96594 14.9603 4.09312 14.8666 4.18689C14.7728 4.28065 14.6456 4.33333 14.513 4.33333H13.633L12.853 12.4073C12.7932 13.026 12.505 13.6002 12.0448 14.0179C11.5846 14.4356 10.9852 14.6669 10.3637 14.6667H6.32902C5.7076 14.6667 5.10842 14.4354 4.64832 14.0177C4.18822 13.6 3.90018 13.0259 3.84035 12.4073L3.05969 4.33333H2.17969C2.04708 4.33333 1.9199 4.28065 1.82613 4.18689C1.73237 4.09312 1.67969 3.96594 1.67969 3.83333C1.67969 3.70072 1.73237 3.57355 1.82613 3.47978C1.9199 3.38601 2.04708 3.33333 2.17969 3.33333H6.01302ZM7.34635 6.5C7.34635 6.36739 7.29368 6.24021 7.19991 6.14645C7.10614 6.05268 6.97896 6 6.84635 6C6.71375 6 6.58657 6.05268 6.4928 6.14645C6.39903 6.24021 6.34635 6.36739 6.34635 6.5V11.5C6.34635 11.6326 6.39903 11.7598 6.4928 11.8536C6.58657 11.9473 6.71375 12 6.84635 12C6.97896 12 7.10614 11.9473 7.19991 11.8536C7.29368 11.7598 7.34635 11.6326 7.34635 11.5V6.5ZM9.84635 6C9.97896 6 10.1061 6.05268 10.1999 6.14645C10.2937 6.24021 10.3464 6.36739 10.3464 6.5V11.5C10.3464 11.6326 10.2937 11.7598 10.1999 11.8536C10.1061 11.9473 9.97896 12 9.84635 12C9.71375 12 9.58657 11.9473 9.4928 11.8536C9.39903 11.7598 9.34635 11.6326 9.34635 11.5V6.5C9.34635 6.36739 9.39903 6.24021 9.4928 6.14645C9.58657 6.05268 9.71375 6 9.84635 6ZM4.83569 12.3113C4.87165 12.6824 5.04452 13.0268 5.3206 13.2774C5.59668 13.528 5.95619 13.6667 6.32902 13.6667H10.3637C10.7365 13.6667 11.096 13.528 11.3721 13.2774C11.6482 13.0268 11.8211 12.6824 11.857 12.3113L12.629 4.33333H4.06369L4.83569 12.3113Z"
                        fill="white"
                      />
                    </svg>
                    {lang("Delete")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default Index;
