import { UndoOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Table,
  Tabs,
  Tooltip,
  TimePicker,
  DatePicker,
  InputNumber,
  Image,
} from "antd";
import useRequest from "../../hooks/useRequest";
import { Severty, ShowToast } from "../../helper/toast";
import lang from "../../helper/langHelper";
import SingleImageUpload from "../../components/SingleImageUpload";
import apiPath from "../../constants/apiPath";
import { useEffect, useState } from "react";
import notfound from "../../assets/images/not_found.png";
import { useAuthContext } from "../../context/AuthContext";
import Currency from "../../components/Currency";
const FileType = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/avif",
  "image/webp",
  "image/gif",
];

const Payment = ({ show, hide, data }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(false);

  const { currency } = useAuthContext();

  const [form] = Form.useForm();

  const { request } = useRequest();

  const onSubmit = (value) => {
    setLoading(true);
    const { amount, receipt_number, payment_mod, payment_type } = value;

    const payload = {
      amount,
      payment_mod,
      receipt_number,
      payment_type,
      image,
      invoice_id: data._id,
      restaurant_id: data.restaurant_id._id,
    };

    request({
      url: `${apiPath.invoice}`,
      method: "POST",
      data: payload,
      onSuccess: ({ status, message }) => {
        setLoading(false);
        if (status) {
          ShowToast(message, Severty.SUCCESS);
        } else {
          ShowToast(message, Severty.ERROR);
        }
        hide();
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const handleImage = (data) => {
    setImage(data.length ? data[0].url : null);
  };

  const payment_mod = Form.useWatch("payment_mod", form);

  return (
    <Modal
      width={750}
      open={show}
      onOk={() => null}
      onCancel={hide}
      // title={`${data ? "Update " + section : "Create a New " + section}`}
      okButtonProps={{
        form: "create",
        htmlType: "submit",
        loading: loading,
      }}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="tab_modal"
    >
      <Form
        form={form}
        id="create"
        layout="vertical"
        initialValues={{
          is_active: true,
          name: data?.restaurant_id.name,
          city: data?.city_id.name,
          area: data?.restaurant_id.area?.name ?? "",
        }}
        onFinish={onSubmit}
      >
        <h4 className="modal_title_cls">Payment</h4>
        <h6>
          Total Amount :{" "}
          <Currency
            price={data?.remaining_amount ? data?.remaining_amount : 0}
          />{" "}
        </h6>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <div className="payment-mannage-outer">
              <Form.Item
                label="Choose a Payment Method"
                name="payment_mod"
                rules={[{ required: true, message: "please select a type" }]}
              >
                <Radio.Group>
                  <Radio value={"Wire"}>Wire Transfer</Radio>
                  <Radio value={"Cash"}>Cash</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </Col>

          {payment_mod != "Cash" ? (
            <Col span={24}>
              <Form.Item
                className="mb-0"
                rules={[
                  {
                    validator: (_, value) => {
                      if (image) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Receipt image is required"),
                      );
                    },
                  },
                ]}
                label={"Upload Receipt Image"}
                name="image1"
              >
                <SingleImageUpload
                  value={image}
                  fileType={FileType}
                  imageType={"invoice"}
                  onChange={(data) => handleImage(data)}
                />
              </Form.Item>
              {image && image.length > 0 && (
                <div className="mt-2">
                  {" "}
                  <div
                    className="remove-wrap"
                    style={{ cursor: "pointer" }}
                    onClick={() => setImage()}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.66536 2.33333H8.33203C8.33203 1.97971 8.19156 1.64057 7.94151 1.39052C7.69146 1.14048 7.35232 1 6.9987 1C6.64508 1 6.30594 1.14048 6.05589 1.39052C5.80584 1.64057 5.66536 1.97971 5.66536 2.33333ZM4.66536 2.33333C4.66536 2.02692 4.72572 1.7235 4.84298 1.44041C4.96024 1.15731 5.13211 0.900088 5.34878 0.683417C5.56545 0.466747 5.82268 0.294875 6.10577 0.177614C6.38886 0.0603535 6.69228 0 6.9987 0C7.30512 0 7.60853 0.0603535 7.89163 0.177614C8.17472 0.294875 8.43194 0.466747 8.64861 0.683417C8.86528 0.900088 9.03716 1.15731 9.15442 1.44041C9.27168 1.7235 9.33203 2.02692 9.33203 2.33333H13.1654C13.298 2.33333 13.4252 2.38601 13.5189 2.47978C13.6127 2.57355 13.6654 2.70072 13.6654 2.83333C13.6654 2.96594 13.6127 3.09312 13.5189 3.18689C13.4252 3.28065 13.298 3.33333 13.1654 3.33333H12.2854L11.5054 11.4073C11.4455 12.026 11.1574 12.6002 10.6972 13.0179C10.2369 13.4356 9.63757 13.6669 9.01603 13.6667H4.98136C4.35994 13.6667 3.76077 13.4354 3.30066 13.0177C2.84056 12.6 2.55252 12.0259 2.4927 11.4073L1.71203 3.33333H0.832031C0.699423 3.33333 0.572246 3.28065 0.478478 3.18689C0.38471 3.09312 0.332031 2.96594 0.332031 2.83333C0.332031 2.70072 0.38471 2.57355 0.478478 2.47978C0.572246 2.38601 0.699423 2.33333 0.832031 2.33333H4.66536ZM5.9987 5.5C5.9987 5.36739 5.94602 5.24021 5.85225 5.14645C5.75848 5.05268 5.63131 5 5.4987 5C5.36609 5 5.23891 5.05268 5.14514 5.14645C5.05138 5.24021 4.9987 5.36739 4.9987 5.5V10.5C4.9987 10.6326 5.05138 10.7598 5.14514 10.8536C5.23891 10.9473 5.36609 11 5.4987 11C5.63131 11 5.75848 10.9473 5.85225 10.8536C5.94602 10.7598 5.9987 10.6326 5.9987 10.5V5.5ZM8.4987 5C8.63131 5 8.75848 5.05268 8.85225 5.14645C8.94602 5.24021 8.9987 5.36739 8.9987 5.5V10.5C8.9987 10.6326 8.94602 10.7598 8.85225 10.8536C8.75848 10.9473 8.63131 11 8.4987 11C8.36609 11 8.23891 10.9473 8.14514 10.8536C8.05138 10.7598 7.9987 10.6326 7.9987 10.5V5.5C7.9987 5.36739 8.05138 5.24021 8.14514 5.14645C8.23891 5.05268 8.36609 5 8.4987 5ZM3.48803 11.3113C3.52399 11.6824 3.69686 12.0268 3.97294 12.2774C4.24903 12.528 4.60853 12.6667 4.98136 12.6667H9.01603C9.38887 12.6667 9.74837 12.528 10.0245 12.2774C10.3005 12.0268 10.4734 11.6824 10.5094 11.3113L11.2814 3.33333H2.71603L3.48803 11.3113Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <Image
                    width={120}
                    src={image !== "" ? image : notfound}
                  ></Image>{" "}
                </div>
              )}
            </Col>
          ) : (
            <span>
              **After submit cash request One of our collection manager come
              your place to collect cash
            </span>
          )}
        </Row>
        {payment_mod != "Cash" && (
          <>
            <Row gutter={[16, 0]}>
              <Col span={24} sm={12}>
                <Form.Item
                  label={lang("Receipt Number")}
                  name="receipt_number"
                  rules={[
                    {
                      required: true,
                      message: lang("Receipt  Number is required"),
                    },
                  ]}
                >
                  <Input autoComplete="off" placeholder={"Receipt Number"} />
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item
                  label={lang(`Total Amount (${currency})`)}
                  name="amount"
                  rules={[
                    {
                      required: true,
                      message: lang("Amount is required"),
                    },
                    {
                      validator: (_, value) => {
                        if (value <= data.remaining_amount) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "Amount is not greater then invoice remaining amount",
                          ),
                        );
                      },
                    },
                  ]}
                >
                  <InputNumber
                    autoComplete="off"
                    placeholder={"2,000"}
                    onChange={(value) => {
                      if (value === data.remaining_amount) {
                        form.setFieldsValue({ payment_type: "Full payment" });
                      } else {
                        console.log("e.target.value", value);
                        form.setFieldsValue({
                          payment_type: "Partial payment",
                        });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 0]}>
              <Col span={24}>
                <div className="payment-mannage-outer">
                  <Form.Item
                    label="Choose a Payment"
                    name="payment_type"
                    rules={[
                      {
                        required: true,
                        message: "please select a payment type",
                      },
                    ]}
                  >
                    <Radio.Group
                      onChange={(e) => {
                        if (e?.target?.value === "Full payment") {
                          console.log("e.target.value", e?.target?.value);
                          form.setFieldsValue({
                            amount: data?.remaining_amount,
                          });
                        } else {
                          form.setFieldsValue({ amount: null });
                        }
                      }}
                    >
                      <Radio value={`Full payment`}>Full Payment</Radio>
                      <Radio value={`Partial payment`}>Partial Payment</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default Payment;
