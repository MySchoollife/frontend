import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Collapse,
  Steps,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import apiPath from "../../constants/apiPath";
import { AppStateContext, useAppContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import moment from "moment";
import {
  CaretRightOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ImportForm from "../../components/ImportForm";
import { useNavigate, useParams } from "react-router";
import EditIcon from "../../assets/images/edit.svg";
import deleteWhiteIcon from "../../assets/images/icon/deleteWhiteIcon.png";
import DeleteModal from "../../components/DeleteModal";
import { DeleteRestaurantReasons } from "../../constants/reasons";

const weekdays = [
  { name: "sunday", label: "Sunday" },
  { name: "monday", label: "Monday" },
  { name: "tuesday", label: "Tuesday" },
  { name: "wednesday", label: "Wednesday" },
  { name: "thursday", label: "Thursday" },
  { name: "friday", label: "Friday" },
  { name: "saturday", label: "Saturday" },
];

const ViewPackage = () => {

  const api = {
    addEdit: apiPath.providerList,
    country: apiPath.common.countries,
    city: apiPath.common.city,
    fc: apiPath.common.foodCategories,
    rc: apiPath.common.restaurantCategories,
    category: apiPath.allCategory,
    SubCategory: apiPath.allSubCategory,
    subAdmin: apiPath.allSubAdmin,
    attribute: apiPath.allAttributeByCategory,
    eventType: apiPath.allEventType,
  };


  const sectionName = lang("Provider");
  const heading = sectionName + " " + lang("Services");
  const { setPageHeading } = useContext(AppStateContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const params = useParams();
  const { request } = useRequest();
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [logo, setLogo] = useState();
  const [coverPhoto, setCoverPhoto] = useState();
  const { country } = useAppContext();
  const [mobileNumber, setMobileNumber] = useState(null);
  const [showInput, setShowInput] = useState([]);
  const [profile, setProfile] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [subAdmin, setSubAdmin] = useState([]);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [data, setData] = useState(null);
  const [location, setLocation] = useState(null);
  const [editLocation, setEditLocation] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [services, setServices] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [event, setEvent] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState([]);
  const [selectedService, setSelectedService] = useState([]);

  useEffect(() => {
    setPageHeading(heading);
  }, []);

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

  const getProfile = (id) => {
    console.log("evalue", id);

    request({
      url: `${api.addEdit}/profile/${id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setProfile(data);
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const getSubCategory = (id) => {
    console.log("evalue", id);

    request({
      url: `${api.SubCategory}/${id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setSubCategory(data);
        }
        console.log(data, "data");
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

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

  const getSubAdmin = () => {
    request({
      url: api.subAdmin,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setSubAdmin(data);
        }
        console.log(data, "data");
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const getAttribute = (category) => {
    request({
      url: `${api.attribute}/${category}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setAttributes(data);
        }
        console.log(data, "data");
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const getEvent = () => {
    request({
      url: `${api.eventType}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          console.log(data);
          setEvent(data);
        }
        console.log(data, "data");
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const getCountry = () => {
    request({
      url: `/country`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setCountries(data);
        }
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
        console.log(data, "lll");
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
    if (!country.country_id) return;
    getCategory();
    getSubAdmin();
    getCountry();
  }, [country.country_id]);

  useEffect(() => {
    if (!data) return;

    console.log(data, "vendorEdit");
    form.setFieldsValue({
      ...data,
      mobile: data.country_code + data.mobile_number,
      mobile2: data?.vendor_id?.country_code_sec
        ? data?.vendor_id?.country_code_sec + data?.vendor_id?.mobile_number_sec
        : "",
      country_id: data?.country_id,
      city_id: data?.city_id?._id,
      area: data?.area,
      category_id: data?.category_id,
      sub_category_id: data?.sub_category_id,
      associated_manager: data?.associated_manager,
      profile_id: data?.profile_id?._id,
      location_on_map: data.address,
      have_whatsapp: data?.have_whatsapp,
      have_whatsapp_sec: data?.vendor_id?.have_whatsapp_sec,

      working_days: data.working_days.map((day) => ({
        day: day.day,
        time: [moment(day.open_time), moment(day.close_time)],
      })),
      service_id: data.service_id,
    });
    setShowInput(data?.profile_id?.permission);
    setLogo(data.logo);
    setCoverPhoto(data?.cover_photo);
    setImage(data.image);


    setLocation({
      map_address: data.map_address,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    setEditLocation({
      map_address: data.map_address,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    setMobileNumber({
      country_code: data.country_code,
      mobile_number: data.mobile_number,
    });
    // getSubCategory(data?.category_id?._id);

    getCategory();
    getSubAdmin();
    getProfile(data?.category_id);
    getSubCategory(data?.category_id);
    getServices(data?.category_id);
    getAttribute(data?.category_id);
    getEvent(data?.category_id);
  }, [data]);

  const onCreate = (values) => {
    //  return console.log(values,formData, "hfjhdkghkhdgkd");
    const { location, working_days } = values;
    let payload = {
      ...values,
    };

    if (form.getFieldValue("packages")?.find((elem) => elem?.package_service_id?.length <= 1)) {
      return ShowToast("Please Select Atleast 2 Services to Create a Package!", Severty.ERROR);
    }

    // request({
    //   url: `${data ? api.addEdit + "/" + data._id : api.addEdit}`,
    //   method: data ? "PUT" : "POST",
    //   data: payload,
    //   onSuccess: (data) => {
    //     setLoading(false);
    //     if (data.status) {
    //       ShowToast(data.message, Severty.SUCCESS);
    //       navigate(-1);
    //     } else {
    //       ShowToast(data.message, Severty.ERROR);
    //     }
    //   },
    //   onError: (error) => {
    //     ShowToast(error.response.data.message, Severty.ERROR);
    //     setLoading(false);
    //   },
    // });
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


  const handleCheckboxChange = ({ attribute_id, service_id }) => {
    let newAttribute = [...selectedAttribute];

    if (newAttribute.some((attr) => attr.attribute === attribute_id && attr.service === service_id)) {
      setSelectedAttribute(newAttribute.filter((item) => !(item.attribute === attribute_id && item.service === service_id)));
      console.log(
        "newAttributeRemove-",
        newAttribute.filter(
          (item) => !(item.attribute === attribute_id && item.service === service_id)
        )
      );
    } else {
      setSelectedAttribute((prev) => [
        ...prev,
        { attribute: attribute_id, service: service_id },
      ]);
      console.log("newAttributeAdd-", [
        ...newAttribute,
        { attribute: attribute_id, service: service_id },
      ]);
    }

    const newService = [...selectedService];
    if (!newService.includes(service_id)) {
      newService.push(service_id);
    }
    setSelectedService(newService);
    // console.log("newService-", newService);
  };

  const accordionItems = services?.map((item, index) => (
    <Collapse.Panel
      key={item._id + index}
      header={item.name}
      extra={<CaretRightOutlined />}
    >
      <div
        className="clinic_body"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <span className="clinic_left">Add Attribute</span>
        <div className="clinic_right">
          {attributes
            .filter((attribute) => attribute.service_id.includes(item._id)) // Filter attributes based on service ID
            .map((attribute, idx) => (
              <Checkbox
                key={idx}
                onChange={
                  (e) => {
                    handleCheckboxChange({
                      attribute_id: attribute._id,
                      service_id: item._id,
                    });
                  } // Pass the object correctly
                }
                checked={selectedAttribute.some(
                  (attr) =>
                    attr.attribute === attribute._id &&
                    attr.service === item._id
                )}
              // checked={Kalu[item.key][item.key]['create']}
              >
                {attribute.name}
              </Checkbox>
            ))}
        </div>
      </div>
    </Collapse.Panel>
  ));


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
                  className="edit-cls v-img btnStyle primary_btn  py-2 px-3  d-flex align-items-center gap-1"
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
          <h4 className="modal_title_cls">{`${lang("Add") + " " + lang("Provider")
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
                <h4 className="profile-heading">Package</h4>
                {showInput?.map((item) => (
                  <React.Fragment key={item._id}>
                    {item.is_selected && item.name === "packages" && (
                      <Form.List name="packages">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                              <div className="row g-3" key={key}>
                                <Col span={12} sm={12}>
                                  <Form.Item
                                    {...restField}
                                    label={lang("Package Name")}
                                    name={[name, "name"]}
                                    fieldKey={[fieldKey, "name"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: lang("Package name is required"),
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Enter Package Name" />
                                  </Form.Item>
                                </Col>
                                <Col span={12} md={12}>
                                  <Form.Item
                                    {...restField}
                                    label={lang("Package Service Name")}
                                    name={[name, "package_service_id"]}
                                    fieldKey={[fieldKey, "package_service_id"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: lang("Please select a service"),
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
                                      {services
                                        .filter((item) => form.getFieldValue("services")?.some((elem) => elem.service_id === item._id))
                                        .map((item) => (
                                          <Select.Option key={item?._id} label={item?.name} value={item?._id}>
                                            {item?.name}
                                          </Select.Option>
                                        ))}
                                    </Select>
                                  </Form.Item>
                                </Col>

                                <Col span={12} sm={12}>
                                  <Form.Item
                                    {...restField}
                                    label={lang("Package Price ($)")}
                                    name={[name, "original_price"]}
                                    fieldKey={[fieldKey, "original_price"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: lang("Original price is required"),
                                      },
                                    ]}
                                  >
                                    <InputNumber placeholder="Enter Original Price" />
                                  </Form.Item>
                                </Col>
                                <Col span={12} sm={12}>
                                  <Form.Item
                                    {...restField}
                                    label={lang("Package Price(%)")}
                                    name={[name, "discounted_price"]}
                                    fieldKey={[fieldKey, "discounted_price"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: lang("Discounted price is required"),
                                      },
                                    ]}
                                  >
                                    <InputNumber placeholder="Enter Discounted Price" />
                                  </Form.Item>
                                </Col>

                                <Col span={24} style={{ textAlign: 'right' }}>
                                  <MinusCircleOutlined onClick={() => remove(name)} />
                                </Col>
                              </div>
                            ))}

                            <Form.Item className="main-button-add-p">
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                block
                              >
                                Add Service Package
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
            <Button type="primary" onClick={(e) => navigate(-1)} disabled={false}>
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

export default ViewPackage;
