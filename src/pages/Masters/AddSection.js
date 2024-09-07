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

const AddSection = ({ api, show, hide, data, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [file, setFile] = useState([]);
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    console.log(data);
    form.setFieldsValue({ ...data });
  }, [data]);

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
          {data ? lang(`Edit Section`) : lang(`Add New Section`)}
        </h4>
        <Row gutter={[16, 0]}>
          <Col span={24} sm={12}>
            <Form.Item
              label={lang(`Name`)}
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
              ]}
              normalize={(value) => value.trimStart()}
            >
              <Input
                autoComplete="off"
                placeholder={lang(`Enter Section Name`)}
              />
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
        </Row>
      </Form>
    </Modal>
  );
};

export default AddSection;
