
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
import { getStorage, listAll, ref, uploadString, getDownloadURL, getBytes } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

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

//Variables for holding last downloaded items indices
var lastDownloadedUnisexShoe, lastDownloadedMaleShoe, lastDownloadedFemaleShoe;
//tab name constants
const TAB_NAME_UNISEX = "unisex",
    TAB_NAME_MALE = "male",
    TAB_NAME_FEMALE = "female";

//get the tabs
var unisexTab = document.getElementById("unisexTab");
var maleTab = document.getElementById("maleTab");
var femaleTab = document.getElementById("femaleTab");
console.log("initiating products retrievel")

//Download twenty products if they are more than twenty

//FOR DEBUGGING, REMOVE
setCookie("orders", "");
setCookie("ordersCount", "");

//Unisex
showProgressDialog("Getting products...");
listAll(ref(storage, "products/dresses/unisex")).then(
    response => {
        if (response.prefixes.length >= 20) {
            //make an array of twenty items from response prefix
            var array = [];
            for (var i = 0; i < 20; i++) {
                array[i] = response.prefixes[i];
            }
            //Now download the products
            downloadProducts(array, 0, TAB_NAME_UNISEX, () => {
                //The callbackFunction
                //Male
                listAll(ref(storage, "products/dresses/male")).then(
                    response1 => {
                        if (response1.prefixes.length >= 20) {
                            //make an array of twenty items from response prefix
                            var array = [];
                            for (var i = 0; i < 20; i++) {
                                array[i] = response1.prefixes[i];
                            }
                            //Now download the products
                            downloadProducts(array, 0, TAB_NAME_MALE, () => {
                                //The call back functtion for female
                                //Female
                                listAll(ref(storage, "products/dresses/female")).then(
                                    response2 => {
                                        if (response2.prefixes.length >= 20) {
                                            //make an array of twenty items from response prefix
                                            var array = [];
                                            for (var i = 0; i < 20; i++) {
                                                array[i] = response2.prefixes[i];
                                            }
                                            //Now download the products
                                            downloadProducts(array, TAB_NAME_FEMALE, 0, () => {
                                                //Here do the final acts
                                                //set the last index in the call back to allow time for others to download
                                                lastDownloadedUnisexShoe = 19;
                                                //set the last index finally
                                                lastDownloadedMaleShoe = 19;
                                                //set the last index finally
                                                lastDownloadedFemaleShoe = 19;
                                            });
                                        } else {
                                            downloadProducts(response2.prefixes, 0, TAB_NAME_FEMALE, () => {
                                                //set the last index in the call back to allow time for others to download
                                                lastDownloadedUnisexShoe = 19;
                                                //set the last index finally
                                                lastDownloadedMaleShoe = 19;
                                            });
                                        }
                                    }
                                )
                            });
                        } else {
                            downloadProducts(response1.prefixes, 0, TAB_NAME_MALE, () => {
                                //The call back functtion for female
                                //Female
                                listAll(ref(storage, "products/dresses/female")).then(
                                    response2 => {
                                        if (response2.prefixes.length >= 20) {
                                            //make an array of twenty items from response prefix
                                            var array = [];
                                            for (var i = 0; i < 20; i++) {
                                                array[i] = response2.prefixes[i];
                                            }
                                            //Now download the products
                                            downloadProducts(array, 0, TAB_NAME_FEMALE, () => {
                                                //set the last index in the call back to allow time for others to download
                                                lastDownloadedUnisexShoe = 19;
                                                //set the last index
                                                lastDownloadedFemaleShoe = 19;
                                            });
                                        } else {
                                            downloadProducts(response2.prefixes, 0, TAB_NAME_FEMALE, () => {
                                                //set the last index in the call back to allow time for others to download
                                                lastDownloadedUnisexShoe = 19;
                                            });
                                        }
                                    }
                                )
                            })
                        }
                    }
                )
            });
        } else {
            downloadProducts(response.prefixes, 0, TAB_NAME_UNISEX, () => {
                //All unisex downloaded
                //The callbackFunction
                //Male
                listAll(ref(storage, "products/dresses/male")).then(
                    response1 => {
                        if (response1.prefixes.length >= 20) {
                            //make an array of twenty items from response prefix
                            var array = [];
                            for (var i = 0; i < 20; i++) {
                                array[i] = response1.prefixes[i];
                            }
                            //Now download the products
                            downloadProducts(array, 0, TAB_NAME_MALE, () => {
                                //The call back functtion for female
                                //Female
                                listAll(ref(storage, "products/dresses/female")).then(
                                    response2 => {
                                        if (response2.prefixes.length >= 20) {
                                            //make an array of twenty items from response prefix
                                            var array = [];
                                            for (var i = 0; i < 20; i++) {
                                                array[i] = response2.prefixes[i];
                                            }
                                            //Now download the products
                                            downloadProducts(array, TAB_NAME_FEMALE, 0, () => {
                                                //Here do the final acts
                                                //set the last index finally
                                                lastDownloadedMaleShoe = 19;
                                                //set the last index finally
                                                lastDownloadedFemaleShoe = 19;
                                            });
                                        } else {
                                            downloadProducts(response2.prefixes, 0, TAB_NAME_FEMALE, () => {
                                                //set the last index finally
                                                lastDownloadedMaleShoe = 19;
                                            });
                                        }
                                    }
                                )
                            });
                        } else {
                            downloadProducts(response1.prefixes, 0, TAB_NAME_MALE, () => {
                                //The call back functtion for female
                                //Female
                                listAll(ref(storage, "products/dresses/female")).then(
                                    response2 => {
                                        console.log("PEFIXES...");
                                        console.log(response2.prefixes);
                                        if (response2.prefixes.length >= 20) {
                                            //make an array of twenty items from response prefix
                                            var array = [];
                                            for (var i = 0; i < 20; i++) {
                                                array[i] = response2.prefixes[i];
                                            }
                                            //Now download the products
                                            downloadProducts(array, 0, TAB_NAME_FEMALE, () => {
                                                //set the last index
                                                lastDownloadedFemaleShoe = 19;
                                            });
                                        } else {
                                            downloadProducts(response2.prefixes, 0, TAB_NAME_FEMALE /*call back null here */);
                                        }
                                    }
                                )
                            })
                        }
                    }
                )
            })
        }
    }
)

function makeStringFromByteArray(arrayBuffer) {
    var array = new Uint8Array(arrayBuffer);
    //textencode
    var decoder = new TextDecoder();
    return decoder.decode(array);
}

var getMoreUnisexButton = document.getElementById("getMoreUnisex");
var getMoreMaleButton = document.getElementById("getMoreMale");
var getMoreFemaleButton = document.getElementById("getMoreFemale");

function downloadProducts(productsReferences, i/*i is index*/, tabName, callBackFunction/*For recursive synchronous downloads*/) {
    //return if prefices are nil
    if(productsReferences.length === 0) {return;}

    //downloads products synchronously
    //get the item name first
    console.log("PREFIX[" + i + "]...");
    console.log(productsReferences[i]);
    var productPrefix = productsReferences[i];
    getBytes(ref(productPrefix, "price"), 100)
        .then((bytes) => {
            console.log("Shoe name and price retrieved successfully!");
            console.log("name: " + productPrefix.name);
            var price = makeStringFromByteArray(bytes);
            console.log("price: " + price);
            //get the image file type
            getBytes(ref(productPrefix, "imageFileType"), 100).then(
                (bytes1) => {
                    console.log("ImageFileType retrieved successfully...");
                    var imageFileType = makeStringFromByteArray(bytes1);
                    console.log("imageFileType: " + imageFileType);
                    //get the image download url
                    getDownloadURL(ref(productPrefix, "image." + imageFileType)).then(
                        url => {
                            console.log("Image download url: " + url);
                            //Now make the element
                            var shoe = "<div id=\"" + productPrefix.name + "\" class=\"product\">";
                            shoe += "   <img src=\"" + url + "\"><br>";
                            shoe += "   <text>" + productPrefix.name + "</text><br>";
                            shoe += "   <b>Ksh. " + price + "</b><br>";
                            shoe += "   <input type=\"button\" name=\"" + productPrefix.name + "\" value=\"add to cart\" gender=\"" + tabName + "\">";
                            shoe += "</div>";

                            console.log("shoe...");
                            console.log(shoe);

                            //append to tab for testing phase
                            if (tabName === TAB_NAME_UNISEX) {
                                unisexTab.children[1].children[0].innerHTML += shoe;
                            } else if (tabName === TAB_NAME_MALE) {
                                maleTab.children[1].children[0].innerHTML += shoe;
                            } else if (tabName === TAB_NAME_FEMALE) {
                                femaleTab.children[1].children[0].innerHTML += shoe;
                            }

                            //now set the click listener
                            document.getElementById(productPrefix.name).children[6].onclick = (event) => {
                                addToCart(event);
                            }

                            console.log("the product input[button].onclick element...");
                            console.log(document.getElementById(productPrefix.name).children[6].onclick);

                            console.log("product[" + i + "] DOWNLOADED SUCCESSFULLY!");

                            //check if the item is the last
                            if (i === productsReferences.length - 1) {
                                console.log("PRODUCT DOWNLOAD DONE...");
                                console.log("callBackFunction...");
                                console.log(callBackFunction);
                                //execute the call back function at this point; if it was provided
                                if (callBackFunction) {
                                    console.log("CallbackFunction provided, proceeding to execute...");
                                    callBackFunction();

                                    //set the button visibiliies if allowable
                                    if (lastDownloadedUnisexShoe) {
                                        getMoreUnisexButton.style.display = "table";
                                    }

                                    if (lastDownloadedMaleShoe) {
                                        getMoreMaleButton.style.display = "table";
                                    }

                                    if (lastDownloadedFemaleShoe) {
                                        getMoreFemaleButton.style.display = "table";
                                    }

                                } else {
                                    console.log("No CallbackFunction provided, exiting...");
                                    console.log("Setting click listeners for poducts...");
                                    setClickListenersForAllProducts();

                                    hideProgressDialog();
                                }
                                //THE EXECUTION ENDS HERE IF THE CALL BACK FUNCTION IS NOT AVAILABLE
                            } else {
                                downloadProducts(productsReferences, i + 1, tabName, callBackFunction);
                            }
                        }
                    )
                }
            )
        })
        .catch(error => {
            console.log("Error occurred during shoe item retrieval...");
            console.log(error);
        });
}

