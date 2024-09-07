import { Card, Col, Row, Tabs } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../../context/AppContext";
import useRequest from "../../hooks/useRequest";
import lang from "../../helper/langHelper";
import DeletedTeacher from "./DeletedTeacher";
import AllEmployee from "./AllEmployee";

const { TabPane } = Tabs;

const useTabs = {
  AllEmployee: lang("All Employee"),
  EmployeeRoll: lang("Employee Roll"),
};

function Index() {
  const { setPageHeading } = useContext(AppStateContext);
  const { request } = useRequest();
  const [selectedTab, setSelectedTab] = useState(useTabs.AllEmployee);
  const handleTabChange = (status) => {
    setSelectedTab(status);
  };

  useEffect(() => {
    setPageHeading(lang("Employee Management"));
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
                <TabPane tab={useTabs.AllEmployee} key={useTabs.AllEmployee}>
                  <div className="cms-bodycontent">
                    <AllEmployee />
                  </div>
                </TabPane>

                <TabPane tab={useTabs.EmployeeRoll} key={useTabs.EmployeeRoll}>
                  <div className="cms-bodycontent">
                    <AllEmployee />
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
