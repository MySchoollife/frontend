import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import apiPath from "../../constants/apiPath";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
import { useAppContext } from "../../context/AppContext";

const targetAudience = [
  { name: "Vendor", label: "Vendor" },
  { name: "Customers", label: "Customers" },
];

const AddNotificationModal = ({ section, show, hide, data, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);
  const [selectAudience, setSelectAudience] = useState();
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCity] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const debouncedSearchCity = useDebounce(searchCity, 300);
  const { country } = useAppContext();

  const onCreate = (values) => {
    // return console.log(values,"values")
    const payload = {
      ...values,
    };
    payload.country_id = country.country_id;

    console.log(payload, "payload");

    setLoading(true);

    request({
      url: apiPath.notification,
      method: "POST",
      data: payload,
      onSuccess: (data) => {
        setLoading(false);
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
          hide();
          refresh();
        } else {
          ShowToast(data.message, Severty.ERROR);
        }
      },
      onError: (error) => {
        ShowToast(error.response.data.message, Severty.ERROR);
        setLoading(false);
      },
    });
  };

  const getCategory = () => {
    console.log();
    request({
      url: apiPath.common.restaurantCategories,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setCategories(data);
        }
        console.log(data, "data");
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const getCountry = () => {
    request({
      url: `/country`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        console.log(data, "Country");
        if (status) {
          setCountries(data);
        }
      },
    });
  };

  const getCity = (id) => {
    request({
      // url: `/city/${id}`,
      url: `/country-city/${id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        console.log(data, "city");
        if (status) {
          setCity(data);
        }
      },
    });
  };

  useEffect(() => {
    // getCountry();
    if (!!data) {
      form.setFieldsValue({
        ...data,
        start_date: moment(data.start_date),
        category_id: data.category_id?._id,
        country_id: data.country_id?._id,
        city_id: data.city_id?._id,
        Schedule_time : data.Schedule_time ? moment(data.Schedule_time)   : ""
      });
      setSelectAudience(data.audience);

      // getCity(data?.country_id?._id);
    }
  }, []);

  return (
    <Modal
      width={750}
      open={show}
      okText="Add"
      onCancel={hide}
      okButtonProps={{
        form: "create",
        htmlType: "submit",
        loading: loading,
      }}
      className="tab_modal"
    >
      <Form id="create" form={form} onFinish={onCreate} layout="vertical">
        <h4 className="modal_title_cls">
          {data ? "Resend Notification" : "Create Notification"}
        </h4>
        <Row gutter={[16, 0]} className="w-100">
          <Col span={24} sm={24} md={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please Enter Notification Title",
                },
                {
                  max: 150,
                  message: "Title should not contain more then 80 characters!",
                },
                {
                  min: 2,
                  message: "Title should contain at least 2 characters!",
                },
              ]}
              normalize={(value) => value.trimStart()}
            >
              <Input
                autoComplete="off"
                placeholder="Enter Notification Title"
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={24} md={12}>
            <Form.Item
              label="Arabic Title"
              name="ar_title"
              rules={[
                {
                  required: true,
                  message: "Please Enter Notification Arabic Title",
                },
                {
                  max: 150,
                  message:
                    "Arabic Title should not contain more then 80 characters!",
                },
                {
                  min: 2,
                  message: "Arabic Title should contain at least 2 characters!",
                },
              ]}
              normalize={(value) => value.trimStart()}
            >
              <Input
                autoComplete="off"
                placeholder="Enter Notification Arabic Title"
              />
            </Form.Item>
          </Col>

          {/* <Col span={24} sm={24} md={12}>
            <Form.Item
              label="Country"
              name="country_id"
              rules={[
                { required: true, message: "Please select the country!" },
              ]}
            >
              <Select
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                autoComplete="off"
                placeholder="Select Country"
                showSearch
                onChange={(value) => getCity(value)}
              >
                {countries.map((item) => (
                  <Select.Option
                    key={item._id}
                    label={item.name}
                    value={item._id}
                  >
                    {item.name}{" "}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}

          {/* <Col span={24} sm={24} md={12}>
            <Form.Item
              label="City"
              name="city_id"
              rules={[{ required: true, message: "Please select the city!" }]}
            >
              <Select
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder="Select City"
                showSearch
                // onChange={(value) => getCity(value)}
              >
                {cities.map((item) => (
                  <Select.Option
                    key={item._id}
                    label={item.name}
                    value={item._id}
                  >
                    {item.name}{" "}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}

          <Col span={12} sm={12} md={12}>
            <Form.Item
              name="audience"
              label="Select Audience"
              rules={[
                {
                  required: true,
                  message: "Please Select Audience",
                },
              ]}
            >
              <Select
                onChange={(value) => setSelectAudience(value)}
                placeholder="Select Audience"
                className="w-100"
              >
                {targetAudience.map((item, index) => (
                  <option key={item.name} value={item.name}>
                    <span className="cap">{item.label}</span>
                  </option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12} sm={12} md={12}>
            <Form.Item
              name="Schedule_time"
              label="Schedule Time"
              rules={[
                {
                  required: true,
                  message: "Please enter Schedule time",
                },
              ]}
            >
             <DatePicker placeholder="Enter Date & Time"   format={"DD:MM:yy hh:mm a"} 
                 showTime={{ format: 'hh:mm a' }} />
            </Form.Item>
          </Col>

          <Col span={24} sm={24} md={12}>
            <Form.Item
              label="Notification English"
              name="message"
              rules={[
                {
                  required: true,
                  message: "Please Enter Notification Message",
                },
                {
                  max: 80,
                  message:
                    "Message should not contain more then 80 characters!",
                },
                {
                  min: 2,
                  message: "Message should contain at least 2 characters!",
                },
              ]}
              normalize={(value) => value.trimStart()}
            >
              <Input
                autoComplete="off"
                placeholder="Enter Notification Message"
              />
            </Form.Item>
          </Col>

          <Col span={24} sm={24} md={12}>
            <Form.Item
              label="Notification Arabic"
              name="ar_message"
              rules={[
                {
                  required: true,
                  message: "Please Enter Notification Message in arabic",
                },
                {
                  max: 80,
                  message:
                    "Message should not contain more then 80 characters!",
                },
                {
                  min: 2,
                  message: "Message should contain at least 2 characters!",
                },
              ]}
              normalize={(value) => value.trimStart()}
            >
              <Input
                autoComplete="off"
                placeholder="Enter Arabic Notification Message"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddNotificationModal;
