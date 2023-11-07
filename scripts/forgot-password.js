
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
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

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

var emailAddressInput = document.getElementById("emailAddress");
var submitEmailButton = document.getElementById("submitEmailButton");

submitEmailButton.onclick = () => {
    if (emailAddressInput.value) {
        var emailAddress = emailAddressInput.value;
        //send the signing email

        const actionCodeSettings = {
            url: "https://mitofashion.github.io/html/login.html",
            handleCodeInApp: true
        };

        sendPasswordResetEmail(auth, emailAddress, actionCodeSettings)
            .then(() => {
                hideProgressDialog();
                alert("Please check your email inbox for reset link😊");
                alert("The email might be in your spam folder")
                //relocate to the index page
                console.log("Login email sent!");
            })

            .catch(error => {
                hideProgressDialog();
                alert("Sorry, maximum daily email limit exceeded!😭");
                console.log("Error during login link email sending...");
                console.log("error.code: " + error.code);
                console.log("error.message" + error.message);
				console.log("error...");
				console.log(error);
            })
    } else {
		alert("Email address is required😭");
	}
}