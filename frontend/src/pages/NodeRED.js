import React, { useCallback, useContext, useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/auth-context";
import Swal from "sweetalert2";
import { httpGetNodeRed, httpPutNodeRed } from "../hooks/requests";
import Table from "react-bootstrap/Table";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import HowItWorks from "../components/UIElements/Accordion";
import HowItWorksNR from "../components/UIElements/NodeRedConfig/HowItWorksNR";

function NodeRED({ userType }) {
  const authCtx = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [NRConfig, setConfig] = useState({});
  const [editedConfig, setEditedConfig] = useState({});
  const [loading, setLoading] = useState(false);

  const getNodeRedConfig = useCallback(async () => {
    const fetchedConfig = await httpGetNodeRed(authCtx);
    if (fetchedConfig.responseCode === 404) {
      Swal.fire({
        title: "Error",
        text: `${fetchedConfig.message}`,
        icon: "error",
      });
      return setConfig({});
    }
    setConfig(fetchedConfig);
    setEditedConfig(fetchedConfig);
  }, [authCtx]);

  useEffect(() => {
    document.title = "Node-RED Settings - Airconnect";
    getNodeRedConfig();
  }, [getNodeRedConfig]);

  const handleEditConfig = () => {
    setEditMode(true);
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    // Perform the save/update logic here
    const response = await httpPutNodeRed(authCtx, editedConfig);
    setLoading(false);

    if (response.responseCode === 201) {
      Swal.fire({
        text: "Node-RED configuration updated",
        icon: "success",
      });
      setEditMode(false);
      getNodeRedConfig();
    } else {
      Swal.fire({
        title: "Error",
        text: `${response.message}`,
        icon: "error",
      });
    }
  };

  const handleCancelEdit = () => {
    // Show a confirmation prompt if there are unsaved changes
    if (
      editMode &&
      Object.keys(editedConfig).some(
        (key) => editedConfig[key] !== NRConfig[key]
      )
    ) {
      Swal.fire({
        title: "Discard Changes?",
        text: "Are you sure you want to discard changes?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, discard!",
        cancelButtonText: "No, keep editing",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setEditMode(false);
          setEditedConfig(NRConfig); // Reset editedConfig to the original state
        }
      });
    } else {
      setEditMode(false);
      setEditedConfig(NRConfig);
    }
  };

  const handleChange = (e) => {
    setEditedConfig({
      ...editedConfig,
      [e.target.name]: e.target.value,
    });
  };

  const buttonStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline",
    padding: "0",
  };

  //MQTT

  const handlePullSchedules = async () => {
    Swal.fire({
      title: "Enter password",
      input: "password",
      showClass: {
        popup: `
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
      inputPlaceholder: "Enter your password",
      inputAttributes: {
        maxlength: "50",
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Sync MongoDB",
      showLoaderOnConfirm: true,
      preConfirm: async (enteredPassword) => {
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/admin/dashboard/sync-data",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authCtx.token,
              },
              body: JSON.stringify({
                password: enteredPassword,
              }),
            }
          );
          const responseData = await response.json();
          return responseData;
        } catch (error) {
          Swal.showValidationMessage(`
            Request failed: ${error}
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      console.log(result);
      if ("value" in result) {
        const response =
          "responseCode" in result.value ? result.value : { responseCode: 404 };
        if (response.responseCode === 404) {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            text: `${result.value.message}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
        if (response.responseCode === 401) {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            html: `${response.message}`,
            showConfirmButton: false,
          });
        }
        if (response.responseCode === 200) {
          if (response.count > 0) {
            Swal.fire({
              html: "Importing schedules.",
              timer: response.count * 100,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
              },
            }).then((result) => {
              Swal.fire({
                position: "top-end",
                icon: "success",
                text: `${response.message}`,
                showConfirmButton: false,
                timer: 1500,
              });
            });
          }
        }
      }
    });
  };

  const handleSyncEdgeDevices = async () => {
    Swal.fire({
      title: "Enter password",
      input: "password",
      showClass: {
        popup: `
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
      inputPlaceholder: "Enter your password",
      inputAttributes: {
        maxlength: "50",
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Sync MySQL",
      showLoaderOnConfirm: true,
      preConfirm: async (enteredPassword) => {
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/admin/dashboard/sync-edge-devices",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authCtx.token,
              },
              body: JSON.stringify({
                password: enteredPassword,
              }),
            }
          );
          const responseData = await response.json();
          return responseData;
        } catch (error) {
          Swal.showValidationMessage(`
            Request failed: ${error}
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if ("value" in result) {
        const response =
          "responseCode" in result.value ? result.value : { responseCode: 404 };
        if (response.responseCode === 404) {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            text: `${result.value.message}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
        if (response.responseCode === 401) {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            html: `${response.message}`,
            showConfirmButton: false,
          });
        }
        if (response.responseCode === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            text: `${result.value.message}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  return (
    <div className="my-4">
      <h2>Node-RED Configuration</h2>
      <hr />
      <HowItWorks>
        <HowItWorksNR />
      </HowItWorks>
      <h3>Current Node-RED Settings</h3>
      <p className="small text-dark">
        This page provides you with the flexibility to effortlessly update your
        Node-RED configuration. You can customise essential parameters,
        including the choice of broker, MQTT topics for database
        synchronisation, and the designated DATA API URL.
      </p>
      <Table bordered responsive id="view-modal" className="mt-4">
        <tbody>
          <tr>
            <th className="pb-4">MQTT Broker:</th>
            <td>
              {editMode ? (
                <Form.Control
                  type="text"
                  name="broker"
                  value={editedConfig.broker}
                  onChange={handleChange}
                />
              ) : (
                `${NRConfig.broker}`
              )}
            </td>
          </tr>
          <tr>
            <th className="pb-4">Database Topic:</th>
            <td>
              {editMode ? (
                <Form.Control
                  type="text"
                  name="databaseTopic"
                  value={editedConfig.databaseTopic}
                  onChange={handleChange}
                />
              ) : (
                `${NRConfig.databaseTopic}`
              )}
            </td>
          </tr>
          <tr>
            <th className="pb-4">Edge Device Topic:</th>
            <td>
              {editMode ? (
                <Form.Control
                  type="text"
                  name="edgeDeviceTopic"
                  value={editedConfig.edgeDeviceTopic}
                  onChange={handleChange}
                />
              ) : (
                `${NRConfig.edgeDeviceTopic}`
              )}
            </td>
          </tr>
          <tr>
            <th className="pb-4">Data API URL:</th>
            <td>
              {editMode ? (
                <Form.Control
                  type="text"
                  name="url"
                  value={editedConfig.url}
                  onChange={handleChange}
                />
              ) : (
                `${NRConfig.url}`
              )}
            </td>
          </tr>
        </tbody>
      </Table>

      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <div className="mt-3">
          {editMode ? (
            <>
              <div className="d-flex justify-content-start">
                <Button
                  label="Save new configuration"
                  icon="pi pi-save"
                  className="red-button mx-2"
                  onClick={handleSaveConfig}
                />
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  className="white-button"
                  onClick={handleCancelEdit}
                />
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-start">
              <div className="col-md-6">
                {["super_admin"].includes(userType) && (
                  <Button
                    label="Edit configuration"
                    icon="pi pi-pencil"
                    className="blue-button"
                    onClick={handleEditConfig}
                  />
                )}
              </div>
              <div className="col-md-6 d-flex justify-content-end">
                <div className="mx-2">
                  <Button
                    label="Sync MongoDB"
                    icon="pi pi-step-forward"
                    className="green-button"
                    onClick={handlePullSchedules}
                  />
                </div>
                <div>
                  <Button
                    label="Sync MySQL"
                    icon="pi pi-sync"
                    className="blue-btn"
                    onClick={handleSyncEdgeDevices}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NodeRED;
