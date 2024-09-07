import { Col, Form, Modal, Row, Select, Input, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import useDebounce from "../../hooks/useDebounce";
import lang from "../../helper/langHelper";

const EditCityForm = ({ api, show, hide, data, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();

  const [country, setCountry] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searchCity, setSearchCity] = useState("");
  const debouncedSearchCity = useDebounce(searchCity, 300);
  const [page, setPage] = useState(1);

  const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    country_id: undefined,
  });

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const onChange = (key, value) => {
    const selected = country.find((item) => item._id == value);
    setFilter((prev) => ({ ...prev, city_id: undefined, country_id: value }));
    if (selected) {
      form.setFieldsValue({
        currency_name: selected.currency_name,
        currency_symbol: selected.currency_symbol,
        name: selected.name,
      });
    }
  };

  useEffect(() => {
    if (!data) return;
    form.setFieldsValue({
      ...data,
    });
  }, [data]);

  const onCreate = (values) => {
    const { country_id, city_id, currency_name, value, ar_name, name } = values;
    console.log(values, "values");
    const payload = {
      country_id,
      city_id,
      currency_name,
      value,
      ar_name,
      name,
    };
    setLoading(true);

    console.log(payload, "hfdjhjkhgjkfhgjkfhg");
    request({
      url: `${data ? api.addEdit + "/" + data._id + "/city" : api.addEdit}`,
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
      <h4 className="modal_title_cls">{`${
        data ? lang("Edit Service City") : lang("Add Service City")
      }`}</h4>
      <Form id="create" form={form} onFinish={onCreate} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={24} sm={12}>
            <Form.Item
              label={lang(`Name`)}
              name="name"
              rules={[
                { required: true, message: lang("Please enter the  name") },
                {
                  max: 100,
                  message: lang(
                    "Name should not contain more then 100 characters!",
                  ),
                },
                {
                  min: 2,
                  message: lang("Name should contain at least 2 characters!"),
                },
              ]}
              normalize={(value) => value.trimStart()}
            >
              <Input autoComplete="off" placeholder={lang(`Enter Name`)} />
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item
              label={lang(`Arabic Name`)}
              name="ar_name"
              rules={[
                {
                  required: true,
                  message: lang("Please enter the Arabic name"),
                },
                {
                  max: 100,
                  message: lang(
                    "Arabic Name should not contain more then 100 characters!",
                  ),
                },
                {
                  min: 2,
                  message: lang(
                    "Arabic Name should contain at least 2 characters!",
                  ),
                },
              ]}
              normalize={(value) => value.trimStart()}
            >
              <Input
                autoComplete="off"
                placeholder={lang(`Enter  Arabic Name`)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditCityForm;
