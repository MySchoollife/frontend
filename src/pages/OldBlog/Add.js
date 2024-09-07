import { Row, Col, Card, Button, Input, Form, Divider, Image } from "antd";
import React, { useState } from "react";
import useRequest from "../../hooks/useRequest";
import { ShowToast, Severty } from "../../helper/toast";
import { useNavigate } from "react-router";
import apiPath from "../../constants/apiPath";
import DescriptionEditor from "../../components/DescriptionEditor";
import SingleImageUpload from "../../components/SingleImageUpload";
import notfound from "../../assets/images/not_found.png";
import { shortLang, longLang } from "../../config/language";
import { Link } from "react-router-dom";

function Add() {
  const sectionName = "Blog";
  const routeName = "blog";

  const [form] = Form.useForm();
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const FileType = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/avif",
    "image/webp",
    "image/gif",
  ];
  const [image, setImage] = useState([]);

  const [editorValue, setEditorValue] = useState("");
  const [editorEsValue, setEditorEsValue] = useState("");
  const [editorDeValue, setEditorDeValue] = useState("");
  const [editorFrValue, setEditorFrValue] = useState("");

  const handleEditorChange = (data) => {
    setEditorValue(data);
  };

  const handleEditorEsChange = (data) => {
    setEditorEsValue(data);
  };

  const handleEditorFrChange = (data) => {
    setEditorFrValue(data);
  };

  const handleEditorDeChange = (data) => {
    setEditorDeValue(data);
  };

  const handleImage = (data) => {
    setImage(data);
  };

  const onCreate = (values) => {
    if (editorValue.trim() === "<p></p>" || editorValue.trim() === "")
      return ShowToast("Please Enter Description in English", Severty.ERROR);

    const { title, es_title, de_title, fr_title } = values;
    const payload = {};
    payload.title = title;
    payload.es_title = es_title;
    payload.de_title = de_title;
    payload.fr_title = fr_title;
    payload.description = editorValue;
    payload.de_description = editorDeValue;
    payload.es_description = editorEsValue;
    payload.fr_description = editorFrValue;
    payload.thumbnail = image && image.length > 0 ? image[0].url : "";
    setLoading(true);
    request({
      url: apiPath.addEditBlog,
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

  return (
    <>
      <Card title={"Add " + sectionName}>
        <Form
          className="edit-page-wrap colPadding"
          form={form}
          onFinish={onCreate}
          autoComplete="off"
          layout="verticle"
          name="blog_form"
        >
          <Row gutter={[24, 0]}>
            <Col span={24} sm={12}>
              {/* rules={[ { required: true, message: "Please select the thumbnail image!" } ]}  */}
              <Form.Item label="Upload Thumbnail" name="thumbnail">
                <div className="mb-1"></div>
                <SingleImageUpload
                  fileType={FileType}
                  imageType={"blog"}
                  btnName={"Thumbnail"}
                  onChange={(data) => handleImage(data)}
                />
              </Form.Item>
            </Col>

            {/* Start English Blog */}
            <Divider
              orientation="left"
              orientationMargin={15}
              className="devider-color"
            >
              {longLang.en}
            </Divider>

            <Col span={24} sm={12}>
              <Form.Item
                label={`Title (${shortLang.en})`}
                name="title"
                rules={[
                  {
                    required: true,
                    message: `Please enter the title in ${longLang.en}!`,
                  },
                  {
                    max: 100,
                    message:
                      "Title should not contain more then 100 characters!",
                  },
                  {
                    min: 2,
                    message: "Title should contain atleast 2 characters!",
                  },
                ]}
                normalize={(value) => value.trimStart()}
              >
                <Input
                  autoComplete="off"
                  placeholder={`Enter Title in ${longLang.en}`}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={`Description (${shortLang.en})`}
                name="description"
              >
                <DescriptionEditor
                  value={editorValue}
                  placeholder={`Enter Description in ${longLang.en}`}
                  onChange={(data) => handleEditorChange(data)}
                />
              </Form.Item>
            </Col>
            {/* End English Content */}

            {/* Start Spanish Content */}
            <Divider
              orientation="left"
              orientationMargin={15}
              className="devider-color"
            >
              {longLang.es}
            </Divider>

            <Col span={24} sm={12}>
              <Form.Item
                normalize={(value) => value.trimStart()}
                label={`Title (${shortLang.es})`}
                name="es_title"
                rules={[
                  {
                    max: 100,
                    message:
                      "Title should not contain more then 100 characters!",
                  },
                  {
                    min: 2,
                    message: "Title should contain atleast 2 characters!",
                  },
                ]}
              >
                <Input
                  autoComplete="off"
                  placeholder={`Enter Title in ${longLang.es}`}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={`Description (${shortLang.es})`}
                name="es_description"
              >
                <DescriptionEditor
                  value={editorEsValue}
                  placeholder={`Enter Description in ${longLang.es}`}
                  onChange={(data) => handleEditorEsChange(data)}
                />
              </Form.Item>
            </Col>
            {/* End Spanish Content */}

            {/* Start German Content */}

            <Divider
              orientation="left"
              orientationMargin={15}
              className="devider-color"
            >
              {longLang.de}
            </Divider>

            <Col span={24} sm={12}>
              <Form.Item
                normalize={(value) => value.trimStart()}
                label={`Title (${shortLang.de})`}
                name="de_title"
                rules={[
                  {
                    max: 100,
                    message:
                      "Title should not contain more then 100 characters!",
                  },
                  {
                    min: 2,
                    message: "Title should contain atleast 2 characters!",
                  },
                ]}
              >
                <Input
                  autoComplete="off"
                  placeholder={`Enter Title in ${longLang.de}`}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                normalize={(value) => value.trimStart()}
                label={`Description (${shortLang.de})`}
                name="de_description"
              >
                <DescriptionEditor
                  value={editorDeValue}
                  placeholder={`Enter Description in ${longLang.de}`}
                  onChange={(data) => handleEditorDeChange(data)}
                />
              </Form.Item>
            </Col>
            {/* End German Content */}

            {/* Start French Content */}

            <Divider
              orientation="left"
              orientationMargin={15}
              className="devider-color"
            >
              {longLang.fr}
            </Divider>

            <Col span={24} sm={12}>
              <Form.Item
                normalize={(value) => value.trimStart()}
                label={`Title (${shortLang.fr})`}
                name="fr_title"
                rules={[
                  {
                    max: 100,
                    message:
                      "Title should not contain more then 100 characters!",
                  },
                  {
                    min: 2,
                    message: "Title should contain atleast 2 characters!",
                  },
                ]}
              >
                <Input
                  autoComplete="off"
                  placeholder={`Enter Title in ${longLang.fr}`}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={`Description (${shortLang.fr})`}
                name="fr_description"
              >
                <DescriptionEditor
                  value={editorFrValue}
                  placeholder={`Enter Description in ${longLang.fr}`}
                  onChange={(data) => handleEditorFrChange(data)}
                />
              </Form.Item>
            </Col>
            {/* End French Content */}
          </Row>

          <Form.Item className="btn-row float-right mb-0">
            <Link
              className="ant-btn ant-btn-primary"
              type="primary"
              to={`/${routeName}`}
            >
              Back
            </Link>
            <Button type="primary" loading={loading} htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default Add;
