import { message, Upload } from "antd";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { uploadFile } from "react-s3";
import { s3Config } from "../config/s3Config";
import { getFileExtension } from "../helper/functions";

const MultipleImageUpload = ({
  data,
  fileType,
  imageType,
  btnName,
  onDelete,
  onChange,
  disabled = false,
}) => {
  const [fileList, setFileList] = useState([]);

  const beforeUpload = (file) => {
    if (fileType.includes(file.type)) {
    } else {
      message.error("File format is not correct");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 5;

    if (!isLt2M) {
      message.error(`Image must be smaller than 5 MB!`);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!data) return;
    const multipleFileList = data.map((url, index) => ({
      uid: `${index + 1}`,
      name: url,
      status: "done",
      url: url,
    }));
    setFileList(multipleFileList);
  }, [data]);

  const handleImgChange = async (event) => {
    const { file } = event;
    const extension = getFileExtension(file.name);
    const name = `PLANIT_${new Date().getTime()}.${extension}`;

    const newFile = new File([file], name, { type: file.type });
    uploadFile(newFile, s3Config(imageType))
      .then((data) => {
        const fileData = {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: data.location,
          thumbUrl: data.location,
        };
        setFileList([...fileList, fileData]);
        if (onChange) {
          onChange([...fileList, fileData]);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      {" "}
      <PlusOutlined /> <div style={{ marginTop: 8 }}>Upload {btnName}</div>{" "}
    </div>
  );

  const handleRemove = (file) => {
    console.log(fileList, file);
    const newFile = fileList.filter((item) => item.uid != file.uid);
    setFileList(newFile);
    if (onChange) {
      onChange([...newFile]);
    }
    // onDelete(file.url)
  };

  return (
    <Upload
      disabled={disabled}
      listType="picture-card"
      onRemove={handleRemove}
      maxCount={8}
      beforeUpload={beforeUpload}
      fileList={fileList}
      //onChange={handleChange}
      customRequest={handleImgChange}
    >
      {fileList.length >= 8 ? null : uploadButton}
    </Upload>
  );
};

export default MultipleImageUpload;
