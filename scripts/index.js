
//Get the window dimensions
var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//Redirect to mobile layout page if The aspect ratio is that of a mobile
if (height / width < 1 ) {
    //set the value of the link
    document.getElementsByTagName("link")[0].setAttribute("href", "css/rhoda.css");
}

if(getCookie("uid") === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
    window.location.href = "html/admin.html";
}

// Import the functions you need from the SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getStorage, ref, getBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

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

var signUpButton = document.getElementById("signUp");
var loginButton = document.getElementById("login");

//check if user is logged in
if (getCookie("emailAddress") && getCookie("uid")) {
    //if yes, hide the login and signup button
    loginButton.style.display = "none";
    signUpButton.style.display = "none";
    //set the values of the profile info div
    var profileInfoContainer = document.getElementById("profileInfoContainer");
    //set the username
    var username = getCookie("username");
    //set the username
    profileInfoContainer.children[1].innerText = username;
    //make it visible
    profileInfoContainer.style.display = "inline-table";
    
    var uid = getCookie("uid");
    //get the image type
    getBytes(ref(storage, "users/" + uid + "/imageFileType")).then(
        bytes => {
            var imageFileType = makeStringFromByteArray(bytes);
            //Now get the image download url
            getDownloadURL(ref(storage, "users/" + uid + "/image." + imageFileType)).then(
                url => {
                    //set the src of the profile container
                    profileInfoContainer.children[0].setAttribute("src", url);
                    //set the onclick listener for the profiles info div, it should lead to the profile page
                    profileInfoContainer.onclick = () => {
                        window.location.href = "html/profile.html";
                    }
                }
            )
        }
    )
} else {
    //Set their onclick values otherwise
    signUpButton.onclick = () => {
        window.location.href = "html/sign-up.html";
    }

    loginButton.onclick = () => {
        window.location.href = "html/login.html";
    }
}

var shoesButton = document.getElementById("shoes");
var dressesButton = document.getElementById("dresses");
var broochButton = document.getElementById("brooch");

shoesButton.onclick = () => {
    window.location.href = "html/shoes.html";
}

dressesButton.onclick = () => {
    window.location.href = "html/dresses.html";
}

broochButton.onclick = () => {
    window.location.href = "html/brooch.html";
}

function makeStringFromByteArray(arrayBuffer) {
    var array = new Uint8Array(arrayBuffer);
    //textencode
    var decoder = new TextDecoder();
    return decoder.decode(array);
}

//click listener for cart container image
var cartContainer = document.getElementById("cartContainer");
cartContainer.onclick = () => {
    window.location.href = "html/cart.html";
}