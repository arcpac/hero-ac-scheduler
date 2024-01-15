import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "./UpdateScheduleModal.css";
import { AuthContext } from "../../../context/auth-context";
import { parseDate } from "../../../utils/parseDate";
import Swal from "sweetalert2";
import ScheduleForm from "./ScheduleForm";
import _debounce from "lodash/debounce";
import mapErrors from "../../../utils/mapErrors";

function UpdateScheduleModal({
  editMode,
  updateShow,
  updateHandleClose,
  schedule,
  jurisdictions,
}) {
  const authCtx = useContext(AuthContext);
  const [schedId, setId] = useState(schedule["Holiday Name"]);
  const [newName, setNewName] = useState(schedule["Holiday Name"]);
  const [newDate, setNewDate] = useState(parseDate(schedule["Date"]));
  const [newJurisdiction, setNewJurisdiction] = useState(
    schedule["Jurisdiction"]
  );
  const [newInfo, setNewInfo] = useState(schedule["Information"]);
  const [newMoreInfo, setNewMoreInfo] = useState(schedule["More Information"]);

  useEffect(() => {
    setId(schedule._id);
    setNewName(schedule["Holiday Name"]);
    setNewDate(parseDate(schedule["Date"]));
    setNewJurisdiction(schedule["Jurisdiction"]);
    setNewInfo(schedule["Information"]);
    setNewMoreInfo(schedule["More Information"]);
  }, [schedule]);

  const debouncedSubmit = _debounce(async () => {
    const currentMonth = new Date(newDate).getMonth() + 1;
    const month = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
    const day =
      new Date(newDate).getDate() < 10
        ? `0${new Date(newDate).getDate()}`
        : `${new Date(newDate).getDate()}`;
    const dateString = `${new Date(newDate).getFullYear()}${month}${day}`;

    const response = await fetch(
      `http://localhost:8000/admin/schedules/${schedId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
        body: JSON.stringify({
          "Holiday Name": `${newName}`,
          Information: `${newInfo}`,
          Jurisdiction: `${newJurisdiction}`,
          "More Information": `${newMoreInfo}`,
          Date: `${dateString}`,
        }),
      }
    );
    const responseData = await response.json();
    if (responseData.responseCode === 201) {
      setId("");
      setNewDate("");
      setNewInfo("");
      setNewJurisdiction("");
      setNewMoreInfo("");
      setNewName("");
      updateHandleClose();
      Swal.fire({
        text: "Holiday updated",
        icon: "success",
        confirmButtonColor: "#28a745",
        customClass: {
          confirmButton: "btn btn-success",
        },
        showClass: {
          popup: `
              animate__animated
              animate__fadeInDown
              animate__faster
            `,
        },
        hideClass: {
          popup: `
              animate__animated
              animate__fadeOutUp
              animate__faster
            `,
        },
      });
    }
    if (responseData.responseCode === 404) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
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
  }, 500);



  async function onSubmitHandler(event) {
    event.preventDefault();
    debouncedSubmit();
  }

  return (
    <Modal
      show={updateShow}
      onHide={updateHandleClose}
      dialogClassName="modal-lg"
    >
      <form onSubmit={onSubmitHandler}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark h5">
            {editMode ? "Update holiday" : newName}
          </Modal.Title>{" "}
          :
        </Modal.Header>
        <Modal.Body>
          <ScheduleForm
            editMode={editMode}
            newName={newName}
            setNewName={setNewName}
            newDate={newDate}
            setNewDate={setNewDate}
            newJurisdiction={newJurisdiction}
            setNewJurisdiction={setNewJurisdiction}
            newInfo={newInfo}
            setNewInfo={setNewInfo}
            newMoreInfo={newMoreInfo}
            setNewMoreInfo={setNewMoreInfo}
            jurisdictions={jurisdictions}
          />
        </Modal.Body>
        {editMode && (
          <Modal.Footer>
            <button type="submit" className="btn btn-primary">
              Update holiday
            </button>
            <Button variant="secondary" onClick={updateHandleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        )}
      </form>
    </Modal>
  );
}

export default UpdateScheduleModal;