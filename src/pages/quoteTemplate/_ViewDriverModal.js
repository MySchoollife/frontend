import { Button, Col, Image, Modal, Row } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";

import "react-phone-input-2/lib/style.css";
import notfound from "../../assets/images/not_found.png";
import apiPath from "../../constants/apiPath";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import lang from "../../helper/langHelper";

export const ApproveStatus = {
  REJECT: "rejected",
  ACCEPT: "accepted",
  SUSPENDED: "suspended",
  PENDING: "pending",
};

const ViewDriverModal = ({ section, api, show, hide, data, refresh }) => {
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);

  const handleApproveReject = (status) => {
    setLoading(true);
    request({
      url: apiPath.driver + "/" + data?._id + "/action?status=" + status,
      method: "PUT",
      data: { status: status },
      onSuccess: (data) => {
        ShowToast(data.message, Severty.SUCCESS);
        refresh();
        setLoading(false);
        hide();
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  useEffect(() => {
    console.log("data", data);
  });

  return (
    <Modal
      open={show}
      width={750}
      okText="Add"
      onCancel={hide}
      footer={[
        <Button
          key="reject"
          onClick={() => {
            handleApproveReject(ApproveStatus.REJECT);
          }}
        >
          {lang("Reject")}
        </Button>,
        <Button
          key="approve"
          type="primary"
          onClick={() => {
            handleApproveReject(ApproveStatus.ACCEPT);
          }}
          loading={loading}
        >
          {lang("Approve")}
        </Button>,
      ]}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="tab_modal driver-modal"
    >
      <div className="modal_title_wrap">
        <h4 className="modal_title_cls">{lang("New Driver request")}</h4>
        <p>{lang("New delivery agent has been registered with the app")}.</p>
      </div>
      <div className="driver_img">
        <Image
          onError={(e) => {
            e.target.src = notfound;
          }}
          src={data?.image ? data?.image : notfound}
          className="table-img"
          style={{ width: "70px", height: "70px" }}
        />
      </div>
      <div className="new_driver_dtl">
        <Row gutter={24}>
          <Col span={24} sm={6} md={8}>
            <p>Driver Name:</p>
            <p className="font-bold">{data.name}</p>
          </Col>
          <Col span={24} sm={8} md={8}>
            <p>Phone Number:</p>
            <p className="font-bold">
              {data?.country_code + " " + data?.mobile_number}
            </p>
          </Col>
          <Col span={24} sm={10} md={8}>
            <p>Email Address:</p>
            <p className="font-bold">{data?.email}</p>
          </Col>
        </Row>
      </div>
      <div className="driver-personal-dtl">
        <Row
          gutter={24}
          style={{
            textAlign: "center",
          }}
        >
          <Col span={24} sm={6} md={6}>
            <p>Date of Birth:</p>
            <p className="font-bold">{moment(data?.dob).format("ll")}</p>
          </Col>
          <Col span={24} sm={6} md={6}>
            <p>Gender:</p>
            <p className="font-bold">
              {data?.gender == "M" ? "Male" : "Female"}
            </p>
          </Col>
          <Col span={24} sm={6} md={6}>
            <p>Country:</p>
            <p className="font-bold">{data?.country_id?.name}</p>
          </Col>
          <Col span={24} sm={6} md={6}>
            <p>City:</p>
            <p className="font-bold">{data?.city_id?.name}</p>
          </Col>
        </Row>
      </div>
      <div className="new_driver_dtl">
        <Row gutter={24}>
          <Col span={24} sm={6} md={8}>
            <p>Bank Name:</p>
            <p className="font-bold">{data?.bank_details?.bank_name}</p>
          </Col>

          <Col span={24} sm={6} md={8}>
            <p>Beneficiary Name:</p>
            <p className="font-bold">{data?.bank_details?.beneficiary_name}</p>
          </Col>
          <Col span={24} sm={6} md={8}>
            <p>Account Number :</p>
            <p className="font-bold">{data?.bank_details?.acc_number}</p>
          </Col>
          <Col span={24} sm={6} md={8}>
            <p>Iban Number :</p>
            <p className="font-bold">{data?.bank_details?.iban_number}</p>
          </Col>
          <Col span={24} sm={6} md={8}>
            <p>Beneficiary address :</p>
            <p className="font-bold">
              {data?.bank_details?.beneficiary_address}
            </p>
          </Col>
        </Row>
      </div>
      <div className="driver-id-dtl">
        <Row gutter={24}>
          <Col span={12} sm={12} md={6}>
            <p>Vehicle:</p>
            <Image
              onError={(e) => {
                e.target.src = notfound;
              }}
              src={data?.vehicle?.image ? data?.vehicle?.image : notfound}
              style={{ width: "100px", height: "70px" }}
            />
          </Col>

          <Col span={12} sm={12} md={6}>
            <p>ID Card:</p>
            <Image
              onError={(e) => {
                e.target.src = notfound;
              }}
              src={data?.id_document ? data?.id_document : notfound}
              style={{ width: "100px", height: "70px" }}
            />
          </Col>
          <Col span={12} sm={12} md={6}>
            <p>Registration Card:</p>
            <Image
              onError={(e) => {
                e.target.src = notfound;
              }}
              src={data?.rc_document ? data?.rc_document : notfound}
              style={{ width: "100px", height: "70px" }}
            />
          </Col>
          <Col span={12} sm={12} md={6}>
            <p>Car License:</p>
            <Image
              onError={(e) => {
                e.target.src = notfound;
              }}
              src={data?.car_lc_document ? data?.car_lc_document : notfound}
              style={{ width: "100px", height: "70px" }}
            />
          </Col>
          <Col span={12} sm={12} md={6}>
            <p>Driver License:</p>
            <Image
              onError={(e) => {
                e.target.src = notfound;
              }}
              src={data?.lc_document ? data?.lc_document : notfound}
              style={{ width: "100px", height: "70px" }}
            />
          </Col>
        </Row>
      </div>
      <div className="vehicle_cls">
        <Row gutter={24}>
          <Col>
            <p>Vehicle Type:</p>
            <p className="font-bold">{data?.vehicle?.type}</p>
          </Col>
          <Col>
            <p>Vehicle Year:</p>
            <p className="font-bold">{data?.vehicle?.year}</p>
          </Col>
          <Col>
            <p>Vehicle Seats:</p>
            <p className="font-bold">{data?.vehicle?.seats ?? 0}</p>
          </Col>
          <Col>
            <p>Vehicle Color:</p>
            <p className="font-bold">{data?.vehicle?.color ?? "-"}</p>
          </Col>
          {/* <Col>
            <p>Vehicle Model:</p>
            <p className="font-bold">{data?.city_id?.name}</p>
          </Col> */}
        </Row>
        <Row
          gutter={24}
          style={{
            textAlign: "center",
          }}
        >
          <Col>
            <p>Driving License number:</p>
            <p className="font-bold">{data?.vehicle?.lc_number ?? "-"}</p>
          </Col>
          <Col>
            <p>Vehicle Registration number:</p>
            <p className="font-bold">{data?.vehicle?.rc_number ?? "-"}</p>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default ViewDriverModal;
