import css from "./table.module.css";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useDisclosure,
} from "@chakra-ui/react";
import { RepeatIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactLoading from "react-loading";
import DetailModal from "../detailsModal/modal";
import { languageFromId } from "../../util/languageCollection";

export default function SubmissionTable() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); //modal operator from chakra
  const [currentData, setCurrentData] = useState({});
  const [sorted, setSorted] = useState(false);
  const effectRan = useRef(false);

  function NewlineText(props: any) {
    const text = props.text;
    return text.split("\n").map((str: any) => <p>{str}</p>);
  }
  const handleReload = () => {
    getData();
  };
  const getData = async () => {
    setLoading(true);
    var result = await axios.get("/submission/get");
    setTableData(result.data);
    setLoading(false);
  };

  const handleElementClick = (e: any) => {
    setCurrentData(tableData[parseInt(e.target.id)]);
    onOpen();
  };

  const handleDateSort = () => {
    // @ts-ignore
    var final = tableData.reverse();
    setSorted(!sorted);
    setTableData(final);
  };

  useEffect(() => {
    if (!effectRan.current) {
      getData();
      effectRan.current = true;
    }
  }, []);
  useEffect(()=>{
    if(!isOpen) getData()
  },[isOpen])
  return (
    <>
      <TableContainer className={css.tableContainer} overflowY={"auto"}>
        {loading ? (
          <div className={css.loading}>
            <ReactLoading
              type={"bars"}
              color={"#ffffff"}
              height={100}
              width={100}
            />
          </div>
        ) : (
          <Table variant="simple">
            <TableCaption>All The Submissions</TableCaption>
            <Thead>
              <Tr>
                <Th color={"white"} onClick={handleDateSort}>
                  Submitted On{" "}
                  {sorted ? <TriangleDownIcon /> : <TriangleUpIcon />}
                </Th>
                <Th color={"white"}>Username</Th>
                <Th color={"white"}>Language</Th>
                <Th color={"white"}>Code</Th>
                <Th color={"white"}>StdIn</Th>
                <Th isNumeric>
                  <RepeatIcon
                    color={"white"}
                    height={4}
                    width={4}
                    onClick={handleReload}
                  />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((e: any, idx: number) => {
                return (
                  <Tr>
                    <Td>{e.submissionDate}</Td>
                    <Td>{e.username}</Td>
                    <Td>{languageFromId(e.language)}</Td>
                    <Td style={{ whiteSpace: "pre-line" }}>
                      {e.code
                        .slice(0, 100)
                        .replace(/\\n|\\r\\n|\\n\\r|\\r/g, "\n")}
                      {e.code.length > 100 ? <span>...</span> : <></>}
                    </Td>
                    <Td style={{ whiteSpace: "pre-line" }}>
                      {e.stdin.replace(/\\n|\\r\\n|\\n\\r|\\r/g, "\n")}
                    </Td>
                    <Td isNumeric>
                      <button id={String(idx)} onClick={handleElementClick}>
                        Show Code
                      </button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </TableContainer>
      <DetailModal isOpen={isOpen} onClose={onClose} data={currentData} />
    </>
  );
}
