// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The popup page is asking us to find images with bad alt text on the page.
chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    //console.log("received request");
    json_images = []
    var imgs = findBadAltImages();
    imgs.each(function(i, e) {
            var e = $(e);
            var json_img = {'page_url': window.location.href, 'img_url': e[0].src, 'img_current_alt_text': e.attr('alt')};
            json_images.push(json_img);
        });
    //console.log(JSON.stringify(json_images));
    sendResponse({"bad_alt_images": json_images});
    //console.log("sent response");
});

// Search the text nodes for a US-style mailing address.
// Return null if none is found.
var findBadAltImages = function() {
  return $('img:not([alt]), img[alt=""]');  
}