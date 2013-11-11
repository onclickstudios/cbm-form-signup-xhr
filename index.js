function cbmFormSignupXhr(context) {
  var
  $ = require('query'),
  sa = require('superagent'),
  serialize = require('serialize'),
  ev = require('event'),
  validate = require('validate-form');
  
  var
  form = $('form.cm-form-signup'),
  usernameInput = $('input[name=username]', form),
  span = $('#cm-form-signup-info-span');
  
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
      .is(function(val) {
        return val ? false
        : (function() {
          return sa.get(context.existsURI + '?username=' + val)
          .set('X-Requested-With', 'XMLHttpRequest')
          .set('Accept','application/json')
          .end(function(e,s) {
            e ? false
            : !JSON.parse(s.text) ? cb(true)
            : cb(false) || console.log(cb)
          });
        })();
      }, 'username exists');
  
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
  
//  var usernameKeyupTo, val;
//  ev.bind(usernameInput,'keyup', function(e) {
//    clearTimeout(usernameKeyupTo);
//    to = setTimeout(function() {
//      return val === usernameInput.value ? false
//      : (function() {
//        val = usernameInput.value;
//        sa.get(context.existsURI + '?username=' + val)
//        .set('X-Requested-With', 'XMLHttpRequest')
//        .set('Accept','application/json')
//        .end(function(e,s) {
//          e ? false
//          : !JSON.parse(s.text) ? span.innerHTML = ''
//          : span.innerHTML = context.existsMessage || 'Username ' + val + ' already exists';
//        });
//      })();
//    }, 500);
//  });
  
};

module.exports = cbmFormSignupXhr;
