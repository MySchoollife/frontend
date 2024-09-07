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
} from "antd";
import React, { useEffect, useState } from "react";

import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import { useAppContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import apiPath from "../../constants/apiPath";

const AddClass = ({ api, show, hide, data, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [file, setFile] = useState([]);
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (!data) return;
    console.log(data);
    form.setFieldsValue({ ...data });
  }, [data]);

  const getSection = () => {
    request({
      url: apiPath.common.classSection,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setSections(data ?? []);
        }
      },
      onError: (error) => {
        ShowToast(error?.response?.data?.message, Severty.ERROR);
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    getSection();
  }, []);

  const onCreate = (values) => {
    setLoading(true);
    const payload = { ...values };

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
          {data ? lang(`Edit Class`) : lang(`Add New Class`)}
        </h4>
        <Row gutter={[16, 0]}>
          <Col span={24} sm={12}>
            <Form.Item
              label={lang(`Class Name`)}
              name="name"
              rules={[
                {
                  required: true,
                  message: lang("Name is required"),
                },
                {
                  max: 200,
                  message: lang(
                    "Name should not contain more then 200 characters!"
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
                placeholder={lang(`Enter Class Name`)}
              />
            </Form.Item>
          </Col>

          <Col span={24} sm={24}>
            <Form.Item
              label={lang("Section")}
              name="section_id"
              rules={[
                {
                  required: true,
                  message: lang("Please select the Sections!"),
                },
              ]}
            >
              <Select
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder={lang("Select Section")}
                showSearch
              >
                {sections.map((item) => (
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
              label={lang(`Row Order Number`)}
              name="order_number"
              // rules={[
              //   {
              //     required: true,
              //     message: lang("Row Order Number is required"),
              //   },
              // ]}
            >
              <InputNumber
                autoComplete="off"
                placeholder={lang(`Enter Row Order Number`)}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={12}>
            <Form.Item
              label={lang(`Description`)}
              name="description"
              rules={[
                // {
                //   required: true,
                //   message: lang("Description is required"),
                // },
                {
                  max: 5000,
                  message: lang(
                    "Description should not contain more then 5000 characters!"
                  ),
                },
                {
                  min: 2,
                  message: lang(
                    "Description should contain at least 2 characters!"
                  ),
                },
              ]}
            >
              <Input.TextArea
                autoComplete="off"
                placeholder={lang(`Enter Description`)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddClass;
