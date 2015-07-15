// JavaScript Document

  // 2. Runs when the JavaScript framework is loaded
	function onLinkedInLoad() {
		IN.Event.on(IN, "auth", displayStatus);
	}
	
	function displayStatus() {
		var statusDiv = document.getElementById("status");

		statusDiv.innerHTML +=
			"<p>Successfully logged in to Linkedin</p>"
	}

  $(document).ready(function() {
    if(isAPIAvailable()) {
      $('#files').bind('change', handleFileSelect);
    }
  });

  function isAPIAvailable() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
      return true;
    } else {
      // source: File API availability - http://caniuse.com/#feat=fileapi
      // source: <output> availability - http://html5doctor.com/the-output-element/
      document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
      // 6.0 File API & 13.0 <output>
      document.writeln(' - Google Chrome: 13.0 or later<br />');
      // 3.6 File API & 6.0 <output>
      document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
      // 10.0 File API & 10.0 <output>
      document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
      // ? File API & 5.1 <output>
      document.writeln(' - Safari: Not supported<br />');
      // ? File API & 9.2 <output>
      document.writeln(' - Opera: Not supported');
      return false;
    }
  }

  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
	runCompanyUpdate(file)
  }
  
  
// 1. Reads the CSV to an array and then iterates through each item, checking against Linkedin  
    function runCompanyUpdate(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
    var csv = event.target.result;
	var lookupSelect = document.getElementById("csvType");
	var lookupType = lookupSelect.options[lookupSelect.selectedIndex].value;
    var companyLookups = $.csv.toArrays(csv);
	var urlStart = "/companies"
	var urlMiddle = ""
	var urlEnd = ":(id,name,industry,website-url,employee-count-range,founded-year,status,end-year,company-type,email-domains)"
	 
	if (lookupType=="linkedinID"){
		var urlMiddle = "/"
	}
	
	else if (lookupType=="uniName"){
		var urlMiddle = "/universal-name="
	}
	
	else {
		var urlMiddle = "?email-domain="
		var urlEnd = ""
	}	  
		
      for (var i=0;i<companyLookups.length;i++)
			{ 
				var currentLookup = companyLookups[[i],[i]];
				var url = urlStart + urlMiddle + currentLookup + urlEnd

				IN.API.Raw()
				.url(url)
				.result(function (result) {
					
					if (lookupType == "emailDomain"){
						displayCompanies(result);
					}
					
					else {
						displayCompany(result);
					}
				})
				
				.error(function (error) {
					displayError(error);
				});
			}
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
  }	


  // 3. Runs when the Profile() API call returns successfully
	function displayCompany(result) {
		var companyProfileDiv = document.getElementById("companyProfile");
		var emDoms = result.emailDomains.values
		var testes = emDoms.length
		console.log(result)
		
		companyProfileDiv.innerHTML +=
		"\"" + result.id + "\"§\"" + result.name + "\"§\"" + result.industry + "\"§\"" + result.websiteUrl + "\"§\"" + result.employeeCountRange.name + "\"§\"" + result.foundedYear + "\"§\"" + result.status.name + "\"§\"" + result.endYear + "\"§\"" + result.companyType.name +"\"";
		
		for (var i=0;i<emDoms.length;i++)
			{ 
				var emDom = emDoms[i]
				companyProfileDiv.innerHTML += "§\"" + emDom + "\"";
				
			}
		
		companyProfileDiv.innerHTML +=  "<br />";			
	}


  // 4. Runs when the Profile() API call returns successfully - only for email domains - has to have a loop as the results are returned in an array
	function displayCompanies(result) {
		var companyProfileDiv = document.getElementById("companyProfile");
		var companies = result.values;
		
		for (var company in companies) {		
			companyProfileDiv.innerHTML +=
			"\"" + companies[company].id + "\"§\"" + companies[company].name + "\"<br />";		
		}
	}
	
	 
  // 5. Runs when the Profile() API call returns an error
	function displayError(error) {
		var companyProfileDiv = document.getElementById("companyProfile");

		companyProfileDiv.innerHTML +=
			"\"" + error.message +"\"<br />" 
	}
	
/*
  function printTable(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      var csv = event.target.result;
      var data = $.csv.toArrays(csv);
      var html = '';
      for(var row in data) {
        html += '<tr>\r\n';
        for(var item in data[row]) {
          html += '<td>' + data[row][item] + '</td>\r\n';
        }
        html += '</tr>\r\n';
      }
      $('#contents').html(html);
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
  }
*/
