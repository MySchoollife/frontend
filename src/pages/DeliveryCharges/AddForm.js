import { Col, Form, InputNumber, Modal, Row, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import apiPath from "../../constants/apiPath";
import { AppStateContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";

const AddForm = ({ show, hide, data, refresh }) => {
  const [form] = Form.useForm();
  const { country, cities } = useContext(AppStateContext);
  const { request } = useRequest();

  const [loading, setLoading] = useState(false);

  const [searchCity, setSearchCity] = useState("");
  const debouncedSearchCity = useDebounce(searchCity, 300);
  const [page, setPage] = useState(1);
  const [areas, setAreas] = useState([]);

  const [selectedAreas, setSelectedAreas] = useState([]);

  // const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    country_id: undefined,
  });

  // const getCities = (id, search, page) => {
  //   if (!id) return;
  //   request({
  //     url: `/country-all-city/${id}?page=${page}&pageSize=30${
  //       search ? `&search=${search}` : ""
  //     }`,
  //     method: "GET",
  //     onSuccess: ({ data, status }) => {
  //       console.log(data, "setCities");
  //       if (data) {
  //         search ? setCities(data) : setCities((prev) => [...prev, ...data]);
  //       }
  //     },
  //   });
  // };

  const getAreas = (cityId) => {
    let search = "";
    request({
      url: `/city-area/${cityId}?page=${page}&pageSize=30${
        search ? `&search=${search}` : ""
      }`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        console.log(data, "setCities");
        if (data) {
          setAreas(data);
        }
      },
    });
  };

  const onAreaChange = ({ index, value }) => {
    setSelectedAreas((prev) => {
      prev[index] = value;
      console.log(prev, "gdhghgdf PREV value in set value");
      return prev;
    });
  };

  const onFinish = (values) => {
    console.log(values, selectedAreas, "jhghg :🍠 ");
    const { city_id, area_1, area_2, price } = values;
    console.log(values, "values");
    const payload = {
      city_id,
      area_id: [area_1, area_2],
      price,
    };

    setLoading(true);
    request({
      url: apiPath.deliveryCharge + (data ? "/" + data?._id : ""),
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

  // useEffect(() => {
  //   // getCities(country.country_id, "", 1);
  // }, [country.country_id]);

  useEffect(() => {
    if (!data) return;

    if (data?.city_id) {
      getAreas(data.city_id);
    }

    console.log(data);
    form.setFieldsValue({
      ...data,
      area_1: data?.area_id[0],
      area_2: data?.area_id[1],
    });
  }, [data]);

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
      <h4 className="modal_title_cls">
        {`${data ? lang("Edit Delivery Charge") : lang("Add Delivery Charge")}`}
      </h4>
      <Form id="create" form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={[16, 16]}>
          {
            <Col span={24} sm={24}>
              <Form.Item
                label={lang("City")}
                name="city_id"
                rules={[
                  { required: true, message: lang("Please select the city!") },
                ]}
              >
                <Select
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  autoComplete="off"
                  placeholder={lang("Select City")}
                  showSearch
                  onChange={(value) => {
                    getAreas(value);
                  }}
                  disabled={!!data}
                >
                  {cities.map((item) => (
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
          }

          <Col span={24} sm={12}>
            <Form.Item
              label={lang(`Area 1`)}
              name="area_1"
              rules={[{ required: true, message: lang("Please Select Area") }]}
            >
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                disabled={!!data}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                autoComplete="off"
                placeholder={lang("Select Area")}
                showSearch
                onChange={(value) => {
                  onAreaChange({ index: 0, value });
                }}
              >
                {areas.map((item) => (
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

          <Col span={24} sm={12}>
            <Form.Item
              label={lang(`Area 2`)}
              name="area_2"
              rules={[{ required: true, message: lang("Please Select Area") }]}
            >
              <Select
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                disabled={!!data}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                autoComplete="off"
                placeholder={lang("Select Area")}
                showSearch
                onChange={(value) => {
                  onAreaChange({ index: 1, value });
                }}
              >
                {areas.map((item) => (
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

          <Col span={24} sm={12}>
            <Form.Item
              label={lang("Price")}
              name="price"
              rules={[
                { required: true, message: lang("Please Enter the Price") },
              ]}
            >
              <InputNumber
                maxLength={5}
                placeholder={lang("Enter Delivery Charge")}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddForm;
