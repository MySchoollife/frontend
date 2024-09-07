import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Table, Tooltip } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import ConfirmationBox from "../../../components/ConfirmationBox";
import DeleteModal from "../../../components/DeleteModal";
import SectionWrapper from "../../../components/SectionWrapper";
import apiPath from "../../../constants/apiPath";
import { AppStateContext } from "../../../context/AppContext";
import lang from "../../../helper/langHelper";
import { Severty, ShowToast } from "../../../helper/toast";
import useDebounce from "../../../hooks/useDebounce";
import useRequest from "../../../hooks/useRequest";
import AddForm from "./AddForm";
import ViewLogs from "../../../components/ViewLogs";
import { BlockCollectorReasons } from "../../../constants/reasons";

const { confirm } = Modal;

function Collector() {
  const { setPageHeading, country } = useContext(AppStateContext);

  const sectionName = lang("Collector");
  const routeName = "collector";

  const api = {
    status: apiPath.statusSubAdmin,
    addEdit: apiPath.collector,
    collector: apiPath.collector,
  };

  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();
  const { showConfirm } = ConfirmationBox();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [logs, showLogs] = useState(false);
  const [selected, setSelected] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [deleteModal, showDeleteModal] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const debouncedSearchText = useDebounce(searchText, 300);
  const navigate = useNavigate();

  const columns = [
    {
      title: lang("EmpId"),
      dataIndex: "index",
      key: "index",
      render: (_, { uid }) => (uid ? <span className="cap">#{uid}</span> : "-"),
    },
    {
      title: lang("Name"),
      dataIndex: "name",
      key: "name",
      render: (_, { name }) => {
        return name;
      },
    },
    {
      title: lang("Phone number"),
      dataIndex: "ar_name",
      key: "ar_name",
      render: (_, { country_code, mobile_number }) =>
        country_code ? (
          <span className="cap">
            ({country_code}) {mobile_number}
          </span>
        ) : (
          "-"
        ),
    },
    {
      title: lang("Email Address"),
      dataIndex: "email",
      key: "email",
      render: (_, { email }) => {
        return email ? (
          <span style={{ textTransform: "lowercase" }}>{email}</span>
        ) : (
          "-"
        );
      },
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
    {
      title: lang("Collection"),
      render: (_, { collection }) => {
        return collection ? collection : "0";
      },
    },
    {
      title: lang("Action"),
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            {record.is_active ? (
              <>
                <Tooltip
                  title={lang("Edit")}
                  color={"purple"}
                  key={"update" + routeName}
                >
                  <Button
                    title={lang("Edit")}
                    className="edit-cl primary_btn"
                    onClick={() => {
                      setSelected(record);
                      setVisible(true);
                    }}
                  >
                    <i class="fa fa-light fa-pen"></i>
                    <span>{lang(`Edit`)}</span>
                  </Button>
                </Tooltip>

                <Tooltip
                  title={lang("View Details")}
                  color={"purple"}
                  key={"Edit" + routeName}
                >
                  <Button
                    title="View"
                    className="btnStyle btnOutlineDelete"
                    onClick={() => {
                      navigate(`/collector/${record._id}`);
                    }}
                  >
                    {lang("View Details")}
                  </Button>
                </Tooltip>

                <Tooltip
                  title={lang("Block")}
                  color={"purple"}
                  key={"Block" + routeName}
                >
                  <Button
                    className="block-cls"
                    title="Block"
                    onClick={() => {
                      setSelected(record);
                      showDeleteModal(true);
                    }}
                  >
                    <span>{lang(`Block`)}</span>
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Tooltip
                title={lang("UnBlock")}
                color={"purple"}
                key={"Block" + routeName}
              >
                <Button
                  className="block-cls"
                  title="UnBlock"
                  onClick={() => {
                    setSelected(record);
                    showDeleteModal(true);
                  }}
                >
                  <span>{lang("UnBlock")}</span>
                </Button>
              </Tooltip>
            )}
            <Tooltip
              title={lang("View")}
              color={"purple"}
              key={"View" + routeName}
            >
              <Button
                title="View"
                className="btnStyle btnOutlineDelete"
                onClick={() => {
                  setSelected(record);
                  showLogs(true);
                }}
              >
                {lang("View")}
              </Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const deleteData = (record) => {
    request({
      url: api.collector + "/" + record?._id,
      method: "DELETE",
      onSuccess: (data) => {
        setLoading(false);
        setRefresh(true);
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const showDeleteConfirm = (record) => {
    setTimeout(() => {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: [<Button>Are you sure you want Delete this user ?</Button>],
        onOk() {
          deleteData(record);
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }, 5);
  };

  const fetchData = (pagination, filters) => {
    const filterActive = filters ? filters.is_active : null;

    request({
      url:
        api.collector +
        `?status=${filterActive ? filterActive.join(",") : ""}&page=${
          pagination ? pagination.current : 1
        }&pageSize=${
          pagination && pagination.pageSize ? pagination.pageSize : 10
        }&search=${debouncedSearchText}`,
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

  useEffect(() => {
    setLoading(true);
    fetchData({ ...pagination, current: 1 });
  }, [refresh, debouncedSearchText, country.country_id]);

  useEffect(() => {
    setPageHeading(`${lang(`Collection`)} ${lang(`Management`)}`);
  }, []);

  const onSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleChangeStatus = (id, message) => {
    request({
      url: `${api.collector}/${id}/status`,
      method: "PUT",
      data: { message },
      onSuccess: (data) => {
        setLoading(false);
        setSelected();
        setRefresh((prev) => !prev);
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  return (
    <>
      <SectionWrapper
        cardHeading={lang("Collector") + " " + lang("List")}
        extra={
          <>
            <div className="w-100 text-head_right_cont">
              <div className="pageHeadingSearch">
                <Input.Search
                  className="searchInput"
                  placeholder={lang("Search by Name, Phone number, Email")}
                  onChange={onSearch}
                  allowClear
                />
              </div>
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
          refresh={() => setRefresh(true)}
        />
      )}

      {logs && (
        <ViewLogs
          data={selected}
          show={logs}
          hide={() => {
            showLogs(false);
            setSelected();
          }}
        />
      )}

      {deleteModal && (
        <DeleteModal
          title={`${
            selected.is_active ? lang(`Block`) : lang(`UnBlock`)
          } ${lang("Collector")}`}
          subtitle={`${lang("Are you sure you want to")} ${
            selected.is_active ? lang(`Block`) : lang(`UnBlock`)
          } ${lang("this collector?")}`}
          show={deleteModal}
          hide={() => {
            showDeleteModal(false);
            setSelected();
          }}
          onOk={(message) => handleChangeStatus(selected?._id, message)}
          reasons={selected?.is_active ? BlockCollectorReasons : []}
        />
      )}
    </>
  );
}

export default Collector;
