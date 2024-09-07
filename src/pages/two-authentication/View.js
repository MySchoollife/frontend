import { Row, Col, Card, Button, Skeleton } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { ShowToast, Severty } from "../../helper/toast";
import apiPath from "../../constants/apiPath";
import { Badge } from "antd";
import moment from "moment";
import Logo from "../../assets/images/Logo.png";
import callIcon from "../../assets/images/icon/callIcon.svg";
import emailIcon from "../../assets/images/icon/emailIcon.svg";

function View() {
  const sectionName = "Email Template";
  const routeName = "email-template";
  const params = useParams();
  const { request } = useRequest();
  const [list, setList] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = (id) => {
    request({
      url: apiPath.viewEmailTemplate + "/" + id,
      method: "GET",
      onSuccess: (data) => {
        setLoading(false);
        setList(data.data);
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const rawHTML = `
    <html lang="en">
        <body style="font-family: 'Lato', 'Merriweather', 'Roboto', sans-serif;">
            <div className="mainEmailWraper" style="max-width: 680px; margin: 0 auto;">
                <div className="emailHeader" style="display: flex;align-items: center;justify-content: center;padding: 16px;background-color: #0089b624;border-radius: 8px 8px 0 0;">
                    <div className="logoOuter" style="display: flex; align-items: center; justify-content: center;">
                        <img src=${Logo} alt="" width="40%" style="" />
                    </div>
                </div>
        
                <div className="emailTempBody" style="">
                    <div style="padding: 16px; background-color: #fff; gap: 16px;">
                      ${list.description}
                    </div>
                </div>
                
                <div style="padding: 16px;font-size: 14px; background-color: #0089b624; color: #000; text-align:center;">
                  <div style="font-size: 16px; font-weight: 600; color: #0089B6;">Get in touch</div>
                  <div style="font-size: 14px; font-weight: 400; color: #0089B6;">
                    <a href="tel:+91 9876543210" style="text-decoration: none; color: #0089B6; font-size: 16px;">+91 9876543210</a>
                  </div>
                  <div style="font-size: 14px; font-weight: 400; color: #0089B6;">
                    <a href="mailto:tawasi.com" style="text-decoration: none; color: #0089B6; font-size: 16px;">tawasi.com</a>
                  </div>
                  <ul style="list-style: none; padding: 0; margin: 0; display: flex; align-items: center; gap: 16px; justify-content: center; margin-top: 16px;">
                    <li style="">
                      <a href="#" style="display: block; width: 40px; height: 40px; border-radius: 50px; background-color: #0089B6; display: flex; align-items: center; justify-content: center;">
                        <svg width="22" height="22" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clip-path="url(#clip0_101_11)">
                          <path d="M32 6H4C3.46957 6 2.96086 6.21071 2.58579 6.58579C2.21071 6.96086 2 7.46957 2 8V28C2 28.5304 2.21071 29.0391 2.58579 29.4142C2.96086 29.7893 3.46957 30 4 30H32C32.5304 30 33.0391 29.7893 33.4142 29.4142C33.7893 29.0391 34 28.5304 34 28V8C34 7.46957 33.7893 6.96086 33.4142 6.58579C33.0391 6.21071 32.5304 6 32 6ZM30.46 28H5.66L12.66 20.76L11.22 19.37L4 26.84V9.52L16.43 21.89C16.8047 22.2625 17.3116 22.4716 17.84 22.4716C18.3684 22.4716 18.8753 22.2625 19.25 21.89L32 9.21V26.71L24.64 19.35L23.23 20.76L30.46 28ZM5.31 8H30.38L17.84 20.47L5.31 8Z" fill="white"/>
                          </g>
                          <defs>
                          <clipPath id="clip0_101_11">
                          <rect width="36" height="36" fill="white"/>
                          </clipPath>
                          </defs>
                        </svg>
                      </a>
                    </li>
                    <li style="">
                      <a href="#" style="display: block; width: 40px; height: 40px; border-radius: 50px; background-color: #0089B6; display: flex; align-items: center; justify-content: center;">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.36198 4.58425C6.36174 5.07048 6.16835 5.5367 5.82436 5.88034C5.48037 6.22399 5.01396 6.41691 4.52773 6.41667C4.0415 6.41642 3.57528 6.22304 3.23164 5.87905C2.88799 5.53506 2.69507 5.06865 2.69531 4.58242C2.69556 4.09619 2.88894 3.62997 3.23293 3.28632C3.57692 2.94268 4.04333 2.74976 4.52956 2.75C5.01579 2.75024 5.48201 2.94363 5.82566 3.28762C6.1693 3.63161 6.36222 4.09802 6.36198 4.58425ZM6.41698 7.77425H2.75031V19.2509H6.41698V7.77425ZM12.2103 7.77425H8.56198V19.2509H12.1736V13.2284C12.1736 9.87342 16.5461 9.56175 16.5461 13.2284V19.2509H20.167V11.9817C20.167 6.32592 13.6953 6.53675 12.1736 9.31425L12.2103 7.77425Z" fill="white"/>
                        </svg>                
                      </a>
                    </li>
                    <li style="">
                      <a href="#" style="display: block; width: 40px; height: 40px; border-radius: 50px; background-color: #0089B6; display: flex; align-items: center; justify-content: center;">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.91075 20.626C15.213 20.626 19.7546 13.7468 19.7546 7.7917C19.7546 7.5992 19.7546 7.40395 19.7464 7.21145C20.6306 6.57137 21.3937 5.77891 22 4.8712C21.1741 5.23537 20.2988 5.47539 19.4026 5.58345C20.3466 5.0192 21.0536 4.13141 21.3922 3.08508C20.5054 3.6105 19.5346 3.97934 18.5226 4.17545C17.8422 3.45086 16.9419 2.97084 15.9611 2.80974C14.9803 2.64865 13.9737 2.81547 13.0973 3.28437C12.2209 3.75326 11.5236 4.49807 11.1134 5.40341C10.7031 6.30875 10.6029 7.32411 10.8281 8.2922C9.03339 8.20221 7.27762 7.73597 5.67468 6.92372C4.07175 6.11148 2.65744 4.97136 1.5235 3.57733C0.947843 4.57157 0.772164 5.74763 1.03214 6.86669C1.29211 7.98576 1.96825 8.96393 2.92325 9.60258C2.20762 9.57826 1.50772 9.3861 0.88 9.04158V9.10345C0.881234 10.145 1.24205 11.1542 1.90145 11.9604C2.56086 12.7666 3.4784 13.3204 4.499 13.5282C4.11161 13.6349 3.71144 13.6881 3.30963 13.6863C3.02635 13.6872 2.74365 13.6609 2.46537 13.608C2.75383 14.5045 3.3155 15.2884 4.07171 15.8499C4.82793 16.4113 5.74081 16.7221 6.6825 16.7388C5.08276 17.9953 3.10668 18.6768 1.0725 18.6735C0.714066 18.675 0.355882 18.6543 0 18.6116C2.06458 19.9278 4.46228 20.6267 6.91075 20.626Z" fill="white"/>
                        </svg>
                      </a>
                    </li>
                    <li style="">
                      <a href="#" style="display: block; width: 40px; height: 40px; border-radius: 50px; background-color: #0089B6; display: flex; align-items: center; justify-content: center;">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.8327 12.3757H15.1243L16.041 8.70898H12.8327V6.87565C12.8327 5.93148 12.8327 5.04232 14.666 5.04232H16.041V1.96232C15.7422 1.9229 14.6138 1.83398 13.4221 1.83398C10.9333 1.83398 9.16602 3.3529 9.16602 6.14232V8.70898H6.41602V12.3757H9.16602V20.1673H12.8327V12.3757Z" fill="white"/>
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="emailFooter" style="padding: 16px; background-color: #0089B6; border-radius: 0 0 8px 8px; text-align: center;">
                    <div className="title" style="font-size: 14px; color: #fff; font-weight: 500;">Copyright © 2023 Pimpt-Up. All rights reserved.</div>
                </div>
            </div>
        </body>
    </html>`;

  useEffect(() => {
    setLoading(true);
    fetchData(params.id);
  }, []);

  return (
    <>
      <Card title={sectionName + " Details"}>
        <Row gutter={16}>
          <Col span={12} xs={24} md={24}>
            {loading ? (
              [1, 2, 3].map((item) => <Skeleton active key={item} />)
            ) : (
              <div className="view-main-list">
                <div className="view-inner-cls">
                  <h5>Title:</h5>
                  <h6>{list.title}</h6>
                </div>

                <div className="view-inner-cls">
                  <h5>Subject:</h5>
                  <h6>{list.subject}</h6>
                </div>

                <div className="view-inner-cls">
                  <h5>Status:</h5>
                  <h6>
                    {list.is_active ? (
                      <Badge colorSuccess status="success" text="Active" />
                    ) : (
                      <Badge status="error" text="InActive" />
                    )}
                  </h6>
                </div>

                <div className="view-inner-cls">
                  <h5>Created On:</h5>
                  <h6>
                    {list.created_at
                      ? moment(list.created_at).format("DD-MMM-YYYY")
                      : "-"}
                  </h6>
                </div>

                <div className="view-inner-cls float-right">
                  <Link
                    className="ant-btn ant-btn-primary"
                    to={`/${routeName}/`}
                  >
                    Back
                  </Link>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {list && list.description ? (
        <Card title="Email Preview" className="mt-3">
          <Row gutter={16}>
            <Col span={12} xs={24} md={24}>
              {loading ? (
                <Skeleton active />
              ) : (
                <div className="view-main-list">
                  <h6>
                    {<p dangerouslySetInnerHTML={{ __html: rawHTML }}></p>}
                  </h6>
                </div>
              )}
            </Col>
          </Row>
        </Card>
      ) : null}
    </>
  );
}

export default View;
