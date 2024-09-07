import {
  Button,
  Table,
  Tooltip,
  Select,
  Modal,
  Input,
  Form,
  Col,
  Row,
  Menu,
  Radio,
  Divider,
  InputNumber,
  Typography,
  Space,
  Card,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  UserOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import Plus from "../../../assets/images/plus.svg";
import DeleteModal from "../../../components/DeleteModal";
import SectionWrapper from "../../../components/SectionWrapper";
import apiPath from "../../../constants/apiPath";
import { AppStateContext } from "../../../context/AppContext";
import lang from "../../../helper/langHelper";
import { Severty, ShowToast } from "../../../helper/toast";
import useDebounce from "../../../hooks/useDebounce";
import useRequest from "../../../hooks/useRequest";
import { UndoOutlined } from "@ant-design/icons";
import Lottie from "react-lottie";
import * as success from "../../../assets/animation/success.json";
import UploadImage from "../Student/_UploadImage";
import { deleteAccount } from "../../../constants/var";
import { useAuthContext } from "../../../context/AuthContext";
import Loader from "../../../components/Loader";
import { PhoneNumberField } from "../../../components/InputField";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function Index() {
  const { setPageHeading, country } = useContext(AppStateContext);
  const sectionName = lang("My Profile");
  const routeName = "profile";
  const api = {
    status: apiPath.statusRole,
    role: apiPath.role,
  };
  const [selectedKey, setselectedKey] = useState("picture");
  useEffect(() => {
    setPageHeading(`${lang("Profile")} ${lang("Management")}`);
  }, []);
  const handleChange = (key) => {
    setselectedKey(key);
  };

  return (
    <SectionWrapper cardHeading="My Profile">
      <Row gutter={24}>
        <Col span={6}>
          <Menu
            mode="vertical"
            selectedKeys={selectedKey}
            style={{ borderRight: 0 }}
            onClick={(e) => handleChange(e.key)}
          >
            <Menu.Item key="picture" icon={<UserOutlined />}>
              Profile picture
            </Menu.Item>
            <Menu.Item key="about" icon={<InfoCircleOutlined />}>
              About
            </Menu.Item>
            <Menu.Item key="contact" icon={<PhoneOutlined />}>
              Contact details
            </Menu.Item>
            <Menu.Item key="password" icon={<LockOutlined />}>
              Update password
            </Menu.Item>
            <Menu.Item key="support" icon={<QuestionCircleOutlined />}>
              Support Section
            </Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined />}>
              Delete Account
            </Menu.Item>
          </Menu>
        </Col>
        <Col span={18}>
          <AddForm selectedKey={selectedKey} />
        </Col>
      </Row>
    </SectionWrapper>
  );
}

