import { Button, Input, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import EditIcon from "../../assets/images/edit.svg";
import ConfirmationBox from "../../components/ConfirmationBox";
import SectionWrapper from "../../components/SectionWrapper";
import apiPath from "../../constants/apiPath";
import { useAppContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";

function EmailTemplate() {
  const routeName = "email-templates";
  const { setPageHeading, country } = useAppContext();
  const heading = lang("Email Template");

  const api = {
    status: apiPath.statusEmailTemplate,
    list: apiPath.listEmailTemplate,
  };

  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();
  const { showConfirm } = ConfirmationBox();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const debouncedSearchText = useDebounce(searchText, 300);
  const navigate = useNavigate();

  const view = (id) => {
    navigate(`/${routeName}/view/${id}`);
  };

  const columns = [
    {
      title: lang("Title"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: lang("Subject"),
      dataIndex: "subject",
      key: "subject",
    },
    // {
    //   title: "Created On",
    //   key: "created_at",
    //   dataIndex: "created_at",
    //   render: (_, { created_at }) => {
    //     return (
    //       moment(created_at).format('DD-MMM-YYYY')
    //     );
    //   },
    // },
    {
      title: lang("Action"),
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            <Tooltip
              className="edit-cls btnStyle primary_btn"
              title={lang("Edit")}
              color={"purple"}
              key={"updateemail"}
            >
              <Button
                onClick={() => navigate(`/${routeName}/${record._id}/edit`)}
              >
                <img src={EditIcon} />
              </Button>
            </Tooltip>
            {/* <Tooltip
              className="btnStyle btnOutlineDelete"
              title={"View"}
              color={"purple"} key={"viewemail"}>
              <Button onClick={() => { view(record._id) }}>
                view
              </Button>
            </Tooltip> */}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    setPageHeading(heading);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData(pagination);
  }, [refresh, debouncedSearchText]);

  const fetchData = (pagination, filters) => {
    const filterActive = filters ? filters.is_active : null;

    request({
      url:
        api.list +
        `?status=${filterActive ? filterActive.join(",") : ""}&page=${
          pagination ? pagination.current : 1
        }&limit=${
          pagination ? pagination.pageSize : 10
        }&search=${debouncedSearchText}`,
      method: "GET",
      onSuccess: (data) => {
        setLoading(false);
        setList(data.data.list.docs);
        setPagination((prev) => ({
          current: pagination.current,
          total: data.data.list.totalDocs,
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
    console.log(pagination, filters);
    fetchData(pagination, filters);
  };

  const onSearch = (e) => {
    setSearchText(e.target.value);
    setPagination({ current: 1 });
  };

  return (
    <>
      <SectionWrapper
        cardHeading={lang("Email Templates")}
        extra={
          <>
            <div className="w-100 text-head_right_cont">
              <div className="pageHeadingSearch">
                <Input.Search
                  className="searchInput"
                  placeholder={lang("Search by title")}
                  onChange={onSearch}
                  allowClear
                />
              </div>
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
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["10", "20", "30", "50"],
            }}
            onChange={handleChange}
            className="ant-border-space"
          />
        </div>
      </SectionWrapper>
    </>
  );
}

export default EmailTemplate;
