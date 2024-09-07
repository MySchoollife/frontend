import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Row,
  Tabs,
  Tag,
  Typography,
  Table
} from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import apiPath from "../../constants/apiPath";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
import { AppStateContext } from "../../context/AppContext";
import OrderCard from "./_OrderCard";
import DeliveryCard from "./_DeliveryCard";
import RevenueCard from "./_RevenueCard";
import SalesCard from "./_SalesCard";
import SalesProfitChart from "./_SalesProfitChart";
import WalletCard from "./_WalletCard";
import DiscountCard from "./_DiscountCard";
import AdCard from "./_AdCard";
import lang from "../../helper/langHelper";
const Search = Input.Search;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

export const QuoteStatus = {
  REQUEST: "request",
  RECEIVED: "received",
  COMPLETE: "complete",
  FULLFILL: "fulfill",
  ADDONS: "addons",
  ITEMDEALS: "itemdeals",
};

function Index() {

  const { setPageHeading } = useContext(AppStateContext);

  const api = {
    status: apiPath.statusQuote,
    list: apiPath.listQuote,
  };

  const { request } = useRequest();

  const getBrandList = () => {
    request({
      url: apiPath.brandList,
      method: "GET",
      onSuccess: (data) => {

      },
      onError: (error) => {
        console.log(error);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  useEffect(() => {
    setPageHeading(lang("Reports"));
  }, []);


  return (
    <>
      <div className="home-card tabled quoteManagement card_body_space">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={12} className="mb-24">
            <OrderCard />
          </Col>
          <Col xs={24} xl={12} className="mb-24">
            <DeliveryCard />
          </Col>

          <Col xs={24} xl={12} className="mb-24">
            <RevenueCard />
          </Col>

          <Col xs={24} xl={12} className="mb-24">
            <SalesCard />
          </Col>

          <Col xs={24} xl={12} className="mb-24">
            <SalesProfitChart />
          </Col>

          <Col xs={24} xl={12} className="mb-24">
            <WalletCard />
          </Col> 

          <Col xs={24} xl={12} className="mb-24">
            <DiscountCard />
          </Col> 

          <Col xs={24} xl={12} className="mb-24">
            <AdCard />
          </Col>

        </Row>
      </div>
    </>
  );
}


export default Index;
