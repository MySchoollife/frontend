import React from "react";
import { useDrag } from "react-dnd";

const DraggableItem = ({ element, updateElement }) => {
  const [, drag] = useDrag(() => ({
    type: "ITEM",
    item: { id: element.id },
  }));

  const handleChange = (e) => {
    updateElement(element.id, { content: e.target.value });
  };

  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        border: "1px solid black",
        padding: "5px",
        cursor: "move",
      }}
    >
           {" "}
      {element.type === "text" && (
        <input type="text" value={element.content} onChange={handleChange} />
      )}
           {" "}
      {element.type === "image" && (
        <img src={element.imageUrl} alt="Element" style={{ width: "100px" }} />
      )}
            {element.type === "icon" && <span>{element.icon}</span>}   {" "}
    </div>
  );
};

export default DraggableItem;
