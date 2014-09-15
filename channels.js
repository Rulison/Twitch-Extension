/**
*	Open streams in new tabs.
*/

$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});


var BASE_URL = "https://api.twitch.tv/kraken/users/";
var POST_URL = "/follows/channels?limit=100";

var i;  //used in findLive for counting
var listFollowed;  //global variable of followed channels

document.addEventListener('DOMContentLoaded', function () { //once page is loaded...
		var enterNameBox = document.getElementById("name");
			
		chrome.storage.local.get('storedName', function(result) { //look for previously entered username
			enterNameBox.value = result.storedName;
		});
		submit = document.getElementById("submit");
		submit.addEventListener('click', function () { //when clicked
			
		var pchildren = document.getElementsByTagName("p");
		var length = pchildren.length;
		for(j=0;j<length;j++) {
			pchildren[0].parentNode.removeChild(pchildren[0]); //remove previous channels, if any
		}

		var achildren = document.getElementsByTagName("a");
		length = achildren.length;
		for(j=0;j<length;j++) {
			achildren[0].parentNode.removeChild(achildren[0]); //remove previous links, if any
		}

			
		var temp = enterNameBox.value; //save username
		chrome.storage.local.set({'storedName': temp}, function() {
			console.log("Settings saved");
		});

		var getString = BASE_URL + document.getElementById("name").value + POST_URL;
		var req = new XMLHttpRequest();
		req.open("GET", getString, true);
		req.onload = getFollowed_;
		req.send(null);
	});
	submit.click();

});

  /**
   * Parses received text for followed channels.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */

  function getFollowed_(e) {

  	var string = e.target.responseText;

  	while(string.indexOf("display_name") != -1) { 
  		string = string.substring(string.indexOf("display_name")+15, string.length);//gets name of channel
  		var name = string.substring(0, string.indexOf("\""));
  		var a = document.createElement('a'); //create hyperlink
  		a.href = "http://www.twitch.tv/"+name;

  		var p = document.createElement('p');

  		p.innerHTML = name;
  		p.className = "offline";
  		a.appendChild(p);
  		document.body.appendChild(a);
 
  		string = string.substring(name.length, string.length);
  	}

  	listFollowed = document.getElementsByTagName("p"); //get all channels

  	i=0;
  	try {
  		console.log("https://api.twitch.tv/kraken/streams?channel="+listFollowed[i].innerHTML.toLowerCase()); //if no channels, cath err
	} catch (err) {
		return;
	}
  	var req2 = new XMLHttpRequest();
  	req2.open("GET", "https://api.twitch.tv/kraken/streams?channel="+listFollowed[i].innerHTML.toLowerCase());
  	req2.onload = findLive;
  	req2.send(null);

  		// if(response.indexOf(("channels/"+listFollowed[i].innerHTML).toLowerCase()) != -1) {
  		// 	listFollowed[i].innerHTML += " LIVE";
  		// }
  	
  }
  /**
  *	Sees which of the followed channels are live.
  * Recursively structured to ensure everything is loaded in order.
  */
  function findLive(e) {
  	var text = e.target.responseText;
  	totalIndex = text.indexOf("_total");
    if(text.charAt(totalIndex+8) != 0) {
  		listFollowed[i].innerHTML += " LIVE";
  		listFollowed[i].className = "live";
  	}
  	i++;
  	var req2 = new XMLHttpRequest();
  	if(i != listFollowed.length) {
    	req2.open("GET", "https://api.twitch.tv/kraken/streams?channel="+listFollowed[i].innerHTML.toLowerCase());
  		req2.onload = findLive;
  		req2.send(null);
  	}
}
