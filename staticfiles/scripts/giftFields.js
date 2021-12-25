//Fields in order forms that pertain to gifts only appear if the order is a gift

function makeVisible(element) {
  var checked = document.getElementById("id_this_is_a_gift").checked;
  var id = "id_recipient_" + element;
  var el = document.getElementById(id);
  if (el) {
    if (checked) {
      el.className="form-control";
      el.type="text";
      el.setAttribute("maxlength", 100);
      el.placeholder="Recipient " + element;

      var label = document.createElement("Label");
      label.class="control-label";
      label.htmlFor="id_recipient_" + element;
      label.innerHTML="Recipient " + element;
      label.id="id_recipient_" + element + "_label";
      el.parentElement.insertBefore(label, el);	    
    }
    else {
      console.log("Found element and unchecked");
      el.type="hidden";
      var label=document.getElementById("id_recipient_" + element + "_label");
      label.parentElement.removeChild(label);	    
    }
  }
}

gift=document.getElementById("id_this_is_a_gift");
gift.addEventListener('click', function() {	
  makeVisible("name");
  makeVisible("address");
  makeVisible("city");
  makeVisible("state");
  makeVisible("message");
}, false);

