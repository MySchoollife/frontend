import {
    Card,
    Input,
    Typography,
    Table,
    Dropdown,
    Button,
    Image,
    Rate,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import apiPath from "../../constants/apiPath";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
import lang from "../../helper/langHelper";
import { useAppContext } from "../../context/AppContext";
const Search = Input.Search;
const { Title, Text } = Typography;

function DeliveryCard() {

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
            url: `${apiPath.report}/driver` +
                `?page=${pagination ? pagination.current : 1
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

    const columns = [
        {
            title: "Driver Profile",
            dataIndex: "index",
            key: "index",
            render: (_, { user }) =>
                user ? (
                    <>
                        <Image
                            width={40}
                            height={40}
                            src={user?.image ? user.image : null}
                            className="table-img"
                        />
                        {user?.name ? (
                            <span className="cap">{user?.name}</span>
                        ) : (
                            "-"
                        )}
                    </>
                ) : (
                    "-"
                ),
        },
        {
            title: "Driver Id",
            dataIndex: "name",
            key: "name",
            render: (_, { user }) => (user ? <span className="cap">#{user.uid}</span> : "-"),
        },
        {
            title: "Rating",
            dataIndex: "name",
            key: "name",
            render: (_, { averageRating }) => <Rate value={averageRating} disabled />,
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

    const onSearch = (e) => {
        setSearchText(e.target.value);
    };

    const handleChange = (pagination, filters) => {
        fetchData(pagination, filters);
    };

    return (
        <Card bordered={false} className="criclebox h-full p-0">
            <div className="CardHeader d-flex">
                <Title level={5}>{lang('Delivery Person Report')}</Title>
                <Search
                    placeholder={lang("Search ...")}
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
                        showSizeChanger: true,
                        // showQuickJumper: true,
                        pageSizeOptions: ["3", "10", "20", "30"],
                    }}
                    className="ant-border-space"
                    onChange={handleChange}
                />
            </div>
        </Card>
    );
}


export default DeliveryCard;
