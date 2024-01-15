function HowItWorksNR() {
  return (
    <div className="m-0 small text-dark">
      <p>
        Tailor the following parameters to your preferences for configuring
        Node-RED:
      </p>
      <ul className="ml-4 px-4 pt-4">
        <li className="mb-1 mt-1">
          <b>MQTT Broker:</b> Utilises the Mosquitto MQTT broker to seamlessly
          coordinate messages between the publisher and subscriber.
        </li>
        <li className="mb-1">
          <b>Database Topic:</b> Serves as the push mechanism for syncing with
          the edge device, functioning as the publisher to the edge device
          (MySQL).
        </li>
        <li className="mb-1">
          <b>Edge Device Topic:</b> Acts as the pull mechanism subscriber,
          allowing an edge device to subscribe and pull data from the cloud
          database (MongoDB Atlas).
        </li>
        <li className="mb-1">
          <b>DATA API URL:</b> Provides the link to access records of official
          public holidays from the Australian Government website.
        </li>
      </ul>
      <ul className="ml-4 mt-4 px-4">
        <strong>Data Synchronisation:</strong>
        <li className="mb-1 mt-1">
          <strong>Sync MongoDB:</strong> This functionality ensures the synchronisation of data from the <i>Australia Government API</i> to <i>MongoDB Atlas</i>. It involves importing data from the API
          and updating MongoDB Atlas to guarantee that the web application's
          data remains current.
        </li>
        <li className="mb-1">
          <strong>Sync MySQL:</strong> This functionality retrieves data from{" "}
          <i>MongoDB Atlas</i> (cloud database) and updates <i>MySQL</i> (local
          database). The process includes importing data from the cloud database
          and updating the local database, ensuring the local edge devices have
          the latest information.
        </li>
      </ul>
      <p className="my-3">
        <b>Note:</b> A password is required to execute database synchronisation.
      </p>
    </div>
  );
}

export default HowItWorksNR;