//Prevent download interruption
var isDownloading = false;

//getting more poducts
//unisex
getMoreUnisexButton.onclick = () => {
    //if the last index is present
    if (lastDownloadedUnisexShoe) {
        if (!isDownloading) {
            showProgressDialog("Getting more unisex attire...");
            isDownloading = true;
            listAll(ref(storage, "products/dresses/unisex")).then(
                response => {
                    //if response is larger than last index + 21, get only 20
                    if (response.prefixes.length >= lastDownloadedUnisexShoe + 21) {
                        var array = [];
                        for (i = 20; i < 40; i++) {
                            array[i - 20] = response.prefixes[i];
                        }
                        //Now download from the array
                        downloadProducts(array, 0, TAB_NAME_UNISEX, () => {
                            //Set the value of the last index
                            lastDownloadedUnisexShoe += 20;
                            //reset is downloading
                            isDownloading = false;
                        })
                    } else {
                        //Get all of the products in this case from the last index
                        downloadProducts(response.prefixes, lastDownloadedUnisexShoe + 1, TAB_NAME_UNISEX, () => {
                            //Nullify the last index
                            lastDownloadedUnisexShoe = undefined;/*Bad practice but I have no choice*/
                            //Invisiblise the button 😊
                            getMoreUnisexButton.style.display = "none";
                            //reset is downloading
                            isDownloading = false;
                        })
                    }
                }
            )
        } else {
            alert("Sorry, other products are downloading...");
        }
    }
}

