
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
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
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
			.then(() => {
				console.log("Account created succssfully!");
				const user = auth.currentUser;
				//Now write user data to the storage database
				//rank, username, phoneNumber, emailAddress, orders
				//Only errors are handled in string uploads so as to save time
				var rank = "regularUser";
				const userStorageRef = ref(storage, "users/" + user.uid);

				//download the default profile pic
				getBytes(ref(storage, "default_profile_picture.png"), 9000/*the default profile pic size is 8.37kb*/).then(
					bytes => {
						//upload the image file type
						uploadString(ref(userStorageRef, "imageFileType"), "png").then(
							snapshot => {
								console.log("image file type written successfully!");
								//upload the profile picture
								const metadata = {
									contentType: "image/png"
								};

								uploadBytes(ref(userStorageRef, "image.png"), new Uint8Array(bytes), metadata).then(
									snapshot1 => {
										console.log("image uploaded successfully!");
										//rank
										uploadString(ref(storage, "users/" + user.uid + "/rank"), rank).then(
											(snapshot) => {
												console.log("Rank written successfully!");

												//username
												uploadString(ref(storage, "users/" + user.uid + "/username"), username).then(
													(snapshot) => {
														console.log("username written successfully!");

														//phoneNumber
														uploadString(ref(storage, "users/" + user.uid + "/phoneNumber"), phoneNumber.toString()).then(
															(snapshot) => {
																console.log("phoneNumber written successfully!");

																//orders
																uploadString(ref(storage, "users/" + user.uid + "/orders/no_orders"), "no_orders").then(
																	(snapshot) => {
																		console.log("no_orders written successfully!");

																		//emailAddress
																		uploadString(ref(storage, "users/" + user.uid + "/emailAddress"), emailAddress).then(
																			(snapshot) => {
																				console.log("emailAddress written successfully!");

																				//set the cookies for username, emailAddress and phoneNumber
																				setCookie("uid", user.uid, 90);
																				setCookie("username", username, 90);
																				setCookie("phoneNumber", phoneNumber, 90);
																				setCookie("emailAddress", emailAddress, 90);
																				setCookie("rank", rank, 90);
																				//relocate to the home page
																				window.location.href = "../index.html";
																			});
																	});
															});

													});

											});
									}
								)
							}
						)
					}
				)
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