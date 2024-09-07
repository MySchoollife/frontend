import React from "react";
import { useDrop } from "react-dnd";
import DraggableItem from "./DraggableItem";

const Canvas = ({ elements, updateElement }) => {
  const [, drop] = useDrop(() => ({
    accept: "ITEM",
    drop: (item) => {
      // Handle drop logic here, like updating the position of the item
    },
  }));

  return (
    <div
      ref={drop}
      style={{
        position: "relative",
        width: "800px",
        height: "600px",
        border: "1px solid black",
        marginTop: "20px",
      }}
    >
           {" "}
      {elements.map((element) => (
        <DraggableItem
          key={element.id}
          element={element}
          updateElement={updateElement}
        />
      ))}
         {" "}
    </div>
  );
};

export default Canvas;
