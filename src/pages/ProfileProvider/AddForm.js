import { Checkbox, Col, Form, Input, Modal, Radio, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ProfileOptions } from "../../constants/var";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import { useAppContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import apiPath from "../../constants/apiPath";

const AddForm = ({ api, show, hide, selected, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState([]);
  const [selectedBox, setSelectedBox] = useState([]);
  const [city, setCity] = useState([]);
  const [category, setCategory] = useState([]);
  const { cities, country: headerCountry } = useAppContext();
  const [role, setRole] = useState([]);
  const [options, setOptions] = useState(ProfileOptions);

  const getCountry = () => {
    request({
      url: `/country`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        console.log(data, "Country");
        if (status) {
          setCountry(data);
        }
      },
    });
  };

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

  const onCreate = (values) => {
    const payload = {
      ...values,
      country_id: headerCountry.country_id,
    };
    payload.permission = options;

    console.log(payload, "payload");
    setLoading(true);

    request({
      url: `${selected ? api.list + "/" + selected._id : api.list}`,
      method: selected ? "PUT" : "POST",
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
    getCountry();
    getCategory();
  }, []);

  useEffect(() => {
    console.log(options, "options");
  }, [options]);

  useEffect(() => {
    if (!selected) return;
    form.setFieldsValue({
      ...selected,
      country_id: selected.country_id,
      category_id: selected?.category_id?._id,
    });
    // setOptions([
    //   ...ProfileOptions,
    //   ...selected.permission
    // ]);

    const uniqueByName = (arr1, arr2) => {
      const seen = new Set();
      const result = [];
    

      arr2.forEach((item) => {
        if (item.is_selected || item.is_required) {
          if (!seen.has(item.name)) {
            result.push(item);
            seen.add(item.name);
          }
        }
      });
    
      arr1.forEach((item) => {
        if (!seen.has(item.name)) {
          result.push(item);
          seen.add(item.name);
        }
      });
    
      return result;
    };

    setOptions(uniqueByName(options, selected.permission));
  
    console.log(options,"option12")
  }, [selected]);

  return (
    <Modal
      width={780}
      open={show}
      okText={selected ? lang("Update") : lang("Create")}
      onCancel={hide}
      okButtonProps={{
        form: "create",
        htmlType: "submit",
        loading: loading,
      }}
      className="tab_modal"
    >
      <Form id="create" form={form} onFinish={onCreate} layout="vertical">
        <h4 className="modal_title_cls">{selected ? "Edit" : "Add"} SP Profile</h4>
        <Row gutter={[16, 0]} className="w-100">
          <Col span={24} sm={24}>
            <Form.Item
              label={lang("Name")}
              name="name"
              rules={[
                {
                  max: 20,
                  message: lang(
                    "Name should not contain more then 20 characters!",
                  ),
                },
                {
                  min: 2,
                  message: lang("Name should contain at least 2 characters!"),
                },
                {
                  required: true,
                  message: lang("Please enter name"),
                },
              ]}
              normalize={(value) => value.trimStart()}
            >
              <Input autoComplete="off" placeholder={lang(`Enter Name`)} />
            </Form.Item>
          </Col>

          <Col span={24} sm={24}>
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
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder={lang("Select Category")}
                showSearch
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
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

          <Col span={24} md={24}>
            <div className="assign_role">
              <h6>Select Fields</h6>
              {
                <Form.Item
                  // name="permission"
                  className="profile_checkbox"
                  rules={[
                    {
                      required: false,
                      message: lang("Please assign min. 1 field"),
                    },
                  ]}
                >
                  <Row>
                    {options?.map((item, idx) => (
                      <Col span={24} md={12}>
                        <div className="fild-name" key={item.name}>
                          <Checkbox
                            disabled={item.is_disable}
                            checked={item.is_selected}
                            onChange={({ target }) => {
                              if (target.checked) {
                                const newArray = [...options];
                                newArray[idx] = {
                                  ...newArray[idx],
                                  is_selected: true,
                                };
                                setOptions(newArray);
                                //array idx se update with true is_selected = true
                              } else {
                                const newArray = [...options];
                                newArray[idx] = {
                                  ...newArray[idx],
                                  is_selected: false,
                                };
                                setOptions(newArray);
                                //array idx se update with true is_selected = false
                              }
                            }}
                          >
                            {item.label}
                          </Checkbox>

                          <Checkbox
                            disabled={item.is_disable}
                            checked={item.is_required}
                            value={item.name}
                            onChange={({ target }) => {
                              if (target.checked) {
                                const newArray = [...options];
                                newArray[idx] = {
                                  ...newArray[idx],
                                  is_required: true,
                                };
                                setOptions(newArray);
                                //array idx se update with true is_required = true
                              } else {
                                const newArray = [...options];
                                newArray[idx] = {
                                  ...newArray[idx],
                                  is_required: false,
                                };
                                setOptions(newArray);
                                //array idx se update with true is_required = false
                              }
                            }}
                          >
                            Required
                          </Checkbox>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Form.Item>
              }
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddForm;
