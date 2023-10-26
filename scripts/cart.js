
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
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getStorage, listAll, ref, uploadString, getDownloadURL, getBytes, uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

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

//reference to the container
var cartProductsContainer = document.getElementById("cartProductsContainer");
//get the orders
var ordersDSV = getCookie("orders");
console.log("ordersDSV: " + ordersDSV);
//PROVIDE WAY FOR REMOVING ITEMS FROM CART
//deal with orders if available
if (ordersDSV) {
    var ordersArray = ordersDSV.split(">>");
    console.log("ordersArray...");
    console.log(ordersArray);
    //orders array is now reaady
    //get the products recursively
    showProgressDialog("Getting your orders...");
    downloadOrders(ordersArray, 0, () => {
        //make the order button visible when the orders download is complete
        var makeOrderButton = document.getElementById("makeOrderButton");
        makeOrderButton.onclick = () => {
            makeOrders();
        }
        makeOrderButton.style.display = "table";
    })
}

function downloadOrders(array, i/*"i" is index */, callBackFunction) {
    var orderedProductDSV = array[i];
    var orderedProductDetailsArray = orderedProductDSV.split("---");
    console.log("orderedProductDetailsArray...");
    console.log(orderedProductDetailsArray);
    var orderedProductName = orderedProductDetailsArray[0];
    var orderedProductGender = orderedProductDetailsArray[1];
    var orderedProductGenre = orderedProductDetailsArray[2];
    //prepare the product ref
    var orderedProductReference = ref(storage, "products/" + orderedProductGenre + "/" + orderedProductGender + "/" + orderedProductName);
    //get the product price
    getBytes(ref(orderedProductReference, "price"), 10).then(
        bytes => {
            var price = makeStringFromByteArray(bytes);
            //Now get the image file type
            getBytes(ref(orderedProductReference, "imageFileType"), 100).then(
                bytes1 => {
                    var imageFileType = makeStringFromByteArray(bytes1);
                    //Now get the image download url
                    getDownloadURL(ref(orderedProductReference, "image." + imageFileType)).then(
                        url => {
                            //Now make the ordered product
                            var orderedProduct = "<div id=\"" + orderedProductName + "\" class=\"product\">";
                            orderedProduct += "   <img src=\"" + url + "\"><br>";
                            orderedProduct += "   <text>" + orderedProductName + "</text><br>";
                            orderedProduct += "   <b>Ksh. " + price + "</b><br>";
                            orderedProduct += "   <input type=\"button\" name=\"" + orderedProductName + "\" value=\"remove\" gender=\"" + orderedProductGender + "\" genre=\"" + orderedProductGenre + "\">";
                            orderedProduct += "</div>";

                            console.log("orderedProduct...");
                            console.log(orderedProduct);

                            //append it to the layout
                            cartProductsContainer.innerHTML += orderedProduct;

                            //Now the onclick listener
                            var newProduct = document.getElementById(orderedProductName);
                            console.log("newProduct...");
                            console.log(newProduct);
                            newProduct.children[6].onclick = (event) => {
                                removeFromCart(event);
                            }

                            //check wheether there's procession or not
                            if (i === array.length - 1) {
                                console.log("ALL ORDERS DOWWNLOADED SUCCESSFULLY!");
                                //execute the caallback if availablee
                                if (callBackFunction) {
                                    console.log("callBackFunction provided, proceeding to execute...");
                                    callBackFunction();
                                } else {
                                    console.log("No callBackFunction provided, terminating execution...");
                                    hideProgressDialog();
                                }
                                //add click listeners to the unfortunate lot
                                setClickListenersForAllOrders();
                                hideProgressDialog();
                            } else {
                                console.log("order[" + i + "] DOWNLOADED SUCCESSFULLY!");
                                //download the next product
                                downloadOrders(array, i + 1, callBackFunction);
                            }
                        }
                    )
                }
            )
        }
    )
}

