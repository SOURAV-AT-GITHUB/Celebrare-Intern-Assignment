import {
  Box,
  Button,
  ChakraProvider,
  FormLabel,
  Input,
  Select,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Draggable from "react-draggable";
export const CardCanvas = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState({});
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [background, setBackground] = useState(0);
  const backgrounds = [
    "linear-gradient(to right, #fc354c, #0abfbc)",
    "linear-gradient(to right, #ff512f, #dd2476)",
    "linear-gradient(to right, #5f2c82, #49a09d)",
    "linear-gradient(to right, #ec6f66, #f3a183)",
    "linear-gradient(to right, #3d7eaa, #ffe47a)",
  ];
  function addElement() {
    const newElement = {
      id: Date.now(),
      text: "New text",
      fontSize: "16px",
      fontColor: "black",
      fontColor: "Arial",
      position: { x: 0, y: 0 },
    };
    setHistory([...history, elements]);
    setRedoStack([]);
    setElements([...elements, newElement]);
    setSelectedElement(newElement);
  }

  const handleTextChange = (e, index) => {
    const updatedElements = [...elements];
    updatedElements[index].text = e.target.value;
    setElements(updatedElements);
  };

  const handleBlur = () => {
    setIsEditing(false);

    setHistory([...history, elements]);
    setRedoStack([]);
  };

  function updateElement(key, value) {
    const updatedElements = elements.map((element) =>
      element.id == selectedElement.id ? { ...element, [key]: value } : element
    );
    setHistory([...history, elements]);
    setRedoStack([]);
    setElements(updatedElements);
  }
  const undo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setRedoStack([elements, ...redoStack]);
      setElements(lastState);
      setHistory(history.slice(0, history.length - 1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setHistory([...history, elements]);
      setElements(nextState);
      setRedoStack(redoStack.slice(1));
    }
  };

  const handleDragStart = () => {
    setHistory([...history, elements]);
    setRedoStack([]);
  };

  const handleDragStop = (e, data, id) => {
    const updatedElements = elements.map((el) =>
      el.id == id ? { ...el, position: { x: data.x, y: data.y } } : el
    );
    setElements(updatedElements);
  };

  const [isMaxWidth768] = useMediaQuery("(max-width: 768px)");
  return (
    <ChakraProvider>
      <Box id="main-container" p="1em">
        <Box
          id="undo-redo-section"
          mb="1em"
          p={isMaxWidth768 ? 0 : "1em"}
          w="fit-content"
          display={"flex"}
          gap={3}
        >
          <Button size={"lg"} onClick={undo}>
            Undo
          </Button>
          <Button size={"lg"} onClick={redo}>
            Redo
          </Button>
        </Box>
        <Box
          id="main-section"
          display={isMaxWidth768 ? "block" : "flex"}
          textAlign={"center"}
          gap={3}
        >
          <Box
            id="card-section"
            h={isMaxWidth768 ? "60vh" : "80vh"}
            p={4}
            w={isMaxWidth768 ? "100%" : "55%"}
            bg={backgrounds[background]}
            border={"1px solid black"}
            borderRadius={"10px"}
            position={"relative"}
            overflow={"hidden"}
          >
            {elements.map((element, index) => (
              <Draggable
                key={element.id}
                position={element.position}
                onStart={handleDragStart}
                onStop={(e, data) => handleDragStop(e, data, element.id)}
                bounds="#card-section"
              >
                <Box
                  p={"3px"}
                  fontSize={element.fontSize}
                  fontFamily={element.fontFamily}
                  color={element.fontColor}
                  position={"absolute"}
                  onClick={() => {
                    setSelectedElement({ ...element, index });
                    setIsEditing(true);
                  }}
                  cursor={element.id == selectedElement.id ? "move" : "pointer"}
                  border={
                    element.id == selectedElement.id
                      ? "2px dashed blue"
                      : "none"
                  }
                >
                  {isEditing && selectedElement.index == index ? (
                    <Input
                      fontSize={element.fontSize}
                      value={element.text}
                      onChange={(e) => handleTextChange(e, index)}
                      onBlur={handleBlur}
                      autoFocus
                      textAlign={"center"}
                      size="sm"
                      variant="unstyled"
                    />
                  ) : (
                    element.text
                  )}
                </Box>
              </Draggable>
            ))}
          </Box>
          {isMaxWidth768 && <br />}
          <Box
            id="edit-section"
            h={isMaxWidth768 ? "60vh" : "80vh"}
            w={isMaxWidth768 ? "100%" : "40%"}
            border={"1px solid black"}
            borderRadius={"10px"}
            bg={"linear-gradient(to right, #22c1c3, #fdbb2d)"}
            p="1em"
          >
            <Select
              placeholder="Select/Change Background for Card"
              onChange={(e) => setBackground(e.target.value)}
            >
              <option value="0">Miaka</option>
              <option value="1">Bloody Mary</option>
              <option value="2">Calm Darya</option>
              <option value="3">Bourban</option>
              <option value="4">Opa</option>
            </Select>
            <br />
            <Text
              bgColor={"lightgreen"}
              color={"white"}
              p="7px"
              w={"fit-content"}
              m="auto"
              borderRadius={"10px"}
            >
              Click on Add Text Button to add text in the card
            </Text>
            <br />
            <Button
              onClick={addElement}
              size="lg"
              colorScheme="cyan"
              color="white"
            >
              Add Text
            </Button>
            <br />
            {selectedElement.id && (
              <>
                <FormLabel>Select/Change Font Family</FormLabel>
                <Select
                  onChange={(e) => updateElement("fontFamily", e.target.value)}
                >
                  <option
                    value="Arial"
                    selected={
                      selectedElement.fontFamily == "Arial" ? true : false
                    }
                  >
                    Arial
                  </option>
                  <option
                    value="Times New Roman"
                    selected={
                      selectedElement.fontFamily == "Times New Roman"
                        ? true
                        : false
                    }
                  >
                    Times New Roman
                  </option>
                  <option
                    value="Courier New"
                    selected={
                      selectedElement.fontFamily == "Courier New" ? true : false
                    }
                  >
                    Courier New
                  </option>
                </Select>
                <br />
                <FormLabel>Select/Change Font Size</FormLabel>
                <Select
                  onChange={(e) => {
                    updateElement("fontSize", e.target.value);
                  }}
                >
                  <option
                    value="12px"
                    selected={selectedElement.fontSize == "12px" ? true : false}
                  >
                    12px
                  </option>
                  <option
                    value="16px"
                    selected={selectedElement.fontSize == "16px" ? true : false}
                  >
                    16px
                  </option>
                  <option
                    value="20px"
                    selected={selectedElement.fontSize == "20px" ? true : false}
                  >
                    20px
                  </option>
                  <option
                    value="24px"
                    selected={selectedElement.fontSize == "24px" ? true : false}
                  >
                    24px
                  </option>
                  <option
                    value="28px"
                    selected={selectedElement.fontSize == "28px" ? true : false}
                  >
                    28px
                  </option>
                  <option
                    value="32px"
                    selected={selectedElement.fontSize == "32px" ? true : false}
                  >
                    32px
                  </option>
                  <option
                    value="36px"
                    selected={selectedElement.fontSize == "36px" ? true : false}
                  >
                    36px
                  </option>
                  <option
                    value="40px"
                    selected={selectedElement.fontSize == "40px" ? true : false}
                  >
                    40px
                  </option>
                </Select>
                <FormLabel>Select/Change Colour</FormLabel>
                <Input
                  type="color"
                  value={selectedElement.fontColor}
                  onChange={(e) => {
                    updateElement("fontColor", e.target.value);
                  }}
                />
              </>
            )}
          </Box>
        </Box>
      </Box>{" "}
    </ChakraProvider>
  );
};
