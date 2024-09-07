import { Row, Col, Card, Table, Button, Modal, Form, Input, Tag, Tooltip } from "antd";
import React, { useState, useEffect } from "react";
import useRequest from "../../../hooks/useRequest";
import { shortLang, longLang } from "../../../config/language";
import { ShowToast, Severty } from "../../../helper/toast";
import ConfirmationBox from "../../../components/ConfirmationBox";
import apiPath from "../../../constants/apiPath";
import moment from 'moment';
import useDebounce from "../../../hooks/useDebounce";
const Search = Input.Search;

function Index() {

  const sectionName = "Vehicle Type";
  const routeName = "vehicle/type";

  const api = {
    list: apiPath.listCarType,
    addEdit: apiPath.addEditCarType,
    status: apiPath.statusCarType,
  }

  const { request } = useRequest()
  const { showConfirm } = ConfirmationBox()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState();
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 300);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const { confirm } = Modal;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
          <>
            <Tooltip title="Update Type" color={"purple"} key={"updatetype"}>
              <Button onClick={() => {
                setSelected(record)
                setVisible(true)
              }}>
                <i class="fa fa-light fa-pen"></i>
              </Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true)
    fetchData(pagination)
  }, [refresh, debouncedSearchText])


  const fetchData = (pagination, filters) => {
    const filterActive = filters ? filters.is_active : null
    request({
      url: api.list + `?status=${filterActive ? filterActive.join(',') : ''}&search=${debouncedSearchText}&page=${pagination ? pagination.current : 1}&limit=${pagination ? pagination.pageSize : 10}`,
      method: 'GET',
      onSuccess: (data) => {
        setLoading(false)
        setList(data.data.list.docs)
        setPagination(prev => ({ current: pagination.current, total: data.data.list.totalDocs }))
      },
      onError: (error) => {
        setLoading(false)
        ShowToast(error, Severty.ERROR)
      }
    })
  }

  const onSearch = (e) => {
    setSearchText(e.target.value)
    setPagination({ current: 1 })
  };

  const handleChange = (pagination, filters) => {
    fetchData(pagination, filters);
  }

  return (
    <>
      <div className="tabled vehicleType">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Vehicle Type"
              extra={
                <>
                  <Search
                    allowClear
                    size="large"
                    onChange={onSearch}
                    value={searchText}
                    onPressEnter={onSearch}
                    placeholder="Search By Name"
                  />
                  <Button onClick={(e) => { setVisible(true); setSearchText(''); }}>Add {sectionName}</Button>
                </>
              }
            >
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
    const { name, ar_name, de_name, fr_name } = values
    const payload = {}
    setLoading(true)
    payload.name = name;
    payload.ar_name = ar_name ? ar_name : name;
    payload.de_name = de_name ? de_name : name;
    payload.fr_name = fr_name ? fr_name : name;
    request({
      url: `${data ? api.addEdit + "/" + data._id : api.addEdit}`,
      method: 'POST',
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
      visible={show}
      width={800}
      title={`${data ? 'Update ' + section : 'Create a New ' + section}`}
      okText="Ok"
      onCancel={hide}
      okButtonProps={{
        form: 'create',
        htmlType: 'submit',
        loading: loading,
      }}
    >
      <Form id="create" form={form} onFinish={onCreate} layout="vertical">
        {/* <Row>
          <Col span={24}>
            <Form.Item
              label="Type"
              name="name"
              rules={[
                { required: true, message: "Please enter the type!" },
                { max: 200, message: "Name should not contain more then 200 characters!" },
                { min: 2, message: "Name should contain atleast 1 characters!" },
                { pattern: new RegExp(/^[a-zA-Z ]*$/), message: "Only Alphabetic Characters Allowed" }
              ]}
            >
              <Input placeholder="Enter Type Name"/>
            </Form.Item>
          </Col>
        </Row> */}
        <Row gutter={[16,16]}>
          <Col span={24} sm={12}>
            <Form.Item className="mb-0" label={`Name (${shortLang.en})`} name="name"
              rules={[
                { required: true, message: `Please enter the name in ${longLang.en}!` },
                { max: 200, message: "Name should not contain more then 200 characters!" },
                { min: 2, message: "Name should contain atleast 2 characters!" },
              ]}
              normalize={value => value.trimStart()}
            >
              <Input autoComplete="off" placeholder={`Enter Name in ${longLang.en}`} />
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item className="mb-0" label={`Name (${shortLang.es})`} name="ar_name"
              rules={[
                { max: 200, message: "Name should not contain more then 200 characters!" },
                { min: 2, message: "Name should contain atleast 2 characters!" },
              ]}
              normalize={value => value.trimStart()}
            >
              <Input autoComplete="off" placeholder={`Enter Name in ${longLang.es}`} />
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item className="mb-0" label={`Name (${shortLang.de})`} name="de_name"
              rules={[
                { max: 200, message: "Name should not contain more then 200 characters!" },
                { min: 2, message: "Name should contain atleast 2 characters!" },
              ]}
              normalize={value => value.trimStart()}
            >
              <Input autoComplete="off" placeholder={`Enter Name in ${longLang.de}`} />
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item className="mb-0" label={`Name (${shortLang.fr})`} name="fr_name"
              rules={[
                { max: 200, message: "Name should not contain more then 200 characters!" },
                { min: 2, message: "Name should contain atleast 2 characters!" },
              ]}
              normalize={value => value.trimStart()}
            >
              <Input autoComplete="off" placeholder={`Enter Name in ${longLang.fr}`} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default Index;
