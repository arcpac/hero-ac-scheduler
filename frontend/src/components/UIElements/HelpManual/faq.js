import dashboard from "../../../images/helpManual/dashboard.jpg";
import forgotPassword from "../../../images/helpManual/forgot-password.png";
import sched1 from "../../../images/helpManual/sched1.png";
import userProfile from "../../../images/helpManual/profile.png";
import myProfile from "../../../images/helpManual/myProfile.png";
import changePassword from "../../../images/helpManual/changePassword.png";
import changePicture from "../../../images/helpManual/changePicture.png";
import addNewHoliday from "../../../images/helpManual/addNewHoliday.png";
import addScheduleForm from "../../../images/helpManual/addScheduleForm.png";
import schedActionItems from "../../../images/helpManual/schedActionItems.png";
import schedAdvancedFilter from "../../../images/helpManual/schedAdvancedFilter.gif";
import filterScheds from "../../../images/helpManual/filterScheds.gif";
import exportScheds from "../../../images/helpManual/exportScheds.gif";
import addNewUser from "../../../images/helpManual/addNewUser.png";
import userForm from "../../../images/helpManual/userForm.png";
import updateUserForm from "../../../images/helpManual/updateUserForm.gif";
import filterUsers from "../../../images/helpManual/filterUsers.gif";
import activateUser from "../../../images/helpManual/activateUser.png";
import reactivateUser from "../../../images/helpManual/reactivateUser.png";

