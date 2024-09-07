import { UndoOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Image,
  Input,
  Modal,
  Rate,
  Row,
  Select,
  Table,
  Tabs,
  Tooltip,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import PaymentReceipt from "../../assets/images/paymentreceipt.png";
import Currency from "../../components/Currency";
import apiPath from "../../constants/apiPath";
import { Months } from "../../constants/var";
import { AppStateContext } from "../../context/AppContext";
import { dateString } from "../../helper/functions";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import DeleteModal from "../../components/DeleteModal";
import { RejectInvoice } from "../../constants/reasons";
import moment from "moment";
import { DownloadExcel } from "../../components/ExcelFile";

const Search = Input.Search;
const { TabPane } = Tabs;

const PaymentApproval = ({}) => {
  const sectionName = lang("Approval payment");
  const { country } = useContext(AppStateContext);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selected, setSelected] = useState();
  const [detailModal, showDetailModal] = useState(false);
  const [rejectModal, showRejectModal] = useState(false);
  const { request } = useRequest();
  const api = {
    status: apiPath.statusQuote,
    list: apiPath.finance + "/payment/pending",
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
    console.log("filtervalue", filter, filter.year);
    if (filter.year && filter.month) {
      DownloadExcel(excelData, sectionName);
    } else {
      ShowToast(lang("Please select a year and months"), Severty.ERROR);
    }
  };

  const getFilter = () => {
    request({
      url: `${apiPath.finance}/filters/Pending`,
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
      onSuccess: ({ data, total, status }) => {
        setLoading(false);
        if (status) {
          setList(data);
          setPagination((prev) => ({
            ...prev,
            current: pagination.current,
            total: total,
          }));
        }
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  useEffect(() => {
    //  setLoading(true);
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
                {lang("View Detail")}
              </Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const reject = (selected, reason) => {
    const payload = { reason };
    request({
      url: apiPath.finance + `/reject/${selected}`,
      method: "POST",
      data: payload,
      onSuccess: ({ data, total, status, message }) => {
        setLoading(false);
        if (status) {
          ShowToast(message, Severty.SUCCESS);
          return;
        }
        ShowToast(message, Severty.ERROR);
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const excelData = list.map((row) => ({
    Restaurant_id: row?.restaurant_id?.uid || "-",
    Restaurant_name: row.restaurant_id?.name || "-",
    City: row?.city_id?.name || "-",
    Area: row?.restaurant_id?.area?.name || "-",
    Total_payment: row?.amount || "-",
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
        <div className="tab-upload-wrap d-flex align-items-center justify-content-between">
          <h3>{lang("Requested")}</h3>
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
          refresh={() => setRefresh((prev) => !prev)}
          reject={() => {
            showDetailModal(false);
            showRejectModal(true);
          }}
        />
      )}

      {rejectModal && (
        <DeleteModal
          title={lang(`Reject Receipt`)}
          subtitle={lang(`Are you sure you want to reject this receipt?`)}
          show={rejectModal}
          hide={() => {
            showRejectModal(false);
            setSelected();
          }}
          reasons={RejectInvoice}
          onOk={(message) => reject(selected?._id, message)}
        />
      )}
    </>
  );
};

const DetailsModal = ({ show, hide, data, refresh, reject }) => {
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

          hide();
          return;
        }
        ShowToast(message, Severty.ERROR);
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
        <Button
          key="reject"
          onClick={() => {
            reject();
          }}
        >
          {lang("Decline")}
        </Button>,
        <Button
          key="approve"
          type="primary"
          onClick={Approve}
          loading={loading}
        >
          {lang("Approve")}
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

export default PaymentApproval;
