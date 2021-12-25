//Show units relevant to form of measure

//Get units of measure from template
//units = "{{units | js}}"
var units = {
    "WT": {
        'GR': 'grams',
        'KG': 'kilograms',
        'OZ': 'ounces',
        'LB': 'pounds'
    },

    "VOL": {
        'LT': 'liters',
        'FL_OZ': 'fluid_ounces',
        'GAL': 'gallons'
    },

    "CT": {
        'CT': 'count',
        'DZ': 'dozen'
    },

    "LEN": {
        'FT': 'feet',
        'YD': 'yards',
        'M': 'meters'
    },
}

function showFields(event) {
  console.log(event.target.value);
  var category = event.target.value;
  //Units to show in form
  var categoryUnits = units[category];
  console.log(categoryUnits);

  //Element to add select to
  var element = document.getElementById("id_units");

  //Check if element isn't already wrapped then wrap it  
  var wrapper = document.getElementById("wrapper");

  if (!(wrapper)) {
    var parent = element.parentNode;
    wrapper = document.createElement('div');
    wrapper.className = "form-group bootstrap3-required";
    wrapper.id = "wrapper";
    parent.replaceChild(wrapper, element);

    //Add the label
    var label = document.createElement("Label");
    label.class="control-label";
    label.htmlFor="id_units";
    label.innerHTML="Units";
    wrapper.appendChild(label);

    //Change the tag from input to select
    var sel = document.createElement("Select");
    sel.name = "units";
    sel.id = "id_units";
    sel.className = "form-control";
    wrapper.appendChild(sel);
  }

  //Clear old choices
  var sel = document.getElementById('id_units');
  sel.innerHTML = '';

  //Append option for each element in categoryUnits
  Object.keys(categoryUnits).forEach(function(k) {
    var opt = document.createElement("Option");
    opt.value = k;
    opt.innerHTML = categoryUnits[k];
    sel.appendChild(opt);
  })
} 
  
measure=document.getElementById("id_measure");
measure.addEventListener('change', showFields, false)
