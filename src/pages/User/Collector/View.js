import { UndoOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Image, Row, Select, Table } from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import SectionWrapper from "../../../components/SectionWrapper";
import apiPath from "../../../constants/apiPath";
import { Months } from "../../../constants/var";
import { AppStateContext } from "../../../context/AppContext";
import lang from "../../../helper/langHelper";
import { Severty, ShowToast } from "../../../helper/toast";
import useDebounce from "../../../hooks/useDebounce";
import useRequest from "../../../hooks/useRequest";
import { dateString } from "../../../helper/functions";
import Currency from "../../../components/Currency";
import notfound from "../../../assets/images/not_found.png";
const CollectorView = () => {
  const { setPageHeading, country } = useContext(AppStateContext);
  const { id } = useParams();

  const api = {
    view: apiPath.collector,
    addEdit: apiPath.addEditSubAdmin,
    collector: apiPath.collector,
    history: `${apiPath.collector}/${id}/collection`,
    filter: `${apiPath.collector}/${id}/filters`,
  };

  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();
  const [list, setList] = useState([]);
  const [collector, setCollector] = useState();
  const [collection, setCollection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const debouncedSearchText = useDebounce(searchText, 300);

  const [restaurants, setRestaurant] = useState([]);
  const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    restaurant_id: undefined,
    city_id: undefined,
    year: undefined,
    month: undefined,
    status: undefined,
    payment_mod: undefined,
  });

  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  const getFilter = () => {
    request({
      url: `${api.filter}`,
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

  const onChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      title: lang("Name"),
      dataIndex: "name",
      key: "name",
      render: (_, { restaurant_id }) =>
        `${restaurant_id ? restaurant_id.name : ""}`,
    },
    {
      title: lang("Phone Number"),
      render: (_, { restaurant_id }) => {
        return (
          (restaurant_id?.country_code
            ? "+" + restaurant_id?.country_code + "-"
            : "+965") +
          (restaurant_id?.mobile_number ? restaurant_id?.mobile_number : "")
        );
      },
    },
    {
      title: lang("Email"),
      dataIndex: "email",
      key: "email",
      render: (_, { restaurant_id }) => {
        return restaurant_id?.email ? (
          <span style={{ textTransform: "lowercase" }}>
            {restaurant_id?.email}
          </span>
        ) : (
          "-"
        );
      },
    },
    {
      title: lang("Collection date"),
      key: "created_at",
      dataIndex: "created_at",
      render: (_, { created_at }) => dateString(created_at, "ll"),
    },
    {
      title: lang("Country"),
      dataIndex: "country_id",
      key: "country_id",
      render: (_, { country_id }) => {
        return country_id ? (
          <span className="cap">{country_id.name}</span>
        ) : (
          "-"
        );
      },
    },
    {
      title: lang("City"),
      dataIndex: "city_id",
      key: "city_id",
      render: (_, { city_id }) => {
        return city_id ? <span className="cap">{city_id.name}</span> : "-";
      },
    },
    // {
    //     title: "Area",
    //     dataIndex: "area",
    //     key: "area",
    //     render: (_, { area }) => {
    //         return area ? area : "-";
    //     },
    // },
    {
      title: lang("Total Collection"),
      dataIndex: "area",
      key: "area",
      render: (_, { amount }) => <Currency price={amount ?? 0} />,
    },
    {
      title: lang("Payment receipt"),
      dataIndex: "Item_Description",
      key: "Item_Description",
      render: (_, { image }) => (
        <Image src={image ? image : null} className="table-img image-doc" />
      ),
    },
    {
      title: lang("Status"),
      dataIndex: "area",
      key: "area",
      render: (_, { status }) => {
        return status ? status : "-";
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
        api.history +
        `?status=${filterActive ? filterActive.join(",") : ""}&page=${
          pagination ? pagination.current : 1
        }&pageSize=${
          pagination && pagination.pageSize ? pagination.pageSize : 10
        }&search=${debouncedSearchText}${queryString ? `&${queryString}` : ""}`,
      method: "GET",
      onSuccess: ({ data, status, total, message }) => {
        setLoading(false);
        setList(data);
        setPagination((prev) => ({
          ...prev,
          current: pagination.current,
          total: total,
        }));
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

  const getDetails = () => {
    setIsLoading(true);
    request({
      url: `${api.collector}/${id}`,
      method: "GET",
      onSuccess: ({ data, status, total, collection }) => {
        setIsLoading(false);
        if (status) {
          setCollector(data);
          setCollection(collection);
        }
      },
      onError: (error) => {
        console.log(error);
        setIsLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  useEffect(() => {
    if (!country.country_id) return;
    setLoading(true);
    fetchData({ ...pagination, current: 1 });
    getFilter();
  }, [refresh, filter, country.country_id]);

  useEffect(() => {
    getDetails();
    setPageHeading("Collection Management");
  }, []);

  return (
    <>
      <div className="tabled categoryService">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card
              bordered={false}
              className="cap criclebox tablespace mb-24"
              title={
                <>
                  <div className="arrow-ic"></div>
                  <div className="title-left">
                    <h4>{lang("Collector Details")}</h4>
                  </div>
                </>
              }
            >
              <div className="collection_dtl_body">
                <Row gutter={24} style={{ padding: "6px 14px" }}>
                  <Col xs={24} sm={6} md={4} lg={4} xl={2}>
                    <Avatar
                      size="large"
                      src={collector?.image ?? notfound}
                      style={{ width: "80px", height: "80px" }}
                    />
                  </Col>
                  <Col
                    xs={24}
                    sm={18}
                    md={12}
                    lg={12}
                    xl={10}
                    className="mb-3 mt-3"
                  >
                    <div className="collection_wrap">
                      <span className="collection_label">{lang("Name")} :</span>{" "}
                      <span className="collection_label_dtl">
                        {collector?.name}
                      </span>
                    </div>
                    {collector?.country_code && (
                      <div className="collection_wrap">
                        <span className="collection_label">
                          {lang("Phone Number")} :
                        </span>{" "}
                        <span className="collection_label_dtl">
                          ({collector?.country_code}) {collector?.mobile_number}
                        </span>
                      </div>
                    )}
                    <div className="collection_wrap">
                      <span className="collection_label">
                        {lang("Email Address")} :
                      </span>
                      <span className="collection_label_dtl">
                        {" "}
                        {collector?.email}
                      </span>
                    </div>
                    {collector?.city_id && (
                      <div className="collection_wrap">
                        <span className="collection_label">
                          {lang("City")} :
                        </span>
                        <span className="collection_label_dtl">
                          {collector &&
                            collector.city_ids
                              .map((item) => item.name)
                              .join(", ")}
                        </span>
                      </div>
                    )}
                  </Col>

                  <Col xs={24} sm={8} md={8} lg={8} xl={6}>
                    {/* <Button
                                            title="View"
                                            style={{ width: '250px', marginRight: "10px" }}
                                            className="btnStyle btnOutlineDelete"
                                            onClick={() => {
                                                // navigate(`/collector/${record._id}`)
                                            }}
                                        >
                                            View Collection History
                                        </Button> */}
                  </Col>
                  <Col xs={24} sm={16} md={12} lg={12} xl={6}>
                    <Card className="collection_card">
                      <div className="collection_icon">
                        <svg
                          width="27"
                          height="28"
                          viewBox="0 0 27 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_3628_62668)">
                            <path
                              d="M26.8032 13.9062C26.8032 16.3638 26.8102 18.8223 26.8032 21.2799C26.793 24.0054 25.1164 26.2793 22.538 27.0136C21.9769 27.1688 21.3975 27.2474 20.8154 27.2472C15.8994 27.2644 10.9835 27.267 6.06753 27.255C2.96034 27.2496 0.542341 25.1229 0.114811 22.0376C0.0851987 21.7771 0.0734914 21.5148 0.0797687 21.2526C0.0797687 16.3467 0.0797687 11.4408 0.0797687 6.53481C0.0797687 3.58111 2.0165 1.20523 4.87995 0.637545C5.28123 0.564858 5.68857 0.530957 6.09635 0.536312C10.9931 0.529563 15.8896 0.529563 20.7858 0.536312C23.7497 0.536312 26.121 2.45742 26.6934 5.32311C26.7706 5.75296 26.8063 6.18923 26.8 6.62592C26.8078 9.04852 26.8032 11.4774 26.8032 13.9062ZM1.9433 13.8922C1.9433 16.3207 1.9433 18.7493 1.9433 21.1779C1.93595 21.4398 1.95054 21.7018 1.98691 21.9613C2.34202 24.021 3.96414 25.3877 6.06753 25.3877C10.983 25.3934 15.8981 25.3934 20.8131 25.3877C21.046 25.3928 21.2789 25.378 21.5093 25.3433C23.5714 24.9851 24.9357 23.3692 24.9357 21.2628C24.9409 16.3485 24.9409 11.4335 24.9357 6.51767C24.9405 6.28478 24.9256 6.0519 24.8913 5.8215C24.5347 3.76022 22.9157 2.39512 20.8115 2.39512C15.8961 2.39097 10.9806 2.39097 6.0652 2.39512C5.83234 2.38986 5.59945 2.40418 5.369 2.43795C3.3209 2.79227 1.94875 4.41045 1.94252 6.4873C1.93629 8.95741 1.9433 11.4291 1.9433 13.8922Z"
                              fill="#414454"
                            />
                            <path
                              d="M18.6154 9.85511C18.0991 9.85511 17.6428 9.86368 17.188 9.85511C16.9872 9.85772 16.7909 9.79558 16.6282 9.6779C16.4655 9.56022 16.345 9.39327 16.2846 9.20177C16.1663 8.83732 16.2652 8.42849 16.5829 8.21201C16.7645 8.08714 16.9772 8.01516 17.1973 8.00409C18.4207 7.98462 19.6449 7.9893 20.8683 7.9963C21.4508 7.9963 21.8301 8.38567 21.8316 8.96971C21.8348 10.1741 21.8348 11.3786 21.8316 12.583C21.8316 13.1686 21.4236 13.5953 20.8878 13.5867C20.352 13.5782 19.9728 13.1569 19.9681 12.5876C19.9681 12.1438 19.9681 11.6991 19.9681 11.1976C19.8544 11.302 19.7773 11.3674 19.7064 11.4383L15.523 15.62C14.9623 16.1807 14.6018 16.2095 13.9359 15.7617C12.9937 15.1286 12.0483 14.5002 11.0834 13.8562C11.0055 13.9341 10.9277 14.0018 10.8498 14.075C9.46102 15.4611 8.07226 16.847 6.6835 18.2326C6.12047 18.7925 5.26618 18.5854 5.07461 17.8487C4.97649 17.4726 5.11433 17.1681 5.38066 16.9018C6.48803 15.7986 7.59411 14.6933 8.69889 13.586L10.1411 12.1438C10.6605 11.6251 11.0312 11.5854 11.634 11.988C12.5389 12.5908 13.4425 13.1951 14.3448 13.8009C14.4803 13.892 14.5706 13.9348 14.7131 13.7908C15.9716 12.5215 17.2386 11.2615 18.5025 9.99762C18.5298 9.96881 18.5508 9.93688 18.6154 9.85511Z"
                              fill="#414454"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3628_62668">
                              <rect
                                width="26.7312"
                                height="26.7312"
                                fill="white"
                                transform="translate(0.0742188 0.527344)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div className="collection-cont">
                        <h5>{lang("This Month Collection")}</h5>
                        <h4>
                          <Currency price={collection} />
                        </h4>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
              <div></div>
            </Card>
          </Col>
        </Row>
      </div>
      <SectionWrapper
        cardHeading={lang("Restaurant") + " " + lang("List")}
        extra={
          <>
            <div className="w-100 d-flex align-items-baseline text-head_right_cont">
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
              <div className="role-wrap">
                <Select
                  width="110px"
                  placeholder={lang("Year")}
                  showSearch
                  value={filter.year}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  options={years.map((item) => ({ value: item, label: item }))}
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
                  options={months.map((item) => ({ ...item }))}
                  onChange={(value) => onChange("month", value)}
                />
              </div>

              <div className="city-wrap">
                <Select
                  width="250"
                  style={{ minWidth: "150px" }}
                  placeholder="Status"
                  value={filter.status}
                  options={[
                    { value: "Pending", label: lang("Pending") },
                    { value: "Approved", label: lang("Approved") },
                    { value: "Rejected", label: lang("Rejected") },
                  ]}
                  onChange={(value) => onChange("status", value)}
                />
              </div>

              <div className="city-wrap">
                <Select
                  style={{ minWidth: "150px" }}
                  placeholder={lang("Restaurant")}
                  showSearch
                  value={filter.restaurant_id}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  options={restaurants.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                  onChange={(value) => onChange("restaurant_id", value)}
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
                {lang(`Reset`)}
              </Button>
            </div>
          </>
        }
      >
        <div className="table-responsive customPagination">
          <Table
            loading={loading}
            columns={columns}
            dataSource={list}
            pagination={{
              defaultPageSize: 10,
              responsive: true,
              total: pagination.pageSize,
            }}
            onChange={handleChange}
            className="ant-border-space"
          />
        </div>
      </SectionWrapper>
    </>
  );
};

export default CollectorView;
