import {
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Radio,
} from "antd";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import notfound from "../../assets/images/not_found.png";
import SingleImageUpload from "../../components/SingleImageUpload";
import apiPath from "../../constants/apiPath";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import moment from "moment";
import { useAppContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import BannerImageUpload from "../../components/BannerImageUpload";
const bannerPositions = [
  { name: "Top banner", label: lang("Top Banner") },
  // { name: "Mid banner", label: "Mid Banner" },
  { name: "Bottom banner", label: lang("Bottom Banner") },
];

const FileType = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/avif",
  "image/webp",
  "image/gif",
];

const AdvertisementBannerForm = ({ section, show, hide, data, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const { country, cities } = useAppContext();

  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState();
  const [file, setFile] = useState();
  const [bannerFor, setBannerFor] = useState([]);
  const [bannerLink, setBannerLink] = useState(false);

  const handleImage = (data) => {
    data.length > 0 ? setImage(data[0].url) : setImage();
  };

  const getCategory = () => {
    request({
      url: apiPath.allCategory,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setBannerFor(data);
          console.log(data, "getCategory");
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const getServices = () => {
    request({
      url: apiPath.Services,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setBannerFor(data);
          console.log(data, "getServices");
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const getProvider = () => {
    request({
      url: apiPath.allProivder,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setBannerFor(data);
          console.log(data, "getProvider");
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const onCreate = (values) => {
    let payload = {
      ...values,
      image: image,
    };

    setLoading(true);

    request({
      url: data ? apiPath.banner + "/" + data._id : apiPath.banner,
      method: data ? "PUT" : "POST",
      data: payload,
      onSuccess: (data) => {
        setLoading(false);
        console.log("data", data);
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

  useEffect(() => {
    if (!!data) {
      form.setFieldsValue({
        ...data,
        start_date: moment(data.start_date),
        end_date: moment(data.end_date),
      });

      setImage(data.image);

      setFile(data.image);
    }
    handleTypeChange(data?.banner_for);
  }, [data]);

  const linkType = [
    {
      name: "Category",
      label: "Category",
    },
    {
      name: "Serivce",
      label: "Serivce",
    },
    {
      name: "Provider",
      label: "Provider",
    },
    {
      name: "Normal",
      label: "Normal",
    },
  ];

  const handleTypeChange = (value) => {
    setBannerLink(false);

    if (value === "Category") {
      getCategory();
    } else if (value === "Serivce") {
      getServices();
    } else if (value === "Provider") {
      getProvider();
    } else if (value === "Normal") {
      setBannerFor([]);
      setBannerLink(true);
    }
  };

  return (
    <Modal
      width={750}
      open={show}
      okText={data ? lang("Update") : lang("Add")}
      onCancel={hide}
      okButtonProps={{
        form: "create",
        htmlType: "submit",
        loading: loading,
      }}
      initialValue={{
        is_active: true,
      }}
      className="tab_modal"
    >
      <Form id="create" form={form} onFinish={onCreate} layout="vertical">
        <h4 className="modal_title_cls">
          {data ? lang("Edit Banner") : lang("Add Banner")}
        </h4>
        <Row gutter={[16, 0]} className="w-100">
          <Col span={24}>
            <Form.Item
              className=""
              rules={[
                {
                  validator: (_, value) => {
                    if (image) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(lang("Image is required")));
                  },
                },
              ]}
              label={lang("Upload Banner Image")}
              name="image"
            >
              <BannerImageUpload
                value={image}
                fileType={FileType}
                btnName={"Image"}
                imageType="advertisement"
                onChange={(data) => handleImage(data)}
                isDimension={true}
              />
              <p className="img-size-details">
                **
                {lang(
                  "Images should be 600x400 for best view in gallery image. You can select only (.gif, .png, .jpeg, .jpg) format files upto 1 MB file size"
                )}
                ..!!!
              </p>
              {
                <div className="mt-2">
                  <Image width={120} src={image ? image : notfound}></Image>
                </div>
              }
            </Form.Item>
          </Col>

          <Col span={12} md={12}>
            <Form.Item
              label={lang("Start Date")}
              name="start_date"
              rules={[
                {
                  required: true,
                  message: lang("Please select the start date"),
                },
              ]}
            >
              <DatePicker
                format={"DD-MM-YYYY"}
                placeholder={lang("Select Start Date")}
                disabledDate={(current) =>
                  current && current < moment().endOf("day")
                }
              />
            </Form.Item>
          </Col>

          <Col span={12} md={12}>
            <Form.Item
              label={lang("End Date")}
              name="end_date"
              dependencies={["start_date"]}
              rules={[
                {
                  required: true,
                  message: lang("Please select the end date"),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("start_date") > value) {
                      return Promise.reject(
                        lang("End date is not less than start date")
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                format={"DD-MM-YYYY"}
                placeholder={lang("Select End Date")}
                disabledDate={(current) =>
                  current && current < moment().endOf("day")
                }
              />
            </Form.Item>
          </Col>

          <Col span={24} sm={24} md={12}>
            <Form.Item
              name="position"
              label={lang("Banner Position")}
              rules={[
                {
                  required: true,
                  message: lang("Please select the Banner Position"),
                },
              ]}
            >
              <Select
                placeholder={lang("Select Banner Position")}
                className="w-100"
              >
                {bannerPositions.map((item, index) => (
                  <option key={item.name} value={item.name}>
                    <span className="cap">{item.label}</span>
                  </option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12} md={12}>
            <Form.Item
              label={lang("Type")}
              name="banner_for"
              rules={[
                {
                  required: true,
                  message: lang("Please Select a Type"),
                },
              ]}
            >
              <Select
                onChange={(e) => {
                  handleTypeChange(e);
                  form.setFieldsValue({ banner_for_id: [] });
                }}
                placeholder="Select Banner For"
              >
                {linkType.map((item) => (
                  <Select.Option key={item.name} value={item.name}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {
            bannerFor.length > 0  ?
            <Col span={24} md={24}>
              <Form.Item
                label={lang("Banner For")}
                name="banner_for_id"
                rules={[
                  {
                    required: true,
                    message: lang("Please Select a item"),
                  },
                ]}
              >
                <Select
                  placeholder="Select Banner For"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {bannerFor?.map((item) => (
                   
                    <Select.Option
                      key={item._id}
                      label={item.name}
                      value={item._id}
                    >
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
             : ""
          }

          {bannerLink && (
            <Col span={24} md={24}>
              <Form.Item
                label={lang("Banner Link")}
                name="banner_link"
                rules={[
                  {
                    required: true,
                    message: lang("Please Enter the Link"),
                  },
                ]}
              >
                <Input placeholder="Enter Link" />
              </Form.Item>
            </Col>
          )}

          <Col span={24} sm={24} md={12}>
            <Form.Item
              name="rotation_time"
              label={lang("Rotation Time")}
              rules={[
                {
                  required: true,
                  message: lang("Please select the rotation Time"),
                },
              ]}
            >
              <InputNumber placeholder="Enter Seconds" />
            </Form.Item>
          </Col>
          <Col span={12} sm={12}>
            <div className="status_wrap">
              <Form.Item
                label={lang("Status")}
                name="is_active"
                initialValue={true}
              >
                <Radio.Group>
                  <Radio value={true}>{lang("Active")}</Radio>
                  <Radio value={false}>{lang("De-Active")}</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AdvertisementBannerForm;
