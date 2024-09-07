import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Radio,
  Input,
  Checkbox,
} from "antd";

import apiPath from "../../constants/apiPath";
import lang from "../../helper/langHelper";
import useRequest from "../../hooks/useRequest";
import { useAppContext } from "../../context/AppContext";
import { Severty, ShowToast } from "../../helper/toast";

export const AddFood = ({
  data,
  api,
  refresh,
  order,
  setOrderedItems,
  show,
  hide,
}) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();

  const { request } = useRequest();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  const [foodSize, setFoodSize] = useState();
  const [addOnValues, setAddOnValues] = useState();
  const [choiceValue, setChoiceValues] = useState();
  const [selectedSizePrice, setSelectedSizePrice] = useState(0);
  const [addOnPrice, setAddOnPrice] = useState(0);
  const [adding, setAdding] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [price, setPrice] = useState(0);
  const { country } = useAppContext();

  const [finalIngredients, setFinalIngredients] = useState([]);
  const [finalChoice, setFinalChoice] = useState([]);
  // const [selectedAddOn, setSelectedAddOn] = useState([]);
  const [selectedAddOn, setSelectedAddOn] = useState({});

  useEffect(() => {
    const newArray = Object.keys(selectedAddOn).map((add_cat_id) => {
      const category = addOnValues.find(
        ({ category_id }) => category_id._id == add_cat_id,
      );
      return {
        add_cat_id: {
          _id: add_cat_id,
          name: category?.category_id?.name ?? "",
          ar_name: category?.category_id?.ar_name ?? "",
        },
        ingredient_ids: selectedAddOn[add_cat_id],
      };
    });
    setFinalIngredients(newArray);
  }, [selectedAddOn]);

  useEffect(() => {
    const newArray = Object.keys(selectedChoices).map((choice_id) => {
      const choice = choiceValue.find(
        (item) => item._id == choice_id,
      )?.choice_id;
      console.log(selectedChoices, choice, "selectedChoices");
      return {
        choice_id: {
          _id: choice_id,
          name: choice?.name ?? "",
          ar_name: choice?.ar_name ?? "",
        },
        options: selectedChoices[choice_id],
      };
    });
    setFinalChoice(newArray);
  }, [selectedChoices]);

  const getCategory = (id) => {
    request({
      url: `${apiPath.adminCommon}/restaurant-category/${order?.restaurant_id?.vendor_id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setCategories(data);
        }
      },
    });
  };

  const getFood = (id) => {
    request({
      url: `${apiPath.adminCommon}/restaurant-food/${id}`,
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setItems(data);
        }
      },
    });
  };

  const handleFoodItemSelect = (food_id) => {
    getAddOns(food_id);
  };

  const getAddOns = (food_id) => {
    request({
      url: apiPath.order + "/" + food_id + "/addOn",
      method: "GET",
      onSuccess: ({ data, status }) => {
        if (status) {
          setFoodSize(data.size);
          const size = data.size?.length ? data.size[0] : null;
          if (size) {
            form.setFieldsValue({
              size_id: size.size_id,
            });

            setSelectedSizePrice(size.price);
          }
          if (data.contain_add_on) {
            setAddOnValues(data.add_on.filter((item) => item.is_active));
          }
          if (data.contain_choice) {
            setChoiceValues(data.choice);
          }
        }
      },
    });
  };

  useEffect(() => {
    console.log(finalIngredients, "final ingredients :🚡 ");
    const total = calculateTotalPrice(finalIngredients);
    console.log(total, selectedSizePrice);
    setAddOnPrice(total);
    setPrice(total + selectedSizePrice);
  }, [finalIngredients, selectedSizePrice]);

  useEffect(() => {
    console.log(finalChoice, "finalChoice :🚡 ");
  }, [finalChoice]);

  const onCreate = async (values) => {
    const { food_id, size_id } = values;

    const payload = { food_id, size_id };

    payload.choice = finalChoice;
    payload.add_on_with_qty = finalIngredients;
    payload.qty = 1;
    payload.add_on_price = addOnPrice;
    payload.price = selectedSizePrice;
    payload.total_price = price;

    console.log(payload);
    setAdding(true);
    request({
      url: `${apiPath.order}/${order._id}/add-item`,
      method: "POST",
      data: payload,
      onSuccess: ({ data, status, message }) => {
        if (status) {
          // setItems(data);
          hide();
          if (refresh) {
            refresh();
          }
        } else {
          ShowToast(message, Severty.ERROR);
        }
      },
    });
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    console.log(order, "order :🚀 ");
  }, [order]);

  return (
    <Modal
      open={show}
      width={1200}
      okText={lang("Add")}
      onCancel={hide}
      cancelText={null}
      footer={[
        <>
          <Button key="cancel" type="primary" onClick={hide}>
            {lang("Cancel")}
          </Button>
          <Button form="create" key="update" type="primary" htmlType="submit">
            {lang("Update")}
          </Button>
        </>,
      ]}
      okButtonProps={{
        form: "create",
        htmlType: "submit",
      }}
      aria-labelledby="contained-modal-title-vcenter"
      className="tab_modal edit_orders"
    >
      <h4 className="modal_title_cls">{lang("Add New Item")}</h4>
      <div className="order-dtl-card mb-0">
        <Form id="create" form={form} onFinish={onCreate} layout="vertical">
          <div className="order-dtl-list add-item">
            <Row gutter={20}>
              <Col span={24} md={12}>
                <Form.Item
                  label={lang("Choose Category")}
                  name="category_id"
                  rules={[
                    { required: true, message: "Please select Category!" },
                  ]}
                >
                  <Select
                    width="500"
                    placeholder="Select Category"
                    onChange={(value) => getFood(JSON.parse(value)?._id)}
                  >
                    {categories.map((item) => (
                      <Select.Option
                        key={item?._id}
                        value={JSON.stringify(item)}
                      >
                        {item?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  label={lang("Choose Item")}
                  name="food_id"
                  rules={[{ required: true, message: "Please select Item!" }]}
                >
                  <Select
                    width="500"
                    placeholder="Select Item"
                    onChange={(id) => {
                      handleFoodItemSelect(id);
                    }}
                  >
                    {items.map((item) => (
                      <Select.Option key={item?._id} value={item?._id}>
                        {item?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
          {!!foodSize && (
            <div className="order-dtl-card02 mb-3">
              <div className="order-item-header">
                <h4>{lang("Choose Size")}</h4>
              </div>
              <div className="order-item-body">
                <Form.Item
                  name="size_id"
                  className="assign_role_checkbox"
                  rules={[
                    {
                      required: true,
                      message: "Please select food size",
                    },
                  ]}
                // initialValue={foodSize.length == 1 ? foodSize[0]?.size_id : undefined}
                >
                  <Radio.Group
                    onChange={({ target }) => {
                      const selected = foodSize.find(
                        (item) => item.size_id == target.value,
                      );
                      if (selected) setSelectedSizePrice(selected.price);
                    }}
                  >
                    {foodSize.map((item, idx) => (
                      <div
                        className="order-item-left"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Radio value={item.size_id} key={item.size}>
                          {item.size}
                        </Radio>
                        <div className="order-item-right">
                          <span>
                            ({item.price}
                            {country.data.currency})
                          </span>
                        </div>
                      </div>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
          )}

          {!!choiceValue && (
            <>
              {choiceValue.map((c, index) => (
                <Choice
                  c={c}
                  key={index}
                  index={index}
                  selectedChoices={selectedChoices}
                  setSelectedChoices={setSelectedChoices}
                />
              ))}
            </>
          )}

          {!!addOnValues && (
            <>
              {addOnValues.map((cat, index) => (
                <AddOns
                  cat={cat}
                  index={index}
                  key={index}
                  setSelectedAddOn={setSelectedAddOn}
                  selectedAddOn={selectedAddOn}
                />
              ))}
            </>
          )}

          <div className="total-item-oreder">
            <h4>{lang("Total Amount")}</h4>
            <span>
              {price} {country.data.currency}
            </span>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

const AddOns = ({ cat, index, setSelectedAddOn, selectedAddOn }) => {
  const [ingredientIds, setIngredientIds] = useState([]);

  useEffect(() => {
    console.log(ingredientIds, cat.category_id.name, "kl");
    if (!ingredientIds.length) {
      const obj = { ...selectedAddOn };
      if (obj.hasOwnProperty(cat.category_id._id)) {
        delete obj[cat.category_id._id];
      }
      setSelectedAddOn(obj);
      return;
    }
    setSelectedAddOn((prev) => ({
      ...prev,
      [cat.category_id._id]: ingredientIds,
    }));
  }, [ingredientIds]);

  return (
    <div key={index} className="order-dtl-card02 mb-3">
      <div className="order-item-header">
        <h4>
          {cat.is_mandatory && "*"}
          {cat.category_id.name} { }
        </h4>
      </div>
      <div className="order-item-body">
        {cat.ingredient_ids.map((addOn) => (
          <Ingredient
            addOn={addOn}
            key={addOn._id}
            cat={cat}
            ingredientIds={ingredientIds}
            setIngredientIds={setIngredientIds}
          />
        ))}
      </div>
    </div>
  );
};

const Ingredient = ({ addOn, cat, ingredientIds, setIngredientIds }) => {
  const { country } = useAppContext();
  const [data, setData] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const add = (data) => {
    const items = [...ingredientIds];
    const findIndex = items.findIndex((item) => item.id._id == data.id._id);
    if (findIndex !== -1) {
      items[findIndex] = data;
      // ingredientIds.splice(findIndex, 1);
      setIngredientIds(items);
      return;
    }
    setIngredientIds((prev) => [...prev, data]);
  };

  const remove = (id) => {
    const items = [...ingredientIds];
    const findIndex = items.findIndex((item) => item?.id?._id == id);
    console.log(findIndex, "findIndex");
    if (findIndex !== -1) {
      items.splice(findIndex, 1);
      setIngredientIds(items);
      setSelectedSize();
      return;
    }
  };

  return (
    <div
      key={addOn._id}
      className="d-flex justify-content-between align-items-left"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Checkbox
        className="order-item-left"
        onChange={({ target }) => {
          if (target.checked) {
            console.log("checked");
          } else {
            remove(data?.id?._id);
          }
        }}
        checked={ingredientIds.find((item) => item?.id?._id == data?.id?._id)}
      >
        <span>{addOn.name}</span>
      </Checkbox>

      <div style={{ marginLeft: 30 }}>
        <Radio.Group
          onChange={({ target }) => {
            const data = {
              id: addOn._id,
              size: target.value,
              qty: 1,
            };

            const size = addOn.ingredient_size.find(
              (item) => item.size._id == target.value,
            );
            const data1 = {
              id: { _id: addOn._id, name: addOn.name, ar_name: addOn.ar_name },
              size: {
                _id: target.value,
                name: size?.size?.name ?? "",
                ar_name: size?.size?.ar_name ?? "",
                price: size?.price,
              },
              qty: 1,
            };
            setSelectedSize(target.value);
            console.log(data, addOn.name);
            add(data1);
            setData(data1);
          }}
          value={selectedSize}
        >
          {addOn.ingredient_size.map((addonSize) => (
            <div>
              <div
                className="order-item-left"
                style={{ display: "flex", margin: "10px 0" }}
              >
                <Radio
                  type="radio"
                  // onChange={() => handleAddOnChange(addOn)}
                  value={addonSize.size._id}
                // checked={selectedAddOns.some((item) => item._id === addOn._id)}
                >
                  {addonSize.size.name}{" "}
                  <span>
                    {" "}
                    ({addonSize.price} {country.data.currency}){" "}
                  </span>
                </Radio>
              </div>
            </div>
          ))}
        </Radio.Group>
      </div>
    </div>
  );
};

const Choice = ({ c, index, selectedChoices, setSelectedChoices }) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!selected.length) {
      const obj = { ...selectedChoices };
      if (obj.hasOwnProperty(c._id)) {
        delete obj[c._id];
      }
      setSelectedChoices(obj);
      return;
    }
    setSelectedChoices((prev) => ({ ...prev, [c._id]: selected }));
  }, [selected]);

  return (
    <div className="order-dtl-card02 mb-3">
      <div className="order-item-header">
        <h4>
          {c.choice}
          {c?.is_multi_select && (
            <span>
              {" "}
              {c.is_mandatory == false ? "*required" : ""} ({lang('Maximum Selection')} {" "}
              {c?.multi_select_count})
            </span>
          )}
        </h4>
      </div>
      <div className="order-item-body">
        <Form.Item
          name={`choices[${index}]`}
          rules={[
            {
              required: c.is_mandatory,
              message: lang("Please select at least one option"),
            },
            {
              validator: (_, value) => {
                const max = c.is_multi_select ? c.multi_select_count : 1;
                if (value && value.length > max) {
                  return Promise.reject(
                    lang(`You can select up to ${max} choice(s)`),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Checkbox.Group
            value={selected}
            onChange={(value) => {
              const max = c.is_multi_select ? c.multi_select_count : 1;
              if (value.length <= max) setSelected(value);
            }}
          >
            {c?.choice_id?.options?.map((option) => (
              <Checkbox key={option._id} value={option.name}>
                {option.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </div>
    </div>
  );
};

function calculateTotalPrice(data) {
  let totalPrice = 0;
  data.forEach((item) => {
    item.ingredient_ids.forEach((ingredient) => {
      totalPrice += ingredient.size.price * ingredient.qty;
    });
  });
  return totalPrice;
}
