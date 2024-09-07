import { Button, Col, Row, Table, Tooltip, Switch } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import EditForm from "./EditForm";
import EditCityForm from "./EditCity";

function ServiceLocationView() {
  const heading = lang("Service Location") + " " + lang("Management");
  const { setPageHeading } = useContext(AppStateContext);

  const sectionName = lang("Service Location");
  const routeName = "locations";
  const { id } = useParams();

  const api = {
    status: apiPath.location,
    addEdit: apiPath.location,
    list: apiPath.location + `/${id}`,
  };

  const [searchText, setSearchText] = useState("");

  const { request } = useRequest();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [page, setPage] = useState(1);

  const debouncedSearchText = useDebounce(searchText, 300);
  const [searchCity, setSearchCity] = useState("");
  const debouncedSearchCity = useDebounce(searchCity, 300);

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    country_id: undefined,
    city_id: undefined,
    year: undefined,
    month: undefined,
  });

  useEffect(() => {
    getCountry();
  }, []);

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

  const getCities = (id, search, page) => {
    if (!id) return;
    request({
      url: `/country-city/${id}?page=${page}&pageSize=30${
        search ? `&search=${search}` : ""
      }`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        console.log(data, "setCities");
        if (data) {
          search
            ? setCities((prev) => [...data])
            : setCities((prev) => [...prev, ...data]);
        }
      },
    });
  };

  useEffect(() => {
    if (!filter?.country_id) return;
    getCities(filter.country_id, debouncedSearchCity, page);
  }, [page]);

  useEffect(() => {
    if (!filter?.country_id) return;
    getCities(filter.country_id, debouncedSearchCity, 1);
  }, [debouncedSearchCity]);

  const onDelete = (id) => {
    request({
      url: api.list + "/" + id,
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

  const handleChangeStatus = (cityId, message) => {
    request({
      url: api.status + `/${id}/status/${cityId}`,
      method: "PUT",
      data: { message },
      onSuccess: (data) => {
        setLoading(false);
        setRefresh((prev) => !prev);
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
        } else {
          ShowToast(data.message, Severty.ERROR);
        }
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
      title: lang("City"),
      dataIndex: "country_id",
      key: "country_id",
      render: (_, { name }) => {
        return name ? <span className="cap">{name}</span> : "-";
      },
    },
    {
      title: lang("City NAME ARABIC"),
      dataIndex: "country_id",
      key: "country_id",
      render: (_, { ar_name }) => {
        return ar_name ? <span className="cap">{ar_name}</span> : "-";
      },
    },
    {
      title: lang("Country"),
      dataIndex: "country",
      key: "country",
      render: (_, { country }) => {
        return country ? <span className="cap">{country?.name}</span> : "-";
      },
    },
    {
      title: lang("Action"),
      fixed: "right",
      key: "action",
      render: (_, record) => (
        <>
          <Tooltip
            title={lang("Edit")}
            color={"purple"}
            key={"Edit" + routeName}
          >
            <Button
              title="Edit"
              className="edit-cls btnStyle primary_btn"
              onClick={() => {
                setSelected(record);
                setShowEdit(true);
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
                navigate(`/locations/${record?._id}/area`);
              }}
            >
              <span>{lang("View")}</span>
            </Button>
          </Tooltip>
        </>
      ),
    },
    {
      title: "Status",
      key: "is_active",
      dataIndex: "is_active",
      render: (_, record) => {
        return (
          <Switch
            onClick={() => {
              setSelected(record);
              setShowStatus(true);
            }}
            checked={record?.is_active}
          />
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    fetchData(pagination);
  }, [refresh, debouncedSearchText, filter]);

  useEffect(() => {
    setPageHeading(heading);
  }, [setPageHeading]);

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

  return (
    <>
      <div className="tabled quoteManagement">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <SectionWrapper
              showBack={true}
              cardHeading={lang(`Service City List`)}
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
                      {lang("Add Service City")}
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
        <EditForm
          section={sectionName}
          api={api}
          show={visible}
          hide={() => {
            setSelected();
            setVisible(false);
          }}
          data={selected}
          cities={list.map(({ _id }) => _id)}
          refresh={() => setRefresh((prev) => !prev)}
        />
      )}

      {showEdit && (
        <EditCityForm
          section={sectionName}
          api={api}
          show={showEdit}
          hide={() => {
            setSelected();
            setShowEdit(false);
          }}
          data={selected}
          refresh={() => setRefresh((prev) => !prev)}
        />
      )}

      {showStatus && (
        <DeleteModal
          title={`${
            selected?.is_active ? lang(`De-active`) : lang(`Active`)
          } ${`City`}`}
          subtitle={`Are you sure you want to ${
            selected?.is_active ? lang(`de-active`) : lang(`active`)
          } ${`this City?`}`}
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

export default ServiceLocationView;
