import {
    Card,
    Input,
    Typography,
    Table,
    Dropdown,
    Button,

} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import apiPath from "../../constants/apiPath";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
import lang from '../../helper/langHelper'
import { useAppContext } from "../../context/AppContext";
import Currency from "../../components/Currency";
const Search = Input.Search;
const { Title, Text } = Typography;

function OrderCard() {


    const { country } = useAppContext()
    const [searchText, setSearchText] = useState("");
    const { request } = useRequest();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 3,
        total: 0,
    });

    const debouncedSearchText = useDebounce(searchText, 300);

    const items = [
        {
            key: "1",
            label: (<h6 onClick={() => console.log("")}>PDF</h6>
            ),
        },
        {
            key: "2",
            label: (
                <h6 onClick={() => null}>Excel</h6>
            ),
        },
    ];

    useEffect(() => {
        setLoading(true);
        fetchData({ ...pagination, current: 1 });
    }, [refresh, debouncedSearchText, country.country_id]);

    const fetchData = (pagination, filters) => {
        setLoading(true);
        request({
            url:
                apiPath.order +
                `?delivery_status=delivered&page=${pagination ? pagination.current : 1
                }&pageSize=${pagination ? pagination.pageSize : 10
                }&search=${debouncedSearchText}`,
            method: "GET",
            onSuccess: ({ data, status, total, message }) => {
                setLoading(false);
                if (status) {
                    setList(data);
                    setPagination((prev) => ({
                        ...prev,
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: total,
                    }));
                }
            },
            onError: (error) => {
                console.log(error);
                setLoading(false);
                ShowToast(error, Severty.ERROR);
            },
        });
    };

    const handleChange = (pagination, filters) => {
        fetchData(pagination, filters);
    };

    const onSearch = (e) => {
        setSearchText(e.target.value);
    };
    
    const columns = [
        {
            title: "Order id",
            dataIndex: "index",
            key: "index",
            render: (_, { uid }) => (uid ? <span className="cap">#{uid}</span> : "-"),
        },
        {
            title: "Order Items",
            dataIndex: "name",
            key: "name",
            render: (_, { items }) =>
                items.length
                    ? items.map((item, idx) => (
                        <span key={idx} className="cap">
                            {item?.qty} X {item?.food_id?.name ?? item?.food?.name}
                        </span>
                    ))
                    : "-",
        },
        {
            title: "Order Time",
            dataIndex: "name",
            key: "name",
            render: (_, { created_at }) =>
                created_at ? moment(created_at).format("lll") : "-",
        },
        {
            title: "Price",
            dataIndex: "ar_name",
            key: "ar_name",
            render: (_, { total_payable }) => <Currency price={total_payable ?? 0} />,
        },
        {
            title: "Restaurant Name",
            dataIndex: "name",
            key: "name",
            render: (_, { restaurant_id }) => (restaurant_id ? <span className="cap">{restaurant_id.name}</span> : "-"),
        },
        {
            title: "Export",
            key: "created_at",
            render: (_, { driver_id }) =>
                <div className="modal-footer-cls">
                    <Dropdown
                        menu={{ items }}
                        trigger={["click"]}
                        className="notification-box"
                        placement="top"
                    >
                        <Button className="btn btn_primary">
                            Export as{" "}
                            <svg
                                viewBox="64 64 896 896"
                                focusable="false"
                                data-icon="down"
                                width="1em"
                                height="1em"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
                            </svg>
                        </Button>
                    </Dropdown>
                </div>,
        },
    ];

    

    return (
        <Card bordered={false} className="criclebox h-full p-0">
            <div className="CardHeader d-flex">
                <Title level={5}>{lang(`Orders`)}</Title>
                <Search
                    placeholder={lang(
                        "Search by customer name, Phone number, email",
                    )}
                    onChange={onSearch}
                    allowClear
                />
            </div>
            <div className="table-responsive customPagination withOutSearilNo">
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={list}
                    pagination={{
                        defaultPageSize: 3,
                        responsive: true,
                        ...pagination,
                        //total: pagination.total,
                        showSizeChanger: true,
                        // pageSize:pagination.pageSize,
                        // showQuickJumper: true,
                        pageSizeOptions: ["3", "10", "20", "30"],
                    }}
                    onChange={handleChange}

                    className="ant-border-space"
                />
            </div>
        </Card>
    );
}


export default OrderCard;
