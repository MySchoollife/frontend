import {
  Card,
  Input,
  Typography,
  Progress,
  Row,
  Skeleton,
  Radio,
  Tabs
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import apiPath from "../../constants/apiPath";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
import lang from "../../helper/langHelper";
const Search = Input.Search;
const { Title, Text } = Typography;
const { TabPane } = Tabs

function RevenueCard() {

  const api = {
    status: apiPath.statusQuote,
    list: apiPath.listQuote,
  };

  const { request } = useRequest();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // setLoading(true);
    // fetchData({ current: 1 });
  }, [refresh]);

  const fetchData = () => {
    setLoading(true);
    const payload = {};

    request({
      url: api.list,
      method: "POST",
      data: payload,
      onSuccess: (data) => {
        setLoading(false);
        setList(data.data.list.docs);
      },
      onError: (error) => {
        setLoading(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  return (
    <Card bordered={false} className="criclebox h-full">
      <div className="graph-title">
        <Title level={5}>{lang("Revenue Report")}</Title>
        <Row style={{ justifyContent: "end" }}>
          <Radio.Group defaultValue="month" buttonStyle="solid">
            <Radio.Button onClick={() => null} value="week">
              {lang("Week")}
            </Radio.Button>
            <Radio.Button onClick={() => null} value="month">
              {lang("Month")}
            </Radio.Button>
            <Radio.Button onClick={() => null} value="year">
              {lang("Year")}
            </Radio.Button>
          </Radio.Group>
        </Row>
      </div>
      <Tabs
        className="main_tabs"
        onTabClick={() => null}
        //activeKey={'country'}
        tabBarStyle={{ color: "green" }}
      >
        <TabPane tab={<div className="tab_title"><span>2K</span> <span>{lang("country")}</span></div>} key="country">
          <div className="graph_inner_title">
            <h3>{lang("Country")}</h3>
            <h3>{lang("Sales")}</h3>
          </div>
          {loading ? [1, 2, 3].map(item => <Skeleton active key={item} />) : <>
            <div className="home_progress"><span className="progreess-left"><h4>30K </h4><h5>Dubai</h5></span><Progress percent={25} />
              <span className="progress-right">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L10 8L15 13" stroke="#28C76F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                </svg>25.8%
              </span>
            </div>
            <div className="home_progress"><span className="progreess-left"><h4>26K </h4><h5>Abu Dhabi</h5></span><Progress percent={16} status="active" /><span className="progress-right"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L10 8L15 13" stroke="#28C76F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
              25.8%</span></div>
            <div className="home_progress"><span className="progreess-left"><h4>22K </h4><h5>Sharjah</h5></span><Progress percent={13} status="exception" /><span className="progress-right"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L10 8L15 13" stroke="#28C76F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
              25.8%</span></div>
            <div className="home_progress"><span className="progreess-left"><h4>17K </h4><h5>Ajman</h5></span><Progress percent={11} /><span className="progress-right"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L10 8L15 13" stroke="#28C76F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
              25.8%</span></div>
          </>}
        </TabPane>
        <TabPane tab={<div className="tab_title"><span>20k</span> <span>{("City")}</span></div>} key="city">
          <div className="graph_inner_title">
            <h3>{lang("Cities")}</h3>
            <h3>{lang("Sales")}</h3>
          </div>
          {loading ? [1, 2, 3].map(item => <Skeleton active key={item} />) : <>
            <div className="home_progress"><span className="progreess-left"><h4>30K </h4><h5>Dubai</h5></span><Progress percent={95} />
              <span className="progress-right">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L10 8L15 13" stroke="#28C76F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                </svg>95.8%
              </span>
            </div>
            <div className="home_progress"><span className="progreess-left"><h4>26K </h4><h5>Abu Dhabi</h5></span><Progress percent={32} status="active" /><span className="progress-right"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L10 8L15 13" stroke="#28C76F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
              32.8%</span></div>
            <div className="home_progress"><span className="progreess-left"><h4>22K </h4><h5>Sharjah</h5></span><Progress percent={13} status="exception" /><span className="progress-right"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L10 8L15 13" stroke="#28C76F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
              25.8%</span></div>
            <div className="home_progress"><span className="progreess-left"><h4>17K </h4><h5>Ajman</h5></span><Progress percent={49} /><span className="progress-right"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L10 8L15 13" stroke="#28C76F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
              49.8%</span></div>
          </>}
        </TabPane>

        {/* <TabPane tab={<div className="tab_title"><span>3.1k</span> <span>Area</span></div>} key="area">
          <div className="graph_inner_title">
            <h3>Sales by Area</h3>
            <h3>Sales</h3>
          </div>
            {loading ? [1, 2, 3].map(item => <Skeleton active key={item} />) : <>
              <div className="home_progress"><span className="progreess-left"><h4>30K </h4><h5>Dubai</h5></span>
              <Progress percent={35} />
                <span className="progress-right">
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L10 8L15 13" stroke="#28C76F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>35.8%
                </span>
              </div>
              <div className="home_progress"><span className="progreess-left"><h4>26K </h4><h5>Abu Dhabi</h5></span><Progress percent={58} status="active" /><span className="progress-right"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L10 8L15 13" stroke="#28C76F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              58.8%</span></div>
              <div className="home_progress"><span className="progreess-left"><h4>22K </h4><h5>Sharjah</h5></span><Progress percent={13} status="exception" /><span className="progress-right"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L10 8L15 13" stroke="#28C76F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              25.8%</span></div>
              <div className="home_progress"><span className="progreess-left"><h4>17K </h4><h5>Ajman</h5></span><Progress percent={17} /><span className="progress-right"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L10 8L15 13" stroke="#28C76F" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              25.8%</span></div>
            </>}
          </TabPane> */}
      </Tabs>
    </Card>
  );
}


export default RevenueCard;
