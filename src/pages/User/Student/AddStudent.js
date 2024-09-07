import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Severty, ShowToast } from "../../../helper/toast";
import useRequest from "../../../hooks/useRequest";
import UploadImage from "./_UploadImage";
import { useAppContext } from "../../../context/AppContext";
import lang from "../../../helper/langHelper";
import { useNavigate, useParams } from "react-router";
import apiPath from "../../../constants/apiPath";

const AddForm = ({}) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const navigate = useNavigate();
  const params = useParams();
  const [data, setData] = useState(null);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState({
    mobile_number: "",
    country_code: "",
  });
  const [pMobileNumber, setPMobileNumber] = useState({
    mobile_number: "",
    country_code: "",
  });
  const [oMobileNumber, setOMobileNumber] = useState({
    mobile_number: "",
    country_code: "",
  });
  const FileType = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/avif",
    "image/webp",
    "image/gif",
  ];

  const handleChange = (value, data) => {
    var country_code = data.dialCode;
    setMobileNumber({
      country_code: country_code,
      mobile_number: value.slice(data.dialCode.length),
    });
  };

  const handlePChange = (value, data) => {
    var country_code = data.dialCode;
    setPMobileNumber({
      country_code: country_code,
      mobile_number: value.slice(data.dialCode.length),
    });
  };

  const handleOChange = (value, data) => {
    var country_code = data.dialCode;
    setOMobileNumber({
      country_code: country_code,
      mobile_number: value.slice(data.dialCode.length),
    });
  };

  const getData = (id) => {
    request({
      url: `${apiPath.viewStudent}/${id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setData(data);
        }
      },
    });
  };

  useEffect(() => {
    if (!params.id) return;
    getData(params.id);
  }, [params.id]);

  useEffect(() => {
    if (!data) return;

    form.setFieldsValue({
      ...data,
      dob: data?.dob ? moment(data?.dob) : "",
      join_date: data?.join_date ? moment(data?.join_date) : "",
      mobile: data.country_code + data.mobile_number,
      parent_mobile: data?.Parent_country_code + data?.parent_mobile_number,
      other_mobile:
        data?.Parent_other_country_code + data?.parent_other_mobile_number,
    });

    setImage(data?.image);
    setMobileNumber({
      mobile_number: data.mobile_number,
      country_code: data.country_code,
    });
    setPMobileNumber({
      mobile_number: data?.parent_mobile_number,
      country_code: data?.Parent_country_code,
    });
    setOMobileNumber({
      mobile_number: data?.parent_other_mobile_number,
      country_code: data?.Parent_other_country_code,
    });
  }, [data]);

  const onCreate = (values) => {
    const payload = { ...values };
    setLoading(true);

    payload.dob = values?.dob ? moment(values?.dob).format("YYYY-MM-DD") : null;

    payload.mobile_number = mobileNumber.mobile_number;
    payload.country_code = mobileNumber.country_code;
    payload.parent_mobile_number = pMobileNumber.mobile_number;
    payload.Parent_country_code = pMobileNumber.country_code;
    payload.parent_other_mobile_number = oMobileNumber.mobile_number;
    payload.Parent_other_country_code = oMobileNumber.country_code;
    payload.image = image;
    request({
      url: `${
        data
          ? apiPath.addEditCustomer + "/" + data._id
          : apiPath.addEditCustomer
      }`,
      method: data ? "PUT" : "POST",
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

  const classOption = [
    {
      name: "ukg",
      label: "UKG",
    },
    {
      name: "hkg",
      label: "HKG",
    },
    {
      name: "lkg",
      label: "LKG",
    },
    {
      name: "nursary",
      label: "Nursary",
    },
    {
      name: "1",
      label: "1th",
    },
    {
      name: "2",
      label: "2th",
    },
    {
      name: "3",
      label: "3th",
    },
    {
      name: "4",
      label: "4th",
    },
    {
      name: "5",
      label: "5th",
    },
    {
      name: "6",
      label: "6th",
    },
    {
      name: "7",
      label: "7th",
    },
    {
      name: "8",
      label: "8th",
    },
    {
      name: "9",
      label: "9th",
    },
    {
      name: "10",
      label: "10th",
    },
    {
      name: "11_science",
      label: "11th Science",
    },
    {
      name: "11_arts",
      label: "11th Art's",
    },
    {
      name: "12_science",
      label: "12th Science",
    },
    {
      name: "12_arts",
      label: "12th Art's",
    },
  ];

  return (
    <Form
      id="create"
      form={form}
      onFinish={onCreate}
      layout="vertical"
      initialValues={{
        dob: moment("01-01-1990", "DD-MM-YYYY"),
        join_date: moment(),
      }}
    >
      <div className="add_user_title">
        <h4 className="modal_title_cls">{`${
          data
            ? lang("Edit Student") /* sectionName */
            : lang("Add Student") /* sectionName */
        }`}</h4>
      </div>
      <Row gutter={[16, 0]}>
        {/* <Col span={24}>
          <div className="text-center">
            <Form.Item
              className="upload_wrap"
              // rules={[
              //   {
              //     validator: (_, value) => {
              //       if (image) {
              //         return Promise.resolve();
              //       }
              //       return Promise.reject(
              //         new Error(lang("Profile image is required")),
              //       );
              //     },
              //   },
              // ]}
              name="image"
            >
              <UploadImage preview={false} value={image} setImage={setImage} />
            </Form.Item>
          </div>
        </Col> */}

        <Col span={24} sm={12}>
          <Form.Item
            label={lang(`Name`)}
            name="name"
            rules={[
              { required: true, message: lang("Please enter the full name") },
              {
                max: 100,
                message: lang(
                  "Name should not contain more then 100 characters!"
                ),
              },
              {
                min: 2,
                message: lang("Name should contain at least 2 characters!"),
              },
            ]}
            normalize={(value) => value.trimStart()}
          >
            <Input autoComplete="off" placeholder={lang(`Enter Full Name`)} />
          </Form.Item>
        </Col>

        <Col span={24} lg={12} sm={12}>
          <Form.Item
            label={lang("Email ID")}
            name="email"
            rules={[
              {
                type: "email",
                message: lang("The email is not a valid email!"),
              },
              { required: false, message: lang("Please enter the email!") },
              {
                max: 50,
                message: lang(
                  "Email should not contain more then 50 characters!"
                ),
              },
              {
                min: 5,
                message: lang("Email should contain at least 5 characters!"),
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

        <Col span={24} lg={12} sm={12} className="flagMobileNumber">
          <Form.Item
            label={lang("Mobile Number")}
            name="mobile"
            rules={[
              {
                required: false,
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

        <Col span={24} sm={12}>
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
        </Col>

        <Col span={24} sm={12}>
          <Form.Item
            label={lang("Gender")}
            name="gender"
            rules={[
              { required: true, message: lang("Please select the gender!") },
            ]}
          >
            <Select
              placeholder={lang("Select Gender")}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <Select.Option value="M">{lang("Male")} </Select.Option>
              <Select.Option value="F">{lang("Female")} </Select.Option>
              <Select.Option value="O">Other </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={24} sm={12}>
          <Form.Item
            label={lang("ClassName")}
            name="classname"
            rules={[
              { required: true, message: lang("Please select the ClassName!") },
            ]}
          >
            <Select
              placeholder={lang("Select Class Name")}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {classOption?.map((item) => (
                <Select.Option value={item.name}>{item.label} </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24} sm={24}>
          <Form.Item
            label={lang(`Current Address`)}
            name="c_address"
            rules={[
              { required: true, message: lang("Please enter the Address!") },
              {
                max: 1000,
                message: lang(
                  "Address should not contain more then 1000 characters!"
                ),
              },
              {
                min: 2,
                message: lang("Address should contain at least 2 characters!"),
              },
            ]}
            normalize={(value) => value.trimStart()}
          >
            <Input.TextArea
              autoComplete="off"
              placeholder={lang(`Enter Address`)}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={24}>
          <Form.Item
            label={lang(`Parmanent Address`)}
            name="p_address"
            rules={[
              { required: true, message: lang("Please enter the Address!") },
              {
                max: 1000,
                message: lang(
                  "Address should not contain more then 1000 characters!"
                ),
              },
              {
                min: 2,
                message: lang("Address should contain at least 2 characters!"),
              },
            ]}
            normalize={(value) => value.trimStart()}
          >
            <Input.TextArea
              autoComplete="off"
              placeholder={lang(`Enter Address`)}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={24}>
          <div>
            <h4>Official Details</h4>
          </div>
        </Col>
        <Col span={24} sm={12}>
          <Form.Item
            label={lang(`Addmission Number`)}
            name="addmission_number"
            rules={[
              {
                required: false,
                message: lang("Please enter the addmisssion number"),
              },
            ]}
          >
            <InputNumber
              autoComplete="off"
              placeholder={lang(`Enter Addmission Number`)}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12}>
          <Form.Item
            label={lang(`Joining Date`)}
            name="join_date"
            rules={[
              {
                required: true,
                message: lang("Please select the date of join date"),
              },
            ]}
          >
            <DatePicker
              format={"DD-MM-YYYY"}
              placeholder={lang("Select Join Date")}
              disabledDate={(current) =>
                current && current > moment().endOf("day")
              }
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12}>
          <Form.Item
            label={lang(`Roll Number`)}
            name="roll_number"
            rules={[
              {
                required: true,
                message: lang("Please enter the to roll number"),
              },
            ]}
          >
            <InputNumber
              autoComplete="off"
              placeholder={lang(`Enter Roll Number`)}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={24}>
          <h4>Parents Details</h4>
        </Col>
        <Col span={24} sm={12}>
          <Form.Item
            label={lang(`Father Name`)}
            name="father_name"
            rules={[
              { required: true, message: lang("Please enter the full name") },
              {
                max: 100,
                message: lang(
                  "Name should not contain more then 100 characters!"
                ),
              },
              {
                min: 2,
                message: lang("Name should contain at least 2 characters!"),
              },
            ]}
            normalize={(value) => value.trimStart()}
          >
            <Input autoComplete="off" placeholder={lang(`Enter Full Name`)} />
          </Form.Item>
        </Col>
        <Col span={24} sm={12}>
          <Form.Item
            label={lang(`Mother Name`)}
            name="mother_name"
            rules={[
              { required: true, message: lang("Please enter the full name") },
              {
                max: 100,
                message: lang(
                  "Name should not contain more then 100 characters!"
                ),
              },
              {
                min: 2,
                message: lang("Name should contain at least 2 characters!"),
              },
            ]}
            normalize={(value) => value.trimStart()}
          >
            <Input autoComplete="off" placeholder={lang(`Enter Full Name`)} />
          </Form.Item>
        </Col>
        <Col span={24} sm={12}>
          <Form.Item
            label={lang(`Occupation`)}
            name="occupation"
            rules={[
              {
                required: false,
                message: lang("Please enter the Occupation!"),
              },
            ]}
          >
            <InputNumber
              autoComplete="off"
              placeholder={lang(`Enter Occupation`)}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12} sm={12}>
          <Form.Item
            label={lang("Email ID")}
            name="parent_email"
            rules={[
              {
                type: "email",
                message: lang("The email is not a valid email!"),
              },
              { required: true, message: lang("Please enter the email!") },
              {
                max: 50,
                message: lang(
                  "Email should not contain more then 50 characters!"
                ),
              },
              {
                min: 5,
                message: lang("Email should contain at least 5 characters!"),
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
        <Col span={24} lg={12} sm={12} className="flagMobileNumber">
          <Form.Item
            label={lang("Mobile Number")}
            name="parent_mobile"
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
                name: "parent_mobile",
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
              onChange={handlePChange}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12} sm={12} className="flagMobileNumber">
          <Form.Item
            label={lang("Other Mobile Number")}
            name="other_mobile"
            rules={[
              {
                required: false,
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
                name: "other_mobile",
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
              onChange={handleOChange}
            />
          </Form.Item>
        </Col>
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
    // </Modal>
  );
};

export default AddForm;
