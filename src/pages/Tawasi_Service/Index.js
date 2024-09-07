import { Row, Col, Card, Table, Button, Modal, Form, Input, Tag, Select, Tooltip, message, InputNumber, Image } from "antd";
import React, { useState, useEffect } from "react";
import ShowTotal from "../../components/ShowTotal";
import useRequest from "../../hooks/useRequest";
import { ShowToast, Severty } from "../../helper/toast";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import apiPath from "../../constants/apiPath";
import moment from "moment";
import useDebounce from "../../hooks/useDebounce";
import ConfirmationBox from "../../components/ConfirmationBox";
import SingleImageUpload from "../../components/SingleImageUpload";
import notfound from "../../assets/images/not_found.png";
import { shortLang, longLang } from "../../config/language";
import EditIcon from "../../assets/images/edit.svg";
import { DownloadExcel, SampleFileDownload } from "../../components/ExcelFile";
const Search = Input.Search;

function Index() {

  const sectionName = "Service";
  const routeName = "service";

  const api = {
    status: apiPath.statusService,
    addEdit: apiPath.addEditService,
    list: apiPath.listService
  }

  const { request } = useRequest()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState();
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 300);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const { showConfirm } = ConfirmationBox();

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, { image }) => <Image width={50} src={image ? image : notfound} />
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, { category }) => {
        return (
          <span className="cap">{category ? category.name : '-'}</span>
        )
      }
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, { name }) => {
        return (
          <span className="cap">{name ? name : '-'}</span>
        )
      }
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
            <Tooltip title={"Update " + sectionName} color={"purple"} key={"update" + routeName}>
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
    "Category": row.category ? row.category.name : '-',
    "Name": row.name ? row.name : '-',
    "Status": row.is_active ? 'Active' : 'Inactive',
    "Created On": moment(row.created_at).format("DD-MM-YYYY"),
  }));

  return (
    <>
      <div className="tabled categoryService">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title={sectionName + " Management"}
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
                  <div className="button_group justify-content-end w-100">
                    <Button onClick={(e) => { setVisible(true); setSearchText(''); }}>Add Service</Button>
                    <Button title="Export" onClick={(e) => DownloadExcel(excelData, sectionName)}><i class="fas fa-cloud-download-alt"></i>&nbsp;&nbsp;Export</Button>
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
  const { request } = useRequest()
  const [categoryList, setCategoryList] = useState([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState([]);
  const [image, setImage] = useState([]);
  const FileType = ["image/png", "image/jpg", "image/jpeg", "image/avif", "image/webp", "image/gif"]

  const getCategoryList = () => {
    request({
      url: apiPath.categoryList + "/" + 'service',
      method: 'GET',
      onSuccess: (data) => {
        setCategoryList(data.data);
      },
      onError: (error) => {
        console.log(error)
        ShowToast(error, Severty.ERROR)
      }
    })
  };

  useEffect(() => {
    getCategoryList()
    if (!data) return
    form.setFieldsValue({ ...data })
    setFile([data.image])
    if (data.image != undefined) {
      setImage([data.image])
    } else {
      setImage([notfound])
    }
  }, [data])

  const handleImage = (data) => {
    setImage(data);
    data.length > 0 ? setFile(data[0].url) : setFile([]);
  }

  const onCreate = (values) => {
    const { name, ar_name, de_name, fr_name, category_id, price } = values
    const payload = {}
    setLoading(true)
    payload.name = name;
    payload.price = price;
    payload.ar_name = ar_name
    payload.de_name = de_name
    payload.fr_name = fr_name
    payload.category_id = category_id;
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
        <Row gutter={[16, 16]}>
          <Col span={24} sm={12}>
            <Form.Item className="category-elt mb-0"
              name="category_id"
              label="Select Category"
              rules={[{ required: true, message: 'Missing Category Selection' }]}
            >

              <Select placeholder="Select Category">
                {categoryList && categoryList && categoryList.length > 0 ? categoryList.map((item, index) => (
                  <option key={index} value={item._id}>
                    <span className="cap">{item.name}</span>
                  </option>
                )) : null}
              </Select>
            </Form.Item>
          </Col>
          {/* </Row>

        <div className="mt-3"></div>
        <Row> */}
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
            <Form.Item className="mb-0" label={`Base Price`} name="price"
              rules={[
                { required: true, message: "Base price must be provide" },
                // { max: 10, message: "Price contain maximum 10 digits " },
              ]}
            >
              <InputNumber maxLength={10} autoComplete="off" placeholder={`Enter Base price`} />
            </Form.Item>
          </Col>


          <Col span={24} sm={12}>
            <Form.Item className="mb-0"
              label={"Upload Image"} name="image"
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
              <SingleImageUpload value={image} fileType={FileType} imageType={'service'} btnName={'Image'} onChange={(data) => handleImage(data)} />

            </Form.Item>
            {file && file.length > 0 && <div className="mt-2"> <Image width={120} src={file !== "" ? file : notfound}></Image> </div>}
          </Col>
        </Row>

      </Form>
    </Modal>
  )
}

export default Index;
