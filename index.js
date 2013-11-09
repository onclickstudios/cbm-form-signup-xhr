function cmbFormSignupXhr() {
  var
  sa = require('visionmedia-superagent'),
  serialize = require('JayceTDE-serialize'),
  ev = require('component-event');
  
  var
  form = document.querySelector('.cm-form-signup'),
  span = document.getElementById('signup-span');
  
  ev.bind(form, 'submit', function(e) {
    e.preventDefault();
    var user = serialize(form);
    
    sa.post(form.getAttribute('action'))
    .send(user)
    .set('Accept', 'application/json')
    .set('X-Requested-With','XMLHttpRequest')
    .end(function(e,s) {
      e ? span.innerHTML = e
      : span.innerHTML = JSON.parse(s.text);
    });
  });
};

module.exports = cmbFormSignupXhr;

