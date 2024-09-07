import { Button, Table, Tooltip, Select, Modal, Input, Switch } from "antd";
import React, { useContext, useEffect, useState } from "react";

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
import { UndoOutlined } from "@ant-design/icons";
import { BlockSubAdmin } from "../../constants/var";
// import CheckIcon from "../../assets/images/check.svg"
import Lottie from "react-lottie";
import ViewLogs from "../../components/ViewLogs";
import * as success from "../../assets/animation/success.json";
import {
  DeleteSubadmin,
  DeleteRestaurantReasons,
} from "../../constants/reasons";
import moment from "moment";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function Index() {
  const { setPageHeading, country } = useContext(AppStateContext);

  const sectionName = lang("SP Profile");
  const routeName = "SP Profile";

  const api = {
    status: apiPath.statusProfile,
    list: apiPath.listProfile,
    category: apiPath.allCategory,
  };

  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [logs, showLogs] = useState(false);
  const [selected, setSelected] = useState();
  const [email, setEmail] = useState();
  const [endDate, setEndDate] = useState();
  const [showDelete, setShowDelete] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const debouncedSearchText = useDebounce(searchText, 300);
  const [searchCity, setSearchCity] = useState("");
  const debouncedSearchCity = useDebounce(searchCity, 300);
  const [showMessage, setShowMessage] = useState(false);
  const [countries, setCountries] = useState([]);
  const [showStatusMessage, setShowStatusMessage] = useState(false);

  const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    country_id: undefined,
    city_id: undefined,
    year: undefined,
    month: undefined,
  });
  const [page, setPage] = useState(1);

  const getFilter = () => {
    request({
      url: `${api.list}/filters`,
      method: "GET",
      onSuccess: (res) => {
        const { data, months, years } = res;
        setCities(data);
      },
    });
  };

  const onChange = (key, value) => {
    if (key == "country_id") {
      setCities([]);
      setFilter((prev) => ({ ...prev, city_id: undefined, country_id: value }));
    } else {
      setFilter((prev) => ({ ...prev, [key]: value }));
    }
  };

  const columns = [
    {
      title: lang("S. No"),
      dataIndex: "index",
      key: "index",
      render: (value, item, index) =>
        `${
          pagination.current === 1
            ? index + 1
            : (pagination.current - 1) * 10 + (index + 1)
        }`,
    },

    {
      title: lang("Name"),
      dataIndex: "name",
      key: "name",
      sortDirections: ["ascend", "descend"],
      // sorter: true,
      render: (_, { name }) => {
        return name;
      },
    },
    {
      title: lang("Category Name"),
      dataIndex: "category_id",
      key: "category_id",
      sortDirections: ["ascend", "descend"],
      // sorter: true,
      render: (_, { category_id }) => {
        return category_id ? category_id.name : "-";
      },
    },

    {
      title: lang("Register Date"),
      key: "created_at",
      dataIndex: "created_at",
      render: (_, { created_at }) => {
        return moment(created_at).format("ll");
      },
    },
    {
      title: lang("Action"),
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            <Tooltip
              title={lang("Edit")}
              color={"purple"}
              key={"update" + routeName}
            >
              <Button
                title="Edit"
                className="edit-cl primary_btn"
                onClick={() => {
                  setSelected(record);
                  setVisible(true);
                }}
              >
                <i class="fa fa-light fa-pen"></i>
                <span>{lang("Edit")}</span>
              </Button>
            </Tooltip>

            <Tooltip
              title={lang("Delete")}
              color={"purple"}
              key={"delete" + routeName}
            >
              <Button
                className="delete-cls"
                title={lang("Delete")}
                // onClick={() => {
                //   setSelected(record);
                //   setShowDelete(true);
                // }}
                onClick={() => {
                  if (record.have_item) {
                    return setShowMessage(true);
                  }
                  setSelected(record);
                  setShowDelete(true);
                }}
              >
                <i class="fa fa-light fa-trash"></i>
                <span>{lang("Delete")}</span>
              </Button>
            </Tooltip>
          </>
        );
      },
    },
    {
      title: lang("Status"),
      key: "is_active",
      dataIndex: "is_active",
      filters: [
        {
          text: "Active",
          value: "true",
        },
        {
          text: "InActive",
          value: "false",
        },
      ],
      render: (_, { _id, is_active, have_active_item }) => {
        return (
          <Switch
            onChange={() => {
              if (have_active_item) {
                return setShowStatusMessage(true);
              }
              handleChangeStatus(_id);
            }}
            checked={is_active}
          />
        );
      },
    },
  ];

  const onDelete = (id) => {
    request({
      url: api.list + "/" + id,
      method: "DELETE",
      onSuccess: (data) => {
        setLoading(false);
        ShowToast(data.message, Severty.SUCCESS);
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
      url: api.status + "/" + id,
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

  const fetchData = (pagination, filters, sorter) => {
    const filterActive = filters ? filters.is_active : null;

    const queryString = Object.entries(filter)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    request({
      url:
        api.list +
        `?status=${filterActive ? filterActive.join(",") : ""}&page=${
          pagination ? pagination.current : 1
        }&pageSize=${
          pagination && pagination.pageSize ? pagination.pageSize : 10
        }${sorter ? `&${sorter}` : ""}&search=${debouncedSearchText}${
          queryString ? `&${queryString}` : ""
        }`,
      method: "GET",
      onSuccess: ({ data, status, total, message }) => {
        setLoading(false);

        setList(data);
        console.log(total, "total");
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

  const handleChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    let query = undefined;
    if (field && order) {
      query = `${field}=${order}`;
      console.log(query);
    }
    fetchData(pagination, filters, query);
  };

  useEffect(() => {
    setLoading(true);
    fetchData(pagination);
    getFilter();
  }, [refresh, debouncedSearchText, filter, country?.country_id]);

  useEffect(() => {
    setPageHeading(`${lang("SP Profile")} ${lang("Management")}`);
  }, []);

  const onSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <SectionWrapper
        cardHeading={lang("Service Provider") + " " + lang("Profile")}
        extra={
          <>
            <div className="w-100 text-head_right_cont">
              <div className="pageHeadingSearch">
                <Input.Search
                  className="searchInput"
                  placeholder={lang("Search by name")}
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
                {lang("Add")} {sectionName}
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

      {visible && (
        <AddForm
          section={sectionName}
          api={api}
          show={visible}
          hide={() => {
            setSelected();
            setVisible(false);
          }}
          selected={selected}
          refresh={() => setRefresh((prev) => !prev)}
        />
      )}

      {showDelete && (
        <DeleteModal
          title={lang("Delete Profile")}
          subtitle={lang(`Are you sure you want to Delete this Profile?`)}
          show={showDelete}
          hide={() => {
            setShowDelete(false);
            setSelected();
          }}
          onOk={() => onDelete(selected?._id)}
          reasons={DeleteRestaurantReasons}
        />
      )}

      {showStatus && (
        <DeleteModal
          title={`${
            selected?.is_active ? lang(`Block`) : lang(`UnBlock`)
          } ${lang("Sub Admin")}`}
          subtitle={`${lang("Are you sure you want to")} ${
            selected?.is_active ? lang(`block`) : lang(`unblock`)
          } ${lang("this sub admin?")}`}
          show={showStatus}
          hide={() => {
            setShowStatus(false);
            setSelected();
          }}
          reasons={selected?.is_active ? DeleteRestaurantReasons : []}
          onOk={(message) => handleChangeStatus(selected?._id, message)}
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

      {showMessage && (
        <DeleteModal
          title={lang("Delete Profile")}
          subtitle={lang(
            "This Profile contains provider Service Profile, please remove  this provider from provider before deleting Profile"
          )}
          show={showMessage}
          hide={() => {
            setShowMessage(false);
          }}
          onOk={() => setShowMessage(false)}
          reasons={[]}
        />
      )}

      {showStatusMessage && (
        <DeleteModal
          title={lang("Delete Profile")}
          subtitle={lang(
            "This Profile contains provider Service Profile, please Deactivate  this provider from provider before delete Profile"
          )}
          show={showStatusMessage}
          hide={() => {
            setShowStatusMessage(false);
          }}
          onOk={() => setShowStatusMessage(false)}
          reasons={[]}
        />
      )}
    </>
  );
}

export default Index;
