import { Row, Col, Card, Table, Button, Modal, Form, Input, Tag, Select, Tooltip, Skeleton, Image } from "antd";
import React, { useState, useEffect } from "react";
import useRequest from "../../../hooks/useRequest";
import ShowTotal from "../../../components/ShowTotal";
import { ShowToast, Severty } from "../../../helper/toast";
import apiPath from "../../../constants/apiPath";
import ConfirmationBox from "../../../components/ConfirmationBox";
import moment from "moment";
import { shortLang, longLang } from "../../../config/language";
import useDebounce from "../../../hooks/useDebounce";
import { DownloadExcel, SampleFileDownload } from "../../../components/ExcelFile";
import SingleImageUpload from "../../../components/SingleImageUpload";
import notfound from "../../../assets/images/not_found.png";
import EditIcon from "../../../assets/images/edit.svg";

const Search = Input.Search;

function Index() {

  const sectionName = "Vehicle Model";
  const routeName = "vehicle/model";

  const api = {
    list: apiPath.listCarModel,
    addEdit: apiPath.addEditCarModel,
    status: apiPath.statusCarModel,
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
      title: "Make",
      dataIndex: "make_id",
      key: "make_id",
      render: (_, { make }) => {
        return (
          make ? make.name : '-'
        )
      }
    },
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
            <Tooltip title="Update Model" color={"purple"} key={"updatemodel"}>
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
    "Make": row.make ? row.make.name : '-',
    "Name": row.name ? row.name : '-',
    "Status": row.is_active ? 'Active' : 'Inactive',
    "Created On": moment(row.created_at).format("DD-MM-YYYY"),
  }));

  return (
    <>
      <div className="tabled vehicleModal">
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
                    value={searchText}
                    onPressEnter={onSearch}
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
  const [makeList, setMakeList] = useState([])
  const [loading, setLoading] = useState(false)
  const [modelLoading, setModelLoading] = useState(false)
  const [image, setImage] = useState([]);
  const [file, setFile] = useState([]);

  const FileType = ["image/png", "image/jpg", "image/jpeg", "image/avif", "image/webp", "image/gif"]


  const handleImage = (data) => {
    setImage(data);
    data.length > 0 ? setFile(data[0].url) : setFile([]);
  }
  const getMakeList = () => {
    setModelLoading(true)
    request({
      url: apiPath.carMakeList,
      method: 'GET',
      onSuccess: (data) => {
        setModelLoading(false)
        setMakeList(data.data);
      },
      onError: (error) => {
        console.log(error)
        setModelLoading(false)
        ShowToast(error, Severty.ERROR)
      }
    })
  };

  useEffect(() => {
    getMakeList()
    if (!data) return
    form.setFieldsValue({ ...data }) 
    setFile([data.image])
  }, [data])

  const onCreate = (values) => {
    const { name, ar_name, de_name, fr_name, make_id } = values
    const payload = {}
    setLoading(true)
    payload.name = name;
    payload.ar_name = ar_name ? ar_name : name;
    payload.de_name = de_name ? de_name : name;
    payload.fr_name = fr_name ? fr_name : name;
    payload.make_id = make_id;
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

        {modelLoading ? <Skeleton active key={1} /> :

          <>
            <Row gutter={[16,16]}>
              <Col span={24} sm={12}>
                <Form.Item className="make-elt mb-0"
                  name="make_id"
                  label="Select Make"
                  rules={[{ required: true, message: 'Missing Make Selection' }]}
                >
                  <Select placeholder="Select Make">
                    {makeList && makeList && makeList.length > 0 ? makeList.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    )) : null}
                  </Select>
                </Form.Item>
              </Col>
              
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
              <Col span={24} sm={12}>
                <Form.Item className="mb-0"
                  label={"Upload Image"}
                  name="image"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value !== undefined && value?.length > 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Image is required'));
                      },
                    }
                  ]}>
                  <SingleImageUpload value={image} fileType={FileType} imageType={'banner'} btnName={'Thumbnail'} onChange={(data) => handleImage(data)} />

                </Form.Item>
             {  file && file.length > 0 &&  <div className="mt-2"> <Image width={120} src={file !== "" ? file : notfound}></Image> </div>}
              </Col>
            </Row>

          </>

        }
      </Form>
    </Modal>
  )
}

export default Index;
