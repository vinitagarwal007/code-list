import css from "./App.module.css";
import { useState } from "react";
import Form from "./component/form/form";
import SubmissionTable from "./component/table/table";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageButton = (e:any) => {
    setCurrentPage(e.target.id);
  };
  return (
    <>
      <div className={css.main}>
        <div className={css.slideBarContainer}>
          <div className={css.slideBar}>
            <button
              className={`${css.slideBarButton} ${
                currentPage == 1 ? css.current : ""
              }`}
              onClick={handlePageButton}
              id="1"
            >
              New Submission
            </button>
            <button
              className={`${css.slideBarButton} ${
                currentPage == 2 ? css.current : ""
              }`}
              onClick={handlePageButton}
              id="2"
            >
              All Submission
            </button>
          </div>
        </div>
        <div className={css.holder}>{currentPage == 1 ? <Form /> : <SubmissionTable />}</div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
