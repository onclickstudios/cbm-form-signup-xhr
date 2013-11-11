function cbmFormSignupXhr(context) {
  var
  $ = require('query'),
  sa = require('superagent'),
  serialize = require('serialize'),
  ev = require('event'),
  validate = require('validate-form');
  
  var
  form = $('form.cm-form-signup'),
  usernameInput = $('input[name=username]', form);
  
  validate(form)
    .on('blur')
    .field('email')
      .is('required')
      .is('email', 'invalid email address')
    .field('password')
      .is('required')
      .is('min', 4, 'must be 4+ characters')
    .field('confirm')
      .is('required')
      .is(function(val) {
        return val === $('input[name=password', form).value;
      }, 'passwords don\'t match')
    .field('username')
      .is(function(val,cb) {
        return !val ? false
        : (function() {
          console.log(usernameInput.value);
          return sa.get(context.existsURI + '?username=' + val)
          .set('X-Requested-With', 'XMLHttpRequest')
          .set('Accept','application/json')
          .end(function(e,s) {
            e ? cb(e, false)
            : !JSON.parse(s.text) ? cb(true)
            : cb(false);
          });
        })();
      }, context.existsMessage || 'Username ' + usernameInput.value + ' already exists')
  ;
  
  
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

module.exports = cbmFormSignupXhr;