const faq = [
  {
    id: 1,
    category: "Getting Started",
    title: "How can I get started with the app?",
    photoUrl: null,
    divContent:
      "Welcome to the app! If you're new, check out our Welcome guide for an introduction to the basics. It covers topics such as logging in, viewing schedules, and managing your account to help you get started smoothly.",
  },
  {
    id: 2,
    category: "Profile Management",
    title: "How do I create an account?",
    photoUrl: null,
    divContent:
      "User account creation is restricted to system administrators only. If you need a user account, kindly reach out to the administrators to facilitate the provisioning process.",
  },
  {
    id: 3,
    category: "Profile Management",
    title: "How can I change my account name?",
    photoUrl: null,
    divContent:
      "Account names can only be modified by system administrators. If you notice any typographical errors or have recently changed your name, please contact the system administrator for assistance.",
  },
  {
    id: 4,
    category: "Profile Management",
    title: "How can I update my password?",
    photoUrl: null,
    divContent: `
      <div className="m-0 small text-dark">
      <p class="mb-2">To update your password, follow these steps:</p>
      <ol class="mx-5">
        <li>Click on your profile picture located in the top right corner.</li>
        <img src="${userProfile}" class="img-w30 shadow mb-3 mt-1" alt="Profile Area" />
        <li>Select <b>'My profile'</b> from the dropdown menu and you will be redirected to a new page.</li>
        <img src="${myProfile}" class="img-w20 shadow mb-3 mt-1" alt="My Profile" />
        <li>Follow the provided instructions to create your new password.</li>
        <ul class="mx-4 mb-2">
          <li>Enter your current password, followed by your new password, and confirm the new password.</li>
          <img src="${changePassword}" class="img-w40 shadow mb-3 mt-1" alt="Change Password Area" />
        </ul>
        <li>After successfully updating your password, your account will be logged out.</li>
        <li>Log in again using your new login credentials.</li>
      </ol>
      <p class="mt-4"><i><b>Note:</b> When creating a new password, it must have at least 8 characters, at least 1 digit(s), at least 1 lower case letter(s), at least 1 upper case letter(s), at least 1 non-alphanumeric character(s) such as as *, -, or #</i></p>
    </div>
  `,
  },
  {
    id: 5,
    category: "Profile Management",
    title: "How can I change my profile picture?",
    photoUrl: null,
    divContent: `
      <div className="m-0 small text-dark">
      <p class="mb-2">To update your profile picture, follow these steps:</p>
      <ol class="mx-5">
        <li>Click on your profile picture located in the top right corner.</li>
        <img src="${userProfile}" class="img-w30 shadow mb-3 mt-1" alt="Profile Area" />
        <li>Select <b>'My profile'</b> from the dropdown menu; you will be redirected to a new page.</li>
        <img src="${myProfile}" class="img-w20 shadow mb-3 mt-1" alt="My Profile" />
        <li>Click on the dropzone area or drag and drop to select your new photo.</li>
        <img src="${changePicture}" class="img-w40 shadow mb-3 mt-1" alt="Change Picture Area" />
        <li>Finally, click on <b>'Update picture'</b> to upload your new photo.</li>
      </ol>
      <p class="mt-4"><i><b>Note:</b> Only SVG, PNG, JPG, or GIF images are accepted, with a maximum size of 800 x 800px.</i></p>
    </div>
  `,
  },
  {
    id: 6,
    category: "Profile Management",
    title: `I have forgotten my password. The system doesn’t recognise my
    login details.`,
    photoUrl: null,
    divContent: `
    <div className="m-0 small text-dark">
      <p>To reset your password, follow these steps:</p>
      <ol class="mx-4 mt-1">
        <li>Go to the login page.</li>
        <li>Click on the <b>'Forgotten your password'</b> link.</li>
        <li>Check your email and follow the provided instructions to complete the password reset process.</li>
      </ol> 
      <img src="${forgotPassword}" class="img-w90" alt="Forgot Password" />
    </div>
  `,
  },
  {
    id: 7,
    category: "Profile Management",
    title: `I can't log in to my account.`,
    photoUrl: null,
    divContent:
      "If you face difficulties logging in despite entering the correct credentials, kindly contact the site administrator for assistance. There might be issues with certain system components that require attention.",
  },
  {
    id: 8,
    category: "Schedule Management",
    title: `How do I create a new holiday?`,
    photoUrl: null,
    divContent: `
    <div>
    <p class="mb-2">To add a new holiday, navigate to the <b>'Holiday Schedules'</b> page and follow these steps:</p>
      <ol class="mx-5">
        <li>Click the <b>'Add new holiday'</b> button.</li>
        <img src="${addNewHoliday}" class="img-w70 shadow mb-3 mt-1" alt="Add new holiday button" />
        <li>Complete the form with the necessary details.</li>
        <img src="${addScheduleForm}" class="img-w70 shadow mb-3 mt-1" alt="Add new holiday schedule form" />
        <li>Click <b>'Add new holiday'</b> to save the holiday to the cloud database, or click <b>'Cancel'</b> to discard changes.</li>
      </ol>
    </div>
    `,
  },
  {
    id: 9,
    category: "Schedule Management",
    title: `How can I manage the schedules?`,
    photoUrl: null,
    divContent: `
    <div>
      <p>As an administrator, you have the following capabilities:</p>
      <div class="mx-3 my-4">
        <ul>
          <strong>Action Items:</strong>
          <li class="mb-1 mx-5">
            <strong>Delete:</strong> Remove a holiday schedule.
          </li>
          <li class="mb-1 mx-5">
            <strong>Edit:</strong> Applicable only to custom holidays; you can update a holiday schedule's name, information, or date.
          </li>
          <li class="mb-1 mx-5">
            <strong>On/Off:</strong> Toggle the button to activate or deactivate the holiday schedule for a specific day. This ensures that the HVAC system operates as usual or remains inactive on that particular day.
          </li>
          <img src="${schedActionItems}" class="mx-5 img-w80 shadow mb-3 mt-1" alt="Schedule action items" />
        </ul>
        <ul>
          <strong>Filter Options:</strong>
          <li class="mb-1 mx-5">
            <strong>Basic Search:</strong> Search by holiday name and source types.
          </li>
          <li class="mb-1 mx-5">
            <strong>Advanced Search:</strong> Click "Advanced Search" to reveal additional filter options, such as date range and jurisdiction dropdown.
          </li>
          <img src="${schedAdvancedFilter}" class="mx-5 img-w80 shadow mb-3 mt-1" alt="Schedule advanced filter" />
        </ul>
        <ul>
          <strong>Holiday Status:</strong>
          <li class="mb-1 mx-5">
            <strong>On:</strong> The holiday is currently active and will run as scheduled.
          </li>
          <li class="mb-1 mx-5">
            <strong>Off:</strong> The holiday is currently inactive and will not run as scheduled.
          </li>
          <li class="mb-1 mx-5">
            <strong>Deleted:</strong> Once a holiday is deleted, data cannot be recovered.
          </li>
        </ul>
      </div>
    </div>
  `,
  },
  {
    id: 10,
    category: "Troubleshooting",
    title: `The MQTT status is red. What should I do?`,
    photoUrl: null,
    divContent:
      "If you observe the MQTT status on the Dashboard blinking red, it indicates a potential error with Node-RED. Please report this promptly to the system administrator. Otherwise, a green MQTT status signifies smooth system operation.",
  },
  {
    id: 11,
    category: "Schedule Management",
    title: `I created a holiday by mistake. Can I delete it?`,
    photoUrl: null,
    divContent: `<div><p>Certainly! You have the option to delete or update a holiday's date. Just click on the corresponding delete icon or edit icon located under the Actions column.</p>
      <img src="${sched1}" class="img-w80 mt-3" alt="Forgot Password" /></div>`,
  },
  {
    id: 12,
    category: "Schedule Management",
    title: `How to filter the schedules?`,
    photoUrl: null,
    divContent: `
      <div class="m-0 text-dark">
        <p>By default, all holiday schedules are presented and sorted by date, showcasing the current year's data first, followed by previous years in ascending order. To customise the sorting, click on the column header(s).</p>
        <p>If you prefer to sort by two or more columns simultaneously, hold down <b>Command</b> (for MAC) or <b>CTRL</b> (for Windows). Additionally, you can apply filters by selecting specific filter options.</p>
        <ul class="ml-4 px-4 mt-4 mb-4">
          <strong>Filter Options:</strong>
          <li class="my-1 mx-5">
            <strong>Basic Search:</strong> Search by holiday name and/or source types.
          </li>
          <li class="mb-1 mx-5">
            <strong>Advanced Search:</strong> Click on "Advanced Search" to access additional filtering options such as date range, jurisdiction dropdown, and status dropdown.
          </li>
        </ul>
        <img src="${filterScheds}" class="mx-5 img-w80 shadow mb-3 mt-1" alt="Schedule Advanced Filter" />
      </div>
    `,
  },
  {
    id: 13,
    category: "Schedule Management",
    title: `How to export schedule records?`,
    photoUrl: null,
    divContent: `<div>
      <p>To export data, click the <b>'Export'</b> button, and a .csv file will be downloaded to your computer, capturing the current contents of the data table. Keep in mind that any applied filters, including sorting or search queries, will also be reflected in the exported file.</p>
      <img src="${exportScheds}" class="img-w80 shadow mt-3 mt-1" alt="Schedule advanced filter" />
      `,
  },
  {
    id: 14,
    category: "User Management",
    title: "How to create a new user account",
    photoUrl: null,
    divContent: `
      <div>
      To add a new holiday, navigate to the <b>'Users'</b> page and follow these steps:
        <ol class="mx-5 mt-2">
          <li>Click on the <b>'Add new user'</b> button.</li>
          <img src="${addNewUser}" class="img-w70 shadow mb-3 mt-1" alt="Add new user button" />
          <li class="mt-1">Enter the user's email, first name, last name, and select the user type (<i>Viewer</i> or <i>Moderator</i>).</li>
          <li class="mt-1">A password is auto-generated; you can copy it or type a custom password.</li>
          <li class="my-1">Click 'Add new user,' and an email will be sent to the user to change their password for security.</li>
          <img src="${userForm}" class="img-w70 shadow mb-3 mt-1" alt="Add new user form" />
        </ol>
        <p><i><b>Note:</b> Only site administrators can create additional administrators.</i></p>
      </div>
    `,
  },
  {
    id: 15,
    category: "Troubleshooting",
    title: `How to export records?`,
    photoUrl: null,
    divContent:
      "To export data, click the <b>'Export'</b> button, and a .csv file will be downloaded to your computer, capturing the current contents of the data table. Keep in mind that any applied filters, including sorting or search queries, will also be reflected in the exported file.",
  },
  {
    id: 16,
    category: "Node-RED Management",
    title: "How to edit current Node-RED Settings?",
    photoUrl: null,
    divContent: `
      <div>
        <p>Editing Node-RED settings is a task restricted to site administrators. If you're a site administrator, follow these steps:</p>
        <ol class="mx-5 mt-1">
          <li>Access the Node-RED settings through the administrator dashboard.</li>
          <li>Locate the configuration section for Node-RED.</li>
          <li>Make the necessary changes to the settings.</li>
          <li>Save the changes to update the Node-RED configuration.</li>
        </ol>
        <p>Please note that only site administrators have the authority to modify Node-RED settings.</p>
      </div>
    `,
  },
  {
    id: 17,
    category: "Profile Management",
    title: `My account is locked due to too many attempts of incorrect password. What should I do?`,
    photoUrl: null,
    divContent:
      "Unfortunately, your account has already been locked. To restore access, kindly reach out to the site administrator.",
  },
  {
    id: 18,
    category: "User Management",
    title: `How can I edit a user's account?`,
    photoUrl: null,
    divContent: `
      <div>
        <p>To modify a user's account, follow these steps:</p>
        <ol class="mx-5 mt-1">
          <li>Go to the <b>'Users'</b> page.</li>
          <li>Find the user you want to edit and click the <b><i class="pi pi-pencil"></i></b> (pencil) icon next to their details.</li>
          <li>Complete the form and click <b>'Update user'</b>. Alternatively, you can choose <b>'Cancel'</b> to discard changes.</li>
          <img src="${updateUserForm}" class="img-w70 shadow my-3" alt="Update user form" />
        </ol>
        <p><b>Note:</b> After a successful update, the user's account will be logged out.</p>
      </div>
    `,
  },
  {
    id: 19,
    category: "User Management",
    title: `How do I change a user's password?`,
    photoUrl: null,
    divContent: `
      <div>
        <p>To update a user's password, follow these steps:</p>
        <ol class="mx-5 mt-1">
          <li>Visit the <b>'Users'</b> page.</li>
          <li>Find the user you want to edit and click the <b><i class="pi pi-pencil"></i></b> (pencil) icon next to their details.</li>
          <li>Complete the form and click <b>'Update user'</b>. Alternatively, you can choose <b>'Cancel'</b> to discard changes.</li>
          <img src="${updateUserForm}" class="img-w70 shadow my-3" alt="Update user form" />
        </ol>
        <p><b>Note:</b> After a successful update, the user's account will be logged out.</p>
      </div>
    `,
  },
  {
    id: 20,
    category: "User Management",
    title: `I accidentally deleted a user's account. Can it be retrieved?`,
    photoUrl: null,
    divContent: "Kindly reach out to your site administrator for assistance.",
  },
  {
    id: 21,
    category: "Profile Management",
    title: `I missed clicking on the password reset link before it expired. What should I do now?`,
    photoUrl: null,
    divContent: `<div>
      <p class="mb-0">If the password reset link has expired, return to the <b>'Forgot Password'</b> page and re-submit your email address. You will receive a new reset link shortly.</p>
      <img src="${forgotPassword}" class="img-w90" alt="Forgot Password" />
      </div>
      `,
  },
  {
    id: 22,
    category: "Profile Management",
    title: `I haven't received the password reset link.`,
    photoUrl: null,
    divContent:
      "If you haven't received the password reset link, please check your spam or junk mail folder. Additionally, make sure to regularly check your email. If the issue persists, kindly reach out to the site administrator for further assistance.",
  },
  {
    id: 23,
    category: "User Management",
    title: "How do filter options work?",
    photoUrl: null,
    divContent: `<div> 
        <p>By default, the user list is sorted by the date when the user was added. To customise the sorting, simply click on the column header(s).</p>
        <p>If you prefer to sort by two or more columns simultaneously, hold down <b>Command</b> (for MAC) or <b>CTRL</b> (for Windows).</p>
        <p>Additionally, you can apply filters by selecting specific filter options. Search by name or email, filter by account status, and sort columns as needed. You can also export the data by clicking on the <b>'Export'</b> button.</p>
        <img src="${filterUsers}" class="img-w80 shadow my-4" alt="Filter Users" />
      </div>
    `,
  },
  {
    id: 24,
    category: "Getting Started",
    title: "What file types are supported for exporting data?",
    photoUrl: null,
    divContent:
      "Currently, data export is only available in .csv format, providing flexibility for editing and formatting according to your preferences.",
  },
  {
    id: 25,
    category: "Getting Started",
    title: "Viewing the dashboard",
    photoUrl: null,
    divContent: `
      <div>
        <p class="mb-2">Explore the dashboard for a comprehensive overview of upcoming holidays. It features:</p>
        <ol class="mx-5 mb-3">
          <li>A countdown to the nearest holiday.</li>
          <li>A calendar displaying official and custom holidays.</li>
          <li>Statistics on system usage and the number of holidays per jurisdiction throughout the year.</li>
          <li>Status of MQTT and Node-RED, indicating if they are running smoothly.</li>
        </ol>
        <img src="${dashboard}" class="shadow mb-5 mx-4 img-fluid img-w60" alt="Dashboard Screenshot" />
      </div>
    `,
  },
  {
    id: 26,
    category: "Node-RED Management",
    title: "What does the 'Sync MongoDB' button do?",
    photoUrl: null,
    divContent: `
      <div>
        <p>The <b>'Sync MongoDB'</b> button serves the purpose of synchronising data from the <i>Australia Government API</i> to <i>MongoDB Atlas</i>. This action involves importing data from the API and updating the MongoDB Atlas, ensuring that the web application's data is current.</p>
        <p class="mt-3"><b>Note:</b> Clicking this button initiates a critical process, and as a security measure, a password is required. It's important to note that only administrators with access to Node-RED Settings can perform this synchronisation for both the cloud and local databases.</p>
      </div>
    `,
  },
  {
    id: 27,
    category: "Node-RED Management",
    title: "What does the 'Sync MySQL' button do?",
    photoUrl: null,
    divContent: `
      <div>
        <p>The <b>'Sync MySQL'</b> button facilitates the synchronisation of data between the <i>MongoDB Atlas</i> (cloud database) and <i>MySQL</i> (local database). This involves pulling records from the cloud to the local database, ensuring that local edge devices have the most recent information.</p>
        <p class="mt-3"><b>Note:</b> Clicking this button initiates a critical process, and as a security measure, a password is required. It's important to note that only administrators with access to Node-RED Settings can perform this synchronisation for both the cloud and local databases.</p>
      </div>
    `,
  },
  {
    id: 28,
    category: "User Management",
    title: "How to deactivate or activate a user's account?",
    photoUrl: null,
    divContent: `
      <div>
        <p>To deactivate or activate a user's account, follow these steps:</p>
        <ol class="mx-5 mt-1">
          <li>Visit the <b>'Users'</b> page.</li>
          <li>Identify the account you wish to deactivate/activate and click the <b><i class="pi pi-eye"></i></b> (eye) icon next to their details.</li>
          <img src="${activateUser}" class="img-w90 shadow my-3" alt="Activate/Deactivate User" />
        </ol>
        <p><b>Note:</b> Deactivating a user's account restricts their access to the web application.</p>
      </div>
    `,
  },
  {
    id: 29,
    category: "Troubleshooting",
    title: "How can I reactivate a deleted user account?",
    photoUrl: null,
    divContent: `
      <div>
        <p>To reactive a deleted user's account, follow these steps:</p>
        <ol class="mx-5 mt-1">
          <li>Visit the <b>'Users'</b> page.</li>
          <li>Identify the account you wish to reactivate and click the <b><i class="pi pi-ban"></i></b> (ban) icon next to their details.</li>
          <img src="${reactivateUser}" class="img-w90 shadow my-3" alt="Activate/Deactivate User" />
        </ol>
        <p><b>Note:</b> Only site administrators can see and reactivate deleted user accounts.</p>
      </div>
    `,
  },
  {
    id: 30,
    category: "Schedule Management",
    title: "Can I add multiple holidays on a single day?",
    photoUrl: null,
    divContent: `
      <div>
        <p>No, the system allows only one holiday per day. While you can assign the same holiday to multiple jurisdictions, multiple distinct holidays on the same day are not supported.</p>
      </div>
    `,
  },
];

export default faq;
