import {
  Col,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  InputNumber,
  Card,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";

import notfound from "../../assets/images/not_found.png";
import SingleImageUpload from "../../components/SingleImageUpload";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import lang from "../../helper/langHelper";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { PhoneNumberField } from "../../components/InputField";
import moment from "moment";
import apiPath from "../../constants/apiPath";
import { castCategory, nationality, religion } from "../../constants/var";

const AddForm = ({ api, show, hide, data, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [file, setFile] = useState([]);
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sources, setSources] = useState([]);
  const [status, setStatus] = useState([]);
  const [mobileNumber, setMobileNumber] = useState({
    mobile_number: "",
    country_code: "",
  });
  const [guarMobileNumber, setGuarMobileNumber] = useState({
    mobile_number: "",
    country_code: "",
  });
  const formdata = Form.useWatch([], form);
  console.log(formdata, "formdata");
  useEffect(() => {
    if (!data) return;
    console.log(data);
    form.setFieldsValue({
      ...data,
      attended_class_id: data?.attended_class_id?._id,
      admission_class_id: data?.admission_class_id?._id,
      dob: data?.dob ? moment(data?.dob).format("DD-MM-YYYY") : "",
      mobile: data?.country_code + data?.mobile_number,
      guardian_mobile:
        data?.guardian_country_code + data?.guardian_mobile_number,
    });
    setMobileNumber({
      mobile_number: data.mobile_number,
      country_code: data.country_code,
    });
    setGuarMobileNumber({
      mobile_number: data?.guardian_mobile_number,
      country_code: data?.guardian_country_code,
    });
  }, [data]);

  useEffect(() => {
    getClass();
    getSource();
    getStatus();
  }, []);

  const getClass = () => {
    request({
      url: apiPath.common.class,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setClasses(data ?? []);
        }
      },
      onError: (error) => {
        ShowToast(error?.response?.data?.message, Severty.ERROR);
        setLoading(false);
      },
    });
  };

  const getSource = () => {
    request({
      url: apiPath.common.leadSource,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setSources(data ?? []);
        }
      },
      onError: (error) => {
        ShowToast(error?.response?.data?.message, Severty.ERROR);
        setLoading(false);
      },
    });
  };

  const getStatus = () => {
    request({
      url: apiPath.common.leadStatus,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setStatus(data ?? []);
        }
      },
      onError: (error) => {
        ShowToast(error?.response?.data?.message, Severty.ERROR);
        setLoading(false);
      },
    });
  };

  const onCreate = (values) => {
    // return console.log(values, "values");
    setLoading(true);
    const payload = {
      ...values,
    };
    payload.mobile_number = mobileNumber.mobile_number;
    payload.country_code = mobileNumber.country_code;
    payload.guardian_mobile_number = guarMobileNumber.mobile_number;
    payload.guardian_country_code = guarMobileNumber.country_code;

    request({
      url: `${data ? api.list + "/" + data._id : api.list}`,
      method: data ? "PUT" : "POST",
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

  const handleGuarMobileNumberChange = (value, data) => {
    var country_code = data.dialCode;
    setGuarMobileNumber({
      country_code: country_code,
      mobile_number: value.slice(data.dialCode.length),
    });
  };

  return (
    <Modal
      open={show}
      width={750}
      okText={data ? lang(`Update`) : lang(`Add`)}
      cancelText={lang(`Cancel`)}
      onCancel={hide}
      okButtonProps={{
        form: "create",
        htmlType: "submit",
        loading: loading,
      }}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="tab_modal"
    >
      <Form id="create" form={form} onFinish={onCreate} layout="vertical">
        <h4 className="modal_title_cls">
          {data ? lang(`Edit Lead`) : lang(`Add New Lead`)}
        </h4>
        <Row gutter={[16, 16]}>
          <Col span={24} lg={24} xs={24} className="d-flex flex-column gap-3">
            <Card className="">
              <h4 className="profile-headding">General </h4>
              <Row gutter={[12]}>
                <Col span={12} sm={12}>
                  <Form.Item
                    label={lang("Admission Class")}
                    name="admission_class_id"
                    rules={[
                      {
                        required: true,
                        message: lang("Please select the admission class!"),
                      },
                    ]}
                  >
                    <Select
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder={lang("Select Admission Class")}
                      showSearch
                    >
                      {classes.map((item) => (
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
                <Col span={12} sm={12}>
                  <Form.Item
                    label={lang("Source")}
                    name="source_id"
                    rules={[
                      {
                        required: false,
                        message: lang("Please select the source!"),
                      },
                    ]}
                  >
                    <Select
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder={lang("Select Source")}
                      showSearch
                    >
                      {sources.map((item) => (
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

                <Col span={12} sm={12}>
                  <Form.Item
                    label={lang(`Referred By`)}
                    name="referred_id"
                    rules={[
                      {
                        required: true,
                        message: lang("Referred name is required"),
                      },
                      {
                        max: 200,
                        message: lang(
                          "Name should not contain more then 200 characters!"
                        ),
                      },
                      {
                        min: 2,
                        message: lang(
                          "Name should contain at least 2 characters!"
                        ),
                      },
                    ]}
                    normalize={(value) => value.trimStart()}
                  >
                    <Input
                      autoComplete="off"
                      placeholder={lang(`Enter Referred Name`)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24} lg={24} xs={24} className="d-flex flex-column gap-3">
            <Card className="">
              <h4 className="profile-headding">Personal Details </h4>
              <Row gutter={[12]}>
                <Col span={24} sm={12}>
                  <Form.Item
                    label={lang(`Student Name`)}
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: lang("Name is required"),
                      },
                      {
                        max: 20,
                        message: lang(
                          "Name should not contain more then 20 characters!"
                        ),
                      },
                      {
                        min: 2,
                        message: lang(
                          "Name should contain at least 2 characters!"
                        ),
                      },
                    ]}
                    normalize={(value) => value.trimStart()}
                  >
                    <Input
                      autoComplete="off"
                      placeholder={lang(`Enter Student Name`)}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12}>
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

                {/* <Col span={24} sm={12}>
                  <Form.Item
                    label={lang(`Date of Birth`)}
                    name="dob"
                    rules={[
                      {
                        required: true,
                        message: lang("Please select the date of birth"),
                      },
                    ]}
                  >
                    <DatePicker
                      format={"DD-MM-YYYY"}
                      placeholder={lang("Select Date Of Birth")}
                      disabledDate={(current) =>
                        current && current > moment().endOf("day")
                      }
                    />
                  </Form.Item>
                </Col> */}

                <Col span={24} sm={12}>
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
                    <Select
                      placeholder={lang("Select Gender")}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Select.Option value="M">{lang("Male")} </Select.Option>
                      <Select.Option value="F">{lang("Female")} </Select.Option>
                      <Select.Option value="O">{lang("Other")} </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24} md={8}>
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
            </Card>
          </Col>
          <Col span={24} lg={24} xs={24} className="d-flex flex-column gap-3">
            <Card className="">
              <h4 className="profile-headding">Religion & Category </h4>
              <Row gutter={[12]}>
                <Col span={24} sm={12}>
                  <Form.Item
                    label={lang("Nationality")}
                    name="nationality"
                    rules={[
                      {
                        required: true,
                        message: lang("Please select the nationality!"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={lang("Select Nationality")}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      {nationality.map((item) => (
                        <Select.Option value={item.name} key={item.name}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24} sm={12}>
                  <Form.Item
                    label={lang("Religion")}
                    name="religion"
                    rules={[
                      {
                        required: true,
                        message: lang("Please select the religion!"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={lang("Select Religion")}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      {religion.map((item) => (
                        <Select.Option value={item.name} key={item.name}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24} sm={12}>
                  <Form.Item
                    label={lang("Category")}
                    name="category"
                    rules={[
                      {
                        required: true,
                        message: lang("Please select the Category!"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={lang("Select Category")}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      {castCategory.map((item) => (
                        <Select.Option value={item.name} key={item.name}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12} sm={12}>
                  <Form.Item
                    label={lang(`Aadhar No.`)}
                    name="aadhar_number"
                    rules={[
                      {
                        max: 15,
                        message: lang(
                          "Aadhar No. should not contain more then 15 characters"
                        ),
                      },
                      {
                        min: 12,
                        message: lang(
                          "Aadhar No. should contain at least 12 characters!"
                        ),
                      },
                    ]}
                  >
                    <InputNumber
                      autoComplete="off"
                      placeholder={lang(`Enter Aadhar No.`)}
                    />
                  </Form.Item>
                </Col>

                {/* <Col span={24} sm={12}>
                  <Form.Item
                    label={lang(`Aadhar No.`)}
                    name="aadhar_number"
                    rules={[
                      {
                        required: true,
                        message: lang("`Aadhar No. is required"),
                      },
                      {
                        min: 12,
                        message: lang(
                          "Aadhar No. should contain at least 12 characters!"
                        ),
                      },
                      {
                        max: 15,
                        message: lang(
                          "Aadhar No. should not contain more then 15 characters!"
                        ),
                      },
                    ]}
                  >
                    <InputNumber
                      autoComplete="off"
                      placeholder={lang(`Enter Aadhar No.`)}
                    />
                  </Form.Item>
                </Col> */}
              </Row>
            </Card>
          </Col>

          <Col span={24} lg={24} xs={24} className="d-flex flex-column gap-3">
            <Card className="">
              <h4 className="profile-headding">
                Last School Details (If Any):{" "}
              </h4>
              <Row gutter={[12]}>
                <Col span={24} sm={24}>
                  <Form.Item
                    label={lang(`Name & Address of School`)}
                    name="school_address"
                    rules={[
                      {
                        max: 2000,
                        message: lang(
                          "Name should not contain more then 2000 characters!"
                        ),
                      },
                      {
                        min: 2,
                        message: lang(
                          "Name should contain at least 2 characters!"
                        ),
                      },
                    ]}
                    normalize={(value) => value.trimStart()}
                  >
                    <Input
                      autoComplete="off"
                      placeholder={lang(`Enter School Name & Address`)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} sm={12}>
                  <Form.Item
                    label={lang("Attended Class")}
                    name="attended_class_id"
                    rules={[
                      {
                        required: false,
                        message: lang("Please select the Attended Class!!"),
                      },
                    ]}
                  >
                    <Select
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder={lang("Select Attended Class")}
                      showSearch
                    >
                      {classes.map((item) => (
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
                    label={lang(`Pincode`)}
                    name="school_pincode"
                    rules={[
                      {
                        max: 12,
                        message: lang(
                          "Pincode should not contain more then 12 characters!"
                        ),
                      },
                      {
                        min: 4,
                        message: lang(
                          "Pincode should contain at least 4 characters!"
                        ),
                      },
                    ]}
                  >
                    <InputNumber
                      autoComplete="off"
                      placeholder={lang(`Enter Pincode`)}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12}>
                  <Form.Item
                    label={lang("City")}
                    name="city_id"
                    rules={[
                      {
                        required: true,
                        message: lang("Please select the City!"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={lang("Select City")}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Select.Option value="City">
                        {lang("City")}{" "}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24} sm={12}>
                  <Form.Item
                    label={lang("Country")}
                    name="country_id"
                    rules={[
                      {
                        required: true,
                        message: lang("Please select the Country!"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={lang("Select Country")}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Select.Option value="Country">
                        {lang("Country")}{" "}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24} sm={12}>
                  <Form.Item
                    label={lang(`Address`)}
                    name="address"
                    rules={[
                      {
                        max: 2000,
                        message: lang(
                          "Address should not contain more then 2000 characters!"
                        ),
                      },
                      {
                        min: 2,
                        message: lang(
                          "Address should contain at least 2 characters!"
                        ),
                      },
                    ]}
                  >
                    <Input.TextArea
                      autoComplete="off"
                      placeholder={lang(`Enter  Address`)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} sm={12}>
                  <Form.Item
                    label={lang("Status")}
                    name="lead_status_id"
                    rules={[
                      {
                        required: false,
                        message: lang("Please select the Status!"),
                      },
                    ]}
                  >
                    <Select
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder={lang("Select Lead Status")}
                      showSearch
                    >
                      {status.map((item) => (
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

                <Col span={12} sm={12}>
                  <Form.Item
                    label={lang(`Remark`)}
                    name="remark"
                    rules={[
                      {
                        max: 2000,
                        message: lang(
                          "Remark should not contain more then 2000 characters!"
                        ),
                      },
                      {
                        min: 2,
                        message: lang(
                          "Remark should contain at least 2 characters!"
                        ),
                      },
                    ]}
                  >
                    <Input.TextArea
                      autoComplete="off"
                      placeholder={lang(`Enter  Remark`)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24} lg={24} xs={24} className="d-flex flex-column gap-3">
            <Card className="">
              <h4 className="profile-headding">Parents Details: </h4>
              <Row gutter={[12]}>
                <Col span={24} sm={12}>
                  <Form.Item
                    label={lang(`Father/Guardian`)}
                    name="guardian_name"
                    rules={[
                      {
                        max: 2000,
                        message: lang(
                          "Name should not contain more then 2000 characters!"
                        ),
                      },
                      {
                        min: 2,
                        message: lang(
                          "Name should contain at least 2 characters!"
                        ),
                      },
                    ]}
                    normalize={(value) => value.trimStart()}
                  >
                    <Input
                      autoComplete="off"
                      placeholder={lang(`Enter  Name`)}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12}>
                  <Form.Item
                    label={lang(`Relation`)}
                    name="relation"
                    rules={[
                      {
                        max: 2000,
                        message: lang(
                          "relation should not contain more then 2000 characters!"
                        ),
                      },
                      {
                        min: 2,
                        message: lang(
                          "relation should contain at least 2 characters!"
                        ),
                      },
                    ]}
                    normalize={(value) => value.trimStart()}
                  >
                    <Input
                      autoComplete="off"
                      placeholder={lang(`Enter Relation`)}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12}>
                  <Form.Item
                    label={lang(`Email Address`)}
                    name="guardian_email"
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
                <Col span={24} sm={12}>
                  <Form.Item
                    label={lang(`Occupation (INR)`)}
                    name="guardian_occupation"
                  >
                    <InputNumber
                      autoComplete="off"
                      placeholder={lang(`Enter Occupation`)}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} md={8}>
                  <PhoneNumberField
                    rules={false}
                    label={lang("Phone Number")}
                    name="guardian_mobile"
                    placeholder={lang("Enter Phone Number")}
                    cover={{ md: 24 }}
                    colProps={{ sm: 24, span: 24 }}
                    className=""
                    onChange={handleGuarMobileNumberChange}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddForm;
