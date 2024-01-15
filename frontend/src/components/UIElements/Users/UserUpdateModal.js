import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "../../../context/auth-context";
import UserForm from "./UserForm";
import _debounce from "lodash/debounce";

function UserUpdateModal({ editMode, updateShow, updateHandleClose, user }) {
  const authCtx = useContext(AuthContext);
  const [email, setEmail] = useState(user.email);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [userType, setUserType] = useState(user.userType);
  const [password, setPassword] = useState(user.password);

  useEffect(() => {
    setEmail(user.email);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setUserType(user.userType);
    setPassword(user.password);
  }, [user]);

  // Define a debounce function to limit the API call frequency
  const debouncedSubmit = _debounce(async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/admin/users/${user._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
        body: JSON.stringify({
          email: `${email}`,
          firstName: `${firstName}`,
          lastName: `${lastName}`,
          userType: `${userType}`,
        }),
      }
    );
    const responseData = await response.json();
    console.log(responseData);
    if (responseData.responseCode === 201) {
      setEmail("");
      setFirstName("");
      setLastName("");
      updateHandleClose();
      Swal.fire({
        text: `User updated`,
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
    if (responseData.responseCode === 401) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        html: `${responseData.message}`,
        showConfirmButton: false,
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
  }, 1000); // Set the debounce delay (in milliseconds)

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
            {editMode ? "Update user" : `${user.firstName} ${user.lastName}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm
            editMode={editMode}
            email={email}
            setEmail={setEmail}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            userType={userType}
            password={password}
            setUserType={setUserType}
            setPassword={setPassword}
          />
        </Modal.Body>
        {editMode && (
          <Modal.Footer>
            <button type="submit" className="btn btn-primary">
              Update user
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

export default UserUpdateModal;
