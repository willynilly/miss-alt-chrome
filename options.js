// Saves options to localStorage.
function save_options() {
  var api_key = $("input[name='api-key']").val();
  var disabilities = $("input[name='disabilities[]']:checked").map(function(){return $(this).val();}).get();
  var organizations = $("textarea[name='organizations']").val();
  //console.log(disabilities);
  
  // save to Chrome sync storage
  chrome.storage.sync.set({'api_key': api_key}, function() {
      chrome.storage.sync.set({'disabilities': disabilities}, function() {
        chrome.storage.sync.set({'organizations': organizations}, function() {
          // Notify that we saved.
          message('Settings saved');
        });
      });
  });

}

// Restores select box state to saved value from localStorage.
function restore_options() {
    chrome.storage.sync.get('api_key', function(items) {
        api_key = items['api_key'];
        if (!api_key) {
          return;
        }
        $("input[name='api-key']").val(api_key);
    });

  chrome.storage.sync.get('disabilities', function(items) {
      disabilities = items['disabilities'];
      if (!disabilities) {
        return;
      }

      //console.log(disabilities)

      for (i=0; i < disabilities.length; i++) {
          $("input[name='disabilities[]'][value='" + disabilities[i] + "']").prop('checked', true);
      }
  });
  
  chrome.storage.sync.get('organizations', function(items) {
        organizations = items['organizations'];
        if (!organizations) {
          return;
        }

        //console.log(organizations)
        $("textarea[name='organizations']").val(organizations);
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);