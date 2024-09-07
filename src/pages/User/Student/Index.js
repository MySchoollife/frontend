import { Card, Col, Row, Tabs } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../../../context/AppContext";
import useRequest from "../../../hooks/useRequest";
import lang from "../../../helper/langHelper";
import AllStudent from "./AllStudent";

const { TabPane } = Tabs;

const useTabs = {
  AllStudent: lang("All Students"),
  StudentBulk: lang("Student Bulk Edit"),
  AllMigration: lang("All Migration"),
  DeletedStudent: lang("Deleted"),
};

function Index() {
  const { setPageHeading } = useContext(AppStateContext);
  const { request } = useRequest();
  const [selectedTab, setSelectedTab] = useState(useTabs.AllStudent);
  const handleTabChange = (status) => {
    setSelectedTab(status);
  };

  useEffect(() => {
    setPageHeading(lang("Student Management"));
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
                <TabPane tab={useTabs.AllStudent} key={useTabs.AllStudent}>
                  <div className="cms-bodycontent">
                    <AllStudent />
                  </div>
                </TabPane>

                <TabPane tab={useTabs.StudentBulk} key={useTabs.StudentBulk}>
                  <div className="cms-bodycontent">
                    <AllStudent />
                  </div>
                </TabPane>
                <TabPane tab={useTabs.AllMigration} key={useTabs.AllMigration}>
                  <div className="cms-bodycontent">
                    <AllStudent />
                  </div>
                </TabPane>
                <TabPane
                  tab={useTabs.DeletedStudent}
                  key={useTabs.DeletedStudent}
                >
                  <div className="cms-bodycontent">
                    <AllStudent />
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
