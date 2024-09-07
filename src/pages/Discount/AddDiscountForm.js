import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Steps,
} from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";

import notfound from "../../assets/images/not_found.png";
import SingleImageUpload from "../../components/SingleImageUpload";
import apiPath from "../../constants/apiPath";
import { AppStateContext } from "../../context/AppContext";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import lang from "../../helper/langHelper";

const { Step } = Steps;

export const DISCOUNT_AMOUNT_TYPES = [
  {
    name: "percentage",
    _id: "percentage",
  },
  {
    name: "flat",
    _id: "flat",
  },
];

const discountUserType = [
  "Unlimited times for all users",
  "Once for new user for first order",
  "Once per user",
  "Define custom limit per user",
];

const DiscountTypes = {
  FREE: "Free Delivery",
  PERCENTAGE: "Percentage Delivery",
};

const AddDiscountForm = ({ section, show, hide, data, refresh }) => {
  const api = {
    fc: apiPath.common.foodCategories,
    selectedFC: apiPath.common.selectedFoodCategories,
    items: apiPath.common.items,
    discount: apiPath.discount,
    checkCode: apiPath.checkCode,
  };

  const { country } = useContext(AppStateContext);

  const [currentStep, setCurrentStep] = useState(0);

  const [form] = Form.useForm();
  const { request } = useRequest();
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState();
  const [startDate, setStartDate] = useState();
  const [discountType, setDiscountType] = useState(DiscountTypes.FREE);

  const [customLimitEnabled, setCustomLimitEnabled] = useState(false);
  const [isAllRestaurants, setIsAllRestaurants] = useState(false);
  const [isAllCities, setIsAllCities] = useState(false);

  const [restaurants, setRestaurants] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const { RangePicker } = DatePicker;

  const handleSelectDiscountUserType = (value) => {
    if (value === discountUserType[3]) {
      setCustomLimitEnabled(true);
    } else {
      setCustomLimitEnabled(false);
    }
  };

  const handleDiscountType = (value) => {
    setDiscountType(value);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const FileType = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/avif",
    "image/webp",
    "image/gif",
  ];

  const handleImage = (data) => {
    if (data && data.length > 0) {
      setImage(data[0].url);
    }
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

  const getRestaurants = (countryId, cities) => {
    request({
      url: `/restaurants/` + countryId,
      method: "POST",
      data: { cities: cities },
      onSuccess: ({ data, status }) => {
        if (status) {
          setRestaurants(data);
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

  const handleAllRestaurantsChange = (e) => {
    setIsAllRestaurants(e.target.checked);
  };

  const handleAllCitiesChange = (e) => {
    setIsAllCities(e.target.checked);
    if (e.target.checked) {
      const countryId = form.getFieldValue("country_id");
      getRestaurants(countryId, null);
    }
  };

  const handleCityChange = (cities) => {
    const countryId = form.getFieldValue("country_id");
    getRestaurants(countryId, cities);
  };

  const checkCode = (values) => {
    const payload = { ...values };
    request({
      url: api.checkCode + `?id=${data?._id ? data?._id : ""}`,
      method: "POST",
      data: payload,
      onSuccess: ({ data, status, message }) => {
        if (status) {
          nextStep();
        } else {
          ShowToast(message, Severty.ERROR);
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const onStepSubmit = (values) => {
    setFormData({ ...formData, ...values });
    if (currentStep === steps.length - 1) {
      addNewDiscount(values);
    } else {
      checkCode(values);
    }
  };

  const addNewDiscount = (values) => {
    const payload = {
      ...formData,
      ...values,
      start_date: formData?.disount_time?.[0],
      end_date: formData?.disount_time?.[1],
      for_all_restaurants: !!isAllRestaurants,
      for_all_cities: !!isAllCities,
      image: image,
    };
    request({
      url: data ? api.discount + `/${data._id}` : api.discount,
      method: data ? "PUT" : "POST",
      data: payload,
      onSuccess: (data) => {
        setLoading(false);
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
          refresh();
          hide();
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
    if (!data) return;

    if (data?.country_id) {
      getCity(data.country_id);
    }
    if (data?.for_all_cities) {
      getRestaurants(data.country_id, null);
    }
    if (data?.cities?.length > 0) {
      getRestaurants(data.country_id, cities);
    }
    setIsAllRestaurants(data?.for_all_restaurants);
    setIsAllCities(data?.for_all_cities);
    setImage(data?.image);
    setDiscountType(data?.type);

    form.setFieldsValue({
      ...data,
      disount_time: [moment(data.start_date), moment(data.end_date)],
    });
    console.log("data?.max_uses", data);
  }, [data]);

  useEffect(() => {
    if (country.country_id) {
      form.setFieldValue("country_id", country.country_id);
      if (cities.length == 0) {
        getCity(country.country_id);
      }
      if (restaurants.length == 0) {
        getRestaurants(country.country_id, null);
      }
    }
  }, [country?.country_id]);

  const steps = [
    {
      content: (
        <Form id="create" form={form} onFinish={onStepSubmit} layout="vertical">
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item
                className="mb-0"
                label={lang("Upload Banner Image")}
                rules={[
                  {
                    validator: (_, value) => {
                      if (image) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(lang("Banner image is required")),
                      );
                    },
                  },
                ]}
                name="thumbnail"
              >
                <SingleImageUpload
                  value={image}
                  fileType={FileType}
                  imageType={"blog"}
                  onChange={(data) => handleImage(data)}
                  isDimension={true}
                />
                <p className="img-size-details">
                  **
                  {lang(
                    "Images should be 600x600 for best view in gallery image. You can select only (.gif, .png, .jpeg, .jpg) format files upto 1 MB file size",
                  )}
                  ..!!!
                </p>
              </Form.Item>

              {
                <div className="mt-0">
                  <Image width={120} src={image ? image : notfound}></Image>
                </div>
              }
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item
                label={lang("Country")}
                name="country_id"
                rules={[
                  {
                    required: true,
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
            <Col span={24} md={12}>
              <Form.Item
                className="cc-check-box"
                name="for_all_cities"
                label={lang("Apply on All Cities")}
                valuePropName="checked"
              >
                <Checkbox onChange={handleAllCitiesChange} />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="cities"
                label={lang("Select Cities")}
                rules={[
                  {
                    required: !isAllCities,
                    message: lang("Missing Cities Selection"),
                  },
                ]}
              >
                <Select
                  className="restaurant-selected"
                  filterOption={(input, option) =>
                    option?.label
                      ?.toLowerCase()
                      .indexOf(input?.toLowerCase()) >= 0
                  }
                  disabled={isAllCities}
                  placeholder={lang("Select Cities")}
                  onChange={(e) => {
                    handleCityChange(e);
                  }}
                  mode="multiple"
                >
                  {cities && cities && cities.length > 0
                    ? cities.map((item, index) => (
                        <option
                          key={item._id}
                          value={item._id}
                          label={item.name}
                        >
                          <span className="cap">{item.name}</span>
                        </option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                className="cc-check-box"
                name="for_all_restaurants"
                label={lang("Apply on All Restaurants")}
                valuePropName="checked"
              >
                <Checkbox onChange={handleAllRestaurantsChange} />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="restaurants"
                label={lang("Select Restaurants")}
                rules={[
                  {
                    required: !isAllRestaurants,
                    message: lang("Missing Restaurant Selection"),
                  },
                ]}
              >
                <Select
                  className="restaurant-selected"
                  // the dropdown will be attached to the same container as the trigger element rather than being appended to the end of the document body.
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  disabled={isAllRestaurants}
                  placeholder={lang("Select Restaurants")}
                  mode="multiple"
                >
                  {restaurants && restaurants && restaurants.length > 0
                    ? restaurants.map((item, index) => (
                        <option
                          key={item._id}
                          value={item._id}
                          label={item.name}
                        >
                          <span className="cap">{item.name}</span>
                        </option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      content: (
        <Form id="create" form={form} onFinish={onStepSubmit} layout="vertical">
          <Row gutter={24}>
            <Col span={24} md={12}>
              <Form.Item
                name="type"
                label={lang("Select Discount Type")}
                rules={[
                  {
                    required: true,
                    message: lang("Please select discount type"),
                  },
                ]}
              >
                <Select
                  placeholder={lang("Select Discount Type")}
                  onChange={handleDiscountType}
                >
                  {Object.values(DiscountTypes).map((item) => (
                    <option key={item} value={item} label={item.name}>
                      {item}
                    </option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {discountType === DiscountTypes.PERCENTAGE && (
              <Col span={24} md={12}>
                <Form.Item
                  name="amount"
                  label={lang("Discount Percentage")}
                  rules={[
                    {
                      required: true,
                      message: lang("Please Enter Discount Percentage"),
                    },
                  ]}
                >
                  <InputNumber maxLength={2} max={100} placeholder="10 %" />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={24}>
            <Col span={24} md={24}>
              <Form.Item
                label={lang("Coupon Code")}
                name="code"
                rules={[
                  {
                    max: 7,
                    message: lang(
                      "Name should contain more then 7 characters!",
                    ),
                  },
                  {
                    required: true,
                    message: lang("Please Enter Coupon Code"),
                  },
                ]}
                normalize={(value) => value.trimStart()}
              >
                <Input placeholder={lang("Enter Coupon Code")} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            {/* <Col span={12}>
              <Form.Item
                label="Start Date"
                name="start_date"
                rules={[
                  {
                    required: true,
                    message: "Please select the start date",
                  },
                ]}
              >
                <DatePicker
                  onChange={(e) => setStartDate(moment(e).format("YYYY-MM-DD"))}
                  placeholder="Select Start Date"
                  disabledDate={(current) =>
                    current.isBefore(moment().subtract(1, "day"))
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End Date"
                name="end_date"
                rules={[
                  {
                    required: true,
                    message: "Please select the end date",
                  },
                ]}
                disabledDate={(current) =>
                  current.isBefore(moment().subtract(1, "day"))
                }
              >
                <DatePicker
                  placeholder="Select End Date"
                  disabledDate={(current) =>
                    current.isBefore(moment().subtract(1, "day")) ||
                    current.isBefore(startDate)
                  }
                />
              </Form.Item>
            </Col> */}

            <Col span={24}>
              <Form.Item
                label={lang("Discount Time")}
                name="disount_time"
                rules={[
                  {
                    required: true,
                    message: lang("Please select the time"),
                  },
                ]}
              >
                <DatePicker.RangePicker
                  showTime={{ format: "hh:mm a" }}
                  format="YYYY-MM-DD hh:mm a"
                  placeholder={[lang("Start Time"), lang("End Time")]}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label="Start Time"
                name="start_date"
                rules={[
                  {
                    required: true,
                    message: "Please select the start date",
                  },
                ]}
              >
                <RangePicker
                  showTime={{ format: "hh:mm a" }}
                  format="DD-MM-YY hh:mm a"
                  placeholder="Select Start Date"
                  onChange={(dates) => {
                    if (dates && dates[0]) {
                      const startDate = dates[0].format("DD-MM-YY hh:mm a");
                      setStartDate(startDate);
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row> */}

          <Row gutter={24}>
            <Col span={24} md={24}>
              <Form.Item
                name="min_order_price"
                label={lang("Minimum Order Price")}
                rules={[
                  {
                    required: true,
                    message: lang("Please Enter Minimum Order Price"),
                  },
                ]}
              >
                <InputNumber
                  maxLength={10}
                  placeholder={lang("Enter Minimum Order Price")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24} md={12}>
              <Form.Item
                name="max_discount"
                label={lang("Max Discount")}
                rules={[
                  {
                    required: true,
                    message: lang("Please Enter Max Amount"),
                  },
                ]}
              >
                <InputNumber
                  maxLength={10}
                  placeholder={lang("Enter Max Discount Amount")}
                />
              </Form.Item>
            </Col>

            <Col span={24} md={12}>
              <Form.Item
                name="max_uses"
                label={lang("Max Number Of Uses In Total")}
                rules={[
                  {
                    required: true,
                    message: lang("Please Enter Max Number Of Uses In Total"),
                  },
                ]}
              >
                <InputNumber
                  maxLength={10}
                  placeholder={lang("Enter Max Number Of Uses In Total")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24} md={12}>
              <Form.Item
                name="user_type"
                label={lang("Select User Type")}
                rules={[
                  {
                    required: true,
                    message: lang("Please select user type"),
                  },
                ]}
              >
                <Select
                  placeholder={lang("Select User Type")}
                  onChange={handleSelectDiscountUserType}
                >
                  {discountUserType &&
                  discountUserType &&
                  discountUserType.length > 0
                    ? discountUserType.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>

            {customLimitEnabled && (
              <Col span={24} md={12}>
                <Form.Item
                  name="uses_per_user"
                  label={lang("Uses Per User")}
                  rules={[
                    {
                      required: true,
                      message: lang("Please Enter Uses Per User"),
                    },
                  ]}
                >
                  <InputNumber
                    maxLength={10}
                    placeholder={lang("Enter Uses Per User")}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={24}>
            <Col span={24} md={12}>
              <Form.Item
                name="description"
                label={lang("Custom Message")}
                rules={[
                  {
                    required: true,
                    message: lang("Please Enter the message"),
                  },
                ]}
              >
                <Input placeholder={lang("Enter the message")} />
              </Form.Item>
            </Col>

            <Col span={24} md={12}>
              <Form.Item
                name="ar_description"
                label={lang("Custom Message Arabic")}
                rules={[
                  {
                    required: true,
                    message: "الرجاء إدخال الرسالة",
                  },
                ]}
              >
                <Input placeholder={"Enter the message"} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      content: (
        <Form id="create" form={form} onFinish={onStepSubmit} layout="vertical">
          <Row gutter={24}>
            <div className="disc-last-modal">
              <h6>{data ? lang("Update?") : lang("Final Step")}</h6>
              {!data && (
                <p>{lang("A Final Step!! You are about to Add Discount")}</p>
              )}
            </div>
          </Row>
        </Form>
      ),
    },
  ];

  useEffect(() => {
    getCountry();
  }, []);

  return (
    <Modal
      open={show}
      width={840}
      okText={
        currentStep === steps.length - 1
          ? (data ? "Update" : "Add") + " " + section
          : "Next"
      }
      onCancel={hide}
      okButtonProps={{
        form: "create",
        loading: loading,
        htmlType: "submit",
      }}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="tab_modal"
    >
      <h4 className="modal_title_cls">
        {!!data ? lang("Edit") : lang("Add New")} {section}
      </h4>

      <Steps className="discount-steps" current={currentStep}>
        {steps.map((step) => (
          <Step key={step.title} title={step.title} />
        ))}
      </Steps>

      <div style={{ marginTop: "20px" }} className="modal-border-box">
        <div>{steps[currentStep]?.content}</div>
      </div>
    </Modal>
  );
};

export default AddDiscountForm;
