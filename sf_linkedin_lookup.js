// JavaScript Document

// --------------------Functions related to automatically lookup company information based on the Linkedin ID--------------------

// 0. Sets up a Container Div in the Sidebar for our scripts and LinkedIn login status. Calls the checkPageAddress when it's done.
function loadAkDiv(){
	var akDiv = document.createElement('div');
	akDiv.className = 'sidebarModule';
	akDiv.id = 'akDiv'
	document.getElementById('sidebarDiv').appendChild(akDiv);

	var LiStatusDiv = document.createElement('div');
	LiStatusDiv.className = 'sidebarModuleBody';
	LiStatusDiv.id = 'LiStatusDiv'
	document.getElementById('akDiv').appendChild(LiStatusDiv);
	
	// Creates the script that displays the login with Linkedin icon and status
	var LiLoginScript = document.createElement('script')
	LiLoginScript.type="in/Login"
	document.getElementById('LiStatusDiv').appendChild(LiLoginScript);

}

// 1. This checks if the page is an Account Edit page (also for new accounts)
function checkPageAddress(){
	var page = document.title.indexOf("Account Edit:");
	
	if (page < 0){
		//Do Nothing
		//console.log('Not an Account Edit page')
	}
	
	else {
		// 1.1. Have to create the script within the LiStatusDiv div on the SF page - this is because SF strips out the line breaks on home page components and it makes the API call fail. It calls onLinkedInLoad when it's done
		loadAkDiv(); //Loads the containers for the scripts
		var LiScript=document.createElement('script');
		LiScript.src="https://platform.linkedin.com/in.js"
		LiScript.innerHTML="\n api_key: 8re19a5y2ezz \n onLoad: onLinkedInLoad \n authorize: true";
		document.getElementById('LiStatusDiv').appendChild(LiScript);

		//console.log('Account Edit page')
		enteredID();
	}
}

// 2. This is called from the callback function of the linkedin loader. It calls the function displayStatus once the user is logged in.
function onLinkedInLoad() {
     IN.Event.on(IN, "auth", displayStatus);
}
	
// 2.1 Displays when the user is logged in. Called by onLinkedInLoad
function displayStatus() {	
	var LiStatusDiv_Div = document.getElementById('LiStatusDiv');

	LiStatusDiv_Div.innerHTML +=
		"Logged in to Linkedin";
}

	
// 3. Listens for any changes on the Linkedin ID Field and calls linkedinLookup if it's changed.
function enteredID(){
	var linkedinIDField = document.getElementById("00Nb000000951lY") || "";
	
	linkedinIDField.onblur=function(){linkedinLookup()}
}

// 4. Takes the value in the Linkedin ID value and queries it via the Linkedin API, requesting various facets.
function linkedinLookup(){
	var lookupID = document.getElementById("00Nb000000951lY").value;
	var urlEnd = ":(name,industry,website-url,employee-count-range,founded-year,status,company-type,locations:(is-headquarters,address:(city,state,postal-code,country-code)))";
	var url = "/companies/" + lookupID + urlEnd;
	console.log("Looking up company ID " + lookupID)
	
	if (lookupID !== ""){ // Checks if there is a value in the field
		IN.API.Raw()
		.url(url)
		.result(function (result) {
			console.log(result)
			updateValues(result)
		})
				
		.error(function (error) {
			displayError(error);
		});
	}
  }

//5. Takes the values returned by the linkedin lookup and sets all the variables to the appropriate values. If a value is undefined, it sets it to blank.
function updateValues(result){
	var resultCompanyType = result.companyType || "";
	var resultStatus = result.status || "";
	var resultEmployeeCountRange = result.employeeCountRange || "";

	var linkedinName = result.name;
	var linkedinWebsite = result.websiteUrl;
	var linkedinIndustry = result.industry;
	var linkedinFounded = result.foundedYear;

	var linkedinOwnership = resultCompanyType.name;
	var linkedinEmployees = resultEmployeeCountRange.name;
	var linkedinOperatingStatus = resultStatus.name;
	
	var oldName = document.getElementById("acc2").value;
	var aliasName = document.getElementById("00Nb0000005Ps2O").value;
	
	if (linkedinName != oldName && aliasName == ""){ // This records the old, original name if it is to be changed in the former names field.
		document.getElementById("00Nb0000005Ps2O").value = oldName
		}
	
	else if (linkedinName != oldName && aliasName != ""){ // This records the old, original name if it is to be changed in the former names field.
		document.getElementById("00Nb0000005Ps2O").value += "\n" + oldName;
		}
		
	if (linkedinName){ // This checks if the result var exists (i.e. the var is NOT undefined) and if so, updates the field, otherwise it leaves it untouched.
		document.getElementById("00Nb0000009527U").value=linkedinName;
		document.getElementById("acc2").value=linkedinName;
		}
	
	if (linkedinWebsite){
		document.getElementById("acc12").value=linkedinWebsite;
		}
		
	if (linkedinIndustry){
		document.getElementById("acc7").value=linkedinIndustry;
		}
		
	if (linkedinFounded){
		document.getElementById("00Nb0000009527j").value=linkedinFounded;
		}
		
	if (linkedinOwnership){
		document.getElementById("acc14").value=linkedinOwnership;
		}
		
	if (linkedinEmployees){
		document.getElementById("00Nb0000009527e").value=linkedinEmployees || "";
		}
		
	if (linkedinOperatingStatus){
		document.getElementById("00Nb000000952wh").value=linkedinOperatingStatus || "";
		}
}

//6. Displays an error message if the Linkedin ID was not found and then calls resetPage to clear the values
function displayError(){
	alert("Sorry, this ID was not found, please select another");
	resetPage();
}

//7. Called by displayError - resets all the values on the page
function resetPage(){
	document.getElementById("00Nb0000009527U").value="";
	document.getElementById("acc2").value="";
	document.getElementById("00Nb000000952wr").value="";
	document.getElementById("acc12").value="";
	document.getElementById("acc7").value="";
	document.getElementById("acc14").value="";
	document.getElementById("00Nb000000952wh").value="";
	document.getElementById("00Nb0000009527j").value="";
	document.getElementById("00Nb0000009527e").value="";
}

// --------------------End of functions relating to the company look up--------------------

// --------------------Functions to prevent the New Note and New Attachment buttoms appearing--------------------

function hideBtns()
{
	if(document.getElementsByName("newNote")[0]!=null)
	document.getElementsByName("newNote")[0].style.display = 'none';
	if(document.getElementsByName("newNote")[1]!=null)
	document.getElementsByName("newNote")[1].style.display = 'none';
	
	if(document.getElementsByName("attachFile")[0]!=null)
	document.getElementsByName("attachFile")[0].style.display = 'none';
	if(document.getElementsByName("attachFile")[1]!=null)
	document.getElementsByName("attachFile")[1].style.display = 'none';
}

function loadFunctions(){
	hideBtns();
	checkPageAddress();
}

if (window.addEventListener) {
	window.addEventListener("load", loadFunctions, false);
}

else if (window.attachEvent) {
	window.attachEvent("onload", loadFunctions);
}

var divs = document.getElementsByTagName('div');
var div = divs[divs.length - 1];
div.parentNode.id = "hideDiv";
div.parentNode.style.display = "none";
