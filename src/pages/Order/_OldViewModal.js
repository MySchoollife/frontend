import { Button, Col, Modal, Rate, Row } from "antd";
import React, { useEffect, useState } from "react";

import Currency from "../../components/Currency";
import { dateString, formatPhone } from "../../helper/functions";
import lang from "../../helper/langHelper";

const ViewModal = ({ show, hide, data }) => {
  const [order, setOrder] = useState();
  const [deliveryStatus, setDeliveryStatus] = useState("");

  const DriverOrderStatus = {
    CANCEL: "cancelled",
    PENDING: "pending",
    ACCEPT: "confirmed",
    ARRIVED: "arrived at restaurant",
    PICKUP: "picked up",
    DROP: "arrived at drop location",
    OUT: "out for delivery",
    DELIVERED: "delivered",
  };

  const driverStatus = (order) => {
    let status = "Driver not assigned";
    if (
      order?.driver_status === DriverOrderStatus.ACCEPT ||
      order?.driver_status == "accepted"
    ) {
      status = "Driver assigned";
      setDeliveryStatus("Driver assigned");
    } else if (order?.driver_status === DriverOrderStatus.ARRIVED) {
      status = "Driver at restaurant";
      setDeliveryStatus("Driver at restaurant");
    } else if (order?.driver_status === DriverOrderStatus.DROP) {
      status = "Arrived at customer";
    } else if (order?.driver_status === DriverOrderStatus.PICKUP) {
      status = "Order Picked Up";
    } else if (order?.driver_status === DriverOrderStatus.DELIVERED) {
      status = "Delivered";
    } else if (order?.driver_status === DriverOrderStatus.CANCEL) {
      if (order?.cancelled_by == "Vendor") status = "Rejected by Restaurant";
      else setDeliveryStatus("Cancelled");
    } else {
      // status = order?.driver_status;
      if (order?.status == "processing") status = "Looking for driver";
      if (order?.status == "cancelled") {
        status = "Cancelled";
        setDeliveryStatus("Cancelled");
      }
      if (order?.status == "cancelled" && order?.cancelled_by == "Vendor") {
        status = "Rejected by Restaurant";
        setDeliveryStatus("Rejected by Restaurant");
      }
    }
    setDeliveryStatus(status);
  };

  useEffect(() => {
    if (!data) return;
    console.log(data);
    setOrder(data);
    driverStatus(data);
    console.log("order---", data);
  }, [data]);

  return (
    <Modal
      open={show}
      width={950}
      okText={lang("Add")}
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
        <p>
          {lang("Order ID")}: {order?.uid}
        </p>
      </div>
      <Row gutter={[45, 0]}>
        <Col span={24} sm={24} lg={12}>
          <div className="order-dtl-card">
            <div className="order-header">
              <h3>{lang("Order Details")}</h3>
              <p>{dateString(order?.created_at, "lll")}</p>
            </div>

            <div className="order-dtl-list">
              {order?.items?.map((item, index) => (
                <div className="single-order-dtl mb-2" key={index}>
                  <div className="order-dtl-left">
                    <h6>{item.qty} x</h6>
                  </div>
                  <div className="order-middle w-100">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4>{item?.food_id?.name}</h4>
                      {item?.food_id?.name ? (
                        <span style={{ color: "black" }}>
                          {" "}
                          <Currency price={item?.total_price} />
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <p>{item?.size_id?.name}</p>

                    {item?.choice && item?.choice?.length > 0 && (
                      <h6
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          margin: "10px 0px 0px",
                        }}
                      >
                        ||
                        {item?.choice
                          ? item?.choice
                              ?.map((choice, index) => {
                                return choice.choice_id?.name;
                              })
                              ?.join(", ")
                          : ""}
                        ||{" "}
                      </h6>
                    )}

                    <p
                      style={{
                        fontSize: "14px",
                        margin: "0px 0px 5px",
                        fontWeight: 500,
                      }}
                    >
                      {item?.choice ? (
                        <ul>
                          {item.choice.map((choice, index) => (
                            <li className="order-option" key={index}>
                              {choice.options.map((option, optionIndex) => (
                                <div
                                  className="product-item-inn"
                                  key={optionIndex}
                                >
                                  {option}
                                </div>
                              ))}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        ""
                      )}
                    </p>

                    {item?.add_on_with_qty &&
                      item?.add_on_with_qty?.length > 0 && (
                        <>
                          {Object.entries(
                            item?.add_on_with_qty.reduce(
                              (accumulator, addOn) => {
                                const category = addOn?.add_cat_id?.name;
                                if (!accumulator[category]) {
                                  accumulator[category] = [];
                                }
                                accumulator[category].push(addOn);
                                return accumulator;
                              },
                              {},
                            ),
                          ).map(([category, addOns], categoryIndex) => (
                            <div key={categoryIndex}>
                              {/* Render Add-On Category */}
                              <p
                                style={{
                                  fontSize: "14px",
                                  margin: "5px 0px",
                                  fontWeight: 600,
                                }}
                              >
                                <h6
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    margin: "10px 0px 0px",
                                  }}
                                >
                                  || {category} ||
                                </h6>
                              </p>
                              {/* Render Ingredients under each category */}
                              {addOns.map((addOn, index) => (
                                <div key={index}>
                                  {addOn?.ingredient_ids.map(
                                    (ingredient, ingredientIndex) => (
                                      <p
                                        key={ingredientIndex}
                                        style={{
                                          fontSize: "14px",
                                          margin: "0px",
                                          fontWeight: 500,
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                        }}
                                      >
                                        <p>
                                          {ingredient?.qty ? (
                                            <strong>{ingredient?.qty}X</strong>
                                          ) : (
                                            ""
                                          )}{" "}
                                          {ingredient?.id?.name &&
                                            ` ${ingredient?.id?.name} `}
                                          {ingredient?.size?.name !== "Regular"
                                            ? `(${ingredient?.size?.name})`
                                            : ""}
                                        </p>

                                        {ingredient?.price && (
                                          <span style={{ color: "black" }}>
                                            {" "}
                                            <Currency
                                              price={ingredient?.price}
                                            />
                                          </span>
                                        )}
                                      </p>
                                    ),
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </>
                      )}
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
                  <h6>{lang("Name ")}:</h6>
                  <h5>{order?.customer_id?.name}</h5>
                </div>
                <div className="customer-info">
                  <h6>{lang("Phone Number ")}:</h6>
                  <h5>
                    {formatPhone(
                      order?.customer_id?.country_code,
                      order?.customer_id?.mobile_number,
                    )}
                  </h5>
                </div>
                <div className="customer-info">
                  <h6>{lang("Address ")}:</h6>

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
                <h6>{lang("Order Total ")}</h6>
                <h5>
                  <Currency price={order?.total_amount} />
                </h5>
              </div>

              {
                <div className="bill-info">
                  <h6>{lang("Discount")}</h6>
                  <h5>
                    <Currency price={-order?.discount ?? 0} />
                  </h5>
                </div>
              }

              {
                <div className="bill-info">
                  <h6>
                    {lang("Platform Commission - Restaurant")}
                    {`(${order?.restaurant_id?.commission_rate}%)`}
                  </h6>
                  <h5>
                    <Currency
                      price={order?.platform_commission?.restaurant ?? 0}
                    />
                  </h5>
                </div>
              }

              <div className="bill-info">
                <h6>
                  {lang("Tax")}
                  {`(${order?.restaurant_id?.tax}%)`}
                </h6>
                <h5>
                  <Currency price={order?.tax} />
                </h5>
              </div>

              <div className="bill-info">
                <h6>{lang("Total (For Restaurant) ")}</h6>
                <h5>
                  <Currency
                    price={
                      order?.total_amount -
                        order?.discount -
                        (order?.platform_commission?.restaurant ?? 0) +
                        (order?.tax ?? 0) ?? 0
                    }
                  />
                </h5>
              </div>

              {order?.type === "Delivery" && (
                <div className="bill-info">
                  <h6>{lang("Delivery Fee")}:</h6>
                  <h5>
                    <Currency price={order?.delivery_fee} />
                  </h5>
                </div>
              )}

              {order?.driver_id ? (
                <div className="bill-info">
                  <h6>
                    {lang("Platform Commission - Delivery")}
                    {`(${order?.driver_id?.commission_percentage}%)`}
                  </h6>
                  <h5>
                    <Currency price={order?.platform_commission?.driver ?? 0} />
                  </h5>
                </div>
              ) : null}

              {
                <div className="bill-info">
                  <h6>{lang("Total Platform Commission")}</h6>
                  <h5>
                    <Currency
                      price={
                        (order?.platform_commission?.driver ?? 0) +
                          (order?.platform_commission?.restaurant ?? 0) ?? 0
                      }
                    />
                  </h5>
                </div>
              }

              {order?.tip ? (
                <div className="bill-info">
                  <h6>{lang("Tip")}</h6>
                  <h5>
                    <Currency price={order?.tip} />
                  </h5>
                </div>
              ) : null}
            </div>

            <div className="total-price">
              <div className="bill-info">
                <h6>{lang("TOTAL Order ")}</h6>
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
              <h3>{lang("Delivery")}</h3>
            </div>
            <div className="customer-dtl">
              <div className="bill-info">
                <h6>{lang("Status")}</h6>
                <h5 className="cap">{order?.status}</h5>
              </div>
              <div className="bill-info">
                <h6>{lang("Order Type")}</h6>
                <h5>{order?.type}</h5>
              </div>
              <div className="bill-info">
                <h6>{lang("Payment Mode")}</h6>
                <h5 style={{ textTransform: "uppercase" }}>
                  {order?.payment_mod === "cod"
                    ? "Cash on Delivery"
                    : order?.payment_mod}
                </h5>
              </div>
              <div className="bill-info">
                <h6>{lang("Delivery Distance")}</h6>
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
                      <h6>{lang("Delivery Status")}:</h6>
                      <h5>{deliveryStatus}</h5>
                    </div>
                    <div className="customer-info">
                      <h6>{lang("Name ")}:</h6>
                      <h5>{order?.driver_id?.name}</h5>
                    </div>
                    <div className="customer-info">
                      <h6>{lang("Phone Number ")}:</h6>
                      <h5>
                        {formatPhone(
                          order?.driver_id?.country_code,
                          order?.driver_id?.mobile_number,
                        )}
                      </h5>
                    </div>
                    <div className="customer-info">
                      <h6>{"Vehicle No. "}:</h6>
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
