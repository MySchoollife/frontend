import {Row, Col, Card, Table, Button, Input, Tag, Tooltip, Image} from "antd";
import React, { useState, useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import { ShowToast, Severty } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import ShowTotal from "../../components/ShowTotal";
import { useNavigate } from "react-router";
import ConfirmationBox from "../../components/ConfirmationBox";
import apiPath from "../../constants/apiPath";
import moment from 'moment';
import notfound from "../../assets/images/not_found.png";
import { Link } from "react-router-dom";
import EditIcon from "../../assets/images/edit.svg";
const Search = Input.Search;

function Index() {

  const sectionName   =   "Blog";
  const routeName     =   "blog";

  const api = {
    status  : apiPath.statusBlog,
    list    : apiPath.listBlog
  }
  const [searchText, setSearchText] = useState('');
  const { request } = useRequest()
  const [list, setList] = useState([])
  const { showConfirm } = ConfirmationBox()
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const debouncedSearchText = useDebounce(searchText, 300);
  const navigate = useNavigate();

  const view = (id) => {
    navigate(`/${routeName}/view/${id}`)
  }

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_, { thumbnail }) => <Image width={60} src={thumbnail ? thumbnail : notfound} />
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      key: "is_active",
      filters: [
        {
          text: 'Active',
          value: true,
        },
        {
          text: 'Inactive',
          value: false,
        },
      ],
      render: (_, { is_active, _id }) => {
        let color = is_active ? 'green' : 'red';
        return ( <a><Tag onClick={(e) => showConfirm({record : _id, path : api.status, onLoading : ()=>setLoading(true), onSuccess : ()=>setRefresh(prev => !prev)})} color={color} key={is_active}>{is_active ? "Active" : "Inactive"}</Tag></a> );
      },
    },
    {
      title: "Created On",
      key: "created_at",
      dataIndex: "created_at",
      render: (_, { created_at }) => {
        return (
          moment(created_at).format('DD-MMM-YYYY')
        );
      },
    },
    {
      title: "Action",
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <Tooltip title={"Update " + sectionName} color={"purple"} key={"update"+routeName}>
              <Link className="ant-btn ant-btn-default" title="Edit" to={`/${routeName}/update/`+ (record ? record._id : null)}><img src={EditIcon} />
              </Link></Tooltip>
            <Tooltip title={"View " + sectionName} color={"purple"} key={"viewblog"+routeName}>
              <Link className="ant-btn ant-btn-default" title="View" to={`/${routeName}/view/${record._id}`} ><i className="fa fa-light fa-eye"></i>
              </Link></Tooltip>
          </>
        );
      },
    },
  ];


  useEffect(() => {
    setLoading(true)
    fetchData(pagination)
  }, [refresh, debouncedSearchText])


  const fetchData = (pagination, filters) => {
    const filterActive = filters ? filters.is_active : null

    request({
      url: api.list + `?status=${filterActive ? filterActive.join(',') : ''}&page=${pagination ? pagination.current : 1}&limit=${pagination ? pagination.pageSize : 10}&search=${debouncedSearchText}`,
      method: 'GET',
      onSuccess: (data) => {
        setLoading(false)
        setList(data.data.list.docs)
        setPagination(prev => ({ current: pagination.current, total: data.data.list.totalDocs }))
      },
      onError: (error) => {
        console.log(error)
        setLoading(false)
        ShowToast(error, Severty.ERROR)
      }
    })
  }

  const handleChange = (pagination, filters) => {
    fetchData(pagination, filters);
  }

  const onSearch = (e) => {
    setSearchText(e.target.value)
    setPagination({ current: 1 })
  };

  return (
    <>
      <div className="tabled blog">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title={sectionName + " Management"}
              extra={
                <>
                  <Search
                    allowClear
                    size="large"
                    onChange={onSearch}
                    value={searchText}
                    onPressEnter={onSearch}
                    placeholder="Search By Title"
                  />
                  <div className="button_group justify-content-end w-100">
                    <Link className="ant-btn ant-btn-default" to={`/${routeName}/add`}>Add {sectionName}</Link>
                  </div>
                </>
              }
            >
              <h4 className="text-right mb-1">{pagination.total ? ShowTotal(pagination.total) : ShowTotal(0)}</h4>
              <div className="table-responsive customPagination">
                <Table
                  loading={loading}
                  columns={columns}
                  dataSource={list}
                  pagination={{ defaultPageSize: 10, responsive: true, total: pagination.total, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '30', '50']}}
                  onChange={handleChange}
                  className="ant-border-space"
                />
              </div>

            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Index;
