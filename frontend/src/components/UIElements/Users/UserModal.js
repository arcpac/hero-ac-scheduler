import React, { useContext, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "../../../context/auth-context";
import Swal from "sweetalert2";
import _debounce from "lodash/debounce";
import UserForm from "./UserForm";

function UserModal({ show, handleClose }) {
  const authCtx = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("viewer");

  const debouncedSubmit = _debounce(async () => {
    const response = await fetch("http://127.0.0.1:8000/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authCtx.token,
      },
      body: JSON.stringify({
        email: `${email}`,
        password: `${password.replace(/\s+/g, '')}`,
        firstName: `${firstName}`,
        lastName: `${lastName}`,
        userType: `${userType}`,
      }),
    });
    const responseData = await response.json();
    console.log(responseData)
    if (responseData.responseCode === 201) {
      setEmail("");
      setFirstName("");
      setLastName("");
      handleClose();
      Swal.fire({
        text: `User added`,
        icon: "success",
      });
    }
    if (responseData.responseCode === 404) {
      Swal.fire({
        position: "top-end",
        html: `<b>Error:</b> ${responseData.message}`,
        icon: "error",
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
        html: `<b>Error:</b> ${responseData.message}`,
        showConfirmButton: false,
      });
    }
  }, 500); //milliseconds

  async function onSubmitHandler(event) {
    event.preventDefault();
    debouncedSubmit();
  }

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-lg">
      <form onSubmit={onSubmitHandler}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark h5">Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm
            editMode={true}
            email={email}
            setEmail={setEmail}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            userType={userType}
            setUserType={setUserType}
            password={password}
            setPassword={setPassword}
          />
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn btn-primary">
            Add new user
          </button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default UserModal;
