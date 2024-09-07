import { Button, Image, Input, Table, Tooltip, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import lang from "../../helper/langHelper";
import { Severty, ShowToast } from "../../helper/toast";

function TwoAuthentication() {
  const routeName = "two_authentication";
  const { setPageHeading, country } = useAppContext();
  const heading = lang("Two Authentication Management");

  useEffect(() => {
    setPageHeading(heading);
  }, []);

  return (
    <>
      <Card title="Enable/Disable Two-Factor Authentication">
        <h4>Enable two-factor authentication to secure your account login</h4>
        <div className="enable-two-factor">
          <span>
            Two-factor authentication will add a security layer to login your
            account and verify it through the OTP verification.
          </span>
          <Button className="edit-cls btnStyle primary_btn">Enable</Button>
        </div>
      </Card>
    </>
  );
}

export default TwoAuthentication;
