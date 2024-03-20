import Editor from "@monaco-editor/react";
import { Button, Input, Select } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import css from "./form.module.css";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL ;
import { toast } from "react-toastify";

function languageFromId(value) {
  switch (value) {
    case "76":
      return "cpp";
    case "91":
      return "java";
    case "93":
      return "javascript";
    case "71":
      return "python";
    default:
      return "javascript";
  }
}

export default function Form() {
  const [submitting, setsubmitting] = useState(false);
  const [input, setInput] = useState({ language: '93' });
  const editorRef = useRef()
  const handleInputChange = (e: any) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const handleCodeChange = (value: any) => setInput({ ...input, code: value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setsubmitting(true);
      var result = await axios.post("/submission/new", {...input,code:editorRef.current.getValue()});
      if (result.status == 200) {
        toast.success("Data Submitted Successfully");
      }else{
        toast.error("Error While Submitting Data")
      }
      setsubmitting(false);
    } catch (error) {
      toast.error("Error While Submitting Data")
      setsubmitting(false);
    }
  };


  const handleMount = (editor,monaco) =>{
    editorRef.current = editor;
    editor.focus()
  }
  return (
    <>
      <form className={css.form} onSubmit={handleSubmit} noValidate>
        <div className={css.submission}>
          <center>
            <label>New Code Submission</label>
          </center>
          <Input
            placeholder="Username"
            value={input.user}
            name="username"
            onChange={handleInputChange}
            required
            color={"white"}
          />
          <Input
            color={"white"}
            placeholder="stdIn"
            value={input.stdIn}
            name="stdin"
            onChange={handleInputChange}
            required
          />
          <Select
            color={"white"}
            bgColor={"transparent"}
            onChange={handleInputChange}
            name="language"
            defaultValue={93}
          >
            <option value="76" className={css.option}>
              C++
            </option>
            <option value="91" className={css.option}>
              Java
            </option>
            <option value="93" className={css.option}>
              JavaScript
            </option>
            <option value="71" className={css.option}>
              Python (3.8.1)
            </option>
          </Select>
          <Button
            colorScheme="whatsapp"
            variant="outline"
            type="submit"
            loadingText="Submitting"
            isLoading={submitting}
          >
            Submit
          </Button>
        </div>
        <div className={css.sourceCode}>
          <center>
            <label>Source Code</label>
          </center>
          <div className={css.editor}>
            <Editor
              defaultValue="// Paste or Type your Code"
              theme="vs-dark"
              onChange={handleCodeChange}
              language={languageFromId(input.language)}
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              onMount={handleMount}
            />
          </div>
        </div>
      </form>
    </>
  );
}
