import { ChevronLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function GoBackButton(props) {
  const navigate = useNavigate();
  const goback = () => navigate(-1);
  return (
    <>
      <style>
        {`
        .goback{
          margin-right: 5px;
        }
      `}
      </style>
      <ChevronLeft {...props} className="goback" onClick={goback}></ChevronLeft>
    </>
  );
}
