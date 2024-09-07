import { Card, Col, Row, Tabs } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../../context/AppContext";
import useRequest from "../../hooks/useRequest";
import lang from "../../helper/langHelper";
import Alleads from "./AllLeads";
import SourceList from "./SourceList";
import LeadList from "./LeadStatus";

const { TabPane } = Tabs;

const useTabs = {
  AllLeads: lang("All Leads"),
  LeadStatus: lang("Leads Status"),
  LeadSources: lang("Leads Sources"),
};

function Index() {
  const { setPageHeading } = useContext(AppStateContext);
  const { request } = useRequest();
  const [selectedTab, setSelectedTab] = useState(useTabs.AllLeads);
  const handleTabChange = (status) => {
    setSelectedTab(status);
  };

  useEffect(() => {
    setPageHeading(lang("Leads Management"));
  }, []);

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
                <TabPane tab={useTabs.AllLeads} key={useTabs.AllLeads}>
                  <div className="cms-bodycontent">
                    <Alleads />
                  </div>
                </TabPane>

                <TabPane tab={useTabs.LeadStatus} key={useTabs.LeadStatus}>
                  <div className="cms-bodycontent">
                    <LeadList />
                  </div>
                </TabPane>
                <TabPane tab={useTabs.LeadSources} key={useTabs.LeadSources}>
                  <div className="cms-bodycontent">
                    <SourceList />
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Index;
