// Import the functions you need from the SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getStorage, ref, listAll, uploadString, getDownloadURL, getBytes, uploadBytes } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

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
console.log("Attempting to list orders");//all orders to be loaded after handling the order functionality from the client 
listAll(ref(storage, "orders")).then(
    response => {
        
        console.log(">>>All orders dwnloaded<<<")
        console.log(response.prefixes)
    }
)

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

setTimeout(() => {
	showProgressDialog("anville is awesome as fuck");

	setTimeout(() => {
		hideProgressDialog();
	}, 3000)
}, 1000)