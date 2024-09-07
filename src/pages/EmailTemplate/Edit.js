import { Row, Col, Card, Button, Input, Form, Skeleton } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { ShowToast, Severty } from "../../helper/toast";
import { useNavigate } from "react-router";
import apiPath from "../../constants/apiPath";
import DescriptionEditor from "../../components/DescriptionEditor";
import { useAppContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";

function EmailEdit() {
  const sectionName = lang("Email Template");
  const routeName = "email-templates";

  const { setPageHeading, country } = useAppContext();
  const heading = lang("Email Template");

  const api = {
    addEdit: apiPath.addEditEmailTemplate,
    view: apiPath.viewEmailTemplate,
  };

  const [form] = Form.useForm();
  const { request } = useRequest();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [editorValue, setEditorValue] = useState("");
  const [arDescription, setArDescription] = useState("");

  useEffect(() => {
    setPageHeading(heading);
  }, []);

  const fetchData = (id) => {
    request({
      url: api.view + "/" + id,
      method: "GET",
      onSuccess: (data) => {
        setLoading(false);
        form.setFieldsValue(data.data);
        setEditorValue(data.data.description);
        setArDescription(data.data.ar_description);
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const handleEditorChange = (data) => {
    setEditorValue(data);
  };

  const OnUpdate = (values) => {
    if (editorValue.trim() == "<p></p>" || editorValue.trim() === "")
      return ShowToast("Please Enter Description", Severty.ERROR);
    if (arDescription.trim() == "<p></p>" || arDescription.trim() === "")
      return ShowToast("Please Enter Template Arabic", Severty.ERROR);
    const { name, subject, title } = values;
    const payload = { title };
    payload.name = name;
    payload.description = editorValue;
    payload.ar_description = arDescription;
    payload.subject = subject;
    setLoading(true);
    request({
      url: api.addEdit + "/" + params.id,
      method: "POST",
      data: payload,
      onSuccess: (data) => {
        setLoading(false);
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
          navigate(`/${routeName}`);
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
    setLoading(true);
    fetchData(params.id);
  }, []);

  return (
    <>
      <Card title={lang("Update") + sectionName}>
        {loading ? (
          [1, 2].map((item) => <Skeleton active key={item} />)
        ) : (
          <Form
            className="edit-page-wrap"
            form={form}
            onFinish={OnUpdate}
            autoComplete="off"
            layout="verticle"
            name="email_template_form"
          >
            <Row gutter={[24, 0]}>
              <Col span={24} md={12}>
                <Form.Item
                  normalize={(value) => value.trimStart()}
                  label={lang("Title")}
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: lang("Please Enter the title!"),
                    },
                  ]}
                >
                  <Input autoComplete="off" placeholder="Enter Title" />
                </Form.Item>
              </Col>

              <Col span={24} md={12}>
                <Form.Item
                  normalize={(value) => value.trimStart()}
                  label={lang("Subject")}
                  name="subject"
                  rules={[
                    {
                      required: true,
                      message: lang("Please Enter the subject!"),
                    },
                  ]}
                >
                  <Input autoComplete="off" placeholder="Enter Subject" />
                </Form.Item>
              </Col>

              <Col span={24} md={12}>
                <Form.Item
                  label={lang("Template")}
                  name="description"
                  rules={[
                    { required: true, message: "Please Enter the email!" },
                  ]}
                >
                  <DescriptionEditor
                    value={editorValue}
                    placeholder={lang("Enter Email Template")}
                    onChange={(data) => handleEditorChange(data)}
                  />
                </Form.Item>
              </Col>

              <Col span={24} md={12}>
                <Form.Item
                  label={lang("Template Arabic")}
                  name="ar_description"
                  rules={[
                    {
                      required: true,
                      message: lang("Please Enter the arabic email!"),
                    },
                  ]}
                >
                  <DescriptionEditor
                    value={arDescription}
                    placeholder={lang("Enter Email Template Arabic")}
                    onChange={(data) => setArDescription(data)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="btn-row float-right">
              <Link
                className="ant-btn ant-btn-primary btnStyle btnOutlineDelete  "
                to={`/${routeName}`}
              >
                {lang("Back")}
              </Link>
              <Button
                className="primary_btn btnStyle"
                loading={loading}
                htmlType="submit"
              >
                {lang("Submit")}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </>
  );
}
export default EmailEdit;
