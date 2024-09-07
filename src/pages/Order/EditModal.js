import {
  Button,
  Col,
  Form,
  InputNumber,
  Modal,
  Rate,
  Row,
  Select,
  Skeleton,
  Badge,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";

import AgentImg from "../../assets/images/face-1.jpg";
import Currency from "../../components/Currency";
import apiPath from "../../constants/apiPath";
import { dateString, formatPhone } from "../../helper/functions";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import { AddFood } from "./_AddFood";
import { Timezone } from "../../helper/timezone";

const EditForm = ({
  api,
  show,
  hide,
  data,
  // refresh,
  // isAddFoodModal,
  setIsAddFoodModel,
  setSelected,
  refreshList,
}) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addItem, setAddItem] = useState(false);
  const [changeDriver, setChangeDriver] = useState(false);

  const [orderedItems, setOrderedItems] = useState([]);
  const [driver, setDriver] = useState(null);
  const [order, setOrder] = useState(null);
  const [isAddFoodModal, setIsAddFoodModal] = useState(false);
  const [difference, setDifference] = useState(0);

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
          ShowToast(lang("New Driver Assigned"), Severty.SUCCESS);
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
    const date1 = moment(data.created_at).tz(Timezone);
    const date2 = moment().tz(Timezone);

    const differenceInSeconds = date2.diff(date1, "seconds");

    // Calculate the difference between the two dates in minutes
    const differenceInMinutes = date2.diff(date1, "minutes");
    setDifference(differenceInSeconds);
  }, []);

  useEffect(() => {
    // if (!data) return;
    getOrder();
  }, [refresh]);

  return (
    <>
      <Modal
        open={show}
        width={950}
        okText={lang("Add")}
        onCancel={hide}
        cancelText={null}
        footer={[
          <>
            <Button key="cancel" type="primary" onClick={hide}>
              {lang("Cancel")}
            </Button>
            {driver && (
              <Button key="update" type="primary" onClick={onUpdateOrder}>
                {lang("Change Driver")}
              </Button>
            )}
          </>,
        ]}
        okButtonProps={{
          form: "create",
          htmlType: "submit",
          loading: loading,
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="tab_modal edit_orders"
      >
        <h4 className="modal_title_cls">{lang("Edit Order")}</h4>
        {isLoading ? (
          [1, 2, 3, 4, 5].map((item) => <Skeleton active key={item} />)
        ) : (
          <>
            <Row>
              <Col span={24} md={12}>
                <div className="order-head text-left">
                  <h4>{data?.restaurant_id?.name}</h4>
                  <span>
                    <Rate disabled defaultValue={0} />
                    <span className="no-rating">0</span>(0 Reviews)
                  </span>
                  <p className="orderid">Order ID : {data?.uid}</p>
                  <p className="cap">{dateString(data?.created_at, "lll")}</p>
                </div>
              </Col>

              {data?.customer_id && (
                <Col span={24} md={12}>
                  <div className="order-dtl-card edit-order-dtl">
                    <div className="order-header">
                      <h3>{lang("Customer Details")}</h3>
                    </div>
                    <div className="customer-dtl">
                      <div className="customer-info">
                        <h6>{lang("Name")} :</h6>
                        <h5>{data?.customer_id?.name}</h5>
                      </div>
                      <div className="customer-info">
                        <h6>{lang("Phone Number")} :</h6>
                        <h5>
                          {formatPhone(
                            data?.customer_id?.country_code,
                            data?.customer_id?.mobile_number,
                          )}
                        </h5>
                      </div>
                      <div className="customer-info">
                        <h6>{lang("Address")} :</h6>
                        <h5>{"Box No. 2399, Abu Dhabi, Emirates"}</h5>
                      </div>
                    </div>
                  </div>
                </Col>
              )}

              {!addItem && (
                <Col span={24} md={24}>
                  <div className="addNewItem">
                    <Button
                      onClick={() => {
                        // hide();
                        // setAddItem(true);
                        // setIsAddFoodModel(true);
                        // setSelected(order);
                        setIsAddFoodModal(true);
                      }}
                      className="btn_primary"
                    >
                      {lang("Add New Item")}
                    </Button>
                  </div>
                </Col>
              )}
            </Row>

            <Row gutter={[45, 0]}>
              <Col span={24} sm={24}>
                <div className="order-dtl-card">
                  <div className="order-header">
                    <h3>{lang("Order Details")}</h3>
                  </div>
                  <div className="order-dtl-list edit-order">
                    {orderedItems?.map((item, idx) => (
                      <OrderItem
                        item={item}
                        order={order}
                        key={idx}
                        refresh={() => setRefresh((prev) => !prev)}
                      />
                    ))}
                  </div>
                </div>

                {data?.driver_id ? (
                  <div className="order-dtl-card">
                    <div className="order-header">
                      <h3>{lang("Delivery Agent Details")}</h3>
                    </div>
                    <div className="customer-dtl">
                      <div className="delivery-agent-dtl">
                        <div className="agent-img">
                          <img src={AgentImg} />
                        </div>
                        <div className="agent-info">
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
                          <div className="customer-info">
                            <h6>{lang("Vehicle No. ")}:</h6>
                            <h5>{lang("UAE 123456")}</h5>
                          </div>
                        </div>
                        <div className="changeDriver">
                          <Button
                            onClick={() => setChangeDriver(true)}
                            className="btn_primary"
                          >
                            {lang("Change Driver")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {!changeDriver && difference > 120 && (
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
          </>
        )}
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
    if (driver && driver == driverId) return;

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

const OrderItem = ({ item, order, refresh }) => {
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
          <p>{item?.food_id?.description}</p>
          <div className="editorder-cls">
            {!edit && (
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

export default EditForm;
