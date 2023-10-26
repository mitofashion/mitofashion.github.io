
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
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getStorage, getBytes, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

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

//references to views
var emailAddressInput = document.getElementById("emailAddress");
var passwordInput = document.getElementById("password");
var loginButton = document.getElementById("loginAccountButton");

loginButton.onclick = () => {
    //login the user
    var emailAddress = emailAddressInput.value
    var password = passwordInput.value;

    if (!emailAddress || !password) {
        alert("All fields required please!");
        return;
    }

    showProgressDialog("Logging you in...");

    signInWithEmailAndPassword(auth, emailAddress, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("user...");
            console.log(user);
            //get user data from the storage database
            var rank, username, phoneNumber, emailAddress;
            //rank
            getBytes(ref(storage, "users/" + user.uid + "/rank"), 100)
                .then((bytes) => {
                    console.log("rank retrieved successfully...");
                    rank = makeStringFromByteArray(bytes);

                    //username
                    getBytes(ref(storage, "users/" + user.uid + "/username"), 100)
                        .then((bytes) => {
                            console.log("username retrieved successfully...");
                            username = makeStringFromByteArray(bytes);

                            //phoneNumber
                            getBytes(ref(storage, "users/" + user.uid + "/phoneNumber"), 100)
                                .then((bytes) => {
                                    console.log("phoneNumber retrieved successfully...");
                                    phoneNumber = makeStringFromByteArray(bytes);

                                    //emailAddress
                                    getBytes(ref(storage, "users/" + user.uid + "/emailAddress"), 100)
                                        .then((bytes) => {
                                            hideProgressDialog();
                                            console.log("emailAddress retrieved successfully...");
                                            emailAddress = makeStringFromByteArray(bytes);
                                            //everything has been retrieved
                                            console.log("Everything is here...");
                                            console.log("emailAddress:" + emailAddress);
                                            console.log("phoneNumber: " + phoneNumber);
                                            console.log("username: " + username);
                                            console.log("rank: " + rank);

                                            //Now set the coookies
                                            setCookie("uid", user.uid, 90);
                                            setCookie("emailAddress", emailAddress, 90);
                                            setCookie("phoneNumber", phoneNumber, 90);
                                            setCookie("username", username, 90);
                                            setCookie("rank", rank, 90);
                                            setCookie("password", password, 90);

                                            if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                window.location.href = "admin.html";
                                                return;
                                            }

                                            //relocate to the home page now
                                            window.location.href = "../index.html";
                                        })
                                        .catch(error => {
                                            console.log("emailAddress missing!");
                                            console.log(error);
                                            if (error.status === 0) {
                                                alert("Sorry, you will have to edit your email address!😭");
                                                var emailAddress = "no email address";
                                                console.log("Everything is here...");
                                                console.log("emailAddress:" + emailAddress);
                                                console.log("phoneNumber: " + phoneNumber);
                                                console.log("username: " + username);
                                                console.log("rank: " + rank);

                                                //Now set the coookies
                                                setCookie("uid", user.uid, 90);
                                                setCookie("emailAddress", emailAddress, 90);
                                                setCookie("phoneNumber", phoneNumber, 90);
                                                setCookie("username", username, 90);
                                                setCookie("rank", rank, 90);

                                                if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                    window.location.href = "admin.html";
                                                    return;
                                                }

                                                //relocate to the home page now
                                                window.location.href = "../index.html";
                                            }
                                        });
                                })
                                .catch(error => {
                                    console.log("Error occurred during phoneNumber retrieval...");
                                    console.log(error);
                                    if (error.status === 0) {
                                        alert("Sorry, you will have to edit your phone number!😭");
                                        var phoneNumber = "no phone number";
                                        //emailAddress
                                        getBytes(ref(storage, "users/" + user.uid + "/emailAddress"), 100)
                                            .then((bytes) => {
                                                hideProgressDialog();
                                                console.log("emailAddress retrieved successfully...");
                                                emailAddress = makeStringFromByteArray(bytes);
                                                //everything has been retrieved
                                                console.log("Everything is here...");
                                                console.log("emailAddress:" + emailAddress);
                                                console.log("phoneNumber: " + phoneNumber);
                                                console.log("username: " + username);
                                                console.log("rank: " + rank);

                                                //Now set the coookies
                                                setCookie("uid", user.uid, 90);
                                                setCookie("emailAddress", emailAddress, 90);
                                                setCookie("phoneNumber", phoneNumber, 90);
                                                setCookie("username", username, 90);
                                                setCookie("rank", rank, 90);

                                                if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                    window.location.href = "admin.html";
                                                    return;
                                                }

                                                //relocate to the home page now
                                                window.location.href = "../index.html";
                                            })
                                            .catch(error => {
                                                console.log("emailAddress missing!");
                                                console.log(error);
                                                if (error.status === 0) {
                                                    alert("Sorry, you will have to edit your email address!😭");
                                                    var emailAddress = "no email address";
                                                    console.log("Everything is here...");
                                                    console.log("emailAddress:" + emailAddress);
                                                    console.log("phoneNumber: " + phoneNumber);
                                                    console.log("username: " + username);
                                                    console.log("rank: " + rank);

                                                    //Now set the coookies
                                                    setCookie("uid", user.uid, 90);
                                                    setCookie("emailAddress", emailAddress, 90);
                                                    setCookie("phoneNumber", phoneNumber, 90);
                                                    setCookie("username", username, 90);
                                                    setCookie("rank", rank, 90);

                                                    if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                        window.location.href = "admin.html";
                                                        return;
                                                    }

                                                    //relocate to the home page now
                                                    window.location.href = "../index.html";
                                                }
                                            });
                                    }
                                });
                        })
                        .catch(error => {
                            console.log("Error occurred during username retrieval...");
                            console.log(error);
                            if (error.status === 0) {
                                alert("Sorry, you will have to edit your username!😭");
                                var username = "no username";
                                //phoneNumber
                                getBytes(ref(storage, "users/" + user.uid + "/phoneNumber"), 100)
                                    .then((bytes) => {
                                        console.log("phoneNumber retrieved successfully...");
                                        phoneNumber = makeStringFromByteArray(bytes);

                                        //emailAddress
                                        getBytes(ref(storage, "users/" + user.uid + "/emailAddress"), 100)
                                            .then((bytes) => {
                                                hideProgressDialog();
                                                console.log("emailAddress retrieved successfully...");
                                                emailAddress = makeStringFromByteArray(bytes);
                                                //everything has been retrieved
                                                console.log("Everything is here...");
                                                console.log("emailAddress:" + emailAddress);
                                                console.log("phoneNumber: " + phoneNumber);
                                                console.log("username: " + username);
                                                console.log("rank: " + rank);

                                                //Now set the coookies
                                                setCookie("uid", user.uid, 90);
                                                setCookie("emailAddress", emailAddress, 90);
                                                setCookie("phoneNumber", phoneNumber, 90);
                                                setCookie("username", username, 90);
                                                setCookie("rank", rank, 90);

                                                if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                    window.location.href = "admin.html";
                                                    return;
                                                }

                                                //relocate to the home page now
                                                window.location.href = "../index.html";
                                            })
                                            .catch(error => {
                                                console.log("emailAddress missing!");
                                                console.log(error);
                                                if (error.status === 0) {
                                                    alert("Sorry, you will have to edit your email address!😭");
                                                    var emailAddress = "no email address";
                                                    console.log("Everything is here...");
                                                    console.log("emailAddress:" + emailAddress);
                                                    console.log("phoneNumber: " + phoneNumber);
                                                    console.log("username: " + username);
                                                    console.log("rank: " + rank);

                                                    //Now set the coookies
                                                    setCookie("uid", user.uid, 90);
                                                    setCookie("emailAddress", emailAddress, 90);
                                                    setCookie("phoneNumber", phoneNumber, 90);
                                                    setCookie("username", username, 90);
                                                    setCookie("rank", rank, 90);

                                                    if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                        window.location.href = "admin.html";
                                                        return;
                                                    }

                                                    //relocate to the home page now
                                                    window.location.href = "../index.html";
                                                }
                                            });
                                    })
                                    .catch(error => {
                                        console.log("Error occurred during phoneNumber retrieval...");
                                        console.log(error);
                                        if (error.status === 0) {
                                            alert("Sorry, you will have to edit your phone number!😭");
                                            var phoneNumber = "no phone number";
                                            //emailAddress
                                            getBytes(ref(storage, "users/" + user.uid + "/emailAddress"), 100)
                                                .then((bytes) => {
                                                    hideProgressDialog();
                                                    console.log("emailAddress retrieved successfully...");
                                                    emailAddress = makeStringFromByteArray(bytes);
                                                    //everything has been retrieved
                                                    console.log("Everything is here...");
                                                    console.log("emailAddress:" + emailAddress);
                                                    console.log("phoneNumber: " + phoneNumber);
                                                    console.log("username: " + username);
                                                    console.log("rank: " + rank);

                                                    //Now set the coookies
                                                    setCookie("uid", user.uid, 90);
                                                    setCookie("emailAddress", emailAddress, 90);
                                                    setCookie("phoneNumber", phoneNumber, 90);
                                                    setCookie("username", username, 90);
                                                    setCookie("rank", rank, 90);

                                                    if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                        window.location.href = "admin.html";
                                                        return;
                                                    }

                                                    //relocate to the home page now
                                                    window.location.href = "../index.html";
                                                })
                                                .catch(error => {
                                                    console.log("emailAddress missing!");
                                                    console.log(error);
                                                    if (error.status === 0) {
                                                        alert("Sorry, you will have to edit your email address!😭");
                                                        var emailAddress = "no email address";
                                                        console.log("Everything is here...");
                                                        console.log("emailAddress:" + emailAddress);
                                                        console.log("phoneNumber: " + phoneNumber);
                                                        console.log("username: " + username);
                                                        console.log("rank: " + rank);

                                                        //Now set the coookies
                                                        setCookie("uid", user.uid, 90);
                                                        setCookie("emailAddress", emailAddress, 90);
                                                        setCookie("phoneNumber", phoneNumber, 90);
                                                        setCookie("username", username, 90);
                                                        setCookie("rank", rank, 90);

                                                        if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                            window.location.href = "admin.html";
                                                            return;
                                                        }

                                                        //relocate to the home page now
                                                        window.location.href = "../index.html";
                                                    }
                                                });
                                        }
                                    });
                            }
                        });
                })
                .catch(error => {
                    console.log("Error occurred during rank retrieval...");
                    console.log(error);
                    //write the rank in this case
                    uploadString(ref(storage, "users/" + user.uid + "/rank"), "regularUser").then(
                        snapshot => {
                            //PROCEED WITH ACCOUNT DATA RETRIEVAL
                            //username
                            getBytes(ref(storage, "users/" + user.uid + "/username"), 100)
                                .then((bytes) => {
                                    console.log("username retrieved successfully...");
                                    username = makeStringFromByteArray(bytes);

                                    //phoneNumber
                                    getBytes(ref(storage, "users/" + user.uid + "/phoneNumber"), 100)
                                        .then((bytes) => {
                                            console.log("phoneNumber retrieved successfully...");
                                            phoneNumber = makeStringFromByteArray(bytes);

                                            //emailAddress
                                            getBytes(ref(storage, "users/" + user.uid + "/emailAddress"), 100)
                                                .then((bytes) => {
                                                    hideProgressDialog();
                                                    console.log("emailAddress retrieved successfully...");
                                                    emailAddress = makeStringFromByteArray(bytes);
                                                    //everything has been retrieved
                                                    console.log("Everything is here...");
                                                    console.log("emailAddress:" + emailAddress);
                                                    console.log("phoneNumber: " + phoneNumber);
                                                    console.log("username: " + username);
                                                    console.log("rank: " + rank);

                                                    //Now set the coookies
                                                    setCookie("uid", user.uid, 90);
                                                    setCookie("emailAddress", emailAddress, 90);
                                                    setCookie("phoneNumber", phoneNumber, 90);
                                                    setCookie("username", username, 90);
                                                    setCookie("rank", rank, 90);

                                                    if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                        window.location.href = "admin.html";
                                                        return;
                                                    }

                                                    //relocate to the home page now
                                                    window.location.href = "../index.html";
                                                })
                                                .catch(error => {
                                                    console.log("emailAddress missing!");
                                                    console.log(error);
                                                    if (error.status === 0) {
                                                        alert("Sorry, you will have to edit your email address!😭");
                                                        var emailAddress = "no email address";
                                                        console.log("Everything is here...");
                                                        console.log("emailAddress:" + emailAddress);
                                                        console.log("phoneNumber: " + phoneNumber);
                                                        console.log("username: " + username);
                                                        console.log("rank: " + rank);

                                                        //Now set the coookies
                                                        setCookie("uid", user.uid, 90);
                                                        setCookie("emailAddress", emailAddress, 90);
                                                        setCookie("phoneNumber", phoneNumber, 90);
                                                        setCookie("username", username, 90);
                                                        setCookie("rank", rank, 90);

                                                        if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                            window.location.href = "admin.html";
                                                            return;
                                                        }

                                                        //relocate to the home page now
                                                        window.location.href = "../index.html";
                                                    }
                                                });
                                        })
                                        .catch(error => {
                                            console.log("Error occurred during phoneNumber retrieval...");
                                            console.log(error);
                                            if (error.status === 0) {
                                                alert("Sorry, you will have to edit your phone number!😭");
                                                var phoneNumber = "no phone number";
                                                //emailAddress
                                                getBytes(ref(storage, "users/" + user.uid + "/emailAddress"), 100)
                                                    .then((bytes) => {
                                                        hideProgressDialog();
                                                        console.log("emailAddress retrieved successfully...");
                                                        emailAddress = makeStringFromByteArray(bytes);
                                                        //everything has been retrieved
                                                        console.log("Everything is here...");
                                                        console.log("emailAddress:" + emailAddress);
                                                        console.log("phoneNumber: " + phoneNumber);
                                                        console.log("username: " + username);
                                                        console.log("rank: " + rank);

                                                        //Now set the coookies
                                                        setCookie("uid", user.uid, 90);
                                                        setCookie("emailAddress", emailAddress, 90);
                                                        setCookie("phoneNumber", phoneNumber, 90);
                                                        setCookie("username", username, 90);
                                                        setCookie("rank", rank, 90);

                                                        if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                            window.location.href = "admin.html";
                                                            return;
                                                        }

                                                        //relocate to the home page now
                                                        window.location.href = "../index.html";
                                                    })
                                                    .catch(error => {
                                                        console.log("emailAddress missing!");
                                                        console.log(error);
                                                        if (error.status === 0) {
                                                            alert("Sorry, you will have to edit your email address!😭");
                                                            var emailAddress = "no email address";
                                                            console.log("Everything is here...");
                                                            console.log("emailAddress:" + emailAddress);
                                                            console.log("phoneNumber: " + phoneNumber);
                                                            console.log("username: " + username);
                                                            console.log("rank: " + rank);

                                                            //Now set the coookies
                                                            setCookie("uid", user.uid, 90);
                                                            setCookie("emailAddress", emailAddress, 90);
                                                            setCookie("phoneNumber", phoneNumber, 90);
                                                            setCookie("username", username, 90);
                                                            setCookie("rank", rank, 90);

                                                            if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                                window.location.href = "admin.html";
                                                                return;
                                                            }

                                                            //relocate to the home page now
                                                            window.location.href = "../index.html";
                                                        }
                                                    });
                                            }
                                        });
                                })
                                .catch(error => {
                                    console.log("Error occurred during username retrieval...");
                                    console.log(error);
                                    if (error.status === 0) {
                                        alert("Sorry, you will have to edit your username!😭");
                                        var username = "no username";
                                        //phoneNumber
                                        getBytes(ref(storage, "users/" + user.uid + "/phoneNumber"), 100)
                                            .then((bytes) => {
                                                console.log("phoneNumber retrieved successfully...");
                                                phoneNumber = makeStringFromByteArray(bytes);

                                                //emailAddress
                                                getBytes(ref(storage, "users/" + user.uid + "/emailAddress"), 100)
                                                    .then((bytes) => {
                                                        hideProgressDialog();
                                                        console.log("emailAddress retrieved successfully...");
                                                        emailAddress = makeStringFromByteArray(bytes);
                                                        //everything has been retrieved
                                                        console.log("Everything is here...");
                                                        console.log("emailAddress:" + emailAddress);
                                                        console.log("phoneNumber: " + phoneNumber);
                                                        console.log("username: " + username);
                                                        console.log("rank: " + rank);

                                                        //Now set the coookies
                                                        setCookie("uid", user.uid, 90);
                                                        setCookie("emailAddress", emailAddress, 90);
                                                        setCookie("phoneNumber", phoneNumber, 90);
                                                        setCookie("username", username, 90);
                                                        setCookie("rank", rank, 90);

                                                        if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                            window.location.href = "admin.html";
                                                            return;
                                                        }

                                                        //relocate to the home page now
                                                        window.location.href = "../index.html";
                                                    })
                                                    .catch(error => {
                                                        console.log("emailAddress missing!");
                                                        console.log(error);
                                                        if (error.status === 0) {
                                                            alert("Sorry, you will have to edit your email address!😭");
                                                            var emailAddress = "no email address";
                                                            console.log("Everything is here...");
                                                            console.log("emailAddress:" + emailAddress);
                                                            console.log("phoneNumber: " + phoneNumber);
                                                            console.log("username: " + username);
                                                            console.log("rank: " + rank);

                                                            //Now set the coookies
                                                            setCookie("uid", user.uid, 90);
                                                            setCookie("emailAddress", emailAddress, 90);
                                                            setCookie("phoneNumber", phoneNumber, 90);
                                                            setCookie("username", username, 90);
                                                            setCookie("rank", rank, 90);

                                                            if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                                window.location.href = "admin.html";
                                                                return;
                                                            }

                                                            //relocate to the home page now
                                                            window.location.href = "../index.html";
                                                        }
                                                    });
                                            })
                                            .catch(error => {
                                                console.log("Error occurred during phoneNumber retrieval...");
                                                console.log(error);
                                                if (error.status === 0) {
                                                    alert("Sorry, you will have to edit your phone number!😭");
                                                    var phoneNumber = "no phone number";
                                                    //emailAddress
                                                    getBytes(ref(storage, "users/" + user.uid + "/emailAddress"), 100)
                                                        .then((bytes) => {
                                                            hideProgressDialog();
                                                            console.log("emailAddress retrieved successfully...");
                                                            emailAddress = makeStringFromByteArray(bytes);
                                                            //everything has been retrieved
                                                            console.log("Everything is here...");
                                                            console.log("emailAddress:" + emailAddress);
                                                            console.log("phoneNumber: " + phoneNumber);
                                                            console.log("username: " + username);
                                                            console.log("rank: " + rank);

                                                            //Now set the coookies
                                                            setCookie("uid", user.uid, 90);
                                                            setCookie("emailAddress", emailAddress, 90);
                                                            setCookie("phoneNumber", phoneNumber, 90);
                                                            setCookie("username", username, 90);
                                                            setCookie("rank", rank, 90);

                                                            if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                                window.location.href = "admin.html";
                                                                return;
                                                            }

                                                            //relocate to the home page now
                                                            window.location.href = "../index.html";
                                                        })
                                                        .catch(error => {
                                                            console.log("emailAddress missing!");
                                                            console.log(error);
                                                            if (error.status === 0) {
                                                                alert("Sorry, you will have to edit your email address!😭");
                                                                var emailAddress = "no email address";
                                                                console.log("Everything is here...");
                                                                console.log("emailAddress:" + emailAddress);
                                                                console.log("phoneNumber: " + phoneNumber);
                                                                console.log("username: " + username);
                                                                console.log("rank: " + rank);
    
                                                                //Now set the coookies
                                                                setCookie("uid", user.uid, 90);
                                                                setCookie("emailAddress", emailAddress, 90);
                                                                setCookie("phoneNumber", phoneNumber, 90);
                                                                setCookie("username", username, 90);
                                                                setCookie("rank", rank, 90);
    
                                                                if (user.uid === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
                                                                    window.location.href = "admin.html";
                                                                    return;
                                                                }
    
                                                                //relocate to the home page now
                                                                window.location.href = "../index.html";
                                                            }
                                                        });
                                                }
                                            });
                                    }
                                });
                        }
                    )
                });
            /*
       THE TEPLATE FOR DWNLOADING USING XML_HTTP_REQUEST
       getDownloadURL(ref(storage, "users/" + user.uid + "/rank"))
           .then(url => {
               var xmlHttp = new XMLHttpRequest();
               xmlHttp.onload = (event) => {
                   var response = xmlHttp.response;
                   console.log("Success...");
                   console.log("response: " + response.toBase64());
               }
               xmlHttp.responseType = "blob";
               xmlHttp.open("GET", url);
               xmlHttp.send();
           })
           .catch(error => {
               console.log("Error while retrieving data...");
               console.log(error);
           })*/
            //THEN RELOCATE TO HOME
        })
        .catch((error) => {
            hideProgressDialog();
            console.log("A problem ocurred during account creation!");
            console.log("ERROR_CODE: " + error.code);
            console.log("ERROR_MESSSAGE: " + error.message);

            if (error.code === "auth/invalid-login-credentials") {
                alert("Please check your email address or password!");
            } else if (error.code === "auth/network-request-failed") {
                alert("Network error 😢");
            }
        });
}

function makeStringFromByteArray(arrayBuffer) {
    var array = new Uint8Array(arrayBuffer);
    //textencode
    var decoder = new TextDecoder();
    return decoder.decode(array);
}