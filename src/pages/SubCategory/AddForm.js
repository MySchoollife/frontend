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
} from "antd";
import React, { useEffect, useState } from "react";

import notfound from "../../assets/images/not_found.png";
import SingleImageUpload from "../../components/SingleImageUpload";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import { useAppContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";

const AddForm = ({ api, show, hide, data, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [file, setFile] = useState([]);
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);

  const { country } = useAppContext();

  const getCategory = () => {
    request({
      url: api.category,
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

  // const getCountry = () => {
  //   request({
  //     url: `/country`,
  //     method: "GET",
  //     onSuccess: ({ data, status }) => {
  //       if (status) {
  //         setCountry(data)
  //       }
  //     },
  //   });
  // };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    if (!data) return;
    console.log(data);
    form.setFieldsValue({ ...data, category_id: data?.category_id._id });
    setFile([data.image]);
    setImage(data.image);
    console.log("data?.category_id", data?.category_id._id);
  }, [data]);

  const onCreate = (values) => {
    const {
      name,
      ar_name,
      is_active,
      category_id,
      is_featured,
      is_request_quote,
    } = values;
    console.log(values, "values");
    const payload = { country_id: country.country_id };
    setLoading(true);
    payload.name = name;
    payload.ar_name = ar_name;
    payload.is_active = is_active;
    payload.is_request_quote = is_request_quote;
    payload.is_featured = is_featured;
    payload.category_id = category_id;
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
        }}
      >
        <h4 className="modal_title_cls">
          {data ? lang(`Edit Sub Category`) : lang(`Add New Sub Category`)}
        </h4>
        <Row gutter={[16, 0]}>
          <Col span={24} sm={24}>
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
          <Col span={24} sm={12}>
            <Form.Item
              label={lang(`Sub Category Name`)}
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
                placeholder={lang(`Enter Sub Category Name`)}
              />
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item
              label={lang(`Sub Category Name Arabic`)}
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

          {/* <Col span={24} sm={24}>
            <Form.Item
              label="Country"
              name="country_id"
              rules={[
                { required: true, message: "Please select the country!" },
              ]}
            >
              <Select
                filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                autoComplete="off" placeholder="Select Country" showSearch >
                {
                  country.map(item => <Select.Option key={item._id} label={item.name} value={item._id}>{item.name} </Select.Option>)
                }
              </Select>
            </Form.Item>
          </Col> */}

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
              name="is_featured"
              valuePropName="checked"
            >
              <Checkbox>Featured</Checkbox>
            </Form.Item>
          </Col>
          <Col span={12} sm={12}>
            <Form.Item
              label={lang("")}
              name="is_request_quote"
              valuePropName="checked"
            >
              <Checkbox>Request Quote</Checkbox>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              className=""
              rules={[
                {
                  validator: (_, value) => {
                    if (value !== undefined && value?.length > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(lang("Image is required")));
                  },
                },
              ]}
              label={lang("Upload Image")}
              name="image"
            >
              <SingleImageUpload
                value={image}
                fileType={FileType}
                imageType={"category"}
                btnName={"Image"}
                onChange={(data) => handleImage(data)}
                isDimension={false}
              />
            </Form.Item>
            {/* <p className="img-size-details">
              **
              {lang(
                "Images should be 600x600 for best view in gallery image. You can select only (.gif, .png, .jpeg, .jpg) format files upto 1 MB file size",
              )}
              ..!!!
            </p> */}
            {
              <div className="mt-2 add-img-product">
                {" "}
                <Image width={120} src={image ?? notfound}></Image>{" "}
              </div>
            }
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddForm;
