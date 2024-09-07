import { Button, Col, Modal, Rate, Row } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";

import AgentImg from "../../assets/images/face-1.jpg";
import Currency from "../../components/Currency";
import { dateString, formatPhone } from "../../helper/functions";
import lang from "../../helper/langHelper";

const ViewModal = ({ show, hide, data }) => {
  const [order, setOrder] = useState();

  useEffect(() => {
    if (!data) return;
    console.log("data", data);
    setOrder(data);
  }, [data]);

  return (
    <Modal
      open={show}
      width={950}
      okText="Add"
      onCancel={hide}
      cancelText={null}
      footer={[
        <Button key="okay" type="primary" onClick={hide}>
          {lang("Okay")}
        </Button>,
      ]}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="tab_modal edit_orders"
    >
      <h4 className="modal_title_cls">{lang("Order Details")}</h4>
      <div className="order-head">
        <h4>{order?.restaurant_id?.name}</h4>
        <span>
          <Rate disabled defaultValue={0} />
          <span className="no-rating">0</span>(0 {lang("Reviews")})
        </span>
        <p>Order ID : {order?.uid}</p>
      </div>
      <Row gutter={[45, 0]}>
        <Col span={24} sm={24} lg={12}>
          <div className="order-dtl-card">
            <div className="order-header">
              <h3>{lang("Order Details")}</h3>
              <p>{dateString(order?.created_at)}</p>
            </div>

            <div className="order-dtl-list">
              {order?.items?.map((item, index) => (
                <div className="single-order-dtl" key={index}>
                  <div className="order-dtl-left">
                    <h6>{item.qty} x</h6>
                  </div>
                  <div className="order-middle">
                    <h4>
                      {item.qty} x {item?.food_id?.name}
                    </h4>
                  </div>
                  <div className="order-right">
                    <h4>
                      <Currency price={item.price} />
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order?.customer_id && (
            <div className="order-dtl-card">
              <div className="order-header">
                <h3>{lang("Customer Details")}</h3>
              </div>
              <div className="customer-dtl">
                <div className="customer-info">
                  <h6>Name :</h6>
                  <h5>{order?.customer_id?.name}</h5>
                </div>
                <div className="customer-info">
                  <h6>Phone Number :</h6>
                  <h5>
                    {formatPhone(
                      order?.customer_id?.country_code,
                      order?.customer_id?.mobile_number,
                    )}
                  </h5>
                </div>
                <div className="customer-info">
                  <h6>Address :</h6>
                  <h5>{order?.address?.address}</h5>
                </div>
              </div>
            </div>
          )}

          <div className="order-dtl-card">
            <div className="order-header">
              <h3>{lang("Bill Summary")}</h3>
            </div>
            <div className="customer-dtl">
              <div className="bill-info">
                <h6>Basket Total</h6>
                <h5>
                  <Currency price={order?.total_amount} />
                </h5>
              </div>
              <div className="bill-info">
                <h6>Delivery Fee:</h6>
                <h5>
                  <Currency price={order?.delivery_fee} />
                </h5>
              </div>
              <div className="bill-info">
                <h6>10% Discount</h6>
                <h5>
                  <Currency price={-order?.discount} />
                </h5>
              </div>
              <div className="bill-info">
                <h6>Tip</h6>
                <h5>
                  <Currency price={order?.tip} />
                </h5>
              </div>
            </div>
            <div className="total-price">
              <div className="bill-info">
                <h6>TOTAL</h6>
                <h5>
                  <Currency price={order?.total_payable} />
                </h5>
              </div>
            </div>
          </div>
        </Col>

        <Col span={24} sm={24} lg={12}>
          <div className="order-dtl-card">
            <div className="order-header">
              <h3>Delivery</h3>
            </div>
            <div className="customer-dtl">
              <div className="bill-info">
                <h6>Status</h6>
                <h5 className="cap">{order?.status}</h5>
              </div>
              <div className="bill-info">
                <h6>Order Type</h6>
                <h5>{order?.type}</h5>
              </div>
              <div className="bill-info">
                <h6>Payment Mode</h6>
                <h5 style={{ textTransform: "uppercase" }}>
                  {order?.payment_mod}
                </h5>
              </div>
              <div className="bill-info">
                <h6>Delivery Distance</h6>
                <h5>
                  {order?.distance
                    ? `${order?.distance.toFixed(1)} K.M`
                    : "0 K.M"}
                </h5>
              </div>
            </div>
          </div>

          {order?.driver_id && (
            <div className="order-dtl-card">
              <div className="order-header">
                <h3>{lang("Delivery Agent Details")}</h3>
              </div>
              <div className="customer-dtl">
                <div className="delivery-agent-dtl">
                  <div className="agent-img">
                    <img src={order?.driver_id?.image} />
                  </div>
                  <div className="agent-info">
                    <div className="customer-info">
                      <h6>Name :</h6>
                      <h5>{order?.driver_id?.name}</h5>
                    </div>
                    <div className="customer-info">
                      <h6>Phone Number :</h6>
                      <h5>
                        {formatPhone(
                          order?.driver_id?.country_code,
                          order?.driver_id?.mobile_number,
                        )}
                      </h5>
                    </div>
                    <div className="customer-info">
                      <h6>Vehicle No. :</h6>
                      <h5>{order?.driver_id?.vehicle?.rc_number}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Modal>
  );
};

export default ViewModal;
