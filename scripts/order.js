// Import the functions you need from the SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getStorage, listAll, ref, deleteObject, uploadString, getDownloadURL, getBytes, uploadBytes } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

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

var uid = getCookie("ordererID");
//get the products

console.log("uid: " + uid);

showProgressDialog("Getting the user's orders...");
if (uid) {
    listAll(ref(storage, "users/" + uid + "/orders")).then(
        response => {
            //download the products
            downloadProducts(response.prefixes, 0, () => {
                console.log("All orders downloaded!");
                //Now downloading the number and name
                console.log("Downloading username and phone number...");
                getBytes(ref(storage, "users/" + uid + "/username")).then(
                    bytes => {
                        var username = makeStringFromByteArray(bytes);
                        console.log("Username retrieved --> " + username);
                        getBytes(ref(storage, "users/" + uid + "/phoneNumber")).then(
                            bytes1 => {
                                var phoneNumber = makeStringFromByteArray(bytes1);
                                console.log("Phonenumber retrieved --> " + phoneNumber);
                                //now get the total price
                                getBytes(ref(storage, "users/" + uid + "/orders/totalPrice")).then(
                                    bytes2 => {
                                        var totalPrice = makeStringFromByteArray(bytes2);
                                        //Now display them
                                        document.getElementsByClassName("pageHeading")[0].innerText = username + ", " + phoneNumber + " :: TOTAL: " + totalPrice;
                                        hideProgressDialog();
                                    }
                                )
                            }
                        )
                    }
                )
            })
        }
    )
}

var productsContainer = document.getElementById("cartProductsContainer");
var removeOrderButton = document.getElementById("removeOrderButton");
var removeOrderRetainProductsButton = document.getElementById("removeOrderRetainProductsButton");

function downloadProducts(productReferences, i, callBackFunction) {
    var productRef = productReferences[i];
    //price
    getBytes(ref(productRef, "price")).then(
        bytes => {
            var price = makeStringFromByteArray(bytes);
            //image file type
            getBytes(ref(productRef, "imageFileType")).then(
                bytes1 => {
                    var imageFileType = makeStringFromByteArray(bytes1);
                    //image url
                    getDownloadURL(ref(productRef, "image." + imageFileType)).then(
                        url => {
                            var productName = productRef.name;

                            var orderedProduct = "<div id=\"" + productName + "\" class=\"product\">";
                            orderedProduct += "   <img src=\"" + url + "\"><br>";
                            orderedProduct += "   <text>" + productName + "</text><br>";
                            orderedProduct += "   <b>Ksh. " + price + "</b><br>";
                            orderedProduct += "   <input name=\"" + productName + "\" type=\"button\" value=\"restore\" title=\"Remove this order and restore the product\">";
                            orderedProduct += "   <input name=\"" + productName + "\" type=\"button\" value=\"remove\" title=\"Remove this order and delete the product\">";
                            orderedProduct += "</div>";

                            productsContainer.innerHTML += orderedProduct;

                            if (i === productReferences.length - 1) {
                                console.log("PRODUCTS DOWNLOAD COMPLETE...");

                                if (callBackFunction) {
                                    callBackFunction();
                                }

                                removeOrderButton.onclick = () => {
                                    removeOrderAndDeleteProduts();
                                }

                                removeOrderRetainProductsButton.onclick = () => {
                                    removeOrdersAndRetainProducts();
                                }

                                setClickListenersForAllProductsRemoveButton();

                            } else {
                                //go on downloading
                                downloadProducts(productReferences, i + 1, callBackFunction);
                            }
                        }
                    )
                }
            )
        }
    )
}

function makeStringFromByteArray(arrayBuffer) {
    var array = new Uint8Array(arrayBuffer);
    //textencode
    var decoder = new TextDecoder();
    return decoder.decode(array);
}

function removeOrderAndDeleteProduts() {
    showProgressDialog("Removing order...");
    var uid = getCookie("ordererID");
    listAll(ref(storage, "users/" + uid + "/orders")).then(
        response => {
            removeAnOrder(response.prefixes, 0, () => {
                //lastly remove this user from the orderers
                deleteObject(ref(storage, "orders/" + uid + "/anville95")).then(
                    () => {
                        //remove the total price
                        deleteObject(ref(storage, "users/" + uid + "/orders/totalPrice")).then(
                            () => {
                                hideProgressDialog();
                                console.log("Order deleted completely!");
                                console.log("Reloading...");
                                setCookie("ordererID", "");
                                window.location.href = "admin.html";
                            }
                        )
                    }
                )
            });
        }
    )
}

function removeAnOrder(ordersReferences, i, callBackFunction) {
    var orderRef = ordersReferences[i];
    deleteDBFolder(orderRef, 0, () => {
        if (i === ordersReferences.length - 1) {
            console.log("DONE...");
            if (callBackFunction) {
                callBackFunction();
            }
        } else {
            removeAnOrder(ordersReferences, i + 1, callBackFunction);
        }
    })
}

