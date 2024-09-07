import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { rolesOptions } from "../../../constants/var";
import { Severty, ShowToast } from "../../../helper/toast";
import useRequest from "../../../hooks/useRequest";
import { useAppContext } from "../../../context/AppContext";
import lang from "../../../helper/langHelper";
import apiPath from "../../../constants/apiPath";
import { useNavigate, useParams } from "react-router";

const AddForm = ({ setEmail }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const [selectedBox, setSelectedBox] = useState([]);
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState({
    mobile_number: "",
    country_code: "",
  });

  const { cities, country: headerCountry } = useAppContext();
  const [selected, setSelected] = useState(null);
  const [isCollector, setIsCollector] = useState(
    selected ? selected.is_collector : false
  );

  const getData = (id) => {
    request({
      url: apiPath.viewTeacher + "/" + id,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setSelected(data);
        }
        console.log(data, "data");
      },
      onError: (err) => {
        console.log(err);
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
    const { permission } = values;
    const payload = {
      ...values,
      is_collector: isCollector,
    };

    payload.mobile_number = mobileNumber.mobile_number;
    payload.country_code = mobileNumber.country_code;

    if (!permission) {
      payload.permission = [];
    }

    setLoading(true);

    request({
      url: `${
        selected
          ? apiPath.addEditTeacher + "/" + selected._id
          : apiPath.addEditTeacher
      }`,
      method: selected ? "PUT" : "POST",
      data: payload,
      onSuccess: (data) => {
        setLoading(false);
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
          navigate(-1);
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
    if (!params.id) return;
    getData(params.id);
  }, [params.id]);

  useEffect(() => {
    if (!selected) return;

    form.setFieldsValue({
      ...selected,

      password: "",
      mobile: selected.country_code
        ? selected.country_code + selected.mobile_number
        : "",
    });
    let box = [];

    if (selected.is_collector) {
      box.push("collector");
    }
    if (selected.permission.length) {
      box.push("role");
    }
    setSelectedBox(box);
    setIsCollector(selected.is_collector);

    setMobileNumber({
      mobile_number: selected.mobile_number,
      country_code: selected.country_code,
    });
  }, [selected]);

  return (
    <>
      <Form id="create" form={form} onFinish={onCreate} layout="vertical">
        <h4 className="modal_title_cls">{selected ? "Edit" : "Add"} Teacher</h4>
        <Row gutter={[16, 0]} className="w-100">
          <Col span={12} sm={12}>
            <Form.Item
              label={lang("Name")}
              name="name"
              rules={[
                {
                  max: 50,
                  message: lang(
                    "Name should not contain more then 50 characters!"
                  ),
                },
                {
                  min: 2,
                  message: lang("Name should contain at least 2 characters!"),
                },
                {
                  required: true,
                  message: lang("Please enter name"),
                },
              ]}
              normalize={(value) => value.trimStart()}
            >
              <Input autoComplete="off" placeholder={lang(`Enter Name`)} />
            </Form.Item>
          </Col>

          <Col span={12} sm={12}>
            <Form.Item
              label={lang("Role Title")}
              name="role_title"
              rules={[
                {
                  max: 50,
                  message: lang(
                    "Name should not contain more then 50 characters!"
                  ),
                },
                {
                  min: 2,
                  message: lang("Name should contain at least 2 characters!"),
                },
                {
                  required: true,
                  message: lang("Please enter role name"),
                },
              ]}
            >
              <Input placeholder="Enter Role Title" />
            </Form.Item>
          </Col>

          <Col span={12} lg={12} sm={12} className="flagMobileNumber">
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
                        lang("Phone number must be between 8 and 12 digits")
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
                country={"in"}
                preferredCountries={["in"]}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>

          <Col span={12} sm={12}>
            <Form.Item
              label="Email Id"
              name="email"
              rules={[
                { required: true, message: lang("Please enter the email!") },
                {
                  max: 50,
                  message: lang(
                    "Email should not contain more then 50 characters!"
                  ),
                },
                {
                  pattern: new RegExp(
                    /^([a-zA-Z0-9._%-]*[a-zA-Z]+[a-zA-Z0-9._%-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
                  ),
                  message: lang("Enter valid email!"),
                },
              ]}
            >
              <Input
                autoComplete="off"
                placeholder={lang("Enter Email Address")}
              />
            </Form.Item>
          </Col>
          {/* <Col span={24} sm={24}>
            <Form.Item name="is_collector" valuePropName="checked">
              <Checkbox onChange={(e) => setIsCollector(e?.target?.checked)}>
                Is Collector
              </Checkbox>
            </Form.Item>
          </Col> */}
          <Checkbox.Group
            value={selectedBox}
            onChange={(values) => {
              console.log(values, "valuesvalues");
              setSelectedBox(values);

              if (values.includes("role")) {
                form.setFieldsValue({
                  permission: rolesOptions.map(({ name }) => name),
                });
              } else {
                form.setFieldsValue({
                  permission: [],
                });
              }
            }}
          >
            <Col span={24} md={24}>
              <div className="assign_role">
                <Checkbox value="role">
                  {lang("Assign Roles And Responsibility")}
                </Checkbox>
                {
                  <Form.Item
                    name="permission"
                    className="assign_role_checkbox"
                    rules={[
                      {
                        required: false,
                        message: lang("Please assign roles and responsibility"),
                      },
                    ]}
                  >
                    <Checkbox.Group
                      onChange={(value) => {
                        if (value.length != rolesOptions.length) {
                          const old = [...selectedBox];
                          let index = old.indexOf("role");
                          if (index !== -1) old.splice(index, 1);
                          setSelectedBox(old);
                        }
                      }}
                    >
                      {rolesOptions.map((item, idx) => (
                        <Checkbox value={item.name} key={item.name}>
                          {item.label}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                }
              </div>
            </Col>
          </Checkbox.Group>
          {selected && (
            <Col span={12} md={12}>
              <Form.Item
                label={lang("Update Password")}
                name="password"
                rules={[
                  {
                    pattern: new RegExp(
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
                    ),
                    message: lang(
                      "Confirm password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character"
                    ),
                  },
                  {
                    required: false,
                    message: lang("Please enter your password!"),
                  },
                ]}
              >
                <Input.Password
                  onCut={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  autoComplete="off"
                  placeholder={lang("Create Password")}
                />
              </Form.Item>
            </Col>
          )}

          {selected && (
            <Col span={12} md={12}>
              <Form.Item
                label={lang("Confirm Password")}
                name="confirm_password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue("password") || value) {
                        // Make confirm password required if password field is filled
                        if (!value) {
                          return Promise.reject(
                            new Error(lang("Please confirm your password!"))
                          );
                        } else if (getFieldValue("password") !== value) {
                          return Promise.reject(
                            new Error(lang("Passwords do not match!"))
                          );
                        }
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input.Password placeholder={lang("Enter Confirm Password")} />
              </Form.Item>
            </Col>
          )}
          <Col xl={24} md={24} span={24}>
            <Button type="primary" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button type="primary" htmlType="submit" layout="vertical">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddForm;
