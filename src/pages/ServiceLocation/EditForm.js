import { Checkbox, Col, Form, Input, Modal, Row, Select, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import { useParams } from "react-router";
import lang from "../../helper/langHelper";

const dateFormat = "YYYY/MM/DD";

const EditForm = ({ api, show, hide, data, refresh, cities }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [file, setFile] = useState([]);
  const [lo, setImage] = useState([]);
  const [country, setCountry] = useState([]);
  const { id: country_id } = useParams();

  const [city, setCity] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getCountry = () => {
    request({
      url: `/all-country`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        console.log(data, "Country");
        setIsLoading(false);
        if (status) {
          setCountry(data);
        }
      },
    });
  };

  const getCity = (id) => {
    request({
      // url: `/city/${id}`,
      url: `/country-all-city/${id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        console.log(data, "city");
        if (status) {
          console.log(data, cities);
          setCity(data.filter((item) => !cities.includes(item._id)));
        }
      },
    });
  };

  useEffect(() => {
    form.setFieldsValue({ country_id });
    getCity(country_id);
    getCountry();
  }, []);

  const onCreate = (values) => {
    const { city_id } = values;
    console.log(values, "values");
    const payload = {
      country_id,
      city_id,
    };
    setLoading(true);

    console.log(payload, "hfdjhjkhgjkfhgjkfhg");
    request({
      url: `${api.addEdit + "/" + country_id}`,
      method: "PUT",
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
      cancelText={null}
      onCancel={hide}
      okButtonProps={{
        form: "create",
        htmlType: "submit",
        loading: loading,
      }}
      className="tab_modal"
    >
      <h4 className="modal_title_cls">{`${
        data ? lang("Add Service City") : lang("Add Service City")
      }`}</h4>
      {isLoading ? (
        [1, 2].map((item) => <Skeleton active key={item} />)
      ) : (
        <Form id="create" form={form} onFinish={onCreate} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={24} sm={12}>
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
                  disabled={true}
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                  }
                  autoComplete="off"
                  placeholder={lang("Select Country")}
                  showSearch
                  onChange={(value) => getCity(value)}
                >
                  {country.map((item) => (
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
                label={lang("City")}
                name="city_id"
                rules={[
                  { required: true, message: lang("Please select the city!") },
                ]}
                className="multiselect_cls"
              >
                {/* {city.length > 0 ? (
                  <Select
                    mode="multiple"
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    }
                    placeholder="Select City"
                    showSearch
                  >
                    {city.map((item) => (
                      <Select.Option
                        key={item._id}
                        label={item.name}
                        value={item._id}
                      >
                        {item.name}{" "}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <Input />
                )} */}

                <Select
                  mode="tags"
                  // mode="multiple"
                  filterOption={(input, option) =>
                    option.label?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
                  }
                  placeholder={lang("Select City")}
                  showSearch
                >
                  {city.map((item) => (
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
        </Form>
      )}
    </Modal>
  );
};

export default EditForm;
