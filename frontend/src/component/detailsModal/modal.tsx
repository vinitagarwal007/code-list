import css from "./modal.module.css";
import { Button, Modal, Text, Textarea, useDisclosure } from "@chakra-ui/react";
import {
  Modal as Mod,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { languageFromId } from "../../util/languageCollection";
import axios from "axios";

export default function DetailModal(props: any) {
  const { isOpen, onClose, data } = props;
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const finalRef = useRef(null);
  const handleStdinChange = (e: any) => {
    setStdin(e.target.value);
  };
  
  const handleOutputClick = async () => {
    setOutput("Waiting For Server Response....")
    var result = await axios.post("/output/calculate", {
      submission: data,
      stdin: stdin,
    });
    setOutput(result.data)
  };

useEffect(()=>{
    setOutput(data.output)
    setStdin(data.stdin)
},[isOpen])
  return (
    <>
      <Mod finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="auto" backdropBlur={"8px"} />
        <ModalContent
          minWidth={"80%"}
          minH={"80%"}
          backgroundColor={"#1B263B"}
          color={"white"}
          border={"1px"}
          borderColor={"white"}
        >
          <ModalHeader>Output</ModalHeader>
          <ModalCloseButton />
          <ModalBody className={css.container}>
            <div className={css.editor}>
              <Editor
                theme="vs-dark"
                language={languageFromId(data.language)}
                options={{
                  minimap: {
                    enabled: false,
                  },
                  readOnly: true,
                }}
                value={data.code}
              />
              <center>
                <label>Submitted Code in {languageFromId(data.language)}</label>
              </center>
            </div>
            <div className={css.outputSection}>
              <label>Submitted Input:</label>
              <Textarea
                onChange={handleStdinChange}
                value={(stdin || "").replace(/\\n|\\r\\n|\\n\\r|\\r/g, "\n")}
                height={'30%'}
              >
              </Textarea>
              <label>Complied Output:</label>
              <Textarea
                _readOnly={"true"}
                value={output}
                height={'50%'}
              >
              </Textarea>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              color={"white"}
              onClick={handleOutputClick}
            >
              Fetch Output
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Mod>
    </>
  );
}
