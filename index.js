function cmbFormSignupXhr() {
  var
  sa = require('superagent'),
  serialize = require('serialize'),
  ev = require('event');
  
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