//male
getMoreMaleButton.onclick = () => {
    //if the last index is present
    if (lastDownloadedMaleShoe) {
        if (!isDownloading) {
            showProgressDialog("Getting more male attire...");
            isDownloading = true;
            listAll(ref(storage, "products/dresses/male")).then(
                response => {
                    //if response is larger than last index + 21, get only 20
                    if (response.prefixes.length >= lastDownloadedMaleShoe + 21) {
                        var array = [];
                        for (i = 20; i < 40; i++) {
                            array[i - 20] = response.prefixes[i];
                        }
                        //Now download from the array
                        downloadProducts(array, 0, TAB_NAME_MALE, () => {
                            //Set the value of the last index
                            lastDownloadedMaleShoe += 20;
                            //reset is downloading
                            isDownloading = false;
                        })
                    } else {
                        //Get all of the products in this case from the last index
                        downloadProducts(response.prefixes, lastDownloadedMaleShoe + 1, TAB_NAME_MALE, () => {
                            //Nullify the last index
                            lastDownloadedMaleShoe = undefined;/*Bad practice but I have no choice*/
                            //Invisiblise the button 😊
                            getMoreMaleButton.style.display = "none";
                            //reset is downloading
                            isDownloading = false;
                        })
                    }
                }
            )
        } else {
            alert("Sorry, other products are downloading...");
        }
    }
}

//female
getMoreFemaleButton.onclick = () => {
    //if the last index is present
    if (lastDownloadedFemaleShoe) {
        if (!isDownloading) {
            showProgressDialog("Getting more male attire");
            isDownloading = true;
            listAll(ref(storage, "products/dresses/female")).then(
                response => {
                    //if response is larger than last index + 21, get only 20
                    if (response.prefixes.length >= lastDownloadedFemaleShoe + 21) {
                        var array = [];
                        for (i = 20; i < 40; i++) {
                            array[i - 20] = response.prefixes[i];
                        }
                        //Now download from the array
                        downloadProducts(array, 0, TAB_NAME_FEMALE, () => {
                            //Set the value of the last index
                            lastDownloadedFemaleShoe += 20;
                            //reset is downloading
                            isDownloading = false;
                        })
                    } else {
                        //Get all of the products in this case from the last index
                        downloadProducts(response.prefixes, lastDownloadedFemaleShoe + 1, TAB_NAME_FEMALE, () => {
                            //Nullify the last index
                            lastDownloadedFemaleShoe = undefined;/*Bad practice but I have no choice*/
                            //Invisiblise the button 😊
                            getMoreFemaleButton.style.display = "none";
                            //reset is downloading
                            isDownloading = false;
                        })
                    }
                }
            )
        } else {
            alert("Sorry, other products are downloading...");
        }
    }
}

//controlling the tabs
//get the tabButtons
var unisexTabButton = document.getElementById("unisex");
var maleTabButton = document.getElementById("men");
var femaleTabButton = document.getElementById("women");
//holding current visible tab and tab button
var currentVisibleTab, currentVisibleTabButton;

function showTab(tab, tabButton) {
    if (currentVisibleTab) {
        //get the current visible tabButton's class
        var currentClass = currentVisibleTabButton.getAttribute("class");
        //now remove the active
        currentVisibleTabButton.setAttribute("class", currentClass.substring(0, currentClass.indexOf(" tabButtonActive")));
        currentVisibleTab.style.display = "none";
    }
    //now make the suggested tab visible
    tab.style.display = "table";
    var currentClass = tabButton.getAttribute("class");
    tabButton.setAttribute("class", currentClass + " tabButtonActive");
    currentVisibleTab = tab;
    currentVisibleTabButton = tabButton;
}

