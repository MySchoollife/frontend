import { Button, Card, Col, Row, Table, Tooltip } from "antd";
import moment from "moment";
import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import Money from "../../assets/images/money-w.png";
import Reve from "../../assets/images/revenue.png";
import Solar from "../../assets/images/solar_cart.png";
import Currency from "../../components/Currency";
import apiPath from "../../constants/apiPath";
import { Months } from "../../constants/var";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import SectionWrapper from "../../components/SectionWrapper";
import Payment from "./Payment";
import ViewModal from "./_ViewModal";

function InvoiceView() {
  const [selectedTab, setSelectedTab] = useState("RecentInvoice");

  return (
    <>
      <div className="tabled quoteManagement">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24">
              <RecentInvoice selectedTab={selectedTab} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

const RecentInvoice = ({ selectedTab }) => {
  const [list, setList] = useState([]);
  const [list2, setList2] = useState([]);
  const [invoice, setInvoice] = useState();
  const [loading, setLoading] = useState(false);
  const [paymentModal, showPaymentModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [month, setMonth] = useState();
  const [selected, setSelected] = useState([]);
  const [show, setShow] = useState(false);
  const { request } = useRequest();

  const { id } = useParams();

  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleChange = (pagination, filters) => {
    fetchData(pagination, filters);
  };

  const fetchData = (pagination, status) => {
    setLoading(true);
    const payload = {};
    payload.page = pagination ? pagination.current : 1;
    payload.pageSize = pagination ? pagination?.pageSize : 10;

    const queryString = Object.entries(payload)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");

    request({
      url:
        `${apiPath.finance}/${id}` + `${queryString ? `?${queryString}` : ""}`,
      method: "GET",
      onSuccess: ({ data, total, status, orders, discount_orders }) => {
        setLoading(false);
        if (status) {
          setList(orders);
          setList2(discount_orders);
          setInvoice(data);
          const month = Months.find((item) => item.value == data.month);
          console.log(month, "month");
          setMonth(month);
          setPagination((prev) => ({
            ...prev,
            current: pagination.current,
            total: total,
          }));
        }
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error.response.data.errors[0].message, Severty.ERROR);
      },
    });
  };

  useEffect(() => {
    //  setLoading(true);
    fetchData(pagination);
  }, [refresh, selectedTab]);

  const columns = [
    {
      title: "Order id",
      render: (_, { uid }) => `#${uid}`,
    },
    {
      title: "customer",
      dataIndex: "name",
      render: (_, { customer_id }) =>
        customer_id ? (
          <div style={{ display: "flex", gap: 2, flexDirection: "column" }}>
            {customer_id?.name && (
              <span className="cap">{customer_id.name}</span>
            )}
            {customer_id?.country_code && customer_id?.mobile_number && (
              <span className="cap" style={{ fontSize: "14px", color: "gray" }}>
                ({customer_id.country_code}) {customer_id.mobile_number}
              </span>
            )}
            {customer_id?.email && (
              <span style={{ fontSize: "14px", color: "gray" }}>
                {customer_id.email}
              </span>
            )}
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Order Items",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (_, { items }) =>
        items ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {items.map((item, index) => {
              return (
                <span
                  className="cap"
                  key={index}
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  {item?.food_id?.name + " X " + item?.qty}
                </span>
              );
            })}
          </div>
        ) : (
          "-"
        ),
    },
    // {
    //   title: "QYT",
    //   dataIndex: "pickup_point",
    //   key: "pickup_point",
    // },
    {
      title: "Payment Type",
      dataIndex: "payment_type",
      render: (_, { payment_mod }) =>
        payment_mod == "cod" ? `Cash on Delivery` : `Online`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (_, { created_at }) => moment(created_at).format("ll"),
    },
    // {
    //   title: "Order Type",
    //   dataIndex: "order_type",
    //   key: "order_type",
    // },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (_, { total_payable }) =>
        total_payable ? (
          <span className="cap">
            <Currency price={total_payable} />
          </span>
        ) : (
          "-"
        ),
    },
    {
      title: lang("Platform Commission"), //TODO: pending
      key: "admin_commission",
      render: (_, { platform_commission }) =>
        platform_commission ? (
          <span className="cap">
            <Currency price={platform_commission.restaurant} />
          </span>
        ) : (
          "-"
        ),
    },
    {
      title: "Action",
      render: (_, record) => {
        return (
          <>
            <Tooltip title="View Detail" color={"purple"} key={"viewDetail"}>
              <Button
                className="ms-sm-2 mt-xs-2 primary_btn btnStyle"
                onClick={(e) => {
                  setSelected(record);
                  setShow(true);
                }}
              >
                View Details
              </Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
      <>
        <div className="tabled categoryService">
          <Row gutter={[24, 0]}>
            <Col xs={24} xl={24}>
              <Card
                bordered={false}
                className="cap criclebox tablespace mb-24"
                title={
                  <>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(-1)}
                      className="arrow-ic me-1"
                    >
                      <ArrowLeftOutlined />
                    </div>
                    <div className="title-left ">
                      <h4>{month ? month.label : ""} Invoice</h4>
                    </div>
                  </>
                }
              >
                <div className="collection_dtl_body">
                  <Row gutter={24} style={{ padding: "6px 14px" }}>
                    <Col span={24} xxl={12} className="sm-padding-0">
                      <Row gutter={24}>
                        <Col xs={24} xl={12} xxl={10} className="sm-padding-0">
                          <div className="number">
                            {/* <Row align="middle" gutter={[24, 0]}>
                                <Col xs={6}>
                                  <div className="icon_box">
  
                                  </div>
                                </Col>
                                <Col xs={18}>
                                  <span>{'total Orders'}</span>
                                  <p className="ftp_text">25k</p>
                                  <Title level={3}>{ }</Title>
                                </Col>
                              </Row> */}
                            <div className="cls-total">
                              <div className="sales-img-icon">
                                <img src={Solar}></img>
                              </div>
                              <div className="sales-text-outer">
                                <h6>{"total Orders"}</h6>
                                <h4>{pagination ? pagination.total : 0}</h4>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} xl={12} xxl={14} className="sm-padding-0">
                          <div className="number">
                            {/* <Row align="middle" gutter={[24, 0]}>
                                <Col xs={18}>
                                  <span>{'total Sales (COD + Online Sales)'}</span>
                                  <p className="ftp_text">AED 61,000 </p>
                                  <Title level={3}>{ }</Title>
                                </Col>
                                <Col xs={6}>
                                  <div className="icon_box">
  
                                  </div>
                                </Col>
                              </Row> */}
                            <div className="cls-total">
                              <div className="sales-img-icon">
                                <img src={Reve}></img>
                              </div>
                              <div className="sales-text-outer">
                                <h6>{"total Sales (COD + Online Sales)"}</h6>

                                <h4>
                                  <Currency
                                    price={
                                      invoice ? invoice.total_online_and_cod : 0
                                    }
                                  />{" "}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>

                    <Col span={24} xxl={12} className="sm-padding-0">
                      <Card className="collection_card">
                        <div className="cls-total received-amt collection-inner">
                          <div className="sales-img-icon">
                            <img src={Money}></img>
                          </div>
                          <div className="sales-text-outer ">
                            <h6>
                              {invoice
                                ? invoice.who_pay == "Admin"
                                  ? `Pay To Vendor`
                                  : `You Will Receive`
                                : ""}
                            </h6>
                            <h4>
                              <Currency
                                price={invoice ? invoice.remaining_amount : 0}
                              />{" "}
                            </h4>
                          </div>
                        </div>
                        <div className="invoice-btn-sec">
                          {invoice && invoice.who_pay == "Admin" && (
                            <div className="pay-btn">
                              <button onClick={() => showPaymentModal(true)}>
                                pay
                              </button>
                            </div>
                          )}
                          {/* <div className="view-more-btn">
                            <button>View Details</button>
                          </div> */}
                          <div className="view-dawnload-btn">
                            <button>
                              <i class="fas fa-arrow-down me-2"></i>
                              Download Invoice
                            </button>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
                <div></div>
              </Card>
            </Col>
          </Row>
        </div>
        <Card bordered={false} className="criclebox tablespace mb-24">
          <SectionWrapper cardHeading={"Order Without Discount"}>
            <div className="table-responsive customPagination">
              <Table
                loading={loading}
                columns={columns}
                dataSource={list}
                // pagination={{
                //   defaultPageSize: 10,
                //   responsive: true,
                //   total: pagination.total,
                //   showSizeChanger: true,
                //   showQuickJumper: true,
                //   pageSizeOptions: ["10", "20", "30", "50"],
                // }}
                pagination={true}
                // onChange={handleChange}
                className="ant-border-space"
              />
            </div>
          </SectionWrapper>
        </Card>
        <Card bordered={false} className="criclebox tablespace mb-24">
          <SectionWrapper cardHeading={"Order With Discount"}>
            <div className="table-responsive customPagination">
              <Table
                loading={loading}
                columns={columns}
                dataSource={list2}
                // pagination={{
                //   defaultPageSize: 10,
                //   responsive: true,
                //   total: pagination.total,
                //   showSizeChanger: true,
                //   showQuickJumper: true,
                //   pageSizeOptions: ["10", "20", "30", "50"],
                // }}
                pagination={true}
                // onChange={handleChange}
                className="ant-border-space"
              />
            </div>
          </SectionWrapper>
        </Card>
      </>
      {paymentModal && (
        <Payment
          show={paymentModal}
          hide={() => showPaymentModal(false)}
          data={invoice}
        />
      )}
      {show && (
        <ViewModal
          show={show}
          hide={() => {
            setSelected();
            setShow(false);
          }}
          data={selected}
          refresh={() => setRefresh((prev) => !prev)}
        />
      )}
    </>
  );
};

export default InvoiceView;
