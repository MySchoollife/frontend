import { Row, Col, Card, Button, Skeleton, Avatar, Image, Tooltip, Table, Tag } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useRequest from "../../../hooks/useRequest";
import { ShowToast, Severty } from "../../../helper/toast";
import apiPath from "../../../constants/apiPath";
import { Badge } from 'antd';
import moment from 'moment';
import notfound from "../../../assets/images/not_found.png";
import { QuoteStatus } from "../../DeliveryHistory/Index";

function View() {

  const sectionName = "Customer";
  const routeName = "customer";
  const params = useParams();
  const { request } = useRequest();
  const [list, setList] = useState({});
  const [cars, setCars] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = (id) => {
    setLoading(true);
    request({
      url: apiPath.viewCustomer + "/" + id,
      method: 'GET',
      onSuccess: ({ data }) => {
        console.log(data);
        const { list, cars, requests } = data
        setLoading(false);
        setList(list);
        setCars(cars);
        setQuotes(requests);
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR)
      }
    })
  }

  useEffect(() => {
    fetchData(params.id)
  }, [])

  const carsColumns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_, { image }) => <Image width={50} src={image ? apiPath.assetURL + image : notfound} />
    },
    {
      title: "Make",
      dataIndex: "name",
      key: "name",
      render: (_, { make_id }) => {
        return make_id ? <span className="cap">{make_id?.name}</span> : '-';
      },
    },
    {
      title: "Model",
      dataIndex: "brand",
      key: "brand",
      render: (_, { model_id }) => {
        return model_id && model_id.name ? <span className="cap">{model_id.name}</span> : '-';
      },
    },
    {
      title: "Type",
      dataIndex: "category",
      key: "category",
      render: (_, { type_id }) => {
        return type_id && type_id.name ? <span className="cap">{type_id.name}</span> : '-';
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
  ];

  const columns = [
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
      render: (_, { category_id }) => {
        return category_id ? <span className="cap">{category_id.name}</span> : '-';
      },
    },
    {
      title: "Part Number",
      dataIndex: "part_number",
      key: "part_number",
      render: (_, { part_number, _id }) => {
        return part_number ? part_number : '-';
      },
    },
    {
      title: "Part Type",
      dataIndex: "part_type",
      key: "part_type",
      render: (_, { part_type }) => {
        return part_type ? <span className="cap">{part_type}</span> : '-';
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_, { status, _id }) => {
        let color = status === "complete" ? "green" : status === QuoteStatus.REQUEST ? "yellow" : status === QuoteStatus.RECEIVED ? "blue" : "magenta";
        return (
          <a><Tag onClick={(e) => !(status === QuoteStatus.FULLFILL) ? /* changeStatus(_id) */ null : null} color={color} key={status}>
            {
              status === QuoteStatus.REQUEST ? "Request" :
                status === QuoteStatus.RECEIVED ? "Received" :
                  status === QuoteStatus.FULLFILL ? "Requirement FullFilled" : null
            }
          </Tag></a>
        );
      },
    },
    {
      title: "Quote On",
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
            <Tooltip title="View Quote" color={"purple"} key={"viewquote"}>
              <Button onClick={(e) => navigate(`/quote/view/${record._id}`)}>
                <i className="fa fa-light fa-eye"></i>
              </Button>
            </Tooltip>
            {/* {
              record.status == QuoteStatus.RECEIVED &&
              <Tooltip title="View Quote Reply" color={"purple"} key={"viewquote"}>
                <Button onClick={(e) => {
                  setSelectedQuote(record._id)
                  showModal(true)
                }}>
                  <i className="fa fa-light fa-eye"></i>
                </Button>
              </Tooltip>
            } */}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Row gutter={16}>
        <Col span={24} xs={24}>
          <Card title={sectionName + " Details"}>

            {loading ? [1, 2, 3].map(item => <Skeleton active key={item} />) :
              <div className="view-main-list">

                <div className="view-inner-cls">
                  <h5>Image:</h5>
                  <h6>
                    {list && !list.image ?
                      <Avatar style={{ backgroundColor: "#00a2ae", verticalAlign: 'middle' }} className="cap" size={50}>
                        {list?.name?.charAt(0)}
                      </Avatar>
                      :
                      <Image className="image-radius" src={apiPath.assetURL + list.image} />
                    }
                  </h6>
                </div>

                <div className="view-inner-cls">
                  <h5>Name:</h5>
                  <h6><span className="cap">{list.name ? list.name : '-'}</span></h6>
                </div>

                <div className="view-inner-cls">
                  <h5>Email Address:</h5>
                  <h6>{list.email ? list.email : '-'}</h6>
                </div>

                <div className="view-inner-cls">
                  <h5>Phone Number:</h5>
                  <h6>{list ? '+' + list.country_code + '-' : '+965'}{list ? list.mobile_number : '-'}</h6>
                </div>

                <div className="view-inner-cls">
                  <h5>Location:</h5>
                  <h6>{list.location ? list.location : '-'}</h6>
                </div>

                <div className="view-inner-cls">
                  <h5>Status:</h5>
                  <h6>{list.is_active ? <Badge status="success" text="Active" /> : <Badge status="error" text="InActive" />}</h6>
                </div>

                <div className="view-inner-cls">
                  <h5>Registered On:</h5>
                  <h6>{list.created_at ? moment(list.created_at).format('DD-MMM-YYYY') : '-'}</h6>
                </div>

                <div className="view-inner-cls float-right">
                  <Link className="ant-btn ant-btn-primary" to={`/user/${routeName}`}>Back</Link>
                </div>

              </div>
            }

          </Card>
        </Col>
      </Row>

      <Card className="mt-3" title="Vehicles">
        <div className="tabled">
          <Row gutter={[24, 0]}>
            <Col xs={24} xl={24}>
              <div className="table-responsive customPagination">
                <Table
                  loading={loading}
                  columns={carsColumns}
                  dataSource={cars}
                  pagination={true}
                  className="ant-border-space"
                />
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      <Card className="mt-3" title="Quotes">
        <div className="tabled">
          <Row gutter={[24, 0]}>
            <Col xs={24} xl={24}>
              <div className="table-responsive customPagination">
                <Table
                  loading={loading}
                  columns={columns}
                  dataSource={quotes}
                  pagination={true}
                  className="ant-border-space"
                />
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </>
  );
}


export default View;
