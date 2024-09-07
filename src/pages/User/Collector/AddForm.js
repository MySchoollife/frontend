import { Checkbox, Col, Form, Input, Modal, Row, Select } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Severty, ShowToast } from "../../../helper/toast";
import useRequest from "../../../hooks/useRequest";
import { rolesOptions } from "../../../constants/var";
import { useAppContext } from "../../../context/AppContext";
import lang from "../../../helper/langHelper";

const cities = [{ name: "New York", _id: "New York" }];

const AddForm = ({ setEmail, api, show, hide, data, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();

  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState({
    mobile_number: "",
    country_code: "",
  });

  const [isCollector, setIsCollector] = useState(
    data ? data.is_collector : false,
  );

  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);

  const onCreateACollector = (event) => {
    setIsCollector(event.target.checked);
  };

  const { cities, country: headerCountry } = useAppContext();

  const getCountry = () => {
    request({
      url: `/country`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        console.log(data, "Country");
        if (status) {
          setCountry(data);
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

  const handleChange = (value, data) => {
    var country_code = data.dialCode;
    setMobileNumber({
      country_code: country_code,
      mobile_number: value.slice(data.dialCode.length),
    });
  };

  const onCreate = (values) => {
    const payload = {
      ...values,
      is_collector: isCollector,
      country_id: headerCountry.country_id,
      permission: [],
    };

    payload.mobile_number = mobileNumber.mobile_number;
    payload.country_code = mobileNumber.country_code;
    console.log(payload, "payload");

    setLoading(true);

    request({
      url: `${data ? api.collector + "/" + data._id : api.collector}`,
      method: data ? "PUT" : "POST",
      data: payload,
      onSuccess: (data) => {
        setLoading(false);
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
          hide();
          if (data) {
            refresh();
          } else {
            setEmail(payload.email);
          }
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

  useEffect(() => {
    getCountry();
  }, []);

  useEffect(() => {
    if (!data) return;
    console.log(data, "data 86");
    form.setFieldsValue({
      ...data,
      country_id: data.country_id?._id,
      city_id: data.city_id?._id,
      mobile: data.country_code ? data.country_code + data.mobile_number : "",
    });
    getCity(data.country_id?._id);
    setMobileNumber({
      mobile_number: data.mobile_number,
      country_code: data.country_code,
    });
  }, [data]);

  return (
    <Modal
      width={750}
      open={show}
      okText={data ? lang("Update") : lang("Create")}
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
          {data ? lang("Edit") : lang("Add")} {lang("Collector")}
        </h4>
        <Row gutter={[16, 0]} className="w-100">
          <Col span={24} sm={24}>
            <Form.Item
              label={lang("Name")}
              name="name"
              rules={[
                {
                  max: 20,
                  message: lang(
                    "Name should not contain more then 20 characters!",
                  ),
                },
                {
                  min: 2,
                  message: lang("Name should contain at least 2 characters!"),
                },
              ]}
              normalize={(value) => value.trimStart()}
            >
              <Input autoComplete="off" placeholder={lang(`Enter Name`)} />
            </Form.Item>
          </Col>

          {/* <Col span={24} sm={12}>
            <Form.Item
              label="Country"
              name="country_id"
              rules={[
                { required: true, message: "Please select the country!" },
              ]}
            >
              <Select
                filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                autoComplete="off" placeholder="Select Country" showSearch onChange={(value) => getCity(value)}>
                {
                  country.map(item => <Select.Option key={item._id} label={item.name} value={item._id}>{item.name} </Select.Option>)
                }
              </Select>
            </Form.Item>
          </Col> */}

          <Col span={24} sm={12}>
            <Form.Item
              label={lang("City")}
              name="city_id"
              rules={[
                { required: true, message: lang("Please select the city!") },
              ]}
            >
              <Select
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder="Select City"
                showSearch
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
          </Col>

          <Col span={24} sm={12}>
            <Form.Item
              label={lang("Role Title")}
              name="title"
              rules={[
                {
                  max: 30,
                  message: lang(
                    "Title should not contain more then 20 characters!",
                  ),
                },
                {
                  min: 2,
                  message: lang("Title should contain at least 2 characters!"),
                },
              ]}
              normalize={(value) => value.trimStart()}
            >
              <Input
                autoComplete="off"
                placeholder={lang("Enter Role Title")}
              />
            </Form.Item>
          </Col>

          {/* <Col span={24} md={24}>
            <Form.Item
              label="Assign Roles And Responsibility"
              name="permission"
              className="assign_role_checkbox"

            >
              <Checkbox.Group
                onChange={(value) => console.log(value, "working")}
              >
                {rolesOptions.map((item, idx) => (
                  <Checkbox value={item.name} key={item.name}>
                    {item.label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </Col> */}

          <Col span={24} lg={12} sm={12} className="flagMobileNumber">
            <Form.Item
              label={lang("Mobile Number")}
              name="mobile"
              rules={[
                {
                  required: true,
                  validator: (rule, value) => {
                    if (!value) {
                      return Promise.reject(lang("Please enter phone number"));
                    }
                    if (!/^\d{8,15}$/.test(value)) {
                      return Promise.reject(
                        lang("Phone number must be between 8 and 12 digits"),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <PhoneInput
                inputProps={{
                  name: "mobile",
                  required: true,
                  autoFocus: false,
                  autoFormat: false,
                  autoComplete: "off",
                }}
                isValid={(value, country) => {
                  if (value.match(/1234/)) {
                    return "Invalid value: " + value + ", " + country.name;
                  } else if (value.match(/1234/)) {
                    return "Invalid value: " + value + ", " + country.name;
                  } else {
                    return true;
                  }
                }}
                country={"il"}
                preferredCountries={["ps", "il"]}
                // value={
                //   mobileNumber
                //     ? (mobileNumber.country_code
                //         ? mobileNumber.country_code
                //         : "+27") +
                //       (mobileNumber.mobile_number ? mobileNumber.mobile_number : null)
                //     : "+27"
                // }
                onChange={handleChange}
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12}>
            <Form.Item
              className=""
              label={lang("Create A Collector")}
              name="is_collector"
            >
              <Checkbox
                disabled={true}
                onChange={onCreateACollector}
                value={true}
                defaultChecked={isCollector}
              />
            </Form.Item>
          </Col>

          <Col span={24} sm={24}>
            <Form.Item label={lang("Email Id")} name="email">
              <Input
                autoComplete="off"
                placeholder={lang("Enter Email Address")}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddForm;
