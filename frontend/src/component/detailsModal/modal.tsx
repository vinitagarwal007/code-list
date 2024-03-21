import css from "./modal.module.css";
import { Button, Textarea } from "@chakra-ui/react";
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
  const editorRef = useRef()
  const [code, setCode] = useState("");

  const handleStdinChange = (e: any) => {
    setStdin(e.target.value);
  };
  
  const handleOutputClick = async () => {
    setOutput("Waiting For Server Response....")
    // @ts-ignore
    data.code = editorRef.current.getValue()
    data.stdin = stdin
    var result = await axios.post("/output/calculate", data);
    setOutput(result.data)
  };

  const handleMount = (editor:any) =>{
    editorRef.current = editor;
    editor.focus()
  }

  const handleCodeChange = (value: any) => setCode(value);

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
              defaultValue={data.code}
              theme="vs-dark"
              onChange={handleCodeChange}
              language={languageFromId(data.language)}
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              value={code}
              onMount={handleMount}
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
