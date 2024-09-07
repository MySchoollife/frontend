import {
  Button,
  Card,
  Col,
  Image,
  Row,
  Switch,
  Table,
  Tag,
  Tooltip,
  Select,
  Input,
} from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { UndoOutlined } from "@ant-design/icons";
import EditIcon from "../../assets/images/edit.svg";
import deleteWhiteIcon from "../../assets/images/icon/deleteWhiteIcon.png";
import notfound from "../../assets/images/not_found.png";
import Plus from "../../assets/images/plus.svg";
import DeleteModal from "../../components/DeleteModal";
import SectionWrapper from "../../components/SectionWrapper";
import apiPath from "../../constants/apiPath";
import { AppStateContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
import AddForm from "./AddDiscountForm";
import { Months } from "../../constants/var";
import { dateString } from "../../helper/functions";

function Index() {
  const { setPageHeading, country } = useContext(AppStateContext);

  const sectionName = "Discount";
  const routeName = "discount";

  const heading = lang("Discount") + " " + lang("Management");

  const api = {
    discount: apiPath.discount,
    revenue: apiPath.revenue,
  };

  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();

  const [list, setList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const debouncedSearchText = useDebounce(searchText, 300);

  const [showDelete, setShowDelete] = useState(false);

  const [selectedDiscount, setSelectedDiscount] = useState();

  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  const urlParams = new URLSearchParams(window.location.search);
  const year = urlParams.get("year");
  const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    country_id: undefined,
    city_id: undefined,
    year: year,
    month: undefined,
    for_all_cities: undefined,
  });

  const onDelete = (id) => {
    request({
      url: api.discount + "/" + id,
      method: "DELETE",
      onSuccess: (data) => {
        setLoading(false);
        setRefresh((prev) => !prev);
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const handleChangeStatus = (id) => {
    request({
      url: api.discount + "/" + id + "/status",
      method: "PUT",
      onSuccess: (data) => {
        setLoading(false);
        setRefresh((prev) => !prev);
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const columns = [
    {
      title: lang("S. No"),
      dataIndex: "index",
      key: "index",
      render: (value, item, index) =>
        pagination.current === 1
          ? index + 1
          : (pagination.current - 1) * 10 + (index + 1),
    },
    {
      title: lang("Code"),
      dataIndex: "index",
      key: "index",
      render: (_, { code }) => code,
    },
    {
      title: lang("Used Count"),
      dataIndex: "count",
      render: (_, { count }) => {
        return count ? <span className="cap">{count ? count : "-"}</span> : 0;
      },
    },
    {
      title: lang("Banner Image"),
      dataIndex: "image",
      key: "image",
      render: (_, { image }) => (
        <Image
          width={50}
          src={image ? image : notfound}
          className="table-img"
        />
      ),
    },
    {
      title: lang("Cities"),
      dataIndex: "populatedcities",
      key: "populatedcities",
      render: (_, { populatedcities, for_all_cities }) => {
        return (
          <>
            {for_all_cities ? (
              <Tag color="magenta">{<span className="cap">All</span>}</Tag>
            ) : (
              <>
                {populatedcities?.map((rest) => (
                  <p>{rest.name}</p>
                ))}
              </>
            )}
          </>
        );
      },
    },
    {
      title: lang("Restaurants"),
      dataIndex: "populatedrestaurants",
      key: "populatedrestaurants",
      render: (_, { populatedrestaurants, for_all_restaurants }) => {
        return (
          <>
            {for_all_restaurants ? (
              <Tag color="magenta">{<span className="cap">All</span>}</Tag>
            ) : (
              <>
                {populatedrestaurants.map((rest) => (
                  <p>{rest.name}</p>
                ))}
              </>
            )}
          </>
        );
      },
    },

    {
      title: lang("Custom Message"),
      dataIndex: "description",
      key: "description",
      render: (_, { description }) => {
        return <>{description ? <p>{description}</p> : "N/A"}</>;
      },
    },
    {
      title: lang("Custom Message Arabic"),
      dataIndex: "ar_description",
      key: "ar_description",
      render: (_, { ar_description }) => {
        return <>{ar_description ? <p>{ar_description}</p> : "N/A"}</>;
      },
    },
    {
      title: lang("Start Date"),
      dataIndex: "start_date",
      key: "start_date",
      render: (_, { start_date }) => {
        return dateString(start_date, "lll");
      },
    },

    {
      title: lang("End Date"),
      dataIndex: "end_date",
      key: "end_date",
      render: (_, { end_date }) => {
        return dateString(end_date, "lll");
      },
    },
    {
      title: lang("Action"),
      fixed: "right",
      key: "action",
      render: (_, record) => {
        return (
          <div div className="d-flex justify-contenbt-start">
            <Tooltip
              title={lang("Edit")}
              color={"purple"}
              key={"update" + routeName}
            >
              <Button
                title={lang("Edit")}
                className="edit-cls btnStyle primary_btn"
                onClick={() => {
                  setSelectedDiscount(record);
                  setVisible(true);
                }}
              >
                <img src={EditIcon} />
                <span>{lang("Edit")}</span>
              </Button>
            </Tooltip>

            <Tooltip title={lang("Delete")} color={"purple"} key={"Delete"}>
              <Button
                title={lang("Delete")}
                className="btnStyle deleteDangerbtn"
                onClick={() => {
                  setSelectedDiscount(record);
                  setShowDelete(true);
                }}
              >
                <img src={deleteWhiteIcon} />
                <span>{lang("Delete")}</span>
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: lang("Status"),
      key: "is_active",
      dataIndex: "is_active",
      render: (_, { _id, is_active }) => {
        return (
          <Switch
            onChange={() => {
              handleChangeStatus(_id);
            }}
            checked={is_active}
          />
        );
      },
    },
  ];

  const getFilter = () => {
    request({
      url: `${api.discount}/filters`,
      method: "GET",
      onSuccess: (res) => {
        const { data, months, years, isAll } = res;
        console.log(isAll, "isAll");
        if (isAll) {
          data.unshift({ _id: "all", name: "ALL" });
          console.log(data, "kk");
        }
        setCities(data);
        setYears(years);
        const m = Months.filter((item) => months.includes(item.value));
        setMonths(m);
      },
    });
  };

  const fetchData = (pagination, status) => {
    setLoading(true);

    const payload = {};
    payload.page = pagination ? pagination.current : 1;
    payload.pageSize =
      pagination && pagination?.pageSize ? pagination?.pageSize : 10;
    payload.status = "discount";
    payload.search = debouncedSearchText;

    const queryString = Object.entries(filter)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");

    request({
      url:
        api.discount +
        `?status=${""}&page=${pagination ? pagination.current : 1}&pageSize=${
          pagination && pagination?.pageSize ? pagination?.pageSize : 10
        }&search=${debouncedSearchText}${queryString ? `&${queryString}` : ""}`,
      method: "GET",
      // data: payload,
      onSuccess: (data) => {
        setLoading(false);
        setList(data.data);
        setPagination((prev) => ({
          current: pagination.current,
          pageSize: data.data.length > 10 ? 10 : data.data.length,
        }));
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const handleChange = (pagination, sorter, filters) => {
    if (!sorter) {
      fetchData(pagination);
    }
  };

  useEffect(() => {
    fetchData({
      current: 1,
      pageSize: 10,
    });
    setPageHeading(heading);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData({ current: 1 });
    getFilter();
  }, [country.country_id, refresh, debouncedSearchText, filter]);

  const onChange = (key, value) => {
    if (key == "country_id") {
      setCities([]);
      setFilter((prev) => ({ ...prev, city_id: undefined, country_id: value }));
    } else {
      setFilter((prev) => ({ ...prev, [key]: value }));
    }
  };

  const onSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <div className="tabled quoteManagement">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24">
              <SectionWrapper
                cardHeading={lang("Discounts")}
                extra={
                  <>
                    <div className="w-100 text-head_right_cont">
                      <div className="role-wrap">
                        <Select
                          width="110px"
                          placeholder={lang("City")}
                          showSearch
                          value={filter.city_id}
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          options={cities.map((item) => ({
                            value: item._id,
                            label: item.name,
                          }))}
                          onChange={(value) => {
                            if (value == "all") {
                              onChange("city_id", undefined);
                              onChange("for_all_cities", value);
                            } else {
                              onChange("city_id", value);
                              onChange("for_all_cities", undefined);
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={() =>
                          setFilter({
                            country_id: undefined,
                            city_id: undefined,
                            year: undefined,
                            month: undefined,
                            for_all_cities: undefined,
                          })
                        }
                        type="primary"
                        icon={<UndoOutlined />}
                      >
                        {lang("Reset")}
                      </Button>
                      <div className="pageHeadingSearch">
                        <Input.Search
                          className="searchInput"
                          placeholder={lang("Search by discount code")}
                          onChange={onSearch}
                          allowClear
                        />
                      </div>

                      <Button
                        className="primary_btn btnStyle"
                        onClick={(e) => {
                          setVisible(true);
                          setSearchText("");
                        }}
                      >
                        <span className="add-Ic">
                          <img src={Plus} />
                        </span>
                        {lang("Create")} {sectionName}
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
                      total: pagination.total,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      pageSizeOptions: ["10", "20", "30", "50"],
                    }}
                    onChange={handleChange}
                    className="ant-border-space"
                  />
                </div>
              </SectionWrapper>
            </Card>
          </Col>
        </Row>
        {visible && (
          <AddForm
            section={sectionName}
            api={api}
            show={visible}
            hide={() => {
              setSelectedDiscount();
              setVisible(false);
            }}
            data={selectedDiscount}
            refresh={() => setRefresh((prev) => !prev)}
          />
        )}
      </div>
      {showDelete && (
        <DeleteModal
          title={lang("Delete Discount")}
          subtitle={lang(`Are you sure you want to Delete this discount?`)}
          show={showDelete}
          hide={() => {
            setShowDelete(false);
            setSelectedDiscount();
          }}
          onOk={() => onDelete(selectedDiscount?._id)}
        />
      )}
    </>
  );
}

export default Index;
