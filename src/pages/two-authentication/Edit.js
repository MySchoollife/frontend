import { Row, Col, Card, Button, Input, Form, Skeleton, Image } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { ShowToast, Severty } from "../../helper/toast";
import { useNavigate } from "react-router";
import apiPath from "../../constants/apiPath";
import DescriptionEditor from "../../components/DescriptionEditor";
import { useAppContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import SingleImageUpload from "../../components/SingleImageUpload";
import notfound from "../../assets/images/not_found.png";


function AddFrom() {


  const sectionName =  lang("Blog Management");
  const routeName = "blog";
  const heading = lang("Blog Management");
  const { setPageHeading, country } = useAppContext();
 

  const api = {
    addEdit: apiPath.addEditBlog,
    view: apiPath.viewBlog,
  };

  const [form] = Form.useForm();
  const { request } = useRequest();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [editorValue, setEditorValue] = useState("");
  const [arDescription, setArDescription] = useState("");
  const [file, setFile] = useState([]);
  const [image, setImage] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const FileType = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/gif",
  ];
  

  useEffect(() => {
    setPageHeading(heading);
  }, []);

  const fetchData = (id) => {
    request({
      url: api.view + "/" + id,
      method: "GET",
      onSuccess: (data) => {
        setLoading(false);
        form.setFieldsValue({...data.data});
        setEditorValue(data.data.description);
        setArDescription(data.data.ar_description);
        setCoverImage(data.data?.cover_image)
        setImage(data.data?.thumbnail)
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const handleEditorChange = (data) => {
    setEditorValue(data);
  };

  const OnSubmit = (values) => {
    if (editorValue.trim() == "<p></p>" || editorValue.trim() === "")
      return ShowToast("Please Enter Description", Severty.ERROR);
    if (arDescription.trim() == "<p></p>" || arDescription.trim() === "")
      return ShowToast("Please Enter Template Arabic", Severty.ERROR);
    const {  ar_title, title } = values;
    const payload = { title ,ar_title}; 
    payload.thumbnail = image;
    payload.cover_image = coverImage;
    payload.description = editorValue;
    payload.ar_description = arDescription;
    payload.country_id = country.country_id;

    setLoading(true);
    request({
      url: params.id ? api.addEdit + "/" + params.id  : api.addEdit,
      method: params.id ? "PUT" : "POST",
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
    if(!params.id) return;
    setLoading(true);
    fetchData(params.id);
  }, [params.id]);

  const handleImage = (data) => {
    //setImage(data);
    data.length > 0 ? setFile(data[0].url) : setFile([]);
    data.length > 0 ? setImage(data[0].url) : setImage("");
  };

  const handleCoverImage = (data) => {
    data.length > 0 ? setCoverImage(data[0].url) : setImage("");
  };

  return (
    <>
      <Card title={params.id ? lang("Update Blog Content ")  : lang("Add Blog Content ")}>
        {loading ? (
          [1, 2].map((item) => <Skeleton active key={item} />)
        ) : (
          <Form
            className="edit-page-wrap"
            form={form}
            onFinish={OnSubmit}
            autoComplete="off"
            layout="verticle"
            name="email_template_form"
          >
            <Row gutter={[24, 0]}>
            <Col span={24} md={12}>
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
              label={lang("Upload Thumbnail")}
              name="thumbnail"
            >
              <SingleImageUpload
                value={image}
                fileType={FileType}
                imageType={"blog"}
                btnName={"Thumbnail"}
                onChange={(data) => handleImage(data)}
                isDimension={false}
              />
            </Form.Item>
         
            {
              <div className="mt-2 add-img-product">
                {" "}
                <Image width={120} src={image ?? notfound}></Image>{" "}
              </div>
            }
          </Col>
          <Col span={24} md={12}>
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
              label={lang("Upload Cover Image")}
              name="cover_image"
            >
              <SingleImageUpload
                value={coverImage}
                fileType={FileType}
                imageType={"blog"}
                btnName={"Cover Image"}
                onChange={(data) => handleCoverImage(data)}
                isDimension={false}
              />
            </Form.Item>
         
            {
              <div className="mt-2 add-img-product">
                {" "}
                <Image width={120} src={coverImage ?? notfound}></Image>{" "}
              </div>
            }
          </Col>
              <Col span={12} md={12}>
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

              <Col span={12} md={12}>
              <Form.Item
                  normalize={(value) => value.trimStart()}
                  label={lang("Ar_title")}
                  name="ar_title"
                  rules={[
                    {
                      required: true,
                      message: lang("Please Enter the title!"),
                    },
                  ]}
                >
                  <Input autoComplete="off" placeholder="Enter Arabic Title" />
                </Form.Item>
              </Col>

              <Col span={24} md={12}>
                <Form.Item
                  label={lang("Content")}
                  name="description"
                  rules={[
                    { required: true, message: "Please Enter the Content!" },
                  ]}
                >
                  <DescriptionEditor
                    value={editorValue}
                    placeholder={lang("Enter Blog Content")}
                    onChange={(data) => handleEditorChange(data)}
                  />
                </Form.Item>
              </Col>

              <Col span={24} md={12}>
                <Form.Item
                  label={lang("Content Arabic")}
                  name="ar_description"
                  rules={[
                    {
                      required: true,
                      message: lang("Please Enter the arabic Content!"),
                    },
                  ]}
                >
                  <DescriptionEditor
                    value={arDescription}
                    placeholder={lang("Enter Blog Content Arabic")}
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
export default AddFrom;
