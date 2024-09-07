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
import UploadImage from "../User/Student/_UploadImage";
import BannerImageUpload from "../../components/BannerImageUpload";
import notfound from "../../assets/images/not_found.png";

// const weekdays = [
//   { name: "sunday", label: "S" },
//   { name: "monday", label: "M" },
//   { name: "tuesday", label: "T" },
//   { name: "wednesday", label: "W" },
//   { name: "thursday", label: "Th" },
//   { name: "friday", label: "F" },
//   { name: "saturday", label: "ST" },
// ];

const weekdays = [
  { name: "sunday", label: "Sunday" },
  { name: "monday", label: "Monday" },
  { name: "tuesday", label: "Tuesday" },
  { name: "wednesday", label: "Wednesday" },
  { name: "thursday", label: "Thursday" },
  { name: "friday", label: "Friday" },
  { name: "saturday", label: "Saturday" },
];

const AddForm = () => {
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
  const { Step } = Steps;
  const { Panel } = Collapse;
  const sectionName = lang("Provider List");
  const heading = sectionName + " " + lang("Management");
  const { setPageHeading } = useContext(AppStateContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const params = useParams();
  const { request } = useRequest();
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [areas, setAreas] = useState([]);
  const [document, setDocument] = useState();
  const [logo, setLogo] = useState();
  const [coverPhoto, setCoverPhoto] = useState();
  const { country } = useAppContext();
  const [mobileNumber, setMobileNumber] = useState(null);
  const [mobileNumber2, setMobileNumber2] = useState({});
  const [showInput, setShowInput] = useState([]);
  const [profile, setProfile] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [subAdmin, setSubAdmin] = useState([]);
  const [availableWorkingDays, setAvailableWorkingDays] = useState(weekdays);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [data, setData] = useState(null);
  const [location, setLocation] = useState(null);
  const [editLocation, setEditLocation] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [services, setServices] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [event, setEvent] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState();
  const [cities, setCities] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState([]);
  const [selectedService, setSelectedService] = useState([]);

  const format = "h:mm a";

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

  const getServiceAttribute = (service_id) => {
    request({
      url: `${apiPath.allAttribute}/${formData?.category_id}/${service_id}`,
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

  const getCity = (id) => {
    request({
      url: `/country-city/${id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setCities(data);
        }
      },
    });
  };

  const FileType = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/avif",
    "image/webp",
    "image/gif",
  ];

  const getAreas = (id) => {
    request({
      url: `/city-area/${id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        console.log(data, "setCities");
        if (data) {
          setAreas(data);
        }
      },
    });
  };

  const handleImage = (value) => {
    setImage((prev) => {
      return value.map((item) => {
        return item.url;
      });
    });
  };

  const handleCoverPhoto = (data) => {
    data.length > 0 ? setCoverPhoto(data[0].url) : setCoverPhoto("");
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
    if (!params.id) return;
    getProvider(params.id);
  }, [params.id]);

  useEffect(() => {
    if (!country.country_id) return;
    getCategory();
    getSubAdmin();
    getCountry();
    getEvent();
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
      package_service_id: data.package.package_service_id,
      budget: data.package.budget,
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
    setSelectedAttribute(data.values || []);
    setSelectedService(data.service_id || []);

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
    getEvent();
    getProfile(data?.category_id);
    getSubCategory(data?.category_id);
    getServices(data?.category_id);
    getAttribute(data?.category_id);
  }, [data]);

  const onCreate = (formvalue) => {
    //  return console.log(values,formData, "hfjhdkghkhdgkd");
    const { location, working_days } = formData;
    const values = formData;
    let payload = {
      ...formvalue,
      ...values,
      logo: logo,
      cover_photo: coverPhoto,
      country_id: country.country_id,
      ...mobileNumber,
      ...mobileNumber2,
      ...location,
      document: document,
      category_id: values.category_id,
      sub_category_id: values.sub_category_id,
    };
    // payload.values = selectedAttribute;
    // payload.service_id = selectedService;

    console.log(payload, "payload");
    if (
      form
        .getFieldValue("packages")
        ?.find((elem) => elem?.package_service_id?.length <= 1)
    ) {
      return ShowToast(
        "Please Select Atleast 2 Services to Create a Package!",
        Severty.ERROR
      );
    }

    if (image.length) payload.image = image;
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

  const handleMobileNumberChange = (value, data, type) => {
    let country_code = data?.dialCode;
    setMobileNumber({
      country_code: country_code,
      mobile_number: value.slice(data?.dialCode?.length),
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

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const onStepSubmit = (values) => {
    setFormData({ ...formData, ...values });
    console.log("values", { ...formData, ...values });
    if (currentStep === steps.length - 1) {
      onCreate(values);
    } else {
      nextStep();
    }
  };

  const handleCheckboxChange = ({ attribute_id, service_id }) => {
    let newAttribute = [...selectedAttribute];

    if (
      newAttribute.some(
        (attr) => attr.attribute === attribute_id && attr.service === service_id
      )
    ) {
      setSelectedAttribute(
        newAttribute.filter(
          (item) =>
            !(item.attribute === attribute_id && item.service === service_id)
        )
      );
      console.log(
        "newAttributeRemove-",
        newAttribute.filter(
          (item) =>
            !(item.attribute === attribute_id && item.service === service_id)
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

  const steps = [
    {
      content: (
        <Form
          id="create"
          form={form}
          onFinish={onStepSubmit}
          layout="vertical"
          disabled={data ? !isEdit : false}
        >
          <Row gutter={[16, 16]}>
            <Col span={24} lg={24} xs={24} className="d-flex flex-column gap-3">
              <Card>
                <Row gutter={24}>
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
                          option.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder={lang("Select Category")}
                        showSearch
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                        onChange={(e, key) => {
                          getProfile(e);
                          getSubCategory(e);
                          getServices(e);
                          getAttribute(e);
                          setShowInput([]);
                          form.setFieldsValue({ sub_category_id: [] });
                          form.setFieldsValue({ profile_id: [] });
                          form.setFieldsValue({ service_id: [] });
                        }}
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
                  <Col span={12} md={12}>
                    <Form.Item
                      label={lang("Profile")}
                      name="profile_id"
                      rules={[
                        {
                          required: true,
                          message: lang("Please select the profile!"),
                        },
                      ]}
                    >
                      <Select
                        filterOption={(input, option) =>
                          option.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder={lang("Select Profile")}
                        showSearch
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                        onChange={(value, option) => {
                          const selectedItem = profile.find(
                            (item) => item._id === value
                          );
                          if (selectedItem) {
                            setShowInput(selectedItem.permission);
                          }
                        }}
                      >
                        {profile.map((item) => (
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
                </Row>
              </Card>
            </Col>

            <Col span={24} lg={24} xs={24} className="d-flex flex-column gap-3">
              <Card className="">
                <h4 className="profile-headding">General </h4>

                <Row gutter={[12]}>
                  {showInput?.map((item) => (
                    <React.Fragment key={item?._id}>
                      {item.is_selected && item.name === "name" && (
                        <Col span={24} md={8}>
                          <TextInputBox
                            name={"name"}
                            label={item.label}
                            placeholder={lang("Enter " + item.label)}
                            cover={{ md: 24 }}
                            colProps={{ sm: 24, span: 24 }}
                            rules={[
                              {
                                max: 250,
                                message: lang(
                                  "Name should contain more than 250 characters!"
                                ),
                              },
                              {
                                required: item.is_required,
                                message: lang("Please Enter " + item.label),
                              },
                            ]}
                          />
                        </Col>
                      )}
                      {item.is_selected && item.name === "ar_name" && (
                        <Col span={24} md={8}>
                          <TextInputBox
                            name={"ar_name"}
                            label={item.label}
                            placeholder={lang("Enter " + item.label)}
                            cover={{ md: 24 }}
                            colProps={{ sm: 24, span: 24 }}
                            rules={[
                              {
                                max: 250,
                                message: lang(
                                  "Name should contain more than 250 characters!"
                                ),
                              },
                              {
                                required: item.is_required,
                                message: lang("Please Enter " + item.label),
                              },
                            ]}
                          />
                        </Col>
                      )}
                      {item.is_selected && item.name === "description" && (
                        <Col span={24} md={8}>
                          <TextInputBox
                            name="description"
                            label={lang(item.label)}
                            placeholder={lang("Enter Business Description")}
                            cover={{ md: 24 }}
                            colProps={{ sm: 24, span: 24 }}
                            rules={[
                              {
                                max: 500,
                                message: lang(
                                  "Description should contain more then 500 characters!"
                                ),
                              },

                              {
                                required: item.is_required,
                                message: lang("Please Enter " + item.label),
                              },
                            ]}
                          />
                        </Col>
                      )}
                      {item.is_selected && item.name === "ar_description" && (
                        <Col span={24} md={8}>
                          <TextInputBox
                            name="ar_description"
                            label={lang("Business Description Arabic")}
                            placeholder={lang("Enter Business Description")}
                            cover={{ md: 24 }}
                            colProps={{ sm: 24, span: 24 }}
                            rules={[
                              {
                                max: 500,
                                message: lang(
                                  "Description should contain more then 500 characters!"
                                ),
                              },
                              {
                                required: item.is_required,
                                message: lang("Please Enter " + item.label),
                              },
                            ]}
                          />
                        </Col>
                      )}
                      {item.is_selected && item.name === "country_id" && (
                        <Col span={24} md={8}>
                          <Form.Item
                            label={lang("Country")}
                            name="country_id"
                            rules={[
                              {
                                required: item.is_required,
                                message: lang("Please select the country!"),
                              },
                            ]}
                          >
                            <Select
                              filterOption={(input, option) =>
                                option?.label
                                  ?.toLowerCase()
                                  .indexOf(input?.toLowerCase()) >= 0
                              }
                              autoComplete="off"
                              placeholder={"Select Country"}
                              showSearch
                              onChange={(value) => getCity(value)}
                            >
                              {countries.map((item) => (
                                <Select.Option
                                  key={item._id}
                                  label={item.name}
                                  value={item._id}
                                >
                                  {item.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}
                      {item.is_selected && item.name === "city_id" && (
                        <Col span={24} md={8}>
                          <SelectInput
                            name="city_id"
                            label={lang("City")}
                            placeholder={lang("Select City")}
                            showSearch
                            filterOption={(input, option) =>
                              option.label
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            options={cities}
                            cover={{ md: 24 }}
                            colProps={{ sm: 24, span: 24 }}
                            rules={[
                              {
                                required: item.is_required,
                                message: lang("Please Enter " + item.label),
                              },
                            ]}
                            handleChange={(value) => {
                              getAreas(value);
                              form.setFieldsValue({ area: null });
                            }}
                          />
                        </Col>
                      )}
                      {/* {item.is_selected && item.name === "address" && (
                        <Col span={24} md={8}>
                          <TextInputBox
                            name="address"
                            label={lang("Address")}
                            placeholder={lang("Enter Address")}
                            cover={{ md: 24 }}
                            colProps={{ sm: 24, span: 24 }}
                            rules={[
                              {
                                max: 600,
                                message: lang(
                                  "Name should contain more then 600 characters!"
                                ),
                              },
                              {
                                required: item.is_required,
                                message: lang("Please Enter " + item.label),
                              },
                            ]}
                          />
                        </Col>
                      )}
                      {item.is_selected && item.name === "ar_address" && (
                        <Col span={24} md={8}>
                          <TextInputBox
                            name="ar_address"
                            label={lang("Address Arabic")}
                            placeholder={lang("Enter Address")}
                            cover={{ md: 24 }}
                            colProps={{ sm: 24, span: 24 }}
                            rules={[
                              {
                                max: 600,
                                message: lang(
                                  "Name should contain more then 600 characters!"
                                ),
                              },
                              {
                                required: item.is_required,
                                message: lang("Please Enter " + item.label),
                              },
                            ]}
                          />
                        </Col>
                      )} */}
                      {item.is_selected && item.name === "sub_category_id" && (
                        <Col span={12} md={8}>
                          <Form.Item
                            label={lang(`Sub Category Name`)}
                            name="sub_category_id"
                            rules={[
                              {
                                required: item.is_required,
                                message: lang("Please Enter " + item.label),
                              },
                            ]}
                          >
                            <Select
                              filterOption={(input, option) =>
                                option.label
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              placeholder={lang("Select Sub Category")}
                              showSearch
                              mode="multiple"
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
                        </Col>
                      )}
                      {item.is_selected &&
                        item.name === "associated_manager" && (
                          <Col span={12} md={8}>
                            <Form.Item
                              label={lang("Associated manager")}
                              name="associated_manager"
                              rules={[
                                {
                                  required: item.is_required,
                                  message: lang("Please Enter " + item.label),
                                },
                              ]}
                            >
                              <Select
                                filterOption={(input, option) =>
                                  option.label
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                placeholder={lang("Select Associated manager")}
                                showSearch
                                getPopupContainer={(triggerNode) =>
                                  triggerNode.parentNode
                                }
                              >
                                {subAdmin.map((item) => (
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
                        )}
                    </React.Fragment>
                  ))}
                </Row>
              </Card>
            </Col>

            <Col span={24} lg={24} xs={24} className="d-flex flex-column gap-3">
              <Card className="">
                <h4 className="profile-headding">Contact</h4>
                <Row gutter={[12]}>
                  {showInput?.map((item) => (
                    <React.Fragment key={item._id}>
                      {item.is_selected &&
                        item.name === "contact_person_name" && (
                          <Col span={24} md={8}>
                            <TextInputBox
                              name="contact_person_name"
                              label={lang("Contact Person Name")}
                              placeholder={lang("Enter Contact Person Name")}
                              cover={{ md: 24 }}
                              colProps={{ sm: 24, span: 24 }}
                              rules={[
                                {
                                  max: 20,
                                  message: lang(
                                    "Name should contain more then 20 characters!"
                                  ),
                                },
                                {
                                  required: item.is_required,
                                  message: lang("Please Enter " + item.label),
                                },
                              ]}
                            />
                          </Col>
                        )}
                      {item.is_selected && item.name === "email" && (
                        <Col span={24} md={8}>
                          <Form.Item
                            label={lang("Email ID")}
                            name="email"
                            cover={{ md: 24 }}
                            colProps={{ sm: 24, span: 24 }}
                            rules={[
                              {
                                type: "email",
                                message: lang(
                                  "Please enter a valid email address!"
                                ),
                              },
                              {
                                max: 50,
                                message: lang(
                                  "Email address not more then 255 characters!"
                                ),
                              },
                              {
                                required: item.is_required,
                                message: lang("Please Enter " + item.label),
                              },
                            ]}
                          >
                            <Input placeholder={lang("Enter Email ID")} />
                          </Form.Item>
                        </Col>
                      )}
                      {item.is_selected && item.name === "mobile" && (
                        <Col span={24} md={8}>
                          <PhoneNumberField
                            rules={item.is_required}
                            label={lang("Contact Person Phone Number")}
                            name="mobile"
                            placeholder={lang("Enter Phone Number")}
                            cover={{ md: 24 }}
                            colProps={{ sm: 24, span: 24 }}
                            className=""
                            onChange={handleMobileNumberChange}
                          />
                        </Col>
                      )}
                      {item.is_selected && item.name === "password" && (
                        <Col span={24} md={8}>
                          <Form.Item
                            label={lang("Create Password")}
                            name="password"
                            cover={{ md: 24 }}
                            colProps={{ sm: 24, span: 24 }}
                            rules={[
                              // {
                              //   pattern: new RegExp(
                              //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
                              //   ),
                              //   message: lang(
                              //     "Confirm password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character"
                              //   ),
                              // },
                              {
                                required: item.is_required,
                                message: lang("Please Enter " + item.label),
                              },
                            ]}
                          >
                            <Input.Password
                              onCut={(e) => e.preventDefault()}
                              onCopy={(e) => e.preventDefault()}
                              onPaste={(e) => e.preventDefault()}
                              autoComplete="off"
                              placeholder={lang("Create Password")}
                            />
                          </Form.Item>
                        </Col>
                      )}
                      {item.is_selected && item.name === "password" && (
                        <Col span={24} md={8}>
                          <Form.Item
                            label={lang("Confirm Password")}
                            name="confirm_password"
                            dependencies={["password"]}
                            cover={{ md: 24 }}
                            colProps={{ sm: 24, span: 24 }}
                            hasFeedback
                            rules={[
                              {
                                required: item.is_required,
                                message: lang("Please Enter " + item.label),
                              },

                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    getFieldValue("password") === value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      lang(
                                        "Password that you entered doesn't match!"
                                      )
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              placeholder={lang("Enter Confirm Password")}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      {/* {item.is_selected && item.name === "mobile" && (
                        <Col span={24} md={8}>
                          <Form.Item
                            name="have_whatsapp"
                            valuePropName="checked"
                            cover={{ md: 24 }}
                            colProps={{ sm: 24, span: 24 }}
                          >
                            <Checkbox className="" onChange={onChange}>
                              {lang(
                                "This number have WhatsApp to receive messages?"
                              )}{" "}
                            </Checkbox>
                          </Form.Item>
                        </Col>
                      )} */}
                    </React.Fragment>
                  ))}
                </Row>
              </Card>

              <Card>
                <h4 className="profile-headding">Media </h4>
                <div className="row g-3">
                  {showInput?.map((item) => (
                    <React.Fragment key={item._id}>
                      {item.is_selected && item.name === "website_url" && (
                        <>
                          <Col
                            style={{ display: "flex", flexWrap: "wrap" }}
                            span={24}
                            md={24}
                          >
                            {/* <h4>Website Url</h4> */}
                            <TextInputBox
                              name={"twitter_link"}
                              label={"Twitter Link"}
                              placeholder={lang("Enter Twitter Link")}
                              cover={{ md: 8 }}
                              colProps={{ sm: 12, span: 24 }}
                              rules={[
                                {
                                  required: item.is_required,
                                  message: lang("Please enter twitter link "),
                                },
                              ]}
                            />
                            <TextInputBox
                              name={"facebook_link"}
                              label={"FaceBook Link"}
                              placeholder={lang("Enter FaceBook Link")}
                              cover={{ md: 8 }}
                              colProps={{ sm: 24, span: 24 }}
                              rules={[
                                {
                                  required: item.is_required,
                                  message: lang("Please Enter facebook link"),
                                },
                              ]}
                            />
                            <TextInputBox
                              name={"instagram_link"}
                              label={"Instagram Link"}
                              placeholder={lang("Enter Instagram Link")}
                              cover={{ md: 8 }}
                              colProps={{ sm: 24, span: 24 }}
                              rules={[
                                {
                                  required: item.is_required,
                                  message: lang("Please Enter Instagram link"),
                                },
                              ]}
                            />
                          </Col>
                        </>
                      )}

                      {item.is_selected && item.name === "logo" && (
                        <div className="col-xl-4 col-lg-4">
                          <Form.Item
                            className="upload_wrap"
                            rules={[
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (item.is_required && !logo) {
                                    return Promise.reject(
                                      lang(`Please Select ${item.label}`)
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                            name="logo"
                            label={"Upload Profile Image"}
                          >
                            <UploadImage
                              disabled={data ? !isEdit : false}
                              value={logo}
                              setImage={setLogo}
                            />
                          </Form.Item>

                          <p
                            className="img-size-details"
                            style={{ fontSize: 11, marginTop: 4 }}
                          ></p>
                        </div>
                      )}
                      {item.is_selected && item.name === "cover_photo" && (
                        <div className="col-xl-4 col-lg-4 order-lg-2">
                          <Form.Item
                            className="upload_wrap"
                            rules={[
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (item.is_required && !logo) {
                                    return Promise.reject(
                                      lang(`Please Select ${item.label}`)
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                            name="cover_photo"
                            label={"Upload Cover Image"}
                          >
                            {/* <UploadImage
                              disabled={data ? !isEdit : false}
                              value={coverPhoto}
                              setImage={setCoverPhoto}
                            /> */}
                            <SingleImageUpload
                              value={coverPhoto}
                              fileType={FileType}
                              imageType={"coverPhoto"}
                              btnName={"Cover Image"}
                              onChange={(data) => handleCoverPhoto(data)}
                              isDimension={false}
                            />
                          </Form.Item>

                          <div className="mt-2 add-img-product">
                            {" "}
                            <Image
                              width={120}
                              src={coverPhoto ?? notfound}
                            ></Image>{" "}
                          </div>
                        </div>
                      )}

                      {item.is_selected && item.name === "location" && (
                        <div className="col-md-12  order-lg-4">
                          <Form.Item
                            label={lang(
                              "Location (Drag Marker for Selecting Location)"
                            )}
                            name="location"
                            rules={[
                              {
                                required: item.is_required,
                                message: lang("Please Enter " + item.label),
                              },
                            ]}
                          >
                            <LocationMap className="mt-3" />
                          </Form.Item>
                        </div>
                      )}

                      {item.is_selected && item.name === "image" && (
                        <div className="col-xl-12 col-lg-12 mb-4 order-lg-3 ">
                          <p className="mb-0">
                            **
                            {lang(
                              "You can select only (.gif, .png, .jpeg, .jpg) format files upto 1 MB file size"
                            )}
                            ..!!!
                          </p>
                          <Card className="" style={{ height: "100%" }}>
                            <div className="row g-3">
                              <Col span={24}>
                                <Form.Item
                                  className="upload_wrap img-uploaded"
                                  rules={[
                                    ({ getFieldValue }) => ({
                                      validator(_, value) {
                                        if (
                                          item.is_required &&
                                          (!value || value.length === 0)
                                        ) {
                                          return Promise.reject(
                                            lang(`Please Select ${item.label}`)
                                          );
                                        }
                                        return Promise.resolve();
                                      },
                                    }),
                                  ]}
                                  label={lang("Upload Gallery Image")}
                                  name="image"
                                  getValueFromEvent={(event) => {
                                    return event
                                      .map((item) => item.thumbUrl)
                                      .join(",");
                                  }}
                                >
                                  <MultipleImageUpload
                                    value={image}
                                    data={image}
                                    fileType={FileType}
                                    imageType={"category"}
                                    btnName={"Image"}
                                    onChange={(data) => handleImage(data)}
                                  />
                                </Form.Item>
                              </Col>
                            </div>
                          </Card>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </Card>

              <Card>
                <h4 className="profile-headding">Select Event </h4>
                <div className="row g-3">
                  {showInput?.map((item) => (
                    <React.Fragment key={item._id}>
                      {item.is_selected && item.name === "eventtype_id" && (
                        <div className="col-md-12">
                          <div className="row g-3">
                            <Col span={24} md={24}>
                              <Form.Item
                                // label="Event"
                                name="eventtype_id"
                                rules={[
                                  {
                                    required: item.is_required,
                                    message: lang("Please Enter "),
                                  },
                                ]}
                              >
                                <Select
                                  placeholder="Select Event"
                                  // onChange={(e) => {
                                  //   handleSelectWorkDays(e);
                                  // }}
                                  getPopupContainer={(triggerNode) =>
                                    triggerNode.parentNode
                                  }
                                  mode="multiple"
                                >
                                  {event.map((item) => (
                                    <Select.Option
                                      value={item._id}
                                      key={item._id}
                                    >
                                      {item.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </Card>

              <Card className="">
                <h4 className="profile-heading">Working Day's</h4>
                <div className="row g-3">
                  <div className="  col-lg-12  px-0">
                    <Row gutter={24}>
                      {showInput?.map((item) => (
                        <React.Fragment key={item._id}>
                          {item.is_selected && item.name === "working_days" && (
                            <Col span={24} md={24}>
                              <Form.List
                                name="working_days"
                                className="mt-2 "
                                initialValue={[{}]}
                              >
                                {(fields1, { add, remove }, { form }) => (
                                  <>
                                    {fields1.map((field_fr_1, index) => (
                                      <div key={field_fr_1.key}>
                                        <Space
                                          key={field_fr_1.key}
                                          align="baseline"
                                          className="gap-cls"
                                        >
                                          <div className="row gap-3 m-3"></div>
                                          <div className="row gap-3 m-3">
                                            <Col span={24} md={8}>
                                              <Form.Item
                                                label="Select Day"
                                                name={[field_fr_1.name, "day"]}
                                                rules={[
                                                  {
                                                    required: item.is_required,
                                                    message: lang(
                                                      "Please Enter " +
                                                        item.label
                                                    ),
                                                  },
                                                ]}
                                              >
                                                <Select
                                                  placeholder="Select Working Day"
                                                  // onChange={(e) => {
                                                  //   handleSelectWorkDays(e);
                                                  // }}
                                                  getPopupContainer={(
                                                    triggerNode
                                                  ) => triggerNode.parentNode}
                                                >
                                                  {availableWorkingDays.map(
                                                    (day) => (
                                                      <Select.Option
                                                        value={day.name}
                                                        key={day.name}
                                                      >
                                                        {day.label}
                                                      </Select.Option>
                                                    )
                                                  )}
                                                </Select>
                                              </Form.Item>
                                            </Col>
                                            <Col span={24} md={8}>
                                              <Form.Item
                                                className="qty-cls "
                                                style={{
                                                  minWidth: "180px",
                                                }}
                                                name={[field_fr_1.name, "time"]}
                                                label="Enter Time Range"
                                                rules={[
                                                  {
                                                    required: item.is_required,
                                                    message: lang(
                                                      "Please Enter Time Range "
                                                    ),
                                                  },
                                                ]}
                                              >
                                                <TimePicker.RangePicker
                                                  defaultValue={moment(
                                                    "12:08",
                                                    format
                                                  )}
                                                  format={format}
                                                />
                                              </Form.Item>
                                            </Col>

                                            <Col
                                              span={8}
                                              sm={5}
                                              lg={6}
                                              className="mt-4"
                                            >
                                              <div className="add-menu-items-delete">
                                                {index ===
                                                field_fr_1.length - 1 ? (
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
                                                      onClick={() =>
                                                        remove(field_fr_1.name)
                                                      }
                                                      style={{
                                                        borderRadius: "50%",
                                                      }}
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            </Col>
                                          </div>
                                        </Space>
                                      </div>
                                    ))}
                                    <Col md={6} span={24}>
                                      <Form.Item style={{ marginTop: "10px" }}>
                                        <Button
                                          onClick={() => add()}
                                          block
                                          className="primary_btn btnStyle add-item-btn"
                                        >
                                          <i class="fas fa-plus" />
                                          Add Another Day
                                        </Button>
                                      </Form.Item>
                                    </Col>
                                  </>
                                )}
                              </Form.List>
                            </Col>
                          )}
                        </React.Fragment>
                      ))}
                    </Row>
                  </div>
                </div>
              </Card>
            </Col>
            <Row gutter={24}></Row>
          </Row>
        </Form>
      ),
    },
    {
      content: (
        <Form id="create" form={form} onFinish={onStepSubmit} layout="vertical">
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
                                          required: item.is_required,
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
                                        onChange={(e) => getServiceAttribute(e)}
                                        mode="Single"
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
                                        {attributes.map((attribute) => (
                                          <Select.Option
                                            key={attribute._id}
                                            label={attribute.name}
                                            value={attribute._id}
                                          >
                                            {attribute.name}
                                          </Select.Option>
                                        ))}
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
                            <Form.Item>
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
        </Form>
      ),
    },
    {
      content: (
        <Form
          id="create"
          form={form}
          onFinish={onStepSubmit}
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
                            {fields.map(
                              ({ key, name, fieldKey, ...restField }) => (
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
                                          message: lang(
                                            "Package name is required"
                                          ),
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
                                      fieldKey={[
                                        fieldKey,
                                        "package_service_id",
                                      ]}
                                      rules={[
                                        {
                                          required: true,
                                          message: lang(
                                            "Please select a service"
                                          ),
                                        },
                                      ]}
                                    >
                                      <Select
                                        filterOption={(input, option) =>
                                          option.label
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                        }
                                        placeholder={lang("Select service")}
                                        showSearch
                                        getPopupContainer={(triggerNode) =>
                                          triggerNode.parentNode
                                        }
                                        mode="multiple"
                                      >
                                        {services
                                          .filter((item) =>
                                            formData?.services?.some(
                                              (elem) =>
                                                elem.service_id === item._id
                                            )
                                          )
                                          .map((item) => (
                                            <Select.Option
                                              key={item?._id}
                                              label={item?.name}
                                              value={item?._id}
                                            >
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
                                          message: lang(
                                            "Original price is required"
                                          ),
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
                                          message: lang(
                                            "Discounted price is required"
                                          ),
                                        },
                                      ]}
                                    >
                                      <InputNumber placeholder="Enter Discounted Price" />
                                    </Form.Item>
                                  </Col>

                                  <Col span={24} style={{ textAlign: "right" }}>
                                    <MinusCircleOutlined
                                      onClick={() => remove(name)}
                                    />
                                  </Col>
                                </div>
                              )
                            )}

                            <Form.Item>
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
        </Form>
      ),
    },
  ];

  return (
    <>
      {" "}
      <React.Fragment>
        {data ? (
          <Col span={24} lg={24} xs={24} className="">
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
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Steps className="discount-steps" current={currentStep}>
              {steps.map((step) => (
                <Step key={step.title} title={step.title} />
              ))}
            </Steps>
          </Col>
          <Col span={24}>
            <div style={{ marginTop: "20px" }} className="modal-border-box">
              <div>{steps[currentStep]?.content}</div>
            </div>
          </Col>
          <Col span={24}>
            <div className="view-provider">
              {
                <Button type="primary" onClick={(e) => navigate(-1)}>
                  Cancel
                </Button>
              }
              {currentStep === 1 && (
                <Button type="primary" onClick={nextStep}>
                  Skip
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button
                  form="create"
                  type="primary"
                  htmlType="submit"
                  className="next-button-drop"
                >
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button form="create" type="primary" htmlType="submit">
                  Done
                </Button>
              )}
            </div>
          </Col>
        </Row>
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

export default AddForm;
