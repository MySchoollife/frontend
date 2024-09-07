import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Table,
  Tabs,
  Tooltip,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import Lottie from "react-lottie";
import * as success from "../../assets/animation/success.json";
import apiPath from "../../constants/apiPath";
import { AppStateContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import Requested from "./Requested";
import Accepted from "./Accepted";
import NewQuotation from "./NewQuotation";

const Search = Input.Search;
const { TabPane } = Tabs;

export const QuoteStatus = {
  REQUEST: "request",
  RECEIVED: "received",
  COMPLETE: "complete",
  FULLFILL: "fulfill",
  ADDONS: "addons",
  ITEMDEALS: "itemdeals",
};

function Finance() {
  const { setPageHeading } = useContext(AppStateContext);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedTab2, setSelectedTab2] = useState("ApprovalPayment");
  useEffect(() => {
    setPageHeading(lang("Quote  Management"));
  }, []);

  const handleTabChange = (status) => {
    setSelectedTab(status);
  };

  const handleTabChange2 = (status) => {
    setSelectedTab2(status);
  };

  return (
    <>
      <div className="tabled quoteManagement">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24">
              <Tabs
                className="main_tabs"
                onTabClick={handleTabChange}
                activeKey={selectedTab}
                tabBarStyle={{ color: "green" }}
              >
                <TabPane tab={lang("New")} key="all">
                  <NewQuotation />
                </TabPane>

                <TabPane tab={lang("Requested")} key={QuoteStatus.REQUEST}>
                  <Requested />
                </TabPane>

                <TabPane tab={lang("Accepted")} key={"RestaurantPayment"}>
                  <Accepted />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Finance;