const AddForm = ({ selectedKey }) => {
  const [form] = Form.useForm();
  const [image, setImage] = useState("");
  console.log(selectedKey, "selectedKey");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { request } = useRequest();
  const { userProfile, logout } = useAuthContext();
  const { Text, Title } = Typography;
  const [mobileNumber, setMobileNumber] = useState({
    mobile_number: "",
    country_code: "",
  });

  const handleUpdatePassword = (values) => {
    const { old_password, new_password } = values;
    const payload = {};
    if (!old_password || !new_password)
      return ShowToast("Please enter password ", Severty.ERROR);
    setLoading(true);
    payload.new_password = new_password;
    payload.old_password = old_password;
    request({
      url: apiPath.changePassword,
      method: "POST",
      data: payload,
      onSuccess: (data) => {
        setLoading(false);
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
          logout();
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

  const onFinish = (values) => {
    setLoading(true);
    const {
      bio,
      dob,
      gender,
      name,
      website_url,
      email,
      pincode,
      city_id,
      state_id,
      country_id,
      address,
    } = values;
    const payload = {};
    if (selectedKey === "about") {
      payload.bio = bio ? bio : "";
      payload.gender = gender ? gender : "";
    } else if (selectedKey === "picture") {
      payload.image = image ? image : "";
    } else if (selectedKey === "contact") {
      payload.name = name ? name : "";
      payload.email = email ? email : "";
      payload.pincode = pincode ? pincode : "";
      payload.city_id = city_id ? city_id : "";
      payload.state_id = state_id ? state_id : "";
      payload.country_id = country_id ? country_id : "";
      payload.address = address ? address : "";
      payload.website_url = website_url ? website_url : "";
      payload.mobile_number = mobileNumber.mobile_number;
      payload.country_code = mobileNumber.country_code;
    }
    // return console.log(payload, "payload");
    request({
      url: `${apiPath.updateProfile} `,
      method: "POST",
      data: payload,
      onSuccess: (data) => {
        setLoading(false);
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
        } else {
          ShowToast(data.message, Severty.ERROR);
        }
      },
      onError: (error) => {
        ShowToast(error?.response?.data?.message, Severty.ERROR);
        setLoading(false);
      },
    });
  };

  const handleMobileNumberChange = (value, data, type) => {
    let country_code = data?.dialCode;
    setMobileNumber({
      country_code: country_code,
      mobile_number: value.slice(data?.dialCode?.length),
    });
  };

  useEffect(() => {
    if (!userProfile) return;
    form.setFieldsValue({
      ...userProfile,
      mobile: userProfile?.country_code + userProfile?.mobile_number,
    });
    setMobileNumber({
      mobile_number: userProfile?.mobile_number,
      country_code: userProfile?.country_code,
    });
  }, [userProfile]);

  return (
    <>
      {selectedKey === "picture" &&
        (loading ? (
          <Loader />
        ) : (
          <div>
            <h3>Update Profile:</h3>
            <Divider />
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={16}>
                <Col span={24}>
                  <div className="text-center">
                    <Form.Item
                      className="upload_wrap"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (image) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(lang("Profile image is required"))
                            );
                          },
                        },
                      ]}
                      name="image"
                    >
                      <UploadImage
                        preview={false}
                        value={image}
                        setImage={setImage}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Form>
          </div>
        ))}
      {selectedKey === "about" &&
        (loading ? (
          <Loader />
        ) : (
          <>
            <div>
              <h3>Update About Us:</h3>
              <Divider />
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                  <Col span={24} sm={24}>
                    <Form.Item
                      label={lang("Gender")}
                      name="gender"
                      rules={[
                        {
                          required: true,
                          message: lang("Please select the gender!"),
                        },
                      ]}
                    >
                      <Radio.Group>
                        <Radio value="M">{lang("Male")} </Radio>
                        <Radio value="F">{lang("Female")} </Radio>
                        <Radio value="O">Other </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={24} md={24}>
                    <Form.Item
                      name="bio"
                      label="Bio (write About You)"
                      rules={[
                        {
                          required: true,
                          message: lang("Please write about you!"),
                        },
                      ]}
                    >
                      <Input.TextArea placeholder="Write your bio..." />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </>
        ))}

      {selectedKey === "contact" &&
        (loading ? (
          <Loader />
        ) : (
          <div>
            <h3>Update contact details:</h3>
            <Divider />
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={16}>
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
                        message: lang(
                          "Name should contain at least 2 characters!"
                        ),
                      },
                      {
                        required: true,
                        message: lang("Please enter name"),
                      },
                    ]}
                    normalize={(value) => value.trimStart()}
                  >
                    <Input
                      autoComplete="off"
                      placeholder={lang(`Enter Name`)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} md={12}>
                  <PhoneNumberField
                    rules={false}
                    label={lang("Phone Number")}
                    name="mobile"
                    placeholder={lang("Enter Phone Number")}
                    cover={{ md: 24 }}
                    colProps={{ sm: 24, span: 24 }}
                    className=""
                    onChange={handleMobileNumberChange}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12} sm={12}>
                  <Form.Item
                    label={lang(`Email Address`)}
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: lang("Email is required"),
                      },
                      {
                        type: "email",
                        message: lang("Please enter a valid email address"),
                      },
                    ]}
                    normalize={(value) => value.trimStart()}
                  >
                    <Input
                      autoComplete="off"
                      placeholder={lang(`Enter Email Address`)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} sm={12}>
                  <Form.Item
                    label={lang("Website")}
                    name="website_url"
                    rules={[
                      {
                        max: 5000,
                        message: lang(
                          "Website url should not contain more then 5000 characters!"
                        ),
                      },
                      {
                        min: 2,
                        message: lang(
                          "Website url should contain at least 2 characters!"
                        ),
                      },
                    ]}
                    normalize={(value) => value.trimStart()}
                  >
                    <Input
                      // autoComplete="off"
                      placeholder={lang(`Enter Website url`)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12} md={12}>
                  <Form.Item
                    label={lang("Pincode")}
                    name={"pincode"}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) {
                            return Promise.reject(
                              new Error(lang("Pincode is required"))
                            );
                          }

                          if (value.length < 12 || value.length > 15) {
                            return Promise.reject(
                              new Error(
                                lang("Pincode must be between 12 and 15 digits")
                              )
                            );
                          }

                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <InputNumber placeholder={lang("Enter Pincode")} />
                  </Form.Item>
                </Col>
                <Col span={12} md={12}>
                  <Form.Item name="city_id" label="City">
                    <Input placeholder="City name" />
                  </Form.Item>
                </Col>
                <Col span={12} md={12}>
                  <Form.Item name="state_id" label="State">
                    <Input placeholder="State name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="country_id" label="Country">
                    <Input placeholder="Country" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="address" label="Address">
                    <Input.TextArea placeholder="Enter address" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Form>
          </div>
        ))}
      {selectedKey === "password" && (
        <div>
          <h3>Update Password :</h3>
          <Divider />
          <Form
            id="create"
            form={form}
            onFinish={handleUpdatePassword}
            layout="vertical"
          >
            <Form.Item
              label="Old Password"
              name="old_password"
              hasFeedback
              rules={[
                { required: true, message: "Please enter the old password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="new_password"
              dependencies={["old_password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please enter the new password!" },
                {
                  pattern: new RegExp(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
                  ),
                  message:
                    "New password at least contain 8 characters, at least contain one capital letter, at least contain one small letter, at  least contain one digit, atleast contain one special character",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("old_password") === value) {
                      return Promise.reject(
                        new Error(
                          "Old password & new password must be different!"
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirm New Password"
              name="confirm_new_password"
              dependencies={["new_password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please enter the confirm password!",
                },
                {
                  pattern: new RegExp(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
                  ),
                  message:
                    "Confirm password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new_password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Confirm password & password does not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}

      {selectedKey === "support" && (
        <div style={{ padding: "0 24px", minHeight: 280 }}>
          <Card title="Reach Us At" style={{ marginTop: 16 }}>
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <div>
                <Text strong>Mobile Number</Text>
                <br />
                <Text>
                  Sales: <a href="tel:+917500996633">+91-7500996633</a>
                </Text>
                <br />
                <Text>
                  Support: <a href="tel:+918791872966">+91-8791872966</a>
                </Text>
              </div>
              <Divider />
              <div>
                <Text strong>Email</Text>
                <br />
                <Text>
                  Email:{" "}
                  <a href="mailto:support@vedmarg.com">support@vedmarg.com</a>
                </Text>
              </div>
              <Divider />
              <div>
                <Text strong>WhatsApp</Text>
                <br />
                <Text>
                  Sales: <a href="https://wa.me/917500996633">+91-7500996633</a>
                </Text>
                <br />
                <Text>
                  Support:{" "}
                  <a href="https://wa.me/918791872966">+91-8791872966</a>
                </Text>
              </div>
            </Space>
          </Card>
        </div>
      )}

      {selectedKey === "delete" && (
        <div>
          <h3>Delete Account Request:</h3>
          <Divider />
          <Form
            form={form}
            layout="vertical"
            // onFinish={onFinish}
          >
            <Row gutter={[16, 16]} className="justify-content-center">
              <Col md={16}>
                <div>
                  <h4>Why do you want to delete your account?</h4>
                </div>
                <Radio.Group
                  onChange={({ target }) => setValue(target?.value)}
                  value={value}
                >
                  {deleteAccount?.map((item, idx) => (
                    <Radio key={idx} className="d-block" value={item}>
                      {item}
                    </Radio>
                  ))}
                </Radio.Group>
              </Col>
            </Row>
            {value === "Other" ? (
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="other_reason"
                    label="Please specify the other reason:"
                  >
                    <Input.TextArea placeholder="Enter specify the other reason..." />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <Row gutter={[16, 16]} className="justify-content-center">
              <Col span={24} md={24}>
                <div>
                  <h5>
                    It will take upto 3 days and your account along with all the
                    data associated with your account will be delete
                    permanently.
                  </h5>
                </div>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
};

export default Index;
