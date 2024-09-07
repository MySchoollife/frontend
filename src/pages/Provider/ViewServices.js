import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  TimePicker,
  Space,
  Image,
  Collapse,
  Steps,
} from "antd";
import React, { useContext, useEffect, useState } from "react";

import {
  PhoneNumberField,
  SelectInput,
  TextInputBox,
} from "../../components/InputField";
import SingleImageUpload from "../../components/SingleImageUpload";
import MultipleImageUpload from "../../components/MultipleImageUpload2";
import apiPath from "../../constants/apiPath";
import { AppStateContext, useAppContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import LocationMap from "../User/LocationMap";
import { Palestine } from "../../constants/var";
import { useAuthContext } from "../../context/AuthContext";
import moment from "moment";
import {
  CaretRightOutlined,
  DeleteOutlined,
  DeleteRowOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ImportForm from "../../components/ImportForm";
import { useNavigate, useParams } from "react-router";
import EditIcon from "../../assets/images/edit.svg";
import deleteWhiteIcon from "../../assets/images/icon/deleteWhiteIcon.png";
import DeleteModal from "../../components/DeleteModal";
import { DeleteRestaurantReasons } from "../../constants/reasons";
import BannerImageUpload from "../../components/BannerImageUpload";
import notfound from "../../assets/images/not_found.png";

const weekdays = [
  { name: "sunday", label: "Sunday" },
  { name: "monday", label: "Monday" },
  { name: "tuesday", label: "Tuesday" },
  { name: "wednesday", label: "Wednesday" },
  { name: "thursday", label: "Thursday" },
  { name: "friday", label: "Friday" },
  { name: "saturday", label: "Saturday" },
];

const ViewProviderService = () => {
  const api = {
    addEdit: apiPath.providerList,
    country: apiPath.common.countries,
    city: apiPath.common.city,
    fc: apiPath.common.foodCategories,
    rc: apiPath.common.restaurantCategories,
    category: apiPath.allCategory,
    SubCategory: apiPath.allSubCategory,
    subAdmin: apiPath.allSubAdmin,
    attribute: apiPath.allAttribute,
    attributeByCategory: apiPath.allAttributeByCategory,
    eventType: apiPath.allEventType,
  };

  const sectionName = lang("Provider");
  const heading = sectionName + " " + lang("Services");
  const { setPageHeading } = useContext(AppStateContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const params = useParams();
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState([]);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [data, setData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [services, setServices] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [serviceAttributes, setserviceAttributes] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    setPageHeading(heading);
  }, []);

  const getServices = (id) => {
    request({
      url: `${apiPath.allServices}/${id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setServices(data);
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const getAttribute = (service_id, id, idx) => {
    request({
      url: `${api.attribute}/${categoryId ? categoryId : id}/${service_id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setAttributes(data);

          // const index = serviceAttributes.findIndex(obj => obj["idx"] === idx);
          // console.log(idx)
          // if (index) {
          //   serviceAttributes[index] = { idx: idx, attris: data }
          //   let arr = serviceAttributes;
          //   setserviceAttributes(arr);
          // }
          setserviceAttributes((srat) => {
            return [...srat, { attris: data, idx: idx }];
          });
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const getAttributeByCategory = (categoryId) => {
    request({
      url: `${api.attributeByCategory}/${categoryId}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setAttributes(data);
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const getProvider = (id) => {
    request({
      url: `${api.addEdit}/${id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setData(data?.[0]);
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  useEffect(() => {
    getProvider(params.id);
  }, [params.id]);

  useEffect(() => {
    if (!data) return;

    form.setFieldsValue({
      ...data,
    });

    data?.services?.map((sr, idx) => {
      getAttribute(sr.service_id, data?.category_id, idx);
    });

    setCategoryId(data?.category_id);
    setShowInput(data?.profile_id?.permission);
    getServices(data?.category_id);

    getAttributeByCategory(data?.category_id);
  }, [data]);

  const onCreate = (values) => {
    const { location, working_days } = values;
    let payload = {
      ...values,
    };

    request({
      url: `${data ? api.addEdit + "/" + data._id : api.addEdit}`,
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

  const onDelete = (id) => {
    request({
      url: api.addEdit + "/" + id,
      method: "DELETE",
      onSuccess: (data) => {
        ShowToast(data.message, Severty.SUCCESS);
        navigate(-1);
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  console.log(serviceAttributes);
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

  return (
    <>
      {" "}
      <React.Fragment>
        {data ? (
          <Col span={24} lg={24} xs={24}>
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <h4 className="modal_title_cls mb-2 modal_title_menu text-start">
                  {data.name}
                </h4>
              </div>
              <div className="col-12 col-sm-6 d-flex align-items-center gap-3 justify-content-end">
                <Button
                  disabled={!data}
                  onClick={() => setIsEdit(true)}
                  className="edit-cls btnStyle primary_btn  py-2 px-3  d-flex align-items-center gap-1"
                >
                  <img src={EditIcon} />
                  {lang("Edit")}
                </Button>

                <Button
                  disabled={!data}
                  onClick={() => showDeleteModal(true)}
                  className="edit-cls btnStyle deleteDangerbtn py-2 px-3 d-flex align-items-center gap-1"
                >
                  <img src={deleteWhiteIcon} /> {lang("Delete")}{" "}
                </Button>
              </div>
            </div>
          </Col>
        ) : (
          <h4 className="modal_title_cls">{`${
            lang("Add") + " " + lang("Provider")
          }`}</h4>
        )}
        <Form
          id="create"
          form={form}
          onFinish={onCreate}
          disabled={data ? !isEdit : false}
          layout="vertical"
        >
          <Row gutter={24}>
            <Col span={24} lg={24} xs={24} className="d-flex flex-column gap-3">
              <Card className="">
                <h4 className="profile-headding">Offerings</h4>

                {showInput?.map((item) => (
                  <React.Fragment key={item._id}>
                    {item.is_selected && item.name === "service_id" && (
                      <Form.List name="services">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(
                              ({ key, name, fieldKey, ...restField }) => (
                                <div key={key} className="row g-3">
                                  <Col span={12} md={8}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "service_id"]}
                                      fieldKey={[fieldKey, "service_id"]}
                                      label={lang("Service Name")}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Please select a service",
                                        },
                                      ]}
                                    >
                                      <Select
                                        filterOption={(input, option) =>
                                          option.label
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                        }
                                        placeholder={lang("Select Services")}
                                        showSearch
                                        mode="Single"
                                        onChange={(value) =>
                                          getAttribute(value, categoryId, key)
                                        }
                                      >
                                        {services.map((service) => (
                                          <Select.Option
                                            key={service._id}
                                            label={service.name}
                                            value={service._id}
                                          >
                                            {service.name}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                  <Col span={12} md={8}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "original_price"]}
                                      fieldKey={[fieldKey, "original_price"]}
                                      label={lang("Original Price")}
                                    >
                                      <InputNumber />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12} md={8}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "discount_price"]}
                                      fieldKey={[fieldKey, "discount_price"]}
                                      label={lang("Discount Price (%)")}
                                    >
                                      <InputNumber />
                                    </Form.Item>
                                  </Col>
                                  <Col span={24} md={24}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "attribute_id"]}
                                      fieldKey={[fieldKey, "attribute_id"]}
                                      label={lang("Select Attribute")}
                                    >
                                      <Select
                                        filterOption={(input, option) =>
                                          option.label
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                        }
                                        placeholder={lang("Select Attribute")}
                                        showSearch
                                        mode="multiple"
                                      >
                                        {serviceAttributes[key]?.attris?.map(
                                          (attribute, idx) => (
                                            <Select.Option
                                              key={attribute._id}
                                              label={attribute.name}
                                              value={attribute._id}
                                            >
                                              {attribute.name}
                                            </Select.Option>
                                          )
                                        )}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Button
                                      className="minus-btn"
                                      type="dashed"
                                      onClick={() => remove(name)}
                                      icon={<MinusCircleOutlined />}
                                      block
                                    ></Button>
                                  </Col>
                                </div>
                              )
                            )}
                            <Form.Item className="main-button-add-p">
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                block
                              >
                                Add Service
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    )}
                  </React.Fragment>
                ))}
              </Card>
            </Col>
          </Row>
          <div className="view-provider">
            <Button
              type="primary"
              onClick={(e) => navigate(-1)}
              disabled={false}
            >
              Cancel
            </Button>
            <Button form="create" type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </React.Fragment>
      {isUploadVisible && (
        <ImportForm
          path={api.import}
          sectionName={"import Provider"}
          show={isUploadVisible}
          hide={() => setIsUploadVisible(false)}
          existingData={[]}
        />
      )}
      {deleteModal && (
        <DeleteModal
          title={lang("Delete Service Provider")}
          subtitle={lang(
            `Are you sure you want to Delete this Service Provider?`
          )}
          show={deleteModal}
          hide={() => {
            showDeleteModal(false);
          }}
          reasons={DeleteRestaurantReasons}
          onOk={() => onDelete(data?._id)}
        />
      )}
    </>
  );
};

export default ViewProviderService;
