import css from "./form.module.css";
import Editor from "@monaco-editor/react";
import { Button, Input, Select } from "@chakra-ui/react";
import { useRef, useState } from "react";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL ;
import { toast } from "react-toastify";
import { languageFromId } from "../../util/languageCollection";

export default function Form() {
  const formInitState = { language: '93',code:'// Paste or Type your Code',username:'',stdin:'' }
  const [submitting, setsubmitting] = useState(false);
  const [input, setInput] = useState(formInitState);
  const editorRef = useRef()
  const handleInputChange = (e: any) =>
    setInput({ ...input, [e.target.name]: e.target.value });
  // @ts-ignore
  const handleCodeChange = (value: any) => setInput({ ...input, "code": value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setsubmitting(true);
      // @ts-ignore
      var result = await axios.post("/submission/new", {...input});
      if (result.status == 200) {
        toast.success("Data Submitted Successfully");
        setInput(formInitState)
      }else{
        toast.error("Error While Submitting Data")
      }
      setsubmitting(false);
    } catch (error) {
      toast.error("Error While Submitting Data")
      setsubmitting(false);
    }
  };


  const handleMount = (editor:any) =>{
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
            value={input.username}
            name="username"
            onChange={handleInputChange}
            required
            color={"white"}
          />
          <Input
            color={"white"}
            placeholder="stdIn"
            value={input.stdin}
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
              value={input.code}
              onMount={handleMount}
            />
          </div>
        </div>
      </form>
    </>
  );
}
