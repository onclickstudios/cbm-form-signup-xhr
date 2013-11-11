function cbmFormSignupXhr(context) {
  var
  $ = require('query'),
  sa = require('superagent'),
  serialize = require('serialize'),
  ev = require('event');
  
  var
  form = $('.cm-form-signup'),
  usernameInput = $('input[name=username]', form),
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
  
  var usernameKeyupTo;
  ev.bind(usernameInput,'keyup', function(e) {
    clearTimeout(usernameKeyupTo);
    to = setTimeout(function() {
      var val = usernameInput.value;
      sa.get('/users/exists?username=' + val)
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Accept','application/json')
        .end(function(e,s) {
          e ? false
          : !JSON.parse(s.text) ? span.innerHTML = ''
          : span.innerHTML = context.existsMessage || 'already exists';
      });
    }, 500);
  });
};

module.exports = cbmFormSignupXhr;
