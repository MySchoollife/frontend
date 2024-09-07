import { Card, Col, Row, Tabs } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../../../context/AppContext";
import useRequest from "../../../hooks/useRequest";
import lang from "../../../helper/langHelper";
import DeletedTeacher from "./DeletedTeacher";
import AllTeacher from "./AllTeacher";

const { TabPane } = Tabs;

const useTabs = {
  AllTeacher: lang("All Teachers"),
  DeletedTeacher: lang("Deleted Teachers"),
};

function Index() {
  const { setPageHeading } = useContext(AppStateContext);
  const { request } = useRequest();
  const [selectedTab, setSelectedTab] = useState(useTabs.AllTeacher);
  const handleTabChange = (status) => {
    setSelectedTab(status);
  };

  useEffect(() => {
    setPageHeading(lang("Teacher Management"));
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
                <TabPane tab={useTabs.AllTeacher} key={useTabs.AllTeacher}>
                  <div className="cms-bodycontent">
                    <AllTeacher />
                  </div>
                </TabPane>

                <TabPane
                  tab={useTabs.DeletedTeacher}
                  key={useTabs.DeletedTeacher}
                >
                  <DeletedTeacher />
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
