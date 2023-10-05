
//Get the window dimensions
var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//Redirect to mobile layout page if The aspect ratio is that of a mobile
if (height / width < 1 ) {
    //set the value of the link
    document.getElementsByTagName("link")[0].setAttribute("href", "../css/rhoda.css");
}

// Import the functions you need from the SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getStorage, getBytes, uploadBytes, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDigytCZDi5m8-GwuRobJcxii6LB9yiKWA",
    authDomain: "mito-fashion-335d6.firebaseapp.com",
    projectId: "mito-fashion-335d6",
    storageBucket: "mito-fashion-335d6.appspot.com",
    messagingSenderId: "23529473919",
    appId: "1:23529473919:web:b20152e19a6b370a7fbc4a",
    measurementId: "G-R1K2S5194D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

//animation
var instance;

function showProgressDialog(text) {
	var state = 0;
	
	var stateOneText = "<b class=\"animTextWhite\">"+ text + "   </b> <b class=\"animationText\">&gt;</b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animTextWhite\">&gt;</b>";
	var stateTwoText = "<b class=\"animTextWhite\">"+ text + "   </b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animationText\">&gt;</b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animTextWhite\">&gt;</b>";
	var stateThreeText = "<b class=\"animTextWhite\">"+ text + "   </b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animationText\">&gt;</b> <b class=\"animTextWhite\">&gt;</b>";
	var stateFourText = "<b class=\"animTextWhite\">"+ text + "   </b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animationText\">&gt;</b>";
	
	var animationDiv = document.getElementById("animationDiv");
	//set the text
	animationDiv.children[0].children[0].innerText = text;
	animationDiv.style.display = "table";

	instance = window.setInterval(() => {
		if(state === 0) {
			//display state zeero anim
			animationDiv.children[0].innerHTML = stateOneText;
			state += 1;
		} else if(state === 1) {
			//display state one text
			animationDiv.children[0].innerHTML = stateTwoText;
			state += 1;
		} else if(state === 2) {
			//displae stste 2 text
			animationDiv.children[0].innerHTML = stateThreeText;
			state += 1;
		} else if(state === 3) {
			//display state three text
			animationDiv.children[0].innerHTML = stateFourText;
			state = 0;
		}
	}, 200);
}

function hideProgressDialog() {
	if(instance) {
		window.clearInterval(instance);
		var animationDiv = document.getElementById("animationDiv");
		animationDiv.style.display = "none";
	}
}

//get the references to the views
var profilePic = document.getElementById("profilePic");
var selectImage = document.getElementById("selectImage");
var usernameInput = document.getElementById("username");
var phoneNumberInput = document.getElementById("phoneNumber");
var emailAddressInput = document.getElementById("emailAddress");
var editOrSaveButton = document.getElementById("edit-save-button");

var logoutButton = document.getElementById("logout");

//for holding the state of the edit/save button
var isSaveModeOn = false;
//value to show if upload is in progress
var isUploading = false;

//get the uid
var uid = getCookie("uid");
//get the current info of the user
//get the email, name and number from cookie
var username = getCookie("username");
var phoneNumber = getCookie("phoneNumber");
var emailAddress = getCookie("emailAddress");
//Now set these values
usernameInput.value = username;
phoneNumberInput.value = phoneNumber;
emailAddressInput.value = emailAddress;
//set the isdownloading just to allow for image download
isUploading = true;
//get the profle pic file type
getBytes(ref(storage, "users/" + uid + "/imageFileType"), 10).then(
    bytes => {
        let imageFileType = makeStringFromByteArray(bytes);
        console.log("Downloaded imageFileType: " + imageFileType);
        //now get the image url
        getDownloadURL(ref(storage, "users/" + uid + "/image." + imageFileType)).then(
            url => {
                profilePic.setAttribute("src", url);
                isUploading = false;
            }
        )
    }
)

logoutButton.onclick = () => {
    if (!isUploading) {
        //remove all user data
        //Now set the coookies
        setCookie("uid", "", 90);
        setCookie("emailAddress", "", 90);
        setCookie("phoneNumber", "", 90);
        setCookie("username", "", 90);
        setCookie("rank", "", 90);
        setCookie("orders", "", 90);
        setCookie("ordersCount", "", 90);
        //go back to home page
        window.location.href = "../index.html";
    }
}
//make visible
logoutButton.style.display = "table";

