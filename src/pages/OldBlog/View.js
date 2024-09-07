import { Row, Col, Card, Button, Skeleton, Image, Divider } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { ShowToast, Severty } from "../../helper/toast";
import apiPath from "../../constants/apiPath";
import { Badge } from 'antd';
import { shortLang, longLang } from "../../config/language";
import moment from "moment";
import notfound from "../../assets/images/not_found.png";

function View() {

  const sectionName   =   "Blog";
  const routeName     =   "blog";

  const params                =   useParams();
  const { request }           =   useRequest();
  const [list, setList]       =   useState({});
  const [loading, setLoading] =   useState(false);

  const fetchData = (id) => {
    request({
      url: apiPath.viewBlog + "/" + id,
      method: 'GET',
      onSuccess: (data) => {
        setLoading(false);
        setList(data.data);
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR)
      }
    })
  }

  useEffect(() => {
    setLoading(true)
    fetchData(params.id)
  }, [])

  return (
    <>
      <Card title={sectionName + " Details"}>
        <Row gutter={16}>
          <Col span={12} xs={24} md={24}>

            {loading ? <Skeleton active /> : 
              <div className="view-main-list">

                <div className="view-inner-cls">
                  <h5>Image:</h5>
                  <h6><Image className="imagefix" src={list && list.thumbnail ? list.thumbnail : notfound} /></h6>
                </div>

                {/* Start English */}
                <Divider orientation="left" orientationMargin={0} className="devider-color">{longLang.en}</Divider>

                <div className="view-inner-cls">
                  <h5>Title:</h5>
                  <h6 className="cap">{list.title ? list.title : '-'}</h6>
                </div>

                <div className="view-inner-cls">
                  <h5>Description:</h5>
                  <h6 className="cap">{list.description ? <p dangerouslySetInnerHTML={{__html: list.description}}></p>   : "-"}</h6>
                </div>
                {/* End English */}


                {/* Start Spanish */}
                <Divider orientation="left" orientationMargin={0} className="devider-color">{longLang.es}</Divider>

                <div className="view-inner-cls">
                  <h5>Title:</h5>
                  <h6 className="cap">{list.es_title ? list.es_title : '-'}</h6>
                </div>
                
                <div className="view-inner-cls">
                  <h5>Description:</h5>
                  <h6 className="cap">{list.es_description ? <p dangerouslySetInnerHTML={{__html: list.es_description}}></p>   : "-"}</h6>
                </div>
                {/* End Spanish */}


                {/* Start German */}
                <Divider orientation="left" orientationMargin={0} className="devider-color">{longLang.de}</Divider>

                <div className="view-inner-cls">
                  <h5>Title:</h5>
                  <h6 className="cap">{list.de_title ? list.de_title : '-'}</h6>
                </div>
                
                <div className="view-inner-cls">
                  <h5>Description:</h5>
                  <h6 className="cap">{list.de_description ? <p dangerouslySetInnerHTML={{__html: list.de_description}}></p>   : "-"}</h6>
                </div>
                {/* End German */}


                {/* Start Franch */}
                <Divider orientation="left" orientationMargin={0} className="devider-color">{longLang.fr}</Divider>

                <div className="view-inner-cls">
                  <h5>Title:</h5>
                  <h6 className="cap">{list.fr_title ? list.fr_title : '-'}</h6>
                </div>
                
                <div className="view-inner-cls">
                  <h5>Description:</h5>
                  <h6 className="cap">{list.fr_description ? <p dangerouslySetInnerHTML={{__html: list.fr_description}}></p>   : "-"}</h6>
                </div>
                {/* End Franch */}

                <div className="view-inner-cls">
                  <h5>Status:</h5>
                  <h6>{list.is_active ? <Badge colorSuccess status="success" text="Active" /> : <Badge status="error" text="InActive" />}</h6>
                </div>

                <div className="view-inner-cls">
                  <h5>Created On:</h5>
                  <h6>{list.created_at ? moment(list.created_at).format('DD-MMM-YYYY') : '-'}</h6>
                </div>

                <div className="view-inner-cls float-right">
                  <Link className="ant-btn ant-btn-primary"  to={`/${routeName}/`}>Back</Link>
                </div>

              </div>
            }

          </Col>
        </Row>
      </Card>
    </>
  );
  
}

export default View;