import {
  Col,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Checkbox,
  Button,
  Space,
  InputNumber,
} from "antd";
import React, { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import notfound from "../../assets/images/not_found.png";
import SingleImageUpload from "../../components/SingleImageUpload";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import { useAppContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import apiPath from "../../constants/apiPath";

const AddForm = ({ api, show, hide, data, refresh, paramsIds }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [file, setFile] = useState([]);
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const { country } = useAppContext();
  const [showOptions, setShowOptions] = useState(false);

  const getServices = (id) => {
    request({
      url: `${apiPath.allServices}/${id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setServices(data);
        }
        console.log(data, "data");
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const getCategory = () => {
    request({
      url: apiPath.allCategory,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setCategory(data);
        }
        console.log(data, "data");
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const getSubCategory = (id) => {
    console.log("evalue", id);

    request({
      url: `${apiPath.allSubCategory}/${id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setSubCategory(data);
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const FileType = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/gif",
  ];

  const handleImage = (data) => {
    //setImage(data);
    data.length > 0 ? setFile(data[0].url) : setFile([]);
    data.length > 0 ? setImage(data[0].url) : setImage([]);
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    if (!paramsIds) return;
    form.setFieldsValue({
      category_id: paramsIds?.category_id,
      service_id: paramsIds?.service_id,
    });
    getCategory();
    getServices(paramsIds?.category_id);
    console.log("paramsIds", paramsIds);
  }, [paramsIds]);

  useEffect(() => {
    if (!data) return;
    console.log(data);
    form.setFieldsValue({
      ...data,
      category_id: data?.category_id?._id,
      service_id: data?.service_id
        ? data?.service_id?.map(({ _id }) => _id)
        : [],
      // sub_category_id: data?.sub_category_id?._id,
    });

    setFile([data.image]);
    setImage(data.image);
    getCategory();
    getServices(data?.category_id?._id);

    // getSubCategory(data?.category_id?._id);

    if (
      data.type === "radio" ||
      data.type === "checkbox" ||
      data.type === "dropdown"
    ) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  }, [data]);

  const onCreate = (values) => {
    console.log(values, "values");
    const payload = {
      ...values,
      country_id: country.country_id,
      category_id: values.category_id,
      // sub_category_id: values.sub_category_id,
    };

    setLoading(true);

    if (image?.length > 0) {
      payload.image = image;
    }

    request({
      url: `${data ? api.addEdit + "/" + data._id : api.addEdit}`,
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
        ShowToast(error.response.data.message, Severty.ERROR);
        setLoading(false);
      },
    });
  };

  const handleOptions = (val) => {
    if (val === "radio" || val === "checkbox" || val === "dropdown") {
      setShowOptions(true);
      form.setFieldsValue({ options: [{ name: "", ar_name: "" }] });
      console.log(val, "handleOptions");
    } else {
      setShowOptions(false);
    }
  };

  const attributeOption = [
    {
      label: "Dropdown",
      value: "dropdown",
    },
    {
      label: "Radio",
      value: "radio",
    },
    {
      label: "Button",
      value: "button",
    },
    {
      label: "Checkbox",
      value: "checkbox",
    },
    {
      label: "Input",
      value: "input",
    },
    {
      label: "Calendar",
      value: "calendar",
    },
    {
      label: "File",
      value: "file",
    },
    {
      label: "Textbox",
      value: "textbox",
    },
  ];

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
      <Form
        id="create"
        form={form}
        onFinish={onCreate}
        layout="vertical"
        initialValues={{
          is_active: true,
          options: [{ name: "", ar_name: "" }],
        }}
      >
        <h4 className="modal_title_cls">
          {data ? lang(`Edit Attribute`) : lang(`Add New Attribute`)}
        </h4>
        <Row gutter={[16, 0]}>
          <Col span={12} md={12}>
            <Form.Item
              label={lang("Category Name")}
              name="category_id"
              rules={[
                {
                  required: true,
                  message: lang("Please select the category!"),
                },
              ]}
            >
              <Select
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder={lang("Select Category")}
                showSearch
                onChange={(value, key) => {
                  getServices(value);
                  form.setFieldsValue({ service_id: [] });
                }}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {category.map((item) => (
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

          {/* <Col span={12} md={12}>
            <Form.Item
              label={lang(`Sub Category Name`)}
              name="sub_category_id"
              rules={[
                {
                  required: true,
                  message: lang("Please select the sub category!"),
                },
              ]}
            >
              <Select
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder={lang("Select Sub Category")}
                showSearch
                mode="single"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {subCategory.map((item) => (
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
          <Col span={12} md={12}>
            <Form.Item
              label={lang("Service Name")}
              name="service_id"
              rules={[
                {
                  required: true,
                  message: lang("Please select the Service!"),
                },
              ]}
            >
              <Select
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder={lang("Select service")}
                showSearch
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                mode="multiple"
              >
                {services?.map((item) => (
                  <Select.Option
                    key={item?._id}
                    label={item?.name}
                    value={item?._id}
                  >
                    {item?.name}{" "}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item
              label={lang(`Attribute Name`)}
              name="name"
              rules={[
                {
                  required: true,
                  message: lang("Name is required"),
                },
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
              <Input
                autoComplete="off"
                placeholder={lang(`Enter Attribute Name`)}
              />
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item
              label={lang(`Attribute Name Arabic`)}
              name="ar_name"
              rules={[
                {
                  required: true,
                  message: lang("Arabic Name is required"),
                },
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
              <Input autoComplete="off" placeholder={`أدخل اسم الفئة`} />
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item
              label={lang("Attribute Sort Order")}
              name="sort"
              rules={[
                {
                  required: true,
                  message: lang("Attribute Sort Order is required"),
                },
              ]}
              // normalize={(value) => value.trimStart()}
            >
              <InputNumber
                maxLength={5}
                autoComplete="off"
                placeholder={`Enter Attribute Sort Order`}
              />
            </Form.Item>
          </Col>

          <Col span={12} sm={12}>
            <Form.Item
              label={lang(`Type`)}
              name="type"
              rules={[
                {
                  required: true,
                  message: lang("Please select the Attribute type!"),
                },
              ]}
            >
              <Select
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder={lang("Select Attribute")}
                showSearch
                mode="single"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                onChange={(val) => {
                  handleOptions(val);
                  // form.setFieldsValue({ options: null });
                }}
              >
                {attributeOption.map((item) => (
                  <Select.Option
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  >
                    {item.label}{" "}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {/* {showOptions ? (
            <Col span={24} sm={24}>
              <Form.List
                name="options"
                className="mt-2"
                initialValue={[{ name: "", ar_name: "" }]}
              >
                {(fields, { add, remove }, { form }) => (
                  <>
                    {fields.map((field_fr, index_fr) => (
                      <div key={field_fr.key}>
                        <Space
                          key={field_fr.key}
                          align="baseline"
                          className="gap-cls"
                        >
                          <Row gutter={[16, 0]}>
                            <Col span={24} sm={9}>
                              <Form.Item
                                className="qty-cls"
                                {...field_fr}
                                name={[field_fr.name, "name"]}
                                label={lang("Add Attribute Option")}
                                rules={[
                                  {
                                    required: true,
                                    message: lang(
                                      "Please enter attribute option",
                                    ),
                                  },
                                ]}
                                normalize={(value) => value.trimStart()}
                              >
                                <Input
                                  autoComplete="off"
                                  placeholder={lang(`Add Attribute Option`)}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={16} sm={10} lg={9}>
                              <Form.Item
                                className="qty-cls"
                                {...field_fr}
                                name={[field_fr.name, "ar_name"]}
                                label={lang("Add Attribute Option Arabic")}
                                rules={[
                                  {
                                    required: true,
                                    message: lang(
                                      "Please enter attribute option",
                                    ),
                                  },
                                ]}
                                normalize={(value) => value.trimStart()}
                              >
                                <Input
                                  autoComplete="off"
                                  placeholder={`إضافة خيار الاختيار`}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={8} sm={5} lg={6} className="mt-4">
                              <div className="add-menu-items-delete">
                                {index_fr > 0 ? (
                                  <div className="minus-wrap">
                                    <DeleteOutlined
                                      className="delete-circal"
                                      onClick={() => remove(field_fr.name)}
                                      style={{ borderRadius: "50%" }}
                                    />
                                  </div>
                                ) : null}
                                <Form.Item className="addon-items">
                                  <Button
                                    onClick={() => add()}
                                    block
                                    className="primary_btn btnStyle"
                                  >
                                    <i class="fas fa-plus me-1"></i>
                                    {lang("Add")}
                                  </Button>
                                </Form.Item>
                              </div>
                            </Col>
                          </Row>
                        </Space>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
            </Col>
          ) : (
            ""
          )} */}
          {showOptions && (
            <Col span={24} sm={24}>
              <Form.List
                name="options"
                className="mt-2"
                initialValue={[{ name: "", ar_name: "" }]}
              >
                {(fields, { add, remove }, { form }) => (
                  <>
                    {fields.map((field, index) => (
                      <div key={field.key}>
                        <Space
                          key={field.key}
                          align="baseline"
                          className="gap-cls"
                        >
                          <Row gutter={[16, 0]}>
                            <Col span={24} sm={9}>
                              <Form.Item
                                className="qty-cls"
                                {...field}
                                name={[field.name, "name"]}
                                label={lang("Add Attribute Option")}
                                rules={[
                                  {
                                    required: true,
                                    message: lang(
                                      "Please enter attribute option",
                                    ),
                                  },
                                ]}
                                normalize={(value) => value.trimStart()}
                              >
                                <Input
                                  autoComplete="off"
                                  placeholder={lang("Add Attribute Option")}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={16} sm={10} lg={9}>
                              <Form.Item
                                className="qty-cls"
                                {...field}
                                name={[field.name, "ar_name"]}
                                label={lang("Add Attribute Option Arabic")}
                                rules={[
                                  {
                                    required: true,
                                    message: lang(
                                      "Please enter attribute option",
                                    ),
                                  },
                                ]}
                                normalize={(value) => value.trimStart()}
                              >
                                <Input
                                  autoComplete="off"
                                  placeholder={`إضافة خيار الاختيار`}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={8} sm={5} lg={6} className="mt-4">
                              <div className="add-menu-items-delete">
                                {index === fields.length - 1 ? (
                                  <Form.Item className="addon-items">
                                    <Button
                                      onClick={() => add()}
                                      block
                                      className="primary_btn btnStyle"
                                    >
                                      <i class="fas fa-plus me-1"></i>
                                      {lang("Add")}
                                    </Button>
                                  </Form.Item>
                                ) : (
                                  <div className="minus-wrap">
                                    <DeleteOutlined
                                      className="delete-circal"
                                      onClick={() => remove(field.name)}
                                      style={{ borderRadius: "50%" }}
                                    />
                                  </div>
                                )}
                              </div>
                            </Col>
                          </Row>
                        </Space>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
            </Col>
          )}
          <Col span={24} sm={24}>
            <div className="status_wrap">
              <Form.Item label={lang("Status")} name="is_active">
                <Radio.Group>
                  <Radio value={true}>{lang("Active")}</Radio>
                  <Radio value={false}>{lang("De-Active")}</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </Col>
          <Col span={12} sm={12}>
            <Form.Item
              label={lang("")}
              name="is_required"
              valuePropName="checked"
            >
              <Checkbox>Required</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddForm;
