import {
  Button,
  Col,
  Form,
  Modal,
  Rate,
  Row,
  InputNumber,
  Select,
  Badge,
} from "antd";
import React, { useEffect, useState } from "react";

import Currency from "../../components/Currency";
import { dateString, formatPhone } from "../../helper/functions";
import lang from "../../helper/langHelper";
import { AddFood } from "./_AddFood";
import apiPath from "../../constants/apiPath";
import useRequest from "../../hooks/useRequest";
import { Severty, ShowToast } from "../../helper/toast";
import moment from "moment";
import { Timezone } from "../../helper/timezone";

const ViewModal = ({ show, hide, data, refreshList }) => {
  const { request } = useRequest();
  const [form] = Form.useForm();
  const [order, setOrder] = useState();
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [addItem, setAddItem] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isAddFoodModal, setIsAddFoodModal] = useState(false);
  const [orderedItems, setOrderedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [changeDriver, setChangeDriver] = useState(false);

  const [driver, setDriver] = useState(null);

  const [difference, setDifference] = useState(0);

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

  const OrderStatus = {
    ACCEPT: "accepted",
    PENDING: "pending",
    PROCESSING: "processing",
    READY: "ready to pickup",
    PICKUP: "picked up",
    CANCEL: "cancelled",
    DELIVERED: "delivered",
  };

  const RestOrderStatus = {
    PENDING: "pending",
    PROCESSING: "processing",
    READY: "ready to pickup",
    PICKUP: "picked up",
    CANCEL: "cancelled",
    DELIVERED: "delivered",
  };
  const Order = {
    scheduled: "Scheduled",
    "scheduled confirmed": "Scheduled confirmed",
    accepted: "Preparing Order",
    pending: "New Order",
    processing: "processing",
    "ready to pickup": "Ready for Pick Up",
    "picked up": "picked up",
    "out for delivery": "out for delivery",
    cancelled: "cancelled",
    delivered: "delivered",
  };

  const driverStatus = (order) => {
    let status = "Driver not assigned";
    if (
      order?.driver_status === DriverOrderStatus.ACCEPT ||
      order?.driver_status == "accepted"
    ) {
      status = "Driver assigned";
    } else if (order?.driver_status === DriverOrderStatus.ARRIVED) {
      status = "Driver at restaurant";
    } else if (order?.driver_status === DriverOrderStatus.DROP) {
      status = "Arrived at customer";
    } else if (order?.driver_status === DriverOrderStatus.PICKUP) {
      status = "Order Picked Up";
    } else if (order?.driver_status === DriverOrderStatus.DELIVERED) {
      status = "Delivered";
    } else if (order?.driver_status === DriverOrderStatus.CANCEL) {
      if (order?.cancelled_by == "Vendor") status = "Rejected by Restaurant";
      else status = "Cancelled";
    } else {
      // status = order?.driver_status;
      if (order?.status == "processing") status = "Looking for driver";
      if (order?.status == "cancelled") {
        status = "Cancelled";
      }
      if (order?.status == "cancelled" && order?.cancelled_by == "Vendor") {
        status = "Rejected by Restaurant";
      }
    }
    setDeliveryStatus(status);
  };

  const orderstatus = (order) => {
    let text;

    text = Order[order?.status];
    if (order?.status === OrderStatus.ACCEPT) {
      if (order?.restaurant_status === RestOrderStatus.PROCESSING) {
        text = "Preparing Order";
      } else {
        text = "New Order";
      }
    } else if (order?.status === OrderStatus.PROCESSING) {
      text = "Preparing";
    } else if (order?.status === OrderStatus.READY) {
      text = "Ready to pickup";
    } else if (order?.status === OrderStatus.PICKUP) {
      text = "Picked up by driver";
    } else if (order?.status === OrderStatus.DELIVERED) {
    } else if (order?.status === OrderStatus.CANCEL) {
      text = "Rejected";
    } else {
      if (order?.driver_status == "arrived at drop location")
        text = "Driver arrived at customer";
    }

    setOrderStatus(text);
  };

  const onUpdateOrder = () => {
    const payload = {
      // items: orderedItems,
      driver_id: driver,
    };
    request({
      url: apiPath.order + "/" + data?._id,
      method: "PUT",
      data: payload,
      onSuccess: ({ message, status }) => {
        if (status) {
          ShowToast(lang(message), Severty.SUCCESS);
          if (refreshList) refreshList();
          hide();
        }
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const getOrder = () => {
    request({
      url: apiPath.order + "/" + data?._id,
      method: "GET",
      onSuccess: ({ message, status, data, items }) => {
        setIsLoading(false);
        if (status) {
          setOrder(data);
          form.setFieldsValue({ ...data });
          setOrderedItems(data?.items);
        }
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR);
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    // if (!data) return;
    getOrder();
  }, [refresh]);

  useEffect(() => {
    const date1 = moment(data.created_at).tz(Timezone);
    const date2 = moment().tz(Timezone);

    const differenceInSeconds = date2.diff(date1, "seconds");

    // Calculate the difference between the two dates in minutes
    const differenceInMinutes = date2.diff(date1, "minutes");
    setDifference(differenceInSeconds);
  }, []);

  useEffect(() => {
    if (!data) return;
    console.log(data);
    setOrder(data);
    driverStatus(data);
    orderstatus(data);
    console.log("order---", data);
  }, [data]);

  return (
    <>
      <Modal
        open={show}
        width={950}
        okText={lang("Add")}
        onCancel={hide}
        cancelText={null}
        // footer={[
        //   <Button key="okay" type="primary" onClick={hide}>
        //     {lang("Okay")}
        //   </Button>,
        // ]}
        footer={[
          <>
            <Button key="cancel" type="primary" onClick={hide}>
              {lang("Back")}
            </Button>
            {driver && (
              <Button key="update" type="primary" onClick={onUpdateOrder}>
                {lang("Change Driver")}
              </Button>
            )}
          </>,
        ]}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="tab_modal edit_orders"
      >
        <h4 className="modal_title_cls">{lang("Order Details")}</h4>
        <div className="order-head">
          <h4>{order?.restaurant_id?.name}</h4>
          <span>
            <Rate
              disabled
              value={
                order?.restaurant_id?.rating ? order?.restaurant_id?.rating : 0
              }
            />
            <span className="no-rating">
              {order?.restaurant_id?.rating
                ? parseFloat(order.restaurant_id.rating).toFixed(1)
                : 0}
            </span>
            {" (" +
              (order?.restaurant_id?.review_count
                ? order?.restaurant_id.review_count
                : 0) +
              `(${lang("Reviews")}))`}
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

              <div className="order-dtl-list edit-order">
                {orderedItems?.map((item, idx) => (
                  <OrderItem
                    item={item}
                    order={order}
                    key={idx}
                    OrderStatus={OrderStatus}
                    refresh={() => setRefresh((prev) => !prev)}
                  />
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
                    <h6>{lang("Name")} :</h6>
                    <h5>{order?.customer_id?.name}</h5>
                  </div>
                  <div className="customer-info">
                    <h6>{lang("Phone Number ")} :</h6>
                    <h5>
                      {formatPhone(
                        order?.customer_id?.country_code,
                        order?.customer_id?.mobile_number,
                      )}
                    </h5>
                  </div>
                  <div className="customer-info">
                    <h6>{lang("Address")} :</h6>

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
                  <h6>{lang("Order Total")}</h6>
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
                      {`(${
                        order?.platform_commission_rates?.restaurant ??
                        order?.restaurant_id?.commission_rate
                      }%)`}
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
                  <h6>{lang("Total (For Restaurant)")}</h6>
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
                    <h6>{lang("Delivery Fee")} :</h6>
                    <h5>
                      <Currency price={order?.delivery_fee} />
                    </h5>
                  </div>
                )}

                {order?.is_free_delivery && (
                  <div className="bill-info">
                    <h6>
                      {lang("Delivery Discount")} (
                      {`${order?.delivery_coupon.code}`}):
                    </h6>
                    <h5>
                      <Currency price={-order?.delivery_discount} />
                    </h5>
                  </div>
                )}

                {order?.driver_id ? (
                  <div className="bill-info">
                    <h6>
                      {lang("Platform Commission - Delivery")}
                      {`(${
                        order?.platform_commission_rates?.driver ??
                        order?.driver_id?.commission_percentage
                      }%)`}
                    </h6>
                    <h5>
                      <Currency
                        price={order?.platform_commission?.driver ?? 0}
                      />
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
                  <h6>{lang("TOTAL Order")}</h6>
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
                  <h5 className="cap">{orderStatus}</h5>
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
            {!addItem && (
              <div className="addNewItem mb-24">
                {(order?.status === OrderStatus.PENDING ||
                  order?.status === OrderStatus.ACCEPT ||
                  order?.status === OrderStatus.PROCESSING) && (
                  <Button
                    onClick={() => {
                      setIsAddFoodModal(true);
                    }}
                    className="btn_primary"
                  >
                    {lang("Add New Item")}
                  </Button>
                )}
              </div>
            )}

            {order?.driver_id ? (
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
                        <h6>{lang("Name")} :</h6>
                        <h5>{data?.driver_id?.name}</h5>
                      </div>
                      <div className="customer-info">
                        <h6>{lang("Phone Number")} :</h6>
                        <h5>
                          {formatPhone(
                            data?.driver_id?.country_code,
                            data?.driver_id?.mobile_number,
                          )}
                        </h5>
                      </div>
                      {order?.driver_id?.vehicle?.rc_number ? (
                        <div className="customer-info">
                          <h6>{lang("Vehicle No. ")}:</h6>
                          <h5>{order?.driver_id?.vehicle?.rc_number}</h5>
                        </div>
                      ) : (
                        ""
                      )}
                      {(order?.status === OrderStatus.PENDING ||
                        order?.status === OrderStatus.ACCEPT ||
                        order?.status === OrderStatus.PROCESSING) &&
                        order?.type !== "Pickup" && (
                          <div className="changeDriver">
                            <Button
                              onClick={() => setChangeDriver(true)}
                              className="btn_primary"
                            >
                              {lang("Change Driver")}
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {!changeDriver &&
                  difference > 120 &&
                  (order?.status === OrderStatus.PENDING ||
                    order?.status === OrderStatus.ACCEPT ||
                    order?.status === OrderStatus.PROCESSING) &&
                  order?.type !== "Pickup" && (
                    <div className="changeDriver">
                      <Button
                        onClick={() => setChangeDriver(true)}
                        className="btn_primary"
                      >
                        {lang("Assign Driver")}
                      </Button>
                    </div>
                  )}
              </>
            )}
            {changeDriver && (
              <ChangeDriver
                order={data}
                refresh={() => setAddItem(false)}
                driver={driver}
                setDriver={setDriver}
              />
            )}
          </Col>
        </Row>
      </Modal>
      {isAddFoodModal && (
        <AddFood
          refresh={() => setRefresh((prev) => !prev)}
          order={data}
          setOrderedItems={setOrderedItems}
          show={isAddFoodModal}
          hide={() => {
            setIsAddFoodModal(false);
          }}
        />
      )}
    </>
  );
};

const ChangeDriver = ({ order, refresh, driver, setDriver }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [driverList, setDriverList] = useState([]);

  const getDriverList = () => {
    request({
      url: apiPath.order + "/" + order._id + "/drivers",
      method: "GET",
      onSuccess: ({ status, data, city, restaurant }) => {
        if (status) {
          console.log(data, "---- :⚗");
          const res = restaurant.map((item) => ({
            _id: item._id,
            name: item.name,
            is_restaurant: true,
          }));

          const cityData = city.map((item) => ({
            _id: item._id,
            name: item.name,
            is_restaurant: false,
          }));

          setDriverList([...res, ...cityData]);
        }
      },
    });
  };

  const onChangeDriver = (driverId) => {
    setDriver(driverId);
  };

  useEffect(() => {
    getDriverList();
  }, [order]);

  return (
    <div className="order-dtl-card">
      <div className="order-header" style={{ margin: "10px 0" }}>
        <h3>{lang("Assign New Driver")}</h3>
      </div>

      <Form
        id="create"
        form={form}
        layout="vertical"
        style={{ padding: "20px 0 0 0" }}
      >
        <div className="order-dtl-list add-item">
          <Row gutter={20}>
            <Col span={24} md={12}>
              <Form.Item
                name="driver"
                label={lang("Select Driver")}
                rules={[{ required: true, message: "Please select a driver" }]}
              >
                <Select
                  // the dropdown will be attached to the same container as the trigger element rather than being appended to the end of the document body.
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  style={{ width: "100%" }}
                  placeholder={lang("Select Driver")}
                  onChange={onChangeDriver}
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {driverList.map((item) => (
                    <Select.Option
                      key={item._id}
                      label={item.name}
                      value={item._id}
                    >
                      {item.name}{" "}
                      {item.is_restaurant && (
                        <>
                          {""}
                          <Badge
                            key={item._id}
                            color={"green"}
                            text={"restaurant"}
                          />
                        </>
                      )}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};

const OrderItem = ({ item, order, refresh, OrderStatus }) => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const [quantity, setQuantity] = useState(item?.qty);

  const { request } = useRequest();

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    setQuantity(quantity - 1);
  };

  const getFood = () => {
    request({
      url: apiPath.order + "/" + item?.food_id?._id + "/addOn",
      method: "GET",
      onSuccess: ({ message, status, data }) => {
        setLoading(false);
        if (status) {
          if (data?.contain_add_on && data?.add_on && data.add_on.length > 0) {
            let addOn = [];
            data.add_on.forEach((item) => {
              if (item.ingredient_ids.length > 0) {
                item.ingredient_ids.forEach((ig) => {
                  addOn.push(ig);
                });
              }
            });
            // setAddOns(addOn);
          }
        }
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR);
        setLoading(false);
      },
    });
  };

  const updateQuantity = () => {
    request({
      url: apiPath.order + "/" + order._id + "/quantity",
      method: "POST",
      data: { quantity: quantity, food_id: item._id },
      onSuccess: ({ data, status, message }) => {
        if (status) {
          ShowToast(lang("Quantity Updated Successfully"), Severty.SUCCESS);
          if (refresh) {
            refresh();
          }
        } else {
          setQuantity(item?.qty);
          ShowToast(message, Severty.ERROR);
        }
      },
      onError: (error) => {
        setQuantity(item?.qty);
        ShowToast(lang("Error in updating quantity!"), Severty.ERROR);
      },
    });
  };

  useEffect(() => {
    setQuantity(item?.qty);
    console.log("item--", item);
  }, [item]);

  return (
    <React.Fragment>
      <div className="single-order-dtl">
        {/* <div className="order-dtl-left">
          <h6>{quantity}x</h6>
        </div> */}
        <div className="order-middle">
          <h4>
            {quantity} x {item?.food_id.name}
          </h4>

          <p>{item?.size_id?.name}</p>
          {item?.choice &&
            item.choice.some((choice) => choice?.options?.length > 0) && (
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
            {item?.choice &&
            item.choice.some((choice) => choice?.options?.length > 0) ? (
              <ul>
                {item.choice.map((choice, index) => (
                  <li className="order-option" key={index}>
                    {choice.options.map((option, optionIndex) => (
                      <div className="product-item-inn" key={optionIndex}>
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

          {item?.add_on_with_qty && item?.add_on_with_qty?.length > 0 && (
            <>
              {Object.entries(
                item?.add_on_with_qty.reduce((accumulator, addOn) => {
                  const category = addOn?.add_cat_id?.name;
                  if (!accumulator[category]) {
                    accumulator[category] = [];
                  }
                  accumulator[category].push(addOn);
                  return accumulator;
                }, {}),
              ).map(([category, addOns], categoryIndex) => (
                <div key={categoryIndex}>
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
                                <Currency price={ingredient?.price} />
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
          <div className="editorder-cls">
            {!edit &&
              (order?.status === OrderStatus.PENDING ||
                order?.status === OrderStatus.ACCEPT ||
                order?.status === OrderStatus.PROCESSING) && (
                <Button onClick={() => setEdit(true)} className="btn_primary">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.1845 4.10522L12.5965 5.51655M12.0925 2.86188L8.27449 6.67989C8.07722 6.87688 7.94267 7.12787 7.88782 7.40122L7.53516 9.16655L9.30049 8.81322C9.57382 8.75855 9.82449 8.62455 10.0218 8.42722L13.8398 4.60922C13.9546 4.49449 14.0456 4.35828 14.1077 4.20838C14.1697 4.05847 14.2017 3.89781 14.2017 3.73555C14.2017 3.5733 14.1697 3.41263 14.1077 3.26273C14.0456 3.11282 13.9546 2.97662 13.8398 2.86188C13.7251 2.74715 13.5889 2.65614 13.439 2.59405C13.2891 2.53196 13.1284 2.5 12.9662 2.5C12.8039 2.5 12.6432 2.53196 12.4933 2.59405C12.3434 2.65614 12.2072 2.74715 12.0925 2.86188Z"
                      stroke="#414454"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.8672 10.4987V12.4987C12.8672 12.8523 12.7267 13.1915 12.4767 13.4415C12.2266 13.6916 11.8875 13.832 11.5339 13.832H4.20052C3.8469 13.832 3.50776 13.6916 3.25771 13.4415C3.00766 13.1915 2.86719 12.8523 2.86719 12.4987V5.16536C2.86719 4.81174 3.00766 4.4726 3.25771 4.22256C3.50776 3.97251 3.8469 3.83203 4.20052 3.83203H6.20052"
                      stroke="#414454"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  {lang("Edit order")}
                </Button>
              )}
          </div>
        </div>
        <div className="order-right">
          <h4>
            <Currency price={item?.total_price ?? item?.price} />
          </h4>
        </div>
      </div>
      {edit && (
        <div className="order-dtl-card02 mb-3">
          <div className="order-item-header">
            <h4>{lang("Update Quantity")}</h4>
          </div>
          <div className="order-item-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="order-item-left">
                <div>
                  <Button
                    disabled={quantity <= 0}
                    onClick={handleDecrease}
                    style={{ margin: "5px" }}
                  >
                    -
                  </Button>
                  <InputNumber
                    value={quantity}
                    // onChange={(value) => setQuantity(value)}
                    style={{ margin: "10px" }} // Adjust the style as needed
                  />
                  <Button onClick={handleIncrease} style={{ margin: "5px" }}>
                    +
                  </Button>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                updateQuantity();
                setEdit(false);
              }}
              className="btn_primary"
            >
              {lang("Update")}
            </Button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ViewModal;
