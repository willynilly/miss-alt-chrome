function getChromeStorage(key) {
    var dfrd = $.Deferred();
    chrome.storage.sync.get(key, function(result) {
        console.log(key);
        console.log(result);
        console.log(result[key]);
        dfrd.resolve(result[key]);
    });
    return dfrd.promise();
}

// function setChromeStorage(key, value) {
//     var dfrd = $.Deferred();
//     chrome.storage.sync.set({key:value}, function(result) {
//         dfrd.resolve(result[key]);
//     });
//     return dfrd.promise();
// }

function getIssues(badImages) {
    var dfrd = $.Deferred();
    var issues = []
    getChromeStorage('api_key').done(function(apiKey) {
        console.log("get_issues apikey:" + apiKey);
        
        if (!apiKey) {
          return;
        }
        for(i = 0; i < badImages.length; i++) {
            badImage = badImages[i];
            badImage['creator'] = apiKey;
            issues.push(badImage);
        }
        console.log(issues);
        dfrd.resolve(issues);
    });    
    return dfrd.promise();
}

function reportIssue(issue) {
    var dfrd = $.Deferred();
    console.log(issue);
    $.ajax({
        url:"http://127.0.0.1:5000/report", 
        type: "POST",
        data: JSON.stringify(issue),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function(d) {console.log(d)},
        failure: function(err) {console.log(err)} 
    }).done(function() {
        dfrd.resolve();
    });
    return dfrd.promise();
}

function reportIssues(issues) {
    var dfrd = $.Deferred();
    var promises = [];
    for (var i=0;i<issues.length;i++) {
        //$('body').append('<p>' + JSON.stringify(data[i]) + '</p>');
        issue = issues[i]
        promises.push(reportIssue(issue))
    }
    if (promises.length) {
        $.when(promises, function() {
            dfrd.resolve();
        });
    } else {
        dfrd.resolve();
    }
    return dfrd.promise();
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
    //console.log(JSON.stringify(response.bad_alt_images));
    $('body').append('<p>Bad Alt Text Image Count: ' + response.bad_alt_images.length + '</p>');
    //getChromeStorage('api_key').done(function(apiKey){console.log(apiKey)});
    
    getIssues(response.bad_alt_images).done(function(issues) {
        //console.log(JSON.stringify(issues));
        reportIssues(issues);
    });
  });
});

// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// var maps_key = "ABQIAAAATfHumDbW3OmRByfquHd3SRTRERdeAiwZ9EeJWta3L_JZVS0bOBRQeZgr4K0xyVKzUdnnuFl8X9PX0w";
// 
// function gclient_geocode(address) {
//   var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
//             encodeURIComponent(address) + '&sensor=false';
//   var request = new XMLHttpRequest();
// 
//   request.open('GET', url, true);
//   console.log(url);
//   request.onreadystatechange = function (e) {
//     console.log(request, e);
//     if (request.readyState == 4) {
//       if (request.status == 200) {
//         var json = JSON.parse(request.responseText);
//         var latlng = json.results[0].geometry.location;
//         latlng = latlng.lat + ',' + latlng.lng;
// 
//         var src = "https://maps.google.com/staticmap?center=" + latlng +
//                   "&markers=" + latlng + "&zoom=14" +
//                   "&size=512x512&sensor=false&key=" + maps_key;
//         var map = document.getElementById("map");
// 
//         map.src = src;
//         map.addEventListener('click', function () {
//           window.close();
//         });
//       } else {
//         console.log('Unable to resolve address into lat/lng');
//       }
//     }
//   };
//   request.send(null);
// }

// function map() {
//   var address = chrome.extension.getBackgroundPage().selectedAddress;
//   if (address)
//     gclient_geocode(address);
// }
// 
// window.onload = map;

// // Copyright (c) 2012 The Chromium Authors. All rights reserved.
// // Use of this source code is governed by a BSD-style license that can be
// // found in the LICENSE file.
// 
// /**
//  * Global variable containing the query we'd like to pass to Flickr. In this
//  * case, kittens!
//  *
//  * @type {string}
//  */
// var QUERY = 'puppies';
// 
// var kittenGenerator = {
//   /**
//    * Flickr URL that will give us lots and lots of whatever we're looking for.
//    *
//    * See http://www.flickr.com/services/api/flickr.photos.search.html for
//    * details about the construction of this URL.
//    *
//    * @type {string}
//    * @private
//    */
//   searchOnFlickr_: 'https://secure.flickr.com/services/rest/?' +
//       'method=flickr.photos.search&' +
//       'api_key=90485e931f687a9b9c2a66bf58a3861a&' +
//       'text=' + encodeURIComponent(QUERY) + '&' +
//       'safe_search=1&' +
//       'content_type=1&' +
//       'sort=interestingness-desc&' +
//       'per_page=20',
// 
//   /**
//    * Sends an XHR GET request to grab photos of lots and lots of kittens. The
//    * XHR's 'onload' event is hooks up to the 'showPhotos_' method.
//    *
//    * @public
//    */
//   requestKittens: function() {
//     var req = new XMLHttpRequest();
//     req.open("GET", this.searchOnFlickr_, true);
//     req.onload = this.showPhotos_.bind(this);
//     req.send(null);
//   },
// 
//   /**
//    * Handle the 'onload' event of our kitten XHR request, generated in
//    * 'requestKittens', by generating 'img' elements, and stuffing them into
//    * the document for display.
//    *
//    * @param {ProgressEvent} e The XHR ProgressEvent.
//    * @private
//    */
//   showPhotos_: function (e) {
//     var kittens = e.target.responseXML.querySelectorAll('photo');
//     for (var i = 0; i < kittens.length; i++) {
//       var img = document.createElement('img');
//       img.src = this.constructKittenURL_(kittens[i]);
//       img.setAttribute('alt', kittens[i].getAttribute('title'));
//       document.body.appendChild(img);
//     }
//   },
// 
//   /**
//    * Given a photo, construct a URL using the method outlined at
//    * http://www.flickr.com/services/api/misc.urlKittenl
//    *
//    * @param {DOMElement} A kitten.
//    * @return {string} The kitten's URL.
//    * @private
//    */
//   constructKittenURL_: function (photo) {
//     return "http://farm" + photo.getAttribute("farm") +
//         ".static.flickr.com/" + photo.getAttribute("server") +
//         "/" + photo.getAttribute("id") +
//         "_" + photo.getAttribute("secret") +
//         "_s.jpg";
//   }
// };
// 
// // Run our kitten generation script as soon as the document's DOM is ready.
// document.addEventListener('DOMContentLoaded', function () {
//   kittenGenerator.requestKittens();
// });