editOrSaveButton.onclick = () => {
    //dont do anything if upload is in progress
    if (!isUploading) {
        if (!isSaveModeOn) {
            //turn on save mode
            isSaveModeOn = true;
            //give pointer to the profile pic
            profilePic.style.cursor = "pointer";
            //set the onclick listener for the pic
            profilePic.onclick = () => {
                //click the file selector
                selectImage.click();
                selectImage.onchange = () => {
                    //set the src attribute of the profile image
                    profilePic.setAttribute("src", URL.createObjectURL(selectImage.files[0]));
                    console.log("Selected file...");
                    console.log(selectImage.files[0]);
                }
            }
            //make inputs editable
            usernameInput.readOnly = false;
            phoneNumberInput.readOnly = false;
            emailAddressInput.readOnly = false;
            //Now set the value of the button
            editOrSaveButton.value = "SAVE";
        } else {
            //ensure the values are provided
            if (!(usernameInput.value && phoneNumberInput.value && emailAddressInput.value)) {
                alert("Sorry, all fields are required!");
                return;
            }
            //Take pointer from profile pic
            profilePic.style.cursor = "default";
            //remove the click event handler
            profilePic.onclick = null;
            //turn off save mode
            isSaveModeOn = false;
            //make inputs readonly once more
            usernameInput.readOnly = true;
            phoneNumberInput.readOnly = true;
            emailAddressInput.readOnly = true;
            //set the value of the edit or save button
            editOrSaveButton.value = "EDIT";
            //Upload values to db
            console.log("Values to upload to db");
            console.log("username: " + usernameInput.value);
            console.log("phoneNumber: " + phoneNumberInput.value);
            console.log("emailAddress: " + emailAddressInput.value);
            //Upload synchronously while setting the isUploading value
            console.log("Upload initiated...");
            isUploading = true;
            //profilePic if available
            //Check if image is selested
            if (selectImage.files[0]) {
                console.log("Image selested...");
                console.log(selectImage.files[0]);
                console.log("Uploading...");
                //get the image file type
                var imageFileToUpload = selectImage.files[0];
                var imageFileType = imageFileToUpload.name.substring(imageFileToUpload.name.lastIndexOf(".") + 1);
                console.log("ImageFileType: " + imageFileType);
                //upload file type
                uploadString(ref(storage, "users/" + uid + "/imageFileType"), imageFileType).then(
                    snapshot => {
                        console.log("file type uploaded...");

                        const metadata = {
                            contentType: "image/" + imageFileType
                        };

                        //upload the image
                        uploadBytes(ref(storage, "users/" + uid + "/image." + imageFileType), imageFileToUpload, metadata).then(
                            snapshot1 => {
                                console.log("Image uploaded!");
                                //username
                                uploadString(ref(storage, "users/" + uid + "/username"), usernameInput.value).then(
                                    snapshot2 => {
                                        console.log("Username uploaded!");
                                        //phone number
                                        uploadString(ref(storage, "users/" + uid + "/phoneNumber"), phoneNumberInput.value).then(
                                            snapshot3 => {
                                                console.log("phoneNumber uploaded!");
                                                //email Address
                                                uploadString(ref(storage, "users/" + uid + "/emailAddress"), emailAddressInput.value).then(
                                                    snapshot4 => {
                                                        console.log("Email address uploaded successfully!");
                                                        console.log("Upload complete!");
                                                        isUploading = false;
                                                        //set the cookie values of the information
                                                        setCookie("username", usernameInput.value, 90);
                                                        setCookie("phoneNumber", phoneNumberInput.value, 90);
                                                        setCookie("emailAddress", emailAddressInput.value, 90);
                                                    }
                                                )
                                            }
                                        )
                                    }
                                )
                            }
                        )
                    }
                )
            } else {
                console.log("No image selected...");
            }
            //username
            uploadString(ref(storage, "users/" + uid + "/username"), usernameInput.value).then(
                snapshot2 => {
                    console.log("Username uploaded!");
                    //phone number
                    uploadString(ref(storage, "users/" + uid + "/phoneNumber"), phoneNumberInput.value).then(
                        snapshot3 => {
                            console.log("phoneNumber uploaded!");
                            //email Address
                            uploadString(ref(storage, "users/" + uid + "/emailAddress"), emailAddressInput.value).then(
                                snapshot4 => {
                                    console.log("Email address uploaded successfully!");
                                    console.log("Upload complete!");
                                    isUploading = false;
                                    //set the cookie values of the information
                                    setCookie("username", usernameInput.value, 90);
                                    setCookie("phoneNumber", phoneNumberInput.value, 90);
                                    setCookie("emailAddress", emailAddressInput.value, 90);
                                }
                            )
                        }
                    )
                }
            )
        }
    }
}

function makeStringFromByteArray(arrayBuffer) {
    var array = new Uint8Array(arrayBuffer);
    //textencode
    var decoder = new TextDecoder();
    return decoder.decode(array);
}