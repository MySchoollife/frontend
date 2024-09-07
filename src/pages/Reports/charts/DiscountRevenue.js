import {
  Button,
  Card,
  Dropdown,
  Image,
  Input,
  Rate,
  Table,
  Col,
  Row,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import apiPath from "../../../constants/apiPath";
import { useAppContext } from "../../../context/AppContext";
import lang from "../../../helper/langHelper";
import { Severty, ShowToast } from "../../../helper/toast";
import useDebounce from "../../../hooks/useDebounce";
import useRequest from "../../../hooks/useRequest";
import BarChart from "../../../components/charts/BarChart";
import { getRandomColor } from "../../../helper/functions";
import Currency from "../../../components/Currency";

const DiscountRevenue = ({ filter }) => {
  const { country } = useAppContext();
  const { request } = useRequest();
  const [list, setList] = useState([]);
  const [revenue, setRevenue] = useState();
  const [commission, setCommission] = useState();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0,
  });

  useEffect(() => {
    setLoading(true);
    fetchData({ ...pagination, current: 1 });
  }, [refresh, filter, country.country_id]);

  const fetchData = () => {
    setLoading(true);

    const queryString = Object.entries(filter)
      .filter(([_, v]) => v)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");

    request({
      url: `${apiPath.report}/revenue-discount${
        queryString ? `?${queryString}` : ""
      }`,
      method: "GET",
      onSuccess: ({ data, status, total, message }) => {
        setLoading(false);
        if (status) {
          setList(data);
          console.log("Discount Revenue /City", data);
        }
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  useEffect(() => {
    if (!list.length) {
      setRevenue();
      setCommission();
      return;
    }

    let city = [];
    let total_revenue = [];
    let total_commission = [];

    list.map((item) => {
      city.push(item.city_id.name);
      total_revenue.push(item.total_revenue);
      total_commission.push(item.total_commission);
    });

    const rev = {
      labels: city,
      datasets: [
        {
          label: `${lang("Revenue /City")}`,
          data: total_revenue,
          backgroundColor: getRandomColor(0),
        },
      ],
    };

    const comm = {
      labels: city,
      datasets: [
        {
          label: `${lang("Commission /City")}`,
          data: total_commission,
          backgroundColor: getRandomColor(1),
        },
      ],
    };

    setRevenue(rev);
    setCommission(comm);
  }, [list]);

  return (
    <>
      <Col xs={24} xl={12} lg={24}>
        <Col span={24}>
          <div className="revenue-h">
            <h6>Summary</h6>
          </div>
          <div className="revenue-header">
            <div className="revenue-header-text">
              <h6>Total Revenue</h6>
              <h5>
                {
                  <Currency
                    price={list?.reduce((total, index) => {
                      return total + index.total_revenue;
                    }, 0)}
                  />
                }
              </h5>
            </div>
            <div className="revenue-header-text">
              <h6>Total Commission</h6>
              <h5>
                {
                  <Currency
                    price={list?.reduce((total, index) => {
                      return total + index.total_commission;
                    }, 0)}
                  />
                }
              </h5>
            </div>
          </div>
        </Col>
        <Row>
          <Col xs={24} xl={12} lg={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <h4 className="chart-tital"> {lang("Discount Revenue /City")}</h4>

              <BarChart borderColor="#1EB564" data={revenue} />
            </Card>
          </Col>

          <Col xs={24} xl={12} lg={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <h4 className="chart-tital">
                {" "}
                {lang("Discount Commission /City")}
              </h4>
              <BarChart borderColor="#1EB564" data={commission} />
            </Card>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default DiscountRevenue;
