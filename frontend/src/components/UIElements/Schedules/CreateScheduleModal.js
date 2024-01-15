import React, { useContext, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "../../../context/auth-context";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import ScheduleForm from "./ScheduleForm";
import { httpActivityLogs } from "../../../hooks/requests";
import _debounce from "lodash/debounce";
import mapErrors from "../../../utils/mapErrors";

function CreateScheduleModal({ show, handleClose, jurisdictions }) {
  const authCtx = useContext(AuthContext);
  const [holidayName, setHolidayName] = useState("");
  const [date, setDate] = useState(new Date());
  const [jurisdiction, setJurisdiction] = useState("qld");
  const [information, setInformation] = useState("");
  const [moreInfo, setMoreInfo] = useState("");

  const debouncedSubmit = _debounce(async () => {
    const currentMonth = new Date(date).getMonth() + 1;
    const month = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
    const day =
      new Date(date).getDate() < 10
        ? `0${new Date(date).getDate()}`
        : `${new Date(date).getDate()}`;
    const dateString = `${new Date(date).getFullYear()}${month}${day}`;

    const response = await fetch("http://127.0.0.1:8000/admin/schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authCtx.token,
      },
      body: JSON.stringify({
        "Holiday Name": `${holidayName}`,
        Information: `${information}`,
        Jurisdiction: `${jurisdiction}`,
        "More Information": `${moreInfo}`,
        Date: `${dateString}`,
      }),
    });

    const responseData = await response.json();
    if (responseData.responseCode === 201) {
      setHolidayName("");
      setInformation("");
      setMoreInfo("");
      handleClose();
      Swal.fire({
        text: `Added ${responseData.message["Holiday Name"]}`,
        icon: "success",
      });
    }
    if (responseData.responseCode === 404) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        html: "<b>Error:</b> Please check the input values.",
        showConfirmButton: false,
      });
    }
    if (responseData.responseCode === 401) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        html: `${responseData.message}`,
        showConfirmButton: false,
      });
    }
    if (responseData.type === "exist") {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        text: responseData.message,
        showConfirmButton: false,
      });
    }
  }, 500);

  async function onSubmitHandler(event) {
    event.preventDefault();
    debouncedSubmit();
  }

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-lg">
      <form onSubmit={onSubmitHandler}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark h5">
            Add holiday schedule
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ScheduleForm
            editMode={true}
            newName={holidayName}
            setNewName={setHolidayName}
            newDate={date}
            setNewDate={setDate}
            newJurisdiction={jurisdiction}
            setNewJurisdiction={setJurisdiction}
            newInfo={information}
            setNewInfo={setInformation}
            newMoreInfo={moreInfo}
            setNewMoreInfo={setMoreInfo}
            jurisdictions={jurisdictions}
          />
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn btn-primary">
            Add new holiday
          </button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default CreateScheduleModal;
