import { Button, Col, Row, Table, Tooltip } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EditIcon from "../../assets/images/edit.svg";
import Plus from "../../assets/images/plus.svg";
import DeleteModal from "../../components/DeleteModal";
import SectionWrapper from "../../components/SectionWrapper";
import apiPath from "../../constants/apiPath";
import { AppStateContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
import AddForm from "./AddForm";

export const QuoteStatus = {
  REQUEST: "request",
  RECEIVED: "received",
  COMPLETE: "complete",
  FULLFILL: "fulfill",
  ADDONS: "addons",
  ITEMDEALS: "itemdeals",
};

function ServiceLocation() {
  const heading = lang("Service Location") + " " + lang("Management");
  const { setPageHeading } = useContext(AppStateContext);

  const sectionName = "Service Location";
  const routeName = "locations";

  const api = {
    status: apiPath.location,
    addEdit: apiPath.location,
    list: apiPath.location,
  };

  const [searchText, setSearchText] = useState("");

  const { request } = useRequest();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState();
  const [showStatus, setShowStatus] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const debouncedSearchText = useDebounce(searchText, 300);

  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState({
    country_id: undefined,
    city_id: undefined,
    year: undefined,
    month: undefined,
  });

  const getCountry = () => {
    request({
      url: `/country`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        console.log(data, "Country");
        if (data) {
          setCountries(data);
        }
      },
    });
  };

  const handleChangeStatus = (id, message) => {
    request({
      url: api.list + "/" + id + "/status",
      method: "PUT",
      data: { message },
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
      title: lang("Country"),
      dataIndex: "country_id",
      key: "country_id",
      render: (_, { name }) => {
        return name ? <span className="cap">{name}</span> : "-";
      },
    },
    {
      title: lang("Country NAME ARABIC"),
      dataIndex: "country_id",
      key: "country_id",
      render: (_, { ar_name }) => {
        return ar_name ? <span className="cap">{ar_name}</span> : "-";
      },
    },
    {
      title: lang("City"),
      dataIndex: "city_id",
      key: "city_id",
      render: (_, { city }) => {
        return city ? <span className="cap">{city}</span> : "-";
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

            <Tooltip
              title={lang("View")}
              color={"purple"}
              key={"Edit" + routeName}
            >
              <Button
                title="Edit"
                className="btnStyle btnOutlineDelete"
                onClick={() => {
                  navigate(`/locations/${record._id}`);
                }}
              >
                <span>{lang("View")}</span>
              </Button>
            </Tooltip>
            <Tooltip
              title={lang("Block")}
              color={"purple"}
              key={"Edit" + routeName}
            >
              <Button
                title="Edit"
                className="block-cls cap"
                onClick={() => {
                  setSelected(record);
                  setShowStatus(true);
                }}
              >
                {lang("block")}
              </Button>
            </Tooltip>
          </>
        ) : (
          <Tooltip
            title={lang("Unblock")}
            color={"purple"}
            key={"Edit" + routeName}
          >
            <Button
              title="Edit"
              className="block-cls cap"
              onClick={() => {
                setSelected(record);
                setShowStatus(true);
              }}
            >
              {lang("unblock")}
            </Button>
          </Tooltip>
        );
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
        api.list +
        `?status=${filterActive ? filterActive.join(",") : ""}&page=${
          pagination ? pagination.current : 1
        }&pageSize=${pagination.pageSize ?? 10}&search=${debouncedSearchText}${
          queryString ? `&${queryString}` : ""
        }`,
      method: "GET",
      onSuccess: ({ data, status, total, message }) => {
        setLoading(false);
        if (status) {
          setList(data);

          setPagination((prev) => ({
            ...prev,
            current: pagination.current,
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

  const handleChange = (pagination, filters) => {
    fetchData(pagination, filters);
  };

  useEffect(() => {
    setLoading(true);
    fetchData(pagination);
  }, [refresh, debouncedSearchText, filter]);

  useEffect(() => {
    setPageHeading(heading);
  }, [setPageHeading]);

  useEffect(() => {
    getCountry();
  }, []);

  return (
    <>
      <div className="tabled quoteManagement">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <SectionWrapper
              cardHeading={lang(`Country List`)}
              cardSubheading={""}
              extra={
                <>
                  <div className="w-100 text-head_right_cont">
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
                      {lang("ADD Service Country")}
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
          section={sectionName}
          api={api}
          show={visible}
          hide={() => {
            setSelected();
            setVisible(false);
          }}
          data={selected}
          refresh={() => setRefresh((prev) => !prev)}
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
          reasons={[]}
        />
      )}
    </>
  );
}

export default ServiceLocation;
