import { Button, Col, Input, Row, Select, Switch, Table, Tooltip } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UndoOutlined } from "@ant-design/icons";
import EditIcon from "../../assets/images/edit.svg";
import Plus from "../../assets/images/plus.svg";
import DeleteModal from "../../components/DeleteModal";
import SectionWrapper from "../../components/SectionWrapper";
import apiPath from "../../constants/apiPath";
import { AppStateContext, useAppContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import AddForm from "./AddForm";
import ImportForm from "../../components/ImportForm";
import DeliveryChargeImport from "../../components/DeliveryChargeImport";
import useDebounce from "../../hooks/useDebounce";
import Currency from "../../components/Currency";
import { Months } from "../../constants/var";

export const QuoteStatus = {
  REQUEST: "request",
  RECEIVED: "received",
  COMPLETE: "complete",
  FULLFILL: "fulfill",
  ADDONS: "addons",
  ITEMDEALS: "itemdeals",
};

function DeliveryCharge() {
  const heading = lang("Delivery Charge") + " " + lang("Management");
  const { setPageHeading } = useContext(AppStateContext);
  const { country } = useAppContext();

  const sectionName = "Delivery Charge";
  const routeName = "delivery-charge";

  const [searchText, setSearchText] = useState("");

  const { request } = useRequest();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [importModal, showImportModal] = useState(false);
  const [selected, setSelected] = useState();
  const [showStatus, setShowStatus] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [page, setPage] = useState(1);

  const [cities, setCities] = useState([]);
  const [area, setArea] = useState([]);
  const [selectedCity, setSelectedCity] = useState();
  const debouncedSearchText = useDebounce(searchText, 300);
  const [filter, setFilter] = useState({
    country_id: undefined,
    city_id: undefined,
    year: undefined,
    area_id: undefined,
    month: undefined,
  });

  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  // const getCities = (id) => {
  //   request({
  //     url: `/country-city/${id}`,
  //     method: "GET",
  //     onSuccess: ({ data, status }) => {
  //       console.log(data, "setCities");
  //       if (data) {
  //         setCities(data);
  //       }
  //     },
  //   });
  // };

  const getFilter = () => {
    request({
      url: `${apiPath.deliveryCharge}/filters${
        filter.city_id ? `?city_id=${filter.city_id}` : ""
      }`,
      method: "GET",
      onSuccess: (res) => {
        const { data, area } = res;
        setCities(data);
        setArea(area);
      },
    });
  };

  const handleChangeStatus = (id) => {
    request({
      url: apiPath.deliveryCharge + "/" + id + "/status",
      method: "PUT",
      onSuccess: (data) => {
        setLoading(false);
        setRefresh((prev) => !prev);
        ShowToast(data.message, Severty.SUCCESS);
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const onChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      title: lang("S.No."),
      dataIndex: "index",
      key: "index",
      width: 200,
      render: (value, item, index) =>
        `${
          pagination.current === 1
            ? index + 1
            : (pagination.current - 1) * 10 + (index + 1)
        }`,
    },
    {
      title: lang("City"),
      dataIndex: "city",
      key: "city",

      render: (_, { city }) => {
        return city && city?.name ? (
          <span className="cap">{city.name}</span>
        ) : (
          "-"
        );
      },
    },
    {
      title: lang("Area"),
      dataIndex: "area_1",
      key: "areas_1",
      sortDirections: ["ascend", "descend"],
      sorter: true,
      render: (_, { areas }) => {
        return areas && areas[0] && areas[0]?.name ? (
          <span className="cap">{areas[0]?.name}</span>
        ) : (
          "-"
        );
      },
    },
    {
      title: lang("Area"),
      dataIndex: "area_2",
      key: "area_2",
      render: (_, { areas }) => {
        return areas && areas[1] && areas[1]?.name ? (
          <span className="cap">{areas[1]?.name}</span>
        ) : areas && areas[0] && areas[0]?.name ? (
          <span className="cap">{areas[0]?.name}</span>
        ) : (
          "-"
        );
      },
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: lang("Price"),
      dataIndex: "price",
      key: "price",
      render: (_, { price }) => {
        return price ? (
          <span className="cap">
            <Currency price={price} />
          </span>
        ) : (
          0
        );
      },
    },
    {
      title: lang("Action"),
      fixed: "right",
      key: "action",
      render: (_, record) => {
        return record.is_active ? (
          <>
            <Tooltip
              title={lang("Edit")}
              color={"purple"}
              key={"Edit" + routeName}
            >
              <Button
                title={lang("Edit")}
                className="edit-cls btnStyle primary_btn"
                onClick={() => {
                  setSelected(record);
                  setVisible(true);
                }}
              >
                <img src={EditIcon} />
                <span>{lang("Edit")}</span>
              </Button>
            </Tooltip>
          </>
        ) : null;
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

  const fetchData = (pagination, filters, sorter) => {
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
        apiPath.deliveryCharge +
        `?status=${filterActive ? filterActive.join(",") : ""}&page=${
          pagination ? pagination.current : 1
        }&pageSize=${pagination.pageSize ?? 10}${
          queryString ? `&${queryString}` : ""
        }${sorter ? `&${sorter}` : ""}${
          debouncedSearchText ? `&search=${debouncedSearchText}` : ""
        }`,
      method: "GET",
      onSuccess: ({ data, status, total, message, page, pageSize }) => {
        setLoading(false);
        if (status) {
          console.log(data, "hfgdjgfjd");
          setList(data);

          setPagination((prev) => ({
            ...prev,
            current: pagination.current,
            pageSize,
            total: total,
          }));
        }
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const handleChange = (pagination, filters, sorter) => {
    console.log(sorter, "sorter");
    const { field, order } = sorter;
    let query = undefined;
    if (field && order) {
      query = `${field}=${order}`;
      console.log(query);
      // apiUrl += `?sortField=${sortField}&sortOrder=${sortOrder}`;
    }
    fetchData(pagination, filters, query);
  };

  useEffect(() => {
    if (!country?.country_id) return;

    console.log(country, "jdhjghjfghkj");
    // getCities(country.country_id);
  }, [country, page, refresh]);

  useEffect(() => {
    setLoading(true);
    fetchData({ ...pagination, current: 1 });
  }, [refresh, filter, debouncedSearchText]);

  useEffect(() => {
    setPageHeading(heading);
    getFilter();
  }, [setPageHeading, filter.city_id]);

  return (
    <>
      <div className="tabled quoteManagement">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <SectionWrapper
              cardHeading={lang(`Delivery Charges`)}
              cardSubheading={""}
              extra={
                <>
                  <div className="w-100 text-head_right_cont">
                    <div className="pageHeadingSearch">
                      <Input.Search
                        className="searchInput"
                        placeholder={lang("Search by area name")}
                        onChange={(e) => {
                          setSearchText(e.target.value);
                        }}
                        allowClear
                      />
                    </div>

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
                      onChange={(value) => onChange("city_id", value)}
                    />
                    <Select
                      width="110px"
                      placeholder={lang("Area")}
                      showSearch
                      value={filter.area_id}
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      options={area.map((item) => ({
                        value: item._id,
                        label: item.name,
                      }))}
                      onChange={(value) => onChange("area_id", value)}
                    />

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
                    <Button
                      className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                      onClick={(e) => {
                        setVisible(true);
                        setSearchText("");
                      }}
                    >
                      <span className="add-Ic">
                        <img src={Plus} />
                      </span>
                      {lang("ADD Charges")}
                    </Button>

                    <Button
                      className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                      onClick={(e) => {
                        showImportModal(true);
                        setSearchText("");
                      }}
                    >
                      {lang("Import")}
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
                    ...pagination,
                  }}
                  onChange={handleChange}
                  className="ant-border-space"
                />
              </div>
            </SectionWrapper>
          </Col>
        </Row>
      </div>

      {visible && (
        <AddForm
          show={visible}
          hide={() => {
            setVisible(false);
            setSelected();
          }}
          data={selected}
          refresh={() => {
            setRefresh((prev) => !prev);
          }}
        />
      )}

      {importModal && (
        <DeliveryChargeImport
          show={importModal}
          hide={() => {
            showImportModal(false);
            setSelected();
          }}
          refresh={() => {
            setRefresh((prev) => !prev);
          }}
        />
      )}

      {showStatus && (
        <DeleteModal
          title={`${
            selected?.is_active ? lang(`Block`) : lang(`Unblock`)
          } ${lang(`Country`)}`}
          subtitle={`${lang(`Are you sure you want to`)} ${
            selected?.is_active ? lang(`block`) : lang(`unblock`)
          } ${lang(`this Country?`)}`}
          show={showStatus}
          hide={() => {
            setShowStatus(false);
            setSelected();
          }}
          onOk={(message) => handleChangeStatus(selected?._id, message)}
        />
      )}
    </>
  );
}

export default DeliveryCharge;
