import { Button, Col, Row, Table, Tooltip, Switch } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Plus from "../../assets/images/plus.svg";
import DeleteModal from "../../components/DeleteModal";
import SectionWrapper from "../../components/SectionWrapper";
import apiPath from "../../constants/apiPath";
import { AppStateContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
import EditIcon from "../../assets/images/edit.svg";
import AddArea from "./AddArea";

function ServiceLocationAreaView() {
  const heading = lang("Service Location") + " " + lang("Management");
  const { setPageHeading } = useContext(AppStateContext);

  const sectionName = lang("Service Location");
  const routeName = "locations";
  const { id } = useParams();

  const api = {
    status: apiPath.location,
    addEdit: apiPath.location + `/${id}/area`,
    list: apiPath.location + `/${id}/area`,
  };

  const { request } = useRequest();

  const [list, setList] = useState([]);
  const [city, setCity] = useState();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState();
  const [showStatus, setShowStatus] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

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

  const handleChangeStatus = (area, message) => {
    request({
      url: api.status + `/${id}/area/status/${area}`,
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
      title: lang("Area"),
      dataIndex: "name",
      key: "name",
      render: (_, { name }) => {
        return name ? <span className="cap">{name}</span> : "-";
      },
    },
    {
      title: lang("Area name arabic"),
      dataIndex: "name",
      key: "name",
      render: (_, { ar_name }) => {
        return ar_name ? <span className="cap">{ar_name}</span> : "-";
      },
    },
    // {
    //     title: "City",
    //     dataIndex: "city_id",
    //     key: "city_id",
    //     render: (_, { city_id }) => {
    //         return city_id ? <span className="cap">{city_id.name}</span> : "-";
    //     },
    // },
    {
      title: lang("Action"),
      fixed: "right",
      key: "action",
      render: (_, record) => {
        return (
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
        );
      },
    },
    {
      title: lang("Status"),
      key: "is_active",
      dataIndex: "is_active",
      render: (_, record) => {
        return (
          <Switch
            onClick={() => {
              setSelected(record);
              setShowStatus(true);
            }}
            checked={record.is_active}
          />
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    fetchData(pagination);
  }, [refresh]);

  useEffect(() => {
    setPageHeading(heading);
  }, [setPageHeading]);

  const fetchData = (pagination, filters) => {
    const filterActive = filters ? filters.is_active : null;
    request({
      url:
        api.list +
        `?status=${filterActive ? filterActive.join(",") : ""}&page=${
          pagination ? pagination.current : 1
        }&pageSize=${pagination.pageSize ?? 10}`,
      method: "GET",
      onSuccess: ({ data, status, total, message, city }) => {
        setLoading(false);
        if (status) {
          setList(data);
          setCity(city);
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
              cardHeading={`${city?.name ?? ""} ${lang(`City Area List`)}`}
              cardSubheading={""}
              extra={
                <>
                  <div className="w-100 text-head_right_cont">
                    <Button
                      className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                      onClick={(e) => {
                        setVisible(true);
                      }}
                    >
                      <span className="add-Ic">
                        <img src={Plus} />
                      </span>
                      {lang("Add Service Area")}
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
        <AddArea
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
            selected?.is_active ? lang(`De-active`) : lang(`Active`)
          } ${lang(`Area`)}`}
          subtitle={`${lang(`Are you sure you want to`)} ${
            selected?.is_active ? lang(`de-active`) : lang(`active`)
          } ${lang(`this Area?`)}`}
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

export default ServiceLocationAreaView;