//set the click listeners
unisexTabButton.onclick = () => {
    showTab(unisexTab, unisexTabButton);
}

maleTabButton.onclick = () => {
    showTab(maleTab, maleTabButton);
}

femaleTabButton.onclick = () => {
    showTab(femaleTab, femaleTabButton);
}

unisexTabButton.click();

function setClickListenersForAllProducts() {
    //unisex products
    for(var i = 0; i < unisexTab.children[1].children[0].children.length; i++) {
        var product = unisexTab.children[1].children[0].children[i];
        if(!product.onclick) {
            product.children[6].onclick = (event) => {
                addToCart(event);
            }
        }
    }

    //male products
    for(var i = 0; i < maleTab.children[1].children[0].children.length; i++) {
        var product = maleTab.children[1].children[0].children[i];
        if(!product.onclick) {
            product.children[6].onclick = (event) => {
                addToCart(event);
            }
        }
    }

    //female products
    for(var i = 0; i < femaleTab.children[1].children[0].children.length; i++) {
        var product = femaleTab.children[1].children[0].children[i];
        if(!product.onclick) {
            product.children[6].onclick = (event) => {
                addToCart(event);
            }
        }
    }

    console.log("All products click listeners set!")
}

//click listener for cart container image
var cartContainer = document.getElementById("cartContainer");

if(getCookie("ordersCount")) {
    var ordersCount = getCookie("ordersCount");
    //set the cart container
    cartContainer.children[1].innerText = ordersCount.toString();
}

cartContainer.onclick = () => {
    window.location.href = "cart.html";
}

//The function for adding to cart
function addToCart(event) {
    var productName = event.target.getAttribute("name");
    var productGender = event.target.getAttribute("gender");

    console.log("productGender: " + productGender);
    /*
    The cookie structure for orders, delimiter is '>>'
    orders; productOneName---ProductOneGender---productOneGenre>>productTwoName---ProductTwoGender---productTwoGenre>>productThreeName---ProductThreeGender---productThreeGenre
    */
    var orders = getCookie("orders");
    var ordersCount = Number(getCookie("ordersCount")) || 0;
    if (!orders || orders === "") {
        console.log("orders absent, starting a new");
        setCookie("orders", productName + "---" + productGender + "---" + "dresses", 90);
        setCookie("ordersCount", "1");
        ordersCount = 1;
    } else {
        //check if the poduct is there already
        if(orders.indexOf(productName + "---" + productGender + "---" + "dresses") >= 0) {
            alert("Sorry, product was already added!");
            return;
        }
        setCookie("orders", orders + ">>" + productName + "---" + productGender + "---" + "dresses", 90);
        setCookie("ordersCount", (Number(ordersCount) + 1).toString());
        ordersCount += 1;
    }
    //now remove the product
    var product = document.getElementById(productName);
    //get the gender so as to know from which tab to remove
    var gender = product.getAttribute("gender");

    console.log("maleTAb[1][0]...");
    console.log(maleTab.children[1].children[0]);

    console.log("product...");
    console.log(product);
    
    if(productGender === TAB_NAME_UNISEX) {
        console.log("Removing the unisex product");
        unisexTab.children[1].children[0].removeChild(product);
    } else if(productGender === TAB_NAME_MALE) {
        console.log("Removing the male product");
        maleTab.children[1].children[0].removeChild(product);
    } else if(productGender === TAB_NAME_FEMALE) {
        console.log("Removing the female product");
        femaleTab.children[1].children[0].removeChild(product);
    } else {
        console.log("Product gender match not found...");
    }

    //set the cart container
    cartContainer.children[1].innerText = ordersCount.toString();

    //Show the current cart value
    console.log("CURRENT CART VALUE...");
    console.log(getCookie("orders"));
    console.log("ORDERS_COUNT: " + ordersCount);
}
