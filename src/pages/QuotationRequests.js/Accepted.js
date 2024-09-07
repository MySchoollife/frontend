import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Rate,
  Row,
  Select,
  Table,
  Tabs,
  Tooltip,
  Upload,
} from "antd";
import { UndoOutlined } from "@ant-design/icons";
import { Last20Years, Months } from "../../constants/var";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import apiPath from "../../constants/apiPath";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
import Sales1 from "../../assets/images/f-1.svg";
import Sales2 from "../../assets/images/f-2.svg";
import Sales3 from "../../assets/images/f-3.svg";
import PaymentReceipt from "../../assets/images/paymentreceipt.png";
import withDrawerImg from "../../assets/images/face-6.jpeg";
import Currency from "../../components/Currency";
import { AppStateContext } from "../../context/AppContext";
import Lottie from "react-lottie";
import * as success from "../../assets/animation/success.json";
import lang from "../../helper/langHelper";
import { dateString } from "../../helper/functions";
import { DownloadExcel } from "../../components/ExcelFile";

const Search = Input.Search;
const { TabPane } = Tabs;

const RestaurantPayment = ({}) => {
  const sectionName = lang("All payment");
  const { country } = useContext(AppStateContext);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [detailModal, showDetailModal] = useState(false);
  const [selected, setSelected] = useState();
  const [payment, setPayment] = useState();
  const { request } = useRequest();

  const api = {
    status: apiPath.statusQuote,
    list: apiPath.finance + "/payment/approved",
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [restaurants, setRestaurant] = useState([]);
  const [cities, setCities] = useState([]);
  const [filter, setFilter] = useState({
    restaurant_id: undefined,
    city_id: undefined,
    year: undefined,
    month: undefined,
    status: undefined,
    payment_mod: undefined,
  });

  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  const checkFilterValue = () => {
    if (filter.year && filter.month) {
      DownloadExcel(excelData, sectionName);
    } else {
      ShowToast(lang("Please select a year and months"), Severty.ERROR);
    }
  };

  const getFilter = () => {
    request({
      url: `${apiPath.finance}/filters/Approved`,
      method: "GET",
      onSuccess: (res) => {
        const { data, months, years, restaurants } = res;
        setCities(data);
        setYears(years);
        setRestaurant(restaurants);
        const m = Months.filter((item) => months.includes(item.value));
        setMonths(m);
      },
    });
  };

  const onChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleChange = (pagination, sorter, filters) => {
    if (!sorter) {
      fetchData(pagination);
    }
  };

  const fetchData = (pagination, status) => {
    setLoading(true);

    const payload = { ...filter };
    payload.page = pagination ? pagination.current : 1;
    payload.pageSize = pagination ? pagination?.pageSize : 10;

    const queryString = Object.entries(payload)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    request({
      url: api.list + `${queryString ? `?${queryString}` : ""}`,
      method: "GET",
      onSuccess: ({ data, total, status, collection }) => {
        setLoading(false);
        if (status) {
          setList(data);
          setPagination((prev) => ({
            ...prev,
            current: pagination.current,
            total: total,
          }));

          collection && setPayment(collection);
        }
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchData(pagination);
    getFilter();
  }, [refresh, country.country_id, filter]);

  const columns = [
    {
      title: lang("Service Id"),
      dataIndex: "id",
      render: (_, { restaurant_id }) =>
        `#${restaurant_id ? restaurant_id.uid : ""}`,
    },
    {
      title: lang("customer name"),
      dataIndex: "name",
      key: "name",
      render: (_, { restaurant_id }) => `${restaurant_id?.name}`,
    },

    {
      title: lang("Service Provider Name"),
      dataIndex: "country",
      key: "country",
      render: (_, { country_id }) => `${country_id?.name}`,
    },
    {
      title: "Requested Date",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (_, { created_at }) => `${dateString(created_at, "ll")}`,
    },
    {
      title: lang("Status"),
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            <Tooltip
              title={lang("View Detail")}
              color={"purple"}
              key={"viewDetail"}
            >
              <Button
                className="ms-sm-2 mt-xs-2 btnStyle btnOutlineDelete"
                onClick={(e) => {
                  showDetailModal(true);
                  setSelected(record);
                }}
              >
                {"View Detail"}
              </Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const excelData = list.map((row) => ({
    Restaurant_id: row?.restaurant_id?.uid || "-",
    Restaurant_name: row.restaurant_id?.name || "-",
    City: row?.city_id?.name || "-",
    Area: row?.restaurant_id?.area?.name || "-",
    Total_amount: row?.amount || "-",
    Payment_mode: row?.payment_mod || "-",
    Cash_collector: row?.collected_by?.name || "-",
    Receipet_number: row?.uid || "-",
    Collection_date: row?.created_at
      ? moment(row?.created_at).format("DD-MM-YYYY")
      : "-",
  }));

  return (
    <>
      <div className="tab_inner_tit">
        {/* <div className="finance-payment-wrap">
          <Row align={"middle"}>
            <Col span={18} xl={6} lg={7} md={9}>
              <div className="cls-total">
                <div className="sales-img-icon">
                  <img src={Sales1} />
                </div>
                <div className="sales-text-outer">
                  <h6>{lang("Total Online Collection")}</h6>
                  <h4>
                    <Currency price={payment?.online ?? 0} />
                  </h4>
                </div>
              </div>
            </Col>
            <Col span={6} xl={2} lg={2} md={3}>
              <div className="add-saler-amt">
                <span>
                  <i class="fas fa-plus"></i>
                </span>
              </div>
            </Col>
            <Col span={18} xl={6} lg={7} md={9}>
              <div className="cls-total">
                <div className="sales-img-icon">
                  <img src={Sales2} />
                </div>
                <div className="sales-text-outer">
                  <h6>{lang("Total Cash Collection")}</h6>
                  <h4>
                    <Currency price={payment?.cash ?? 0} />
                  </h4>
                </div>
              </div>
            </Col>
            <Col span={6} xl={2} lg={2} md={3}>
              <div className="add-saler-amt">
                <span>
                  <i class="fas fa-equals"></i>
                </span>
              </div>
            </Col>
            <Col span={24} xl={6} lg={6} md={24}>
              <div className="cls-total received-amt">
                <div className="sales-img-icon first-revenue">
                  <img src={Sales3} />
                </div>
                <div className="sales-text-outer">
                  <h6>{lang("Total Amount")}</h6>
                  <h4>
                    <Currency
                      price={payment ? payment.cash + payment.online : 0}
                    />
                  </h4>
                </div>
              </div>
            </Col>
          </Row>
        </div> */}
        <div className="tab-upload-wrap d-flex align-items-center justify-content-between">
          <h3>{lang("All Accepted List")}</h3>
          <div className="d-flex align-items-center gap-3">
            <div className="btn_grp">
              <Button
                className="primary_btn btnStyle"
                onClick={() => checkFilterValue()}
              >
                {lang("Export to Excel")}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* <h4 className="text-right mb-1">{pagination.total ? ShowTotal(pagination.total) : ShowTotal(0)}</h4> */}

      <div className="table-responsive customPagination withOutSearilNo">
        <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={{
            defaultPageSize: 10,
            responsive: true,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", "50"],
          }}
          onChange={handleChange}
          className="ant-border-space"
        />
      </div>

      {detailModal && (
        <DetailsModal
          show={detailModal}
          hide={() => {
            showDetailModal(false);
          }}
          data={selected}
        />
      )}
    </>
  );
};

const DetailsModal = ({ show, hide, data, refresh }) => {
  const { request } = useRequest();

  const [loading, setLoading] = useState(false);

  const Approve = () => {
    setLoading(true);
    const payload = {};
    request({
      url: apiPath.finance + `/approve/${data._id}`,
      method: "POST",
      onSuccess: ({ data, total, status, message }) => {
        setLoading(false);
        if (status) {
          ShowToast(message, Severty.SUCCESS);
          if (refresh) refresh();
          return;
        }
        ShowToast(message, Severty.ERROR);
        hide();
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  return (
    <Modal
      open={show}
      onOk={() => null}
      onCancel={hide}
      width={950}
      okText={lang("Approve")}
      cancelText={lang("Decline")}
      footer={[
        <Button key="approve" type="primary" onClick={hide} loading={loading}>
          {lang("Okay")}
        </Button>,
      ]}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="tab_modal"
    >
      <h4 className="modal_title_cls">{lang("Restaurant Details")}</h4>
      <div className="order-head">
        <h4>{data ? data.restaurant_id.name : ""}</h4>
        <span>
          <Rate disabled defaultValue={data?.restaurant_id?.rating ?? 0} />
          <span className="no-rating">0</span>
          {lang("0 Reviews")}
        </span>
      </div>
      <Row gutter={[45, 0]}>
        <Col span={24} sm={12}>
          <div className="order-dtl-card">
            <div className="order-header">
              <h3>{lang("Invoice Summary")}</h3>
            </div>
            <div className="customer-dtl">
              <div className="bill-info">
                <h6>{lang("This Month Amount")}</h6>
                <h5>
                  <Currency price={data ? data.amount : 0} />
                </h5>
              </div>
              {/* <div className="bill-info">
                  <h6>Pending Amount:</h6>
                  <h5>AED 00.00</h5>
                </div> */}
            </div>
            <div className="total-price">
              <div className="bill-info">
                <h6>{lang("TOTAL")}</h6>
                <h5>
                  <Currency price={data ? data.amount : 0} />
                </h5>
              </div>
            </div>
          </div>
          <div className="payment-recepit">
            <h4>{lang("Payment Receipt")}</h4>
            <div className="paymentImg">
              <Image src={data ? data.image : PaymentReceipt} />
            </div>
          </div>
        </Col>
        <Col span={24} sm={12}>
          <div className="order-dtl-card">
            <div className="order-header">
              <h3>{lang("Receipt")}</h3>
            </div>
            <div className="customer-dtl">
              <div className="bill-info">
                <h6>{lang("Date")}</h6>
                <h5>{data ? dateString(data.created_at, "ll") : ""}</h5>
              </div>
              <div className="bill-info">
                <h6>{lang("Payment Mode")}</h6>
                <h5>{data?.payment_mod ?? ""}</h5>
              </div>
              <div className="bill-info">
                <h6>{lang("Payment Status")}</h6>
                <h5>{data?.payment_type ?? ""}</h5>
              </div>
              <div className="bill-info">
                <h6>{lang("Receipt Number")}</h6>
                <h5>{data?.uid ?? ""}</h5>
              </div>
            </div>
          </div>
          {data && data.payment_mod == "Cash" ? (
            <div className="order-dtl-card">
              <div className="order-header">
                <h3>{lang("Collector Details")}</h3>
              </div>
              <div className="customer-dtl">
                <div className="bill-info">
                  <h6>{lang("Collector ID")}</h6>
                  <h5>#{data?.collected_by?.uid ?? ""}</h5>
                </div>
                <div className="bill-info">
                  <h6>{lang("Collector Name")}</h6>
                  <h5>{data?.collected_by?.name ?? ""}</h5>
                </div>
              </div>
            </div>
          ) : (
            lang("Paid by Self")
          )}
        </Col>
      </Row>
    </Modal>
  );
};

export default RestaurantPayment;
