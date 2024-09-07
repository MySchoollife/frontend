import { Card, Col, Row, Tabs } from "antd";
import React, { useContext, useEffect, useState } from "react";

import { AppStateContext } from "../../context/AppContext";
import useRequest from "../../hooks/useRequest";
import { NotificationList } from "./_NotificationList";
import PushNotificationManager from "./_PushNotificationManager";
import lang from "../../helper/langHelper";

const { TabPane } = Tabs;

const notificationTabs = {
  NOTIFICATIONS: lang("Notifications"),
  PUSH: lang("Push Notifications"),
};

function Index() {
  const { setPageHeading } = useContext(AppStateContext);

  const { request } = useRequest();

  const [selectedTab, setSelectedTab] = useState(
    notificationTabs.NOTIFICATIONS,
  );

  const handleTabChange = (status) => {
    setSelectedTab(status);
  };

  useEffect(() => {
    setPageHeading(lang("Notifications"));
  }, []);

  return (
    <>
      <div className="tabled quoteManagement">
        <Row gutter={[24, 0]}>
          <Col span={24} md={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24">
              <Tabs
                className="main_tabs"
                onTabClick={handleTabChange}
                activeKey={selectedTab}
                tabBarStyle={{ color: "green" }}
              >
                <TabPane
                  tab={notificationTabs.NOTIFICATIONS}
                  key={notificationTabs.NOTIFICATIONS}
                >
                  <div className="notification-main-wrap" style={{ padding: "16px" }}>
                    <NotificationList />
                  </div>
                </TabPane>

                <TabPane
                  tab={notificationTabs.PUSH}
                  key={notificationTabs.PUSH}
                >
                  <PushNotificationManager />
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
