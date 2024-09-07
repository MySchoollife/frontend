import { Row, Col, Card, Table, Button, Modal, Form, Tag, Image, Tooltip, Select, DatePicker, Input, InputNumber } from "antd";
import apiPath from "../../constants/apiPath";
import React, { useState, useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import { ShowToast, Severty } from "../../helper/toast";
import ShowTotal from "../../components/ShowTotal";
import ConfirmationBox from "../../components/ConfirmationBox";
import EditIcon from "../../assets/images/edit.svg";
import moment from 'moment';
const { RangePicker } = DatePicker;

function Index() {

    const sectionName = "Size";
    const routeName = "size";

    const api = {
        status: apiPath.size,
        addEdit: apiPath.size,
        list: apiPath.size,
    }

    const { request } = useRequest()
    const { showConfirm } = ConfirmationBox()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [visible, setVisible] = useState(false);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [selected, setSelected] = useState();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    const columns = [
        {
            title: "Size",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Number",
            dataIndex: "size_number",
            key: "size_number",
        },
        {
            title: "Status",
            key: "is_active",
            filters: [
                {
                    text: 'Active',
                    value: true,
                },
                {
                    text: 'Inactive',
                    value: false,
                },
            ],
            render: (_, { is_active, _id }) => {
                let color = is_active ? 'green' : 'red';
                return (<a><Tag onClick={(e) => showConfirm({ record: _id, path: api.status, onLoading: () => setLoading(true), onSuccess: () => setRefresh(prev => !prev) })} color={color} key={is_active}>{is_active ? "Active" : "Inactive"}</Tag></a>);
            },
        },
        {
            title: "Created On",
            key: "created_at",
            dataIndex: "created_at",
            render: (_, { created_at }) => {
                return (
                    moment(created_at).format('DD-MMM-YYYY')
                );
            },
        },
        {
            title: "Action",
            fixed: 'right',
            render: (_, record) => {
                return (
                    <Tooltip title={"Update " + sectionName} color={"purple"} key={"update" + routeName}>
                        <Button onClick={() => {
                            setSelected(record)
                            setVisible(true)
                        }}>
                            <img src={EditIcon} />
                        </Button>
                    </Tooltip>
                );
            },
        },
    ];

    useEffect(() => {
        setLoading(true)
        fetchData(pagination)
    }, [refresh, startDate, endDate])


    const fetchData = (pagination, filters) => {
        const filterActive = filters ? filters.is_active : null
        const filterType = filters ? filters.type : null
        request({
            url: api.list + `?type=${filterType ? filterType.join(',') : ''}&status=${filterActive ? filterActive.join(',') : ''}&page=${pagination ? pagination.current : 1}&limit=${pagination ? pagination.pageSize : 10}&start_date=${startDate ? startDate : ""}&end_date=${endDate ? endDate : ""}`,
            method: 'GET',
            onSuccess: (data) => {
                setLoading(false)
                const list = data.data.list.docs.map(item => ({ ...item, key: item._id }))
                setList(list)
                setPagination(prev => ({ current: pagination.current, total: data.data.list.totalDocs }))
            },
            onError: (error) => {
                console.log(error)
                ShowToast(error, Severty.ERROR)
            }
        })
    }

    const handleChange = (pagination, filters) => {
        fetchData(pagination, filters);
    }

    const handleChangeDate = (e) => {
        if (e != null) {
            setStartDate(moment(e[0]._d).format("YYYY-MM-DD"))
            setEndDate(moment(e[1]._d).format("YYYY-MM-DD"))
        } else {
            setStartDate()
            setEndDate()
        }
    };

    return (
        <>
            <div className="tabled bannerMain">
                <Row gutter={[24, 0]}>
                    <Col xs={24} xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title={sectionName + " Management"}
                            extra={
                                <>
                                    <div className="w-100 text-end d-smflex">
                                        <RangePicker onChange={handleChangeDate} />
                                        <div className="button_group justify-content-end ms-sm-2 mt-xs-2">
                                            <Button onClick={(e) => setVisible(true)}>Add {sectionName}</Button>
                                        </div>
                                    </div>
                                </>
                            }
                        >
                            <h4 className="text-right mb-1">{pagination.total ? ShowTotal(pagination.total) : ShowTotal(0)}</h4>
                            <div className="table-responsive customPagination">
                                <Table
                                    loading={loading}
                                    columns={columns}
                                    dataSource={list}
                                   pagination={{ defaultPageSize: 10, responsive: true, total: pagination.total, showSizeChanger: true,  pageSizeOptions: ['10', '20', '30', '50'] }}
                                    onChange={handleChange}
                                    className="ant-border-space"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
            {visible && <AddFrom section={sectionName} api={api} show={visible} hide={() => { setSelected(); setVisible(false) }} data={selected} refresh={() => setRefresh(prev => !prev)} />}
        </>
    );
}

const AddFrom = ({ section, api, show, hide, data, refresh }) => {
    const [form] = Form.useForm();
    const { request } = useRequest()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!data) return
        form.setFieldsValue({ ...data })
    }, [data])

    const onCreate = (values) => {

        setLoading(true)
        const payload = {}
        const { type, category_id, link, offer_id } = values;
        payload.type = type;
        payload.category_id = category_id;
        payload.offer_id = offer_id;
        payload.link = link;

        request({
            url: `${data ? api.addEdit + "/" + data._id : api.addEdit}`,
            method: !data ? 'POST' : 'PUT',
            data: payload,
            onSuccess: (data) => {
                setLoading(false)
                if (data.status) {
                    ShowToast(data.message, Severty.SUCCESS)
                    hide()
                    refresh()
                } else {
                    ShowToast(data.message, Severty.ERROR)
                }
            },
            onError: (error) => {
                ShowToast(error.response.data.message, Severty.ERROR)
                setLoading(false)
            },
        })
    };

    return (
        <Modal
            open={show}
            title={`${data ? 'Edit ' + section : 'Create a New ' + section}`}
            okText="Ok"
            onCancel={hide}
            okButtonProps={{
                form: 'create',
                htmlType: 'submit',
                loading: loading,
            }}
        >
            <Form id="create" form={form} onFinish={onCreate} layout="vertical">
                <Row>

                    <Col span={24} xs={24} sm={24} md={24}>
                        <Form.Item
                            normalize={value => value.trim()}
                            className="link-elt"
                            name="name"
                            label="Enter Size"
                            rules={[
                                { required: true, message: 'Please enter valid size name' },
                            ]}>
                            <Input placeholder="Enter Size name"></Input>
                        </Form.Item>
                    </Col>
                    <Col span={24} xs={24} sm={24} md={24}>
                        <Form.Item
                            normalize={value => value.trim()}
                            className="link-elt"
                            name="size_number"
                            label="Enter Size Number"
                            rules={[
                                { required: true, message: 'Please enter valid size number' },
                            ]}>
                            <InputNumber maxLength={2} placeholder="Enter Size name" />
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </Modal>
    )
}

export default Index;
