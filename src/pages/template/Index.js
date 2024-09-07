import React, { useState } from "react";
import TemplateEditor from "./TemplateEditor";
import Canvas from "./Canvas";

const Index = () => {
  const [elements, setElements] = useState([]);

  const addElement = (element) => {
    setElements((prevElements) => [...prevElements, element]);
  };

  const updateElement = (id, newProperties) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, ...newProperties } : el
      )
    );
  };

  return (
    <div className="App">
            <h1>Template Creator</h1>
            <TemplateEditor addElement={addElement} />
            <Canvas elements={elements} updateElement={updateElement} />   {" "}
    </div>
  );
};

export default Index;
