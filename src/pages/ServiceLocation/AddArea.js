import { Col, Form, Modal, Row, Select, Input, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import lang from "../../helper/langHelper";

const AddArea = ({ api, show, hide, data, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    form.setFieldsValue({
      ...data,
    });
  }, [data]);

  const onCreate = (values) => {
    const { name, ar_name } = values;

    const payload = {
      name,
      ar_name,
    };

    setLoading(true);
    console.log(payload, "Area add");

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
      width={800}
      okText={`${data ? lang("Update") : lang("Add")}`}
      cancelText={lang("Cancel")}
      onCancel={hide}
      okButtonProps={{
        form: "create",
        htmlType: "submit",
        loading: loading,
      }}
      className="tab_modal"
    >
      <h4 className="modal_title_cls">{`${
        data ? lang("Edit Service Area") : lang("Add Service Area")
      }`}</h4>
      <Form id="create" form={form} onFinish={onCreate} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={24} sm={12}>
            <Form.Item
              label={`Area Name`}
              name="name"
              rules={[
                { required: true, message: lang("Please enter the area name") },
                {
                  max: 100,
                  message: lang(
                    "Area Name should not contain more then 100 characters!",
                  ),
                },
                {
                  min: 2,
                  message: lang(
                    "Area Name should contain at least 2 characters!",
                  ),
                },
              ]}
              normalize={(value) => value.trimStart()}
            >
              <Input autoComplete="off" placeholder={lang(`Enter Area Name`)} />
            </Form.Item>
          </Col>
          <Col span={24} sm={12}>
            <Form.Item
              label={lang(`Area Name Arabic`)}
              name="ar_name"
              rules={[
                {
                  required: true,
                  message: lang("Please enter the area name arabic"),
                },
              ]}
            >
              <Input autoComplete="off" placeholder={`أدخل اسم المدينة`} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddArea;