function makeOrders() {
    //check the userID first
    if (!(getCookie("uid") || getCookie("emailAddress"))) {
        alert("Sorry, you are not logged in!");
        window.location.href = "sign-up.html";
    }
    ordersDSV = getCookie("orders");
    if (ordersDSV) {
        showProgressDialog("Making orders...");
        var ordersArray = ordersDSV.split(">>");
        uploadOrder(ordersArray, 0, () => {
            //upload the total  orders price
            var totalPrice = 0;
            for (var x = 0; x < cartProductsContainer.children.length; x++) {
                //cut from "Ksh. "
                var priceInWords = cartProductsContainer.children[x].children[4].innerText;
                var priceToAdd = Number(priceInWords.substring(priceInWords.indexOf("Ksh. ") + 5));
                totalPrice += priceToAdd;
            }
            console.log("TOTAL_ORDER_PRICE: " + totalPrice);
            //get the initially saver price
            showProgressDialog("Finishing up...Total cost: " + totalPrice + "...");
            getBytes(ref(storage, "users/" + getCookie("uid") + "/orders/totalPrice")).then(
                (bytes) => {
                    var initialPrice = makeStringFromByteArray(bytes);
                    console.log("INITIAL PRICE GOTTEN: " + initialPrice);
                    totalPrice += Number(initialPrice);

                    //now upload it
                    uploadString(ref(storage, "users/" + getCookie("uid") + "/orders/totalPrice"), totalPrice.toString()).then(
                        () => {
                            console.log("PRICE UPLOADED SUCCESSFULLY!");
                            //Hide the make orders button
                            var makeOrderButton = document.getElementById("makeOrderButton");
                            makeOrderButton.style.display = "none";
                            //clear the orders
                            cartProductsContainer.innerHTML = "";
                            setCookie("orders", "");
                            setCookie("ordersCount", "");
                            //relocate
                            window.location.href = "../index.html";
                        }
                    ).catch(
                        (error) => {
                            alert("Sorry, a problem ocurred!😭");
                            console.log("Eror during uploading of total  price!");
                            console.log(error);
                        }
                    )
                }
            ).catch(
                error => {
                    console.log("HMMMM, IT SEEMS INITIAL PRICE IS MISSING...");
                    //proceed without adding anything to total price
                    //now upload it
                    uploadString(ref(storage, "users/" + getCookie("uid") + "/orders/totalPrice"), totalPrice.toString()).then(
                        () => {
                            console.log("PRICE UPLOADED SUCCESSFULLY!");
                            //Hide the make orders button
                            var makeOrderButton = document.getElementById("makeOrderButton");
                            makeOrderButton.style.display = "none";
                            //clear the orders
                            cartProductsContainer.innerHTML = "";
                            setCookie("orders", "");
                            setCookie("ordersCount", "");
                            //relocate
                            window.location.href = "../index.html";
                        }
                    ).catch(
                        (error) => {
                            alert("Sorry, a problem ocurred!😭");
                            console.log("Eror during uploading of total  price!");
                            console.log(error);
                        }
                    )
                }
            )
        })
    }
}

