
//Get the window dimensions
var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//Redirect to mobile layout page if The aspect ratio is that of a mobile
if (height / width < 1) {
    //set the value of the link
    document.getElementsByTagName("link")[0].setAttribute("href", "css/rhoda.css");
}

if (getCookie("uid") === "zkdaHBZFefRlRrYz4wGlrWLzhxN2") {
    window.location.href = "html/admin.html";
}

// Import the functions you need from the SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getStorage, ref, getBytes, getDownloadURL, uploadBytes, uploadString } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

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

var signUpButton = document.getElementById("signUp");
var loginButton = document.getElementById("login");
var contactUs = document.getElementById("contactUs");

/*contactUs.onclick = () => {
    window.open("+254706114532");
}*/


//check if user is logged in
if (getCookie("emailAddress") && getCookie("uid")) {
    showProgressDialog("Getting things ready for you😊");
    //check if link is login link from email address
    if (isSignInWithEmailLink(auth, window.location.href)) {
        signInWithEmailLink(auth, getCookie("emailAddress"), window.location.href)
            .then((result) => {
                alert("Your email address has been verified 😊");
                console.log("AUTH.CURRENT_USER from email link...");
                console.log(auth.currentUser);
            })
            .catch(error => {
                console.log("Error whilst signing in with email link");
                console.log(error);
            })
    }
    //Login user if he/she logged in in the login page
    if (!auth.currentUser && getCookie("password") && getCookie("emailAddress")) {
        //log the user in
        console.log("EMAIL_ADDRESS: " + getCookie("emailAddress"));
        console.log("PASSWORD: " + getCookie("password"));
        signInWithEmailAndPassword(auth, getCookie("emailAddress"), getCookie("password"))
            .then((userCredential) => {
                console.log("userCredenials...");
                console.log(userCredential);
                console.log("AUTH.CURRENT_USER...");
                console.log(auth.currentUser);

                //Now check if user email address was verified
                console.log("CHECKING IF EMAIL IS VERIFIED!");
                if (!auth.currentUser.emailVerified) {
                    if (confirm("Please verify your email address now😢")) {
                        var emailAddress = getCookie("emailAddress");
                        //resend the verificatioon email
                        const actionCodeSettings = {
                            url: "https://mitofashion.github.io",
                            handleCodeInApp: true,
                        };

                        sendSignInLinkToEmail(auth, emailAddress, actionCodeSettings)
                            .then(() => {
                                hideProgressDialog();
                                alert("Please verify your email address, an email was sent to you!😊");
                                alert("Email might be in your spam folder!");
                                console.log("Login email sent!");
                            })
                            .catch(error => {
                                hideProgressDialog();
                                alert("Sorry, daily email limit exceeded!😭");
                                console.log("Error during resending verification email...");
                                console.log("error.code: " + error.code);
                                console.log("error.message" + error.message);
                            });
                    } else {
                        console.log("User wants to verify email later!");
                    }
                }

            })

            .catch(error => {
                console.log("signinWithEmailAndPassword failed in index");
                console.log(error);
            })
    }

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
    console.log("Getting profile picture...");
    getBytes(ref(storage, "users/" + uid + "/imageFileType"))
        .then(
            bytes => {
                var imageFileType = makeStringFromByteArray(bytes);
                console.log("Profile pic file type retrieved: " + imageFileType);
                //Now get the image download url
                getDownloadURL(ref(storage, "users/" + uid + "/image." + imageFileType)).then(
                    url => {
                        console.log("Profile pic url retrieved --> [" + url + "]");
                        //set the src of the profile container
                        profileInfoContainer.children[0].setAttribute("src", url);
                        //set the onclick listener for the profiles info div, it should lead to the profile page
                        profileInfoContainer.onclick = () => {
                            window.location.href = "html/profile.html";
                        }
                        hideProgressDialog();
                    }
                ).catch(
                    error => {
                        console.log("Profile picture is no");
                        console.log("error...");
                        console.log(error);
                        console.log("error_code: " + error.code);
                        console.log("error_status: " + error.status);

                        if (error.code === "storage/object-not-found") {
                            //fix the picture
                            showProgressDialog("Repairing your default profile picture...");
                            getBytes(ref(storage, "default_profile_picture.png"), 9000/*the default profile pic size is 8.37kb*/).then(
                                bytes => {
                                    //Upload image file type
                                    uploadString(ref(storage, "users/" + uid + "/imageFileType"), "png").then(
                                        snapshot => {
                                            //Upload image now
                                            const metadata = {
                                                contentType: "image/png"
                                            };

                                            uploadBytes(ref(storage, "users/" + uid + "/image.png"), new Uint8Array(bytes), metadata).then(
                                                snapshot => {
                                                    //it's done
                                                    console.log("image repair done!");
                                                    //Now set the onclick listener for the profile data
                                                    profileInfoContainer.onclick = () => {
                                                        window.location.href = "html/profile.html";
                                                    }
                                                    hideProgressDialog();
                                                }
                                            )
                                        }
                                    )
                                }
                            )
                        }
                    }
                )
            }
        )
        .catch(
            error => {
                if (error.status === 0) {
                    showProgressDialog("Repairing your default profile picture...");
                    getBytes(ref(storage, "default_profile_picture.png"), 9000/*the default profile pic size is 8.37kb*/).then(
                        bytes => {
                            //Upload image file type
                            uploadString(ref(storage, "users/" + uid + "/imageFileType"), "png").then(
                                snapshot => {
                                    //Upload image now
                                    const metadata = {
                                        contentType: "image/png"
                                    };

                                    uploadBytes(ref(storage, "users/" + uid + "/image.png"), new Uint8Array(bytes), metadata).then(
                                        snapshot => {
                                            //it's done
                                            console.log("image repair done!");
                                            //Now set the onclick listener for the profile data
                                            profileInfoContainer.onclick = () => {
                                                window.location.href = "html/profile.html";
                                            }
                                            hideProgressDialog();
                                        }
                                    )
                                }
                            )
                        }
                    )
                }
            }
        )
} else if (getCookie("isCreatingAccount") === "true") {
    console.log("WAS CREATING ACCOUNT");
    //check if user is creating account
    //check if link is login link from email address
    if (isSignInWithEmailLink(auth, window.location.href)) {
        signInWithEmailLink(auth, getCookie("accountCreationEmail"), window.location.href)
            .then((result) => {
                alert("Your email address has been verified 😊");
                console.log("AUTH.CURRENT_USER from email link...");
                console.log(auth.currentUser);
                
                if (!auth.currentUser) {
                    //ask if the user wants to proceed creating account
                    if (confirm("You were creating account, would you like to go on?")) {
                        window.location.href = "login.html";
                    }
                }

                if (!auth.currentUser.emailVerified) {
                    if (confirm("Please verify your email address now😢")) {
                        var emailAddress = getCookie("accountCreationEmail");
                        //resend the verificatioon email
                        const actionCodeSettings = {
                            url: "https://mitofashion.github.io",
                            handleCodeInApp: true,
                        };

                        sendSignInLinkToEmail(auth, emailAddress, actionCodeSettings)
                            .then(() => {
                                hideProgressDialog();
                                alert("Please verify your email address, an email was sent to you!😊");
                                console.log("Login email sent!");
                            })
                            .catch(error => {
                                hideProgressDialog();
                                alert("Sorry, something went wrong!😭");
                                console.log("Error during resending verification email...");
                                console.log("error.code: " + error.code);
                                console.log("error.message" + error.message);
                            });
                    } else {
                        console.log("User wants to verify email later!");
                    }
                }

                //show the thing for progress
                showProgressDialog("Getting everything ready for you...");
                //hide buttons for login and signup
                loginButton.style.display = "none";
                signUpButton.style.display = "none";
                //now get the data and write to DB
                var username = getCookie("accountCreationUsername");
                var phoneNumber = getCookie("accountCreationPhoneNumber");
                var rank = "regularUser";
                var emailAddress = getCookie("accountCreationEmail");

                //Now write the user's data to DB
                const userStorageRef = ref(storage, "users/" + getCookie("accountCreationUid"));

                var user = auth.currentUser;

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
                                                                                //remove the account creation data
                                                                                setCookie("isCreatingAccount", "false");
                                                                                setCookie("accountCreationUsername", "");
                                                                                setCookie("accountCreationEmail", "");
                                                                                setCookie("accountCreationPhoneNumber", "");
                                                                                setCookie("accountCreationUid", "");
                                                                                console.log("All details written and account creation done");
                                                                                hideProgressDialog();
                                                                                //No need to download profile picture because it is obviously the default
                                                                                //set the values of the profile info div
                                                                                var profileInfoContainer = document.getElementById("profileInfoContainer");
                                                                                //set the username
                                                                                profileInfoContainer.children[1].innerText = username;
                                                                                //make it visible
                                                                                profileInfoContainer.style.display = "inline-table";
                                                                                //Now set the onclick listener for the profile data
                                                                                profileInfoContainer.onclick = () => {
                                                                                    window.location.href = "html/profile.html";
                                                                                }
                                                                            }).catch(error => {
                                                                                hideProgressDialog();
                                                                                alert("Sorry, something went wrong, please check your connection!😭");
                                                                                console.log("Error whilst writing details to DB...");
                                                                                console.log(error);
                                                                            });
                                                                    }).catch(error => {
                                                                        hideProgressDialog();
                                                                        alert("Sorry, something went wrong, please check your connection!😭");
                                                                        console.log("Error whilst writing details to DB...");
                                                                        console.log(error);
                                                                    });
                                                            }).catch(error => {
                                                                hideProgressDialog();
                                                                alert("Sorry, something went wrong, please check your connection!😭");
                                                                console.log("Error whilst writing details to DB...");
                                                                console.log(error);
                                                            });

                                                    }).catch(error => {
                                                        hideProgressDialog();
                                                        alert("Sorry, something went wrong, please check your connection!😭");
                                                        console.log("Error whilst writing details to DB...");
                                                        console.log(error);
                                                    });

                                            }).catch(error => {
                                                hideProgressDialog();
                                                alert("Sorry, something went wrong, please check your connection!😭");
                                                console.log("Error whilst writing details to DB...");
                                                console.log(error);
                                            });
                                    }
                                ).catch(error => {
                                    hideProgressDialog();
                                    alert("Sorry, something went wrong, please check your connection!😭");
                                    console.log("Error whilst writing details to DB...");
                                    console.log(error);
                                });
                            }
                        ).catch(error => {
                            hideProgressDialog();
                            alert("Sorry, something went wrong, please check your connection!😭");
                            console.log("Error whilst writing details to DB...");
                            console.log(error);
                        });
                    }
                ).catch(error => {
                    hideProgressDialog();
                    alert("Sorry, something went wrong, please check your connection!😭");
                    console.log("Error whilst writing details to DB...");
                    console.log(error);
                });
            })
            .catch(error => {
                alert("Something went wrong 😢");
                console.log("Error whilst signing in with email link");
                console.log(error);
            })
    }
    else {
        //sign in the user
        signInWithEmailAndPassword(auth, getCookie("accountCreationEmail"), getCookie("accountCreationPassword"))
                .then((userCredenials) => {
                    console.log("LOGGED IN DURING ACCOUNT CREATION.");
                    console.log("AUTH.CURRENT_USER...");
                    console.log(auth.currentUser);
                    if (!auth.currentUser) {
                        //ask if the user wants to proceed creating account
                        if (confirm("You were creating account, would you like to go on?")) {
                            window.location.href = "login.html";
                        }
                    }
    
                    if (!auth.currentUser.emailVerified) {
                        if (confirm("Please verify your email address now😢")) {
                            var emailAddress = getCookie("accountCreationEmail");
                            //resend the verificatioon email
                            const actionCodeSettings = {
                                url: "https://mitofashion.github.io",
                                handleCodeInApp: true,
                            };
    
                            sendSignInLinkToEmail(auth, emailAddress, actionCodeSettings)
                                .then(() => {
                                    hideProgressDialog();
                                    alert("Please verify your email address, an email was sent to you!😊");
                                    console.log("Login email sent!");
                                })
                                .catch(error => {
                                    hideProgressDialog();
                                    alert("Sorry, something went wrong!😭");
                                    console.log("Error during resending verification email...");
                                    console.log("error.code: " + error.code);
                                    console.log("error.message" + error.message);
                                });
                        } else {
                            console.log("User wants to verify email later!");
                        }
                    }
    
                    //show the thing for progress
                    showProgressDialog("Getting everything ready for you...");
                    //hide buttons for login and signup
                    loginButton.style.display = "none";
                    signUpButton.style.display = "none";
                    //now get the data and write to DB
                    var username = getCookie("accountCreationUsername");
                    var phoneNumber = getCookie("accountCreationPhoneNumber");
                    var rank = "regularUser";
                    var emailAddress = getCookie("accountCreationEmail");
    
                    //Now write the user's data to DB
                    const userStorageRef = ref(storage, "users/" + getCookie("accountCreationUid"));
    
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

                                    var user = auth.currentUser;
    
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
                                                                            console.log("EMAIL ADDRESS: " + emailAddress);
                                                                            uploadString(ref(storage, "users/" + user.uid + "/emailAddress"), emailAddress).then(
                                                                                (snapshot) => {
                                                                                    console.log("emailAddress written successfully!");
    
                                                                                    //set the cookies for username, emailAddress and phoneNumber
                                                                                    setCookie("uid", user.uid, 90);
                                                                                    setCookie("username", username, 90);
                                                                                    setCookie("phoneNumber", phoneNumber, 90);
                                                                                    setCookie("emailAddress", emailAddress, 90);
                                                                                    setCookie("rank", rank, 90);
                                                                                    //remove the account creation data
                                                                                    setCookie("isCreatingAccount", "false");
                                                                                    setCookie("accountCreationUsername", "");
                                                                                    setCookie("accountCreationEmail", "");
                                                                                    setCookie("accountCreationPhoneNumber", "");
                                                                                    setCookie("accountCreationUid", "");
                                                                                    console.log("All details written and account creation done");
                                                                                    hideProgressDialog();
                                                                                    //No need to download profile picture because it is obviously the default
                                                                                    //set the values of the profile info div
                                                                                    var profileInfoContainer = document.getElementById("profileInfoContainer");
                                                                                    //set the username
                                                                                    profileInfoContainer.children[1].innerText = username;
                                                                                    //make it visible
                                                                                    profileInfoContainer.style.display = "inline-table";
                                                                                    //Now set the onclick listener for the profile data
                                                                                    profileInfoContainer.onclick = () => {
                                                                                        window.location.href = "html/profile.html";
                                                                                    }
                                                                                }).catch(error => {
                                                                                    hideProgressDialog();
                                                                                    alert("Sorry, something went wrong, please check your connection!😭");
                                                                                    console.log("Error whilst writing details to DB...");
                                                                                    console.log(error);
                                                                                });
                                                                        }).catch(error => {
                                                                            hideProgressDialog();
                                                                            alert("Sorry, something went wrong, please check your connection!😭");
                                                                            console.log("Error whilst writing details to DB...");
                                                                            console.log(error);
                                                                        });
                                                                }).catch(error => {
                                                                    hideProgressDialog();
                                                                    alert("Sorry, something went wrong, please check your connection!😭");
                                                                    console.log("Error whilst writing details to DB...");
                                                                    console.log(error);
                                                                });
    
                                                        }).catch(error => {
                                                            hideProgressDialog();
                                                            alert("Sorry, something went wrong, please check your connection!😭");
                                                            console.log("Error whilst writing details to DB...");
                                                            console.log(error);
                                                        });
    
                                                }).catch(error => {
                                                    hideProgressDialog();
                                                    alert("Sorry, something went wrong, please check your connection!😭");
                                                    console.log("Error whilst writing details to DB...");
                                                    console.log(error);
                                                });
                                        }
                                    ).catch(error => {
                                        hideProgressDialog();
                                        alert("Sorry, something went wrong, please check your connection!😭");
                                        console.log("Error whilst writing details to DB...");
                                        console.log(error);
                                    });
                                }
                            ).catch(error => {
                                hideProgressDialog();
                                alert("Sorry, something went wrong, please check your connection!😭");
                                console.log("Error whilst writing details to DB...");
                                console.log(error);
                            });
                        }
                    ).catch(error => {
                        hideProgressDialog();
                        alert("Sorry, something went wrong, please check your connection!😭");
                        console.log("Error whilst writing details to DB...");
                        console.log(error);
                    });
                })
    }
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