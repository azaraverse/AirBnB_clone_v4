// wait for DOM to be loaded
$('document').ready(function () {
  // initialise an empty dict to store amenity ids
  const amenityIds = {};
  // listen for changes on each <input> checkbox tag
  $('.amenities .popover input').change(function () {
    // store id from data-id attribute of the checkbox
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');
    // check if checkbox is checked
    if ($(this).is(':checked')) {
      // store the amenity id in the key of the dictionary
      amenityIds[amenityName] = amenityId;
    } else {
      // else remove the amenity id from the dictionary
      // deleting the key effectively deletes its value
      delete amenityIds[amenityName];
    }
  });
  // update the h4 tag with the list of amenities checked
  // get the keys(Amenity IDs) by name from the dictionary
  const keys = Object.keys(amenityIds);
  const stringNames = keys.sort().join(', ');
  $('.amenities h4').text(stringNames);
});

apiStatus();

function apiStatus () {
  // initialise HOST
  const HOST = '0.0.0.0';
  // define apiUrl
  const apiUrl = `http://${HOST}:5001/api/v1/status/`;
  // get response from apiUrl using get
  $.get(apiUrl, (data, textStatus) => {
    // if status is 'OK', add class 'available' to id element (api_status)
    if (textStatus === 'success' && data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      // otherwise, remove class 'available' from div element id (api_status)
      $('#api_status').removeClass('available');
    }
  });
}
$.ajax({
  type: 'POST',
  url: 'http://0.0.0.0:5001/api/v1/places_search',
  data: JSON.stringify({}),
  contentType: 'application/json',
  success: function (data) {
    for (let i = 0; i < data.length; i++) {
      const place = data[i];
      $('.places').append('<article><div class="title_box"><h2>' + place.name + '</h2><div class="price_by_night">$' + place.price_by_night + '</div></div>' +
      '<div class="information"><div class="max_guest">' + place.max_guest + 'Guests</div>' + '<div class="number_rooms">' + place.number_rooms + '</div>' +
      '<div class="number_bathrooms">' + place.number_bathrooms + 'Bathrooms</div></div><div class="user"><b>Owner:</b>' + place.user.first_name + place.user.last_name +
      '</div><div class="description">' + place.description + '</div></article>');
    }
  }
});
