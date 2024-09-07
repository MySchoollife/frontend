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
import DoughnutCart from "../Auth/_DoughnutCart";
import lang from "../../helper/langHelper";
const Search = Input.Search;
const { Title, Text } = Typography;
const {TabPane} = Tabs

function SalesProfitChart() {
  
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
      //  fetchData({ current: 1 });
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
          <Title level={5}>{lang("Sales/Revenue/Profit")} <p>{lang("Last 7 Days")}</p></Title>
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
            className="custom_tabs main_tabs"
            onTabClick={() => null}
            // tabPosition="left"
            //activeKey={'country'}
            tabBarStyle={{ color: "green" }}
          >
            <TabPane tab={
            <div className="tab_title">
              <span>24K</span>
              <span>{lang("Restaurant")}</span>

            </div>
          } key="restaurant">
            {loading ? [1, 2, 3].map(item => <Skeleton active key={item} />) : <>  <DoughnutCart /> </>}
            </TabPane>
            <TabPane tab={
              <div className="tab_title">
                <span>3.5k</span> <span>{lang("Driver")}</span>
              </div>
            } key="driver">
            {loading ? [1, 2, 3].map(item => <Skeleton active key={item} />) : <>  <DoughnutCart /> </>}
            </TabPane> 

            <TabPane tab={<div className="tab_title"><span>7.5k</span> <span>{lang("City")}</span></div>} key="city">
            {loading ? [1, 2, 3].map(item => <Skeleton active key={item} />) : <>  <DoughnutCart /> </>}
            </TabPane>
            <TabPane tab={<div className="tab_title"><span>2.1</span> <span>{lang("Customer")}</span></div>} key="customer">
            {loading ? [1, 2, 3].map(item => <Skeleton active key={item} />) : <>  <DoughnutCart /> </>}
            </TabPane>
            <TabPane tab={<div className="tab_title"><span>3.1k</span> <span>{lang("Area")}</span></div>} key="Area">
            {loading ? [1, 2, 3].map(item => <Skeleton active key={item} />) : <>  <DoughnutCart /> </>}
            </TabPane>

          </Tabs>
          
          
        </Card>
    );
}


export default SalesProfitChart;
