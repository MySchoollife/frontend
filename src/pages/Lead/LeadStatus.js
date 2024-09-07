import { Button, Table, Tooltip, Select, Modal, Input } from "antd";
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
import { BlockSubAdmin, rolesOptions } from "../../constants/var";
// import CheckIcon from "../../assets/images/check.svg"
import Lottie from "react-lottie";
import ViewLogs from "../../components/ViewLogs";
import * as success from "../../assets/animation/success.json";
import { DeleteSubadmin } from "../../constants/reasons";
import { DownloadExcel } from "../../components/ExcelFile";

import moment from "moment";
import { useNavigate } from "react-router";
import AddStatus from "./AddStatus";

function LeadList() {
  const { setPageHeading, country } = useContext(AppStateContext);

  const sectionName = lang("Lead Status");
  const routeName = "status";

  const api = {
    addEdit: apiPath.addEditLeadStatus,
    list: apiPath.listLeadStatus,
  };

  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState();
  const [showDelete, setShowDelete] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const debouncedSearchText = useDebounce(searchText, 300);
  const [searchCity, setSearchCity] = useState("");
  const debouncedSearchCity = useDebounce(searchCity, 300);
  const [showMessage, setShowMessage] = useState(false);
  const [role, setRole] = useState([]);
  const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    country_id: undefined,
    city_id: undefined,
    year: undefined,
    month: undefined,
    status: undefined,
    role_id: undefined,
  });

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
      width: "4px",
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
      sorter: true,
      width: "4px",
      render: (_, { name }) => {
        return name;
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
            <>
              <Tooltip
                title={lang("Edit")}
                color={"purple"}
                key={"update" + routeName}
              >
                <Button
                  title="Edit"
                  className="edit-cl primary_btn"
                  onClick={(e) => {
                    setVisible(true);
                    setSelected(record);
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
          </>
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

  const fetchData = (pagination, filters, sorter) => {
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
        `?page=${pagination ? pagination.current : 1}&pageSize=${
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
  }, [refresh, debouncedSearchText, filter, country?.country_id]);

  useEffect(() => {
    setPageHeading(`${lang("Lead")} ${lang("Management")}`);
  }, []);

  const onSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <SectionWrapper
        cardHeading={lang("All Leads") + " " + lang("Status")}
        extra={
          <>
            <div className="w-100 text-head_right_cont">
              <div className="pageHeadingSearch">
                <Input.Search
                  className="searchInput"
                  placeholder={lang("Search by status name")}
                  onChange={onSearch}
                  allowClear
                />
              </div>

              <Button
                className="primary_btn btnStyle"
                onClick={(e) => setVisible(true)}
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
        <div className="table-responsive customPagination withOutSearilNo">
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
        <AddStatus
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

      {showDelete && (
        <DeleteModal
          title={lang("Delete Lead Status")}
          subtitle={lang(`Are you sure you want to Delete this lead status?`)}
          show={showDelete}
          hide={() => {
            setShowDelete(false);
            setSelected();
          }}
          onOk={() => onDelete(selected?._id)}
          reasons={[]}
        />
      )}
    </>
  );
}

export default LeadList;