function uploadOrder(array, i, callBackFunction) {
    var orderedProductDetailsArray = array[i].split("---");
    var orderedProductName = orderedProductDetailsArray[0];
    var orderedProductGender = orderedProductDetailsArray[1];
    var orderedProductGenre = orderedProductDetailsArray[2];
    var orderedProductPrice = cartProductsContainer.children[i].children[4].innerText.substring(5);
    var orderedProductUniqueName = orderedProductName + ";" + orderedProductGender + ";" + orderedProductGenre;
    var orderedProductReference = ref(storage, "users/" + getCookie("uid") + "/orders/" + orderedProductUniqueName);
    //upload this product
    uploadString(ref(orderedProductReference, "name"), orderedProductName).then(
        snapshot => {
            console.log("name written");
            uploadString(ref(orderedProductReference, "price"), orderedProductPrice).then(
                snapshot1 => {
                    console.log("price written");
                    uploadString(ref(orderedProductReference, "genre"), orderedProductGenre).then(
                        snapshot2 => {
                            console.log("genre written");
                            uploadString(ref(orderedProductReference, "gender"), orderedProductGender).then(
                                snapshot3 => {
                                    console.log("gender written");
                                    //Now get the original product image and move it to the orders foler of this user
                                    var originalProductReference = ref(storage, "products/" + orderedProductGenre + "/" + orderedProductGender + "/" + orderedProductName);
                                    //Now get the image file type of the product
                                    getBytes(ref(originalProductReference, "imageFileType")).then(
                                        bytes => {
                                            console.log("image file type gotten!");
                                            var imageFileType = makeStringFromByteArray(bytes);
                                            //now get the image
                                            getBytes(ref(originalProductReference, "image." + imageFileType)).then(
                                                bytes1 => {
                                                    console.log("image gotten!");
                                                    //upload these to the new location
                                                    //upload the image
                                                    const metadata = {
                                                        contentType: "image/" + imageFileType
                                                    };
                                                    uploadBytes(ref(orderedProductReference, "image." + imageFileType, metadata), new Uint8Array(bytes1)).then(
                                                        snapshot => {
                                                            console.log("image uploaded!");
                                                            //upload the eimahe file type
                                                            uploadString(ref(orderedProductReference, "imageFileType"), imageFileType).then(
                                                                snapshot => {
                                                                    //upload the actual order
                                                                    uploadString(ref(storage, "orders/" + getCookie("uid") + "/anville95"), "anville el grande").then(
                                                                        snapshot => {
                                                                            console.log("image file type uploaded!");
                                                                            //delete the original product
                                                                            deleteDBFolder(originalProductReference, 0,
                                                                                () => {
                                                                                    console.log("old product deleted!");
                                                                                    console.log("Order finished...");
                                                                                    if (i === array.length - 1) {
                                                                                        console.log("All poducts ordered successfully!");
                                                                                        if (callBackFunction) {
                                                                                            callBackFunction();
                                                                                        }
                                                                                        hideProgressDialog();
                                                                                    } else {
                                                                                        console.log("Uploading next product");
                                                                                        uploadOrder(array, i + 1, callBackFunction);
                                                                                    }
                                                                                })
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
                                }
                            )
                        }
                    )
                }
            )
        }
    )
    //delete it from its DB folder to make it unavailable
    //Notify the admin in the RTDB
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

function setClickListenersForAllOrders() {
    console.log("SETTING THE ONCLICK LISTENERS FOR ALL ORDERS...");
    for (var i = 0; i < cartProductsContainer.children.length; i++) {
        var orderedProduct = cartProductsContainer.children[i].children[6];

        if (!orderedProduct.onclick) {
            orderedProduct.onclick = (event) => {
                removeFromCart(event);
            }
        }
    }
}

function removeFromCart(event) {
    var orderedProductName = event.target.getAttribute("name");
    var orderedProductGender = event.target.getAttribute("gender");
    var orderedProductGenre = event.target.getAttribute("genre");

    //the actual removal
    var ordersDSV = getCookie("orders");
    console.log("INITIAL VALUE OF ORDERS COOKIE");
    console.log(ordersDSV);
    var orderedProductDSV = orderedProductName + "---" + orderedProductGender + "---" + orderedProductGenre;
    //if this product is the first
    if (ordersDSV.indexOf(orderedProductDSV) === 0) {
        //remove it with the trailing '>>'
        orderedProductDSV += ">>";
        ordersDSV = ordersDSV.substring(orderedProductDSV.length);
    } else if (ordersDSV.indexOf(orderedProductDSV) === ordersDSV.length - orderedProductDSV.length) {
        //If this product is the last product
        //remove it with the leading '>>'
        orderedProductDSV = ">>" + orderedProductDSV;
        ordersDSV = ordersDSV.substring(0, ordersDSV.indexOf(orderedProductDSV));
    } else {
        //if it is in the middle
        //remove it with the trailling '>>'
        orderedProductDSV += ">>";
        var firstPortion = ordersDSV.substring(0, ordersDSV.indexOf(orderedProductDSV));//The portion before the product
        var secondPortion = ordersDSV.substring(ordersDSV.indexOf(orderedProductDSV) + orderedProductDSV.length);//The portion after the product
        //Now join the two portions
        ordersDSV = firstPortion + secondPortion;
    }

    //remove the element
    cartProductsContainer.removeChild(document.getElementById(orderedProductName));

    //get the orders count
    var ordersCount = Number(getCookie("ordersCount"));
    ordersCount -= 1;

    setCookie("orders", ordersDSV);
    setCookie("ordersCount", ordersCount.toString());
    console.log("FINAL VALUE OF ORDERS COOKIE");
    console.log(getCookie("orders"));
    console.log("FINAL VALUE OF ORDERS_COUNT COOKIE");
    console.log(ordersCount);
}

function makeStringFromByteArray(arrayBuffer) {
    var array = new Uint8Array(arrayBuffer);
    //textencode
    var decoder = new TextDecoder();
    return decoder.decode(array);
}
