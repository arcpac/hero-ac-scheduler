// UserModal.js
import { Modal, Button, Form } from "react-bootstrap";
// Dependencies
import Swal from 'sweetalert2'
import { AuthContext } from "../../../context/auth-context";
import { useContext, useEffect, useState } from "react";


function NodeRedConfigModal({ show, handleClose, config }) {
    const authCtx = useContext(AuthContext)
    const [id, setId] = useState(config._id)
    const [broker, setBroker] = useState(config.broker)
    const [databaseTopic, setDatabaseTopic] = useState(config.databaseTopic)
    const [edgeDeviceTopic, setEdgeDeviceTopic] = useState(config.edgeDeviceTopic)
    const [url, setUrl] = useState(config.url)
    useEffect(() => {
        setId(config._id)
        setBroker(config.broker)
        setDatabaseTopic(config.databaseTopic)
        setEdgeDeviceTopic(config.edgeDeviceTopic)
        setUrl(config.url)
    }, [config])
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://127.0.0.1:8000/admin/node-red/${config._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authCtx.token,
            },
            body: JSON.stringify({
                "url": `${url}`,
                "databaseTopic": `${databaseTopic}`,
                "edgeDeviceTopic": `${edgeDeviceTopic}`,
                "broker": `${broker}`
            })
        })
        const responseData = await response.json()
        handleClose()
        if (responseData.responseCode === 201) {
            Swal.fire({
                // title: "Updated!",
                text: "NodeRed configuration updated",
                icon: "success"
            });
        }
        if (responseData.responseCode === 404) {
            Swal.fire({
                title: "Error",
                text: `${responseData.message}`,
                icon: "error"
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
    };
    return (
        <Modal show={show} onHide={handleClose}>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="brokerUrl">
                        <Form.Label>Broker URL : {`${config.broker}`}</Form.Label>
                        <Form.Control
                            type="text"
                            name="brokerUrl"
                            value={broker}
                            onChange={(e) => {
                                setBroker(e.target.value)
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="topic">
                        <Form.Label>Topic (Synchronise database) : {`${config.databaseTopic}`}</Form.Label>
                        <Form.Control
                            type="text"
                            name="databaseTopic"
                            value={databaseTopic}
                            onChange={(e) => {
                                setDatabaseTopic(e.target.value)
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="topic">
                        <Form.Label>Topic (Synchronise Edge device) : {`${config.edgeDeviceTopic}`}</Form.Label>
                        <Form.Control
                            type="text"
                            name="edgeDeviceTopic"
                            value={edgeDeviceTopic}
                            onChange={(e) => {
                                setEdgeDeviceTopic(e.target.value)
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="apiUrl">
                        <Form.Label>Data API URL : {`${config.url}`}</Form.Label>
                        <Form.Control
                            type="text"
                            name="apiUrl"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value)
                            }}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                </Modal.Body>
            </form>
        </Modal>
    );
}

export default NodeRedConfigModal;
