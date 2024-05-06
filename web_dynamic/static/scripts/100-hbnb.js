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
    // update the h4 tag with the list of amenities checked
    // get the keys(Amenity IDs) by name from the dictionary
    const keys = Object.keys(amenityIds);
    const stringNames = keys.sort().join(', ');
    $('.amenities h4').text(stringNames);
  });

  // initialise an empty dict to store state ids and city ids
  const stateIds = {};
  const cityIds = {};
  // listen for changes on each <input> checkbox tag for locations
  $('.locations .popover input').change(function () {
    // get id and name from data attribute of the checkbox
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');

    // check if the checkbox is for a state or city based on its position in DOM
    // since states come before city, check for states
    const isState = $(this).siblings('h2').length > 0;
    if (isState) {
      if ($(this).is(':checked')) {
        stateIds[name] = id;
      } else {
        delete stateIds[name];
      }
    } else {
      if ($(this).is(':checked')) {
        cityIds[name] = id;
      } else {
        delete cityIds[name];
      }
    }
    // update the h4 tag with the list of states and cities checked
    // get the keys(State IDs) by name from the dictionary
    const stateKeys = Object.keys(stateIds);
    const cityKeys = Object.keys(cityIds);
    const sNames = stateKeys.sort().join(', ');
    const cNames = cityKeys.sort().join(', ');
    const allNames = sNames.concat(cNames);
    $('.locations h4').text(allNames);
  });

  $('button').click(function () {
    // make a new POST request to places_search with the list of Amenities checked
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      data: JSON.stringify({
        amenities: Object.values(amenityIds),
        states: Object.values(stateIds),
        cities: Object.values(cityIds)
      }),
      contentType: 'application/json',
      success: function (data) {
        // clear existing places before appending new ones
        $('.places').empty();
        // loop through the result of the request and create article tags
        data.forEach(function (place) {
          // create an article element representing a place
          const article = $('<article></article>');
          article.html(`
                  <div class="title_box">
                      <h2>${place.name}</h2>
                      <div class="price_by_night">$${place.price_by_night}</div>
                  </div>
                  <div>
                      <div class="max_guest">${place.max_guest} Guests</div>
                      <div class="number_rooms">${place.number_rooms}</div>
                      <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
                  </div>
                  <div class="description">${place.description}</div>
                  `);
          // append the article element to the section with class 'places'
          $('.places').append(article);
        });
      }
    });
  });
});

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
