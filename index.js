function cbmFormSignupXhr() {
  var
  $ = require('query'),
  sa = require('superagent'),
  serialize = require('serialize'),
  ev = require('event');
  
  var
  form = $('.cm-form-signup'),
  usernameInput = $('input[name=username]'),
  span = $('#signup-span');
  
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
  
  ev.bind(usernameInput, 'keyup', function(e) {
    var val = usernameInput.value;
    val.length < 3 ? false //lalalala
    : sa.get('/users/exists?username=' + val)
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Accept','application/json')
      .end(function(e,s) {
        e ? return false
        : console.log(JSON.parse(s.text));
    });
  });
};

module.exports = cbmFormSignupXhr;
