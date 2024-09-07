import { Button, Col, Image, Modal, Row } from "antd";
import moment from "moment";
import React, { useState } from "react";

import "react-phone-input-2/lib/style.css";
import notfound from "../../../assets/images/not_found.png";
import apiPath from "../../../constants/apiPath";
import { Severty, ShowToast } from "../../../helper/toast";
import useRequest from "../../../hooks/useRequest";
import lang from "../../../helper/langHelper";

export const ApproveStatus = {
    REJECT: "rejected",
    ACCEPT: "accepted",
    SUSPENDED: "suspended",
    PENDING: "pending",
};

const ChangeModal = ({ show, hide, data, refresh }) => {

    const { request } = useRequest();
    const [loading, setLoading] = useState(false);

    const handleApproveReject = (status) => {
        setLoading(true);
        request({
            url: apiPath.request + "/" + data?._id + "/action?status=" + status,
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
                <h4 className="modal_title_cls">{lang(`New ${data.type} Change request`)}</h4>
                <p>{lang(`Customer initiate  ${data.type} change request`)}.</p>
            </div>
            <div className="driver_img">
                <Image
                    src={data?.user_id?.image ? data?.user_id?.image : notfound}
                    className="table-img"
                    style={{ width: "70px", height: "70px" }}
                />
            </div>
            <div className="new_driver_dtl">
                <Row
                    gutter={24}
                >
                    <Col span={24} sm={6} md={8}>
                        <p>Customer Name:</p>
                        <p className="font-bold">{data?.user_id?.name}</p>
                    </Col>
                    <Col span={24} sm={8} md={8}>

                    </Col>
                    <Col span={24} sm={10} md={8}>
                        <>
                            {data.type == 'Email' &&
                                <>
                                    <p>New Email Address:</p>
                                    <p className="font-bold">{data?.email}</p>
                                </>
                            }

                            {data.type == 'Mobile' &&
                                <>
                                    <p> New Phone Number:</p>
                                    <p className="font-bold">{data?.country_code + " " + data?.mobile_number}</p>
                                </>
                            }

                            {data.type == 'City' &&
                                <>
                                    <p> New City:</p>
                                    <p className="font-bold">{data?.city_id?.name ?? ''}</p>
                                </>
                            }
                        </>
                    </Col>
                </Row>
            </div>


        </Modal>
    );
};

export default ChangeModal;
