function cbmFormSignupXhr(context) {
  var
  $ = require('query'),
  sa = require('superagent'),
  serialize = require('serialize'),
  ev = require('event'),
  validate = require('validate-form'),
  qs = require('querystring');
  
  var
  form = $('form.cm-form-signup'),
  usernameInput = $('input[name=username]', form);
  
  validate(form)
    .on('blur')
    .field('email')
      .is('required','required')
      .is('email', 'invalid email address')
    .field('password')
      .is('required','required')
      .is('min', 4, 'must be 4+ characters')
    .field('confirm')
      .is('required','required')
      .is(function(val) {
        return val === $('input[name=password', form).value;
      }, 'passwords don\'t match')
    .field('username')
      .is('required','required')
      .is(function(val,cb) {
        return !val ? false
        : (function() {
          return sa.get(context.existsURI + '?username=' + val)
          .set('X-Requested-With', 'XMLHttpRequest')
          .set('Accept','application/json')
          .end(function(e,s) {
            e ? cb(e, false)
            : !JSON.parse(s.text) ? cb(true)
            : cb(false);
          });
        })();
      }, context.existsMessage || 'already exists')
  ;
  
  
  ev.bind(form, 'submit', function(e) {
    e.preventDefault();
    var user = serialize(form);
    
    sa.post(form.getAttribute('action'))
    .send(user)
    .set('Accept', 'application/json')
    .set('X-Requested-With','XMLHttpRequest')
    .end(function(e,s) {
      e ? form.reset()
      : s.statusType === 5 ? alert('server error')
      : s.status === 409 ? alert('database conflict')
      : s.status === 201 ? (function() {
        var redirect_uri;
        !(redirect_uri = qs.parse(location.search.split('?')[1]).redirect_uri) ? (function() {
          alert('success');
          form.reset();
        })()
        : location.href = redirect_uri;
      })()
      : alert('unknown failure');
    });
  });
  
};

module.exports = cbmFormSignupXhr;
