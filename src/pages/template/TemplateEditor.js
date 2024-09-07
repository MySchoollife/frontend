import React from "react";
import DraggableItem from "./DraggableItem";

const TemplateEditor = ({ addElement }) => {
  const handleAddElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      x: 50,
      y: 50,
      content: type === "text" ? "Sample Text" : "",
      icon: type === "icon" ? "🔍" : "",
      imageUrl: type === "image" ? "https://via.placeholder.com/150" : "",
    };
    addElement(newElement);
  };

  return (
    <div>
            <h2>Toolbox</h2>     {" "}
      <button onClick={() => handleAddElement("text")}>Add Text</button>     {" "}
      <button onClick={() => handleAddElement("image")}>Add Image</button>     {" "}
      <button onClick={() => handleAddElement("icon")}>Add Icon</button>   {" "}
    </div>
  );
};

export default TemplateEditor;