function deleteDBFolder(dbFolderRef, i, callBackFunction) {
    listAll(dbFolderRef).then(
        response => {
            //delete the i
            deleteObject(response.items[i]).then(
                () => {
                    console.log("File [" + i + "] deleted!");
                    if (i === response.items.length - 1) {
                        console.log("<<Folder deleted>>");
                        if (callBackFunction) {
                            callBackFunction();
                        }
                    } else {
                        deleteDBFolder(dbFolderRef, i, callBackFunction);
                    }
                }
            )
        }
    )
}

function setClickListenersForAllProductsRemoveButton() {
    for(var i = 0; i < productsContainer.children.length; i++) {
        productsContainer.children[i].children[6].onclick = (event) => {
            restoreProduct(event);
        }

        productsContainer.children[i].children[7].onclick = (event) => {
            removeAndDeleteASingleProduct(event);
        }
    }
}

function restoreProduct(event) {
    //if only one product just clear the shite
    if(productsContainer.children.length === 1) {
        removeOrdersAndRetainProducts();
        return;
    }
    showProgressDialog("Restoring product...");
    var orderedProductName = event.target.getAttribute("name");
    removeAnOrderAndRetainProduct([ref(storage, "users/" + getCookie("ordererID") + "/orders/" + orderedProductName)], 0, () => {
        console.log("SINGLE PRODUCT REMOVED!");
        //now remove it
        hideProgressDialog();
        productsContainer.removeChild(document.getElementById(orderedProductName));
    })
}

function removeAndDeleteASingleProduct(event) {
    showProgressDialog("Deleting product completely...");
    //if 1 product removeOrderAndDeleteProduts
    if(productsContainer.children.length === 1) {
        removeOrderAndDeleteProduts();
        return;
    }
    var orderedProductName = event.target.getAttribute("name");
    deleteDBFolder(ref(storage, "users/" + getCookie("ordererID") + "/orders/" + orderedProductName), 0, () => {
        console.log("SINGLE PRODUCT DELETED!");
        //now remove it
        hideProgressDialog();
        productsContainer.removeChild(document.getElementById(orderedProductName));
    })
}

function removeOrdersAndRetainProducts() {
    var uid = getCookie("ordererID");
    showProgressDialog("Removing orders while retaining products...");
    listAll(ref(storage, "users/" + uid + "/orders")).then(
        response => {
            removeAnOrderAndRetainProduct(response.prefixes, 0, () => {
                hideProgressDialog();
                //lastly remove this user from the orderers
                deleteObject(ref(storage, "orders/" + uid + "/anville95")).then(
                    () => {
                        //remove the total price
                        deleteObject(ref(storage, "users/" + uid + "/orders/totalPrice")).then(
                            () => {
                                console.log("Order deleted completely!");
                                console.log("Reloading...");
                                setCookie("ordererID", "");
                                window.location.href = "admin.html";
                            }
                        )
                    }
                )
            })
        }
    )
}

//reemoves order recursive
function removeAnOrderAndRetainProduct(orderedProductFolderReferences, i, callBackFunction) {
    var orderedProductReference = orderedProductFolderReferences[i];
    //get the info
    var orderedProductInfo = orderedProductReference.name.split(";");
    console.log("orderedProductInfo...");
    console.log(orderedProductInfo);
    //now copy the folder
    copyDBFolder(orderedProductReference, ref(storage, "products/" + orderedProductInfo[2] + "/" + orderedProductInfo[1] + "/" + orderedProductInfo[0]), () => {
        //now delete the OG folder from the user
        deleteDBFolder(orderedProductReference, 0, () => {
            if(i === orderedProductFolderReferences.length - 1) {
                console.log("ALL ORDES REMOVED SUCCESSFULLY WITHOUT REMOVING PROCUCTS");
    
                if(callBackFunction) {
                    callBackFunction();
                }
            } else {
                console.log("AN ORDER WAS REMOVED!");
                removeAnOrderAndRetainProduct(orderedProductFolderReferences, i + 1, callBackFunction);
            }
        })
    })
}

function copyDBFolder(originFolderRef, destinationFolderRef, callBackFunction) {
    console.log("Starting to copy folder <" + originFolderRef.name + ">");
    listAll(originFolderRef).then(
        response => {
            copyObject(response.items, destinationFolderRef, 0, callBackFunction);
        }
    )
}

function copyObject(objectsReferences, destinationFolderRef, i, callBackFunction) {
    //get the obejct
    getBytes(objectsReferences[i]).then(
        bytes => {
            //upload it
            uploadBytes(ref(destinationFolderRef, objectsReferences[i].name), bytes).then(
                () => {
                    console.log("Object[" + i + "] uploaded successfully!");
                    if (i === objectsReferences.length - 1) {
                        if (callBackFunction) {
                            callBackFunction();
                        }
                    } else {
                        copyObject(objectsReferences, destinationFolderRef, i + 1, callBackFunction);
                    }
                }
            )
        }
    )
}