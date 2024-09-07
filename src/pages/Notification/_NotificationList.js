import React, { useEffect, useState } from "react";

import { Avatar, List, Skeleton } from "antd";
import moment from "moment";
import useRequest from "../../hooks/useRequest";
import apiPath from "../../constants/apiPath";
import InfiniteScroll from "react-infinite-scroll-component";
import lang from "../../helper/langHelper";
import Prouser from "../../assets/images/user.png";


export const NotificationList = () => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 10,
  });

  const { request } = useRequest();

  const dates = {
    today: moment(new Date()).format("YYYY-MM-DD"),
    yesterday: moment(new Date().getTime() - 24 * 60 * 60 * 1000).format(
      "YYYY-MM-DD",
    ),
  };

  const fetchData = () => {
    request({
      url:
        apiPath.notificationUser +
        `?status=${""}&page=${pagination ? pagination.current : 1}&pageSize=${
          pagination && pagination?.total ? pagination?.total : 10
        }&search=${""}`,
      method: "GET",
      onSuccess: ({data}) => {
        setList(data);
        data.length == 0 && setHasMore(false)
        setLoading(false);
      },
      onError: (err) => {
        console.log(err);
        setLoading(false);
      },
    });
  };

  const onNext = ({}) => {
    console.log("Call huaa next");
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [pagination]);

  return (
    <>
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <InfiniteScroll
            dataLength={list.length} //This is important field to render the next data
            next={onNext}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
    {   list.length ==0 ? <b>No notification</b> :     <b>Yay! You have seen it all</b>}
              </p>
            }
          >
            {list.map((data, index) => {
              console.log(data, "datadatadata");
              return (
                <div className="notification-card">
                  <h4>
                    {moment(data._id).format("YYYY-MM-DD") === dates.today
                      ? lang("Today's Notifications")
                      : moment(data._id).format("YYYY-MM-DD") ===
                        dates.yesterday
                      ? lang("Yesterday's Notifications")
                      : moment(data._id).format("YYYY-MM-DD")}
                  </h4>
                  <List
                    key={"groupItem" + index}
                    itemLayout="horizontal"
                    dataSource={data.notifications}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src={item?.from_id?.image ?? Prouser} />}
                          title={item?.title}
                          description={item?.description}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              );
            })}
          </InfiniteScroll>
        </>
      )}
    </>
  );
};
