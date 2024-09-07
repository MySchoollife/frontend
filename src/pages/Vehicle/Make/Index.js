import { Row, Col, Card, Table, Button, Modal, Form, Image, Input, Tag, Tooltip, Select } from "antd";
import React, { useState, useEffect } from "react";
import useRequest from "../../../hooks/useRequest";
import { ShowToast, Severty } from "../../../helper/toast";
import ShowTotal from "../../../components/ShowTotal";
import apiPath from "../../../constants/apiPath";
import moment from 'moment';
import useDebounce from "../../../hooks/useDebounce";
import ConfirmationBox from "../../../components/ConfirmationBox";
import SingleImageUpload from "../../../components/SingleImageUpload";
import notfound from "../../../assets/images/not_found.png";
import { shortLang, longLang } from "../../../config/language";
import { DownloadExcel, SampleFileDownload } from "../../../components/ExcelFile";

const Search = Input.Search;

function Index() {

  const sectionName = "Vehicle Make";
  const routeName = "vehicle/make";

  const api = {
    list: apiPath.listCarMake,
    addEdit: apiPath.addEditCarMake,
    status: apiPath.statusCarMake,
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

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, { image }) => <Image shape={"circle"} width={60} height={60} src={image ? image : notfound} />
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, { name }) => { return (name ? <span className="cap">{name}</span> : '-') }
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
            <Tooltip title="Update Make" color={"purple"} key={"updatemake"}>
              <Button title="Edit" onClick={() => {
                setSelected(record)
                setVisible(true)
              }}>
                <img src={EditIcon} />
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
      url: api.list + `?status=${filterActive ? filterActive.join(',') : ''}&page=${pagination ? pagination.current : 1}&limit=${pagination ? pagination.pageSize : 10}&search=${debouncedSearchText}`,
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

  const excelData = list.map(row => ({
    "Image": row.image ? row.image : '-',
    "Name": row.name ? row.name : '-',
    "Status": row.is_active ? 'Active' : 'Inactive',
    "Created On": moment(row.created_at).format("DD-MM-YYYY"),
  }));

  return (
    <>
      <div className="tabled vehicleMake">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title={sectionName}
              extra={
                <>
                  <Search
                    allowClear
                    size="large"
                    onChange={onSearch}
                    onPressEnter={onSearch}
                    value={searchText}
                    placeholder="Search By Name"
                  />
                  <Button onClick={(e) => { setVisible(true); setSearchText(''); }}>Add {sectionName}</Button>
                  <Button title="Export" onClick={(e) => DownloadExcel(excelData, sectionName)}><i class="fas fa-cloud-download-alt"></i>&nbsp;&nbsp;Export</Button>
                </>
              }
            >

              <h4 className="text-right mb-1">{pagination.total ? ShowTotal(pagination.total) : ShowTotal(0)}</h4>
              <div className="table-responsive customPagination">
                <Table
                  loading={loading}
                  columns={columns}
                  dataSource={list}
                  pagination={{ defaultPageSize: 10, responsive: true, total: pagination.total, showSizeChanger: true, pageSizeOptions: ['10', '20', '30', '50'] }}
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
  const [file, setFile] = useState([]);
  const [type, setType] = useState([]);
  const [image, setImage] = useState([]);
  const { request } = useRequest()
  const [loading, setLoading] = useState(false)
  const FileType = ["image/png", "image/jpg", "image/jpeg", "image/avif", "image/webp", "image/gif"]

  const handleImage = (data) => {
    setImage(data);
    data.length > 0 ? setFile(data[0].url) : setFile([]);
  }

  useEffect(() => {
    if (!data) return
    form.setFieldsValue({ ...data })
    setFile([data.image])
  }, [data])


  const getTypeList = () => {

    request({
      url: '/common/type',
      method: 'GET',
      onSuccess: ({ data, status }) => {
        setType(data)
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR)
      }
    })
  }

  const onCreate = (values) => {
    const { name, ar_name, de_name, fr_name, type } = values
    const payload = {}
    setLoading(true)
    payload.name = name;
    payload.ar_name = ar_name;
    payload.de_name = de_name;
    payload.fr_name = fr_name;
    payload.type = type
    payload.image = image && image.length > 0 ? image[0].url : '';
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

  useEffect(() => {
    getTypeList()
  }, [])


  return (
    <Modal
      open={show}
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

        <Row gutter={[16, 16]}>

          <Col span={24} sm={12}>
            <Form.Item className="mb-0" label={`Name (${shortLang.en})`} name="name"
              rules={[
                { required: true, message: `Please enter the name in ${longLang.en}!` },
                { pattern: new RegExp(/^[a-zA-Z ]*$/), message: "Only Alphabetic Characters Allowed!" },
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
                { pattern: new RegExp(/^[a-zA-Z ]*$/), message: "Only Alphabetic Characters Allowed!" }
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
                { pattern: new RegExp(/^[a-zA-Z ]*$/), message: "Only Alphabetic Characters Allowed!" }
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
                { pattern: new RegExp(/^[a-zA-Z ]*$/), message: "Only Alphabetic Characters Allowed!" }
              ]}
              normalize={value => value.trimStart()}
            >
              <Input autoComplete="off" placeholder={`Enter Name in ${longLang.fr}`} />
            </Form.Item>
          </Col>


          <Col span={24} sm={12}>
            <Form.Item className="mb-0" label={`Vehicle Type`} name="type"
              rules={[
                { required: true, message: "Please select at least one vehicle type" },
              ]}
            >
              <Select showSearch placeholder='Please Select Vehicle Type' mode="multiple"
                filterOption={(input, option) =>
                  (option.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {
                  type.map(item => <Select.Option key={item._id} label={item.name} value={item._id}>{item.name}</Select.Option>)
                }
              </Select>
            </Form.Item>
          </Col>

          <Col span={24} sm={12}>
            <Form.Item className="mb-0"
              rules={[
                {
                  validator: (_, value) => {
                    if (value !== undefined && value?.length > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Image is required'));
                  },
                }
              ]} label="Upload Image" name="image">
              <SingleImageUpload value={image} fileType={FileType} imageType={'make'} btnName={'Image'} onChange={(data) => handleImage(data)} />

            </Form.Item>
            {file && file.length > 0 && <div className="mt-2"> <Image width={120} src={file !== "" ? file : notfound}></Image> </div>}
          </Col>

        </Row>

      </Form>
    </Modal>
  )
}

export default Index;
