
//Get the window dimensions
var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//Redirect to mobile layout page if The aspect ratio is that of a mobile
if (height / width < 1) {
	//set the value of the link
	document.getElementsByTagName("link")[0].setAttribute("href", "../css/rhoda.css");
}

// Import the functions you need from the SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getStorage, ref, uploadString, getDownloadURL, getBytes, uploadBytes } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

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

	var stateOneText = "<b class=\"animTextWhite\">" + text + "   </b> <b class=\"animationText\">&gt;</b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animTextWhite\">&gt;</b>";
	var stateTwoText = "<b class=\"animTextWhite\">" + text + "   </b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animationText\">&gt;</b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animTextWhite\">&gt;</b>";
	var stateThreeText = "<b class=\"animTextWhite\">" + text + "   </b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animationText\">&gt;</b> <b class=\"animTextWhite\">&gt;</b>";
	var stateFourText = "<b class=\"animTextWhite\">" + text + "   </b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animTextWhite\">&gt;</b> <b class=\"animationText\">&gt;</b>";

	var animationDiv = document.getElementById("animationDiv");
	//set the text
	animationDiv.children[0].children[0].innerText = text;
	animationDiv.style.display = "table";

	instance = window.setInterval(() => {
		if (state === 0) {
			//display state zeero anim
			animationDiv.children[0].innerHTML = stateOneText;
			state += 1;
		} else if (state === 1) {
			//display state one text
			animationDiv.children[0].innerHTML = stateTwoText;
			state += 1;
		} else if (state === 2) {
			//displae stste 2 text
			animationDiv.children[0].innerHTML = stateThreeText;
			state += 1;
		} else if (state === 3) {
			//display state three text
			animationDiv.children[0].innerHTML = stateFourText;
			state = 0;
		}
	}, 200);
}

function hideProgressDialog() {
	if (instance) {
		window.clearInterval(instance);
		var animationDiv = document.getElementById("animationDiv");
		animationDiv.style.display = "none";
	}
}

//references to the views
var usernameInput = document.getElementById("usernameInput");
var emailAddressInput = document.getElementById("emailAddress");
var phoneNumberInput = document.getElementById("phoneNumber");
var passwordInput = document.getElementById("password");
var createAccountButton = document.getElementById("createAccountButton");

createAccountButton.onclick = () => {
	//Here we create the account
	//get the details
	var username = usernameInput.value;
	var emailAddress = emailAddressInput.value;
	var phoneNumber = phoneNumberInput.value;
	var password = passwordInput.value;

	if (validateAccountCreationDetails(username, emailAddress, phoneNumber, password)) {
		//Details are valid, create the user in the database
		showProgressDialog("Signing you up...");
		createUserWithEmailAndPassword(auth, emailAddress, password)
			.then((userCredentials) => {

				/*
				SEND AN EMAIL VERIFICATION EMAIL TO THE USER
				FROM WHICH INITIAL SIGN IN OCCURS
				*/

				//set the cookie for account creation details
				setCookie("isCreatingAccount", "true");
				setCookie("accountCreationUsername", username);
				setCookie("accountCreationEmail", emailAddress);
				setCookie("accountCreationPhoneNumber", phoneNumber);
				setCookie("accountCreationUid", auth.currentUser.uid);
				setCookie("accountCreationPassword", password);

				//send the emailAddressVerification email
				const actionCodeSettings = {
					url: "https://mitofashion.github.io",
					handleCodeInApp: true,
				};

				sendEmailVerification(userCredentials.user)
					.then(() => {
						hideProgressDialog();
						alert("Please check your email inbox for the verification email😊");
						console.log("Verification email sent!");
						window.location.href = "../index.html";
					})

					.catch(error => {
						hideProgressDialog();
						console.log("Error when sending verification email!");
						console.log(error);
						/*
						alert("Sorry, daily email limit exceeded!😭");
						//relocate to the index page
						window.location.href = "../index.html";
						console.log("Error during verification email sending...");
						console.log("error.code: " + error.code);
						console.log("error.message" + error.message);*/
					})
				console.log("Account created succssfully!");
			})
			.catch((error) => {
				hideProgressDialog();
				alert("A problem ocurred during account creation");
				console.log("A problem ocurred during account creation!");
				console.log("ERROR_CODE: " + error.code);
				console.log("ERROR_MESSSAGE: " + error.message);
			});
	}
}

function validateAccountCreationDetails(username, emailAddress, phoneNumber, password) {
	/*expression = /^[^@]+@\w+(\.\w+)+\w+w$/*/
	//This expression did not work as expected... I really need to read regex
	if (username.length === 0 || emailAddress.length === 0 || phoneNumber.length === 0 || password.length === 0) {
		alert("Sorry, all fields are required!");
		return false;
	} else if (password.length < 6) {
		alert("Sorry, password must be at least six characters!");
		return false;
	} else if (emailAddress.indexOf("@") < 0 || emailAddress.indexOf(".") < 0) {
		alert("Please enter a valid emailAddress");
		return false;
	}
	return true;
}