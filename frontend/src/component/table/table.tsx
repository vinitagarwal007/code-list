import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import css from "./table.module.css";
import { RepeatIcon } from "@chakra-ui/icons";
import axios from "axios";
export default function SubmissionTable() {
  function NewlineText(props: any) {
    const text = props.text;
    return text.split("\n").map((str:any) => <p>{str}</p>);
  }
  const handleReload = () => {
    getData()
  }
  const getData = async () =>{
    var result = await axios.get("/submission/get")
    console.log(result);
  }
  return (

    <>
      <TableContainer className={css.tableContainer} overflowY={"auto"}>
        <Table variant="simple">
          <TableCaption>All The Submissions</TableCaption>
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Language</Th>
              <Th>Code</Th>
              <Th>StdIn</Th>
              <Th isNumeric>
                <RepeatIcon color={"white"} height={4} width={4} onClick={handleReload}/>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>
                <NewlineText text={"trail\ncode".slice(0,100)}/>
                <span>...</span>
              </Td>
              <Td>25.4</Td>
              <Td isNumeric>25.4</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
