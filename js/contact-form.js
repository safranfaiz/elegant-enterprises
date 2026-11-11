(function () {
  'use strict';

  var SUBJECT_EMAIL_TEMPLATES = {
    'Quote request': [
      'ELEGANT ENTERPRISES — QUOTE REQUEST',
      '========================================',
      '',
      'A visitor has requested a product quote via the website.',
      '',
      'Contact details',
      '---------------',
      'Name: {{name}}',
      'Email: {{email}}',
      '{{phoneLine}}',
      '',
      'Their message',
      '-------------',
      '{{message}}',
      '',
      '---',
      'Submitted: {{date}}',
      'Source: https://www.elegantenterprises.lk/contact.html'
    ].join('\n'),
    'Bulk / distribution': [
      'ELEGANT ENTERPRISES — BULK / DISTRIBUTION ENQUIRY',
      '=================================================',
      '',
      'A visitor is interested in bulk orders or distribution.',
      '',
      'Contact details',
      '---------------',
      'Name: {{name}}',
      'Email: {{email}}',
      '{{phoneLine}}',
      '',
      'Their message',
      '-------------',
      '{{message}}',
      '',
      '---',
      'Submitted: {{date}}',
      'Source: https://www.elegantenterprises.lk/contact.html'
    ].join('\n'),
    'Private label / OEM manufacturing': [
      'ELEGANT ENTERPRISES — PRIVATE LABEL / OEM',
      '=========================================',
      '',
      'A visitor enquired about private label or OEM manufacturing.',
      '',
      'Contact details',
      '---------------',
      'Name: {{name}}',
      'Email: {{email}}',
      '{{phoneLine}}',
      '',
      'Project / requirements',
      '----------------------',
      '{{message}}',
      '',
      '---',
      'Submitted: {{date}}',
      'Source: https://www.elegantenterprises.lk/contact.html'
    ].join('\n'),
    'Factory visit': [
      'ELEGANT ENTERPRISES — FACTORY VISIT REQUEST',
      '=============================================',
      '',
      'A visitor has requested a factory visit.',
      '',
      'Contact details',
      '---------------',
      'Name: {{name}}',
      'Email: {{email}}',
      '{{phoneLine}}',
      '',
      'Visit details / message',
      '-----------------------',
      '{{message}}',
      '',
      '---',
      'Submitted: {{date}}',
      'Source: https://www.elegantenterprises.lk/contact.html'
    ].join('\n'),
    'General enquiry': [
      'ELEGANT ENTERPRISES — GENERAL ENQUIRY',
      '=====================================',
      '',
      'A general enquiry was submitted via the website.',
      '',
      'Contact details',
      '---------------',
      'Name: {{name}}',
      'Email: {{email}}',
      '{{phoneLine}}',
      '',
      'Message',
      '-------',
      '{{message}}',
      '',
      '---',
      'Submitted: {{date}}',
      'Source: https://www.elegantenterprises.lk/contact.html'
    ].join('\n')
  };

  var SUBJECT_MESSAGE_STARTERS = {
    'Quote request': 'Please share products, pack sizes, and estimated monthly quantities for a quote.',
    'Bulk / distribution': 'We are interested in bulk / distribution. Please advise MOQs, pricing, and delivery options.',
    'Private label / OEM manufacturing': 'We are exploring private label or OEM manufacturing. Please share capabilities, MOQs, and lead times.',
    'Factory visit': 'We would like to arrange a factory visit. Preferred date/time and number of visitors:',
    'General enquiry': ''
  };

  var form = document.getElementById('contact-form');
  if (!form) return;

  var sendWhatsAppBtn = document.getElementById('send-whatsapp');
  var submitBtn = form.querySelector('button[type="submit"]');
  var subjectEl = document.getElementById('subject');
  var messageEl = document.getElementById('message');
  var toastEl = document.getElementById('contact-toast');
  var toastTextEl = document.getElementById('contact-toast-text');
  var toastActionEl = document.getElementById('contact-toast-action');
  var toastDismissTimer = null;

  var lastStarter = '';

  function formatSubmittedAt() {
    try {
      return new Date().toLocaleString('en-LK', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch (e) {
      return new Date().toISOString();
    }
  }

  function fillTemplate(subject, data) {
    var template = SUBJECT_EMAIL_TEMPLATES[subject] || SUBJECT_EMAIL_TEMPLATES['General enquiry'];
    var phoneLine = data.phone ? 'Phone: ' + data.phone : 'Phone: (not provided)';
    return template
      .replace(/\{\{name\}\}/g, data.name)
      .replace(/\{\{email\}\}/g, data.email)
      .replace(/\{\{phoneLine\}\}/g, phoneLine)
      .replace(/\{\{message\}\}/g, data.message)
      .replace(/\{\{date\}\}/g, formatSubmittedAt());
  }

  function enquiryLines() {
    var name = document.getElementById('name').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var email = document.getElementById('email').value.trim();
    var subject = subjectEl.value;
    var message = messageEl.value.trim();
    return [
      'Hello Elegant Enterprises,',
      '',
      'Subject: ' + subject,
      'Name: ' + name,
      phone ? 'Phone: ' + phone : '',
      email ? 'Email: ' + email : '',
      '',
      message
    ].filter(function (line) { return line !== ''; }).join('\n');
  }

  function clearFieldErrors() {
    ['name', 'phone', 'email', 'message'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.setCustomValidity('');
    });
  }

  function validateEmailEnquiry() {
    clearFieldErrors();
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var message = messageEl;
    var ok = true;

    if (!name.value.trim()) {
      name.setCustomValidity('Please enter your name.');
      ok = false;
    }
    if (!email.value.trim()) {
      email.setCustomValidity('Email is required to send by email.');
      ok = false;
    } else if (!email.checkValidity()) {
      email.setCustomValidity('Please enter a valid email address.');
      ok = false;
    }
    if (!message.value.trim()) {
      message.setCustomValidity('Please enter your message.');
      ok = false;
    }

    if (!ok) form.reportValidity();
    return ok;
  }

  function validateWhatsAppEnquiry() {
    clearFieldErrors();
    var name = document.getElementById('name');
    var phone = document.getElementById('phone');
    var message = messageEl;
    var ok = true;

    if (!name.value.trim()) {
      name.setCustomValidity('Please enter your name.');
      ok = false;
    }
    if (!phone.value.trim()) {
      phone.setCustomValidity('Please enter your phone number for WhatsApp.');
      ok = false;
    }
    if (!message.value.trim()) {
      message.setCustomValidity('Please enter your message.');
      ok = false;
    }

    if (!ok) form.reportValidity();
    return ok;
  }

  function hideToast() {
    if (!toastEl) return;
    toastEl.classList.add('contact-toast--hidden');
    toastEl.classList.remove('contact-toast--success', 'contact-toast--error');
    if (toastDismissTimer) {
      clearTimeout(toastDismissTimer);
      toastDismissTimer = null;
    }
  }

  function showToast(type, messageHtml) {
    if (!toastEl || !toastTextEl) return;
    hideToast();
    toastEl.classList.remove('contact-toast--hidden');
    toastEl.classList.add(type === 'success' ? 'contact-toast--success' : 'contact-toast--error');
    toastTextEl.innerHTML = messageHtml;
    if (toastActionEl) {
      toastActionEl.innerHTML = '';
      toastActionEl.classList.add('hidden');
    }
    toastDismissTimer = setTimeout(hideToast, 10000);
  }

  function showErrorWithWhatsApp() {
    var waUrl = 'https://wa.me/94741008160?text=' + encodeURIComponent(enquiryLines());
    var html = 'Message wasn\'t sent. Please try again or send your message through <a class="contact-toast__link" href="' + waUrl + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>.';
    if (!toastEl || !toastTextEl) return;
    hideToast();
    toastEl.classList.remove('contact-toast--hidden');
    toastEl.classList.add('contact-toast--error');
    toastTextEl.innerHTML = html;
    if (toastActionEl) {
      toastActionEl.innerHTML = '<a class="btn-whatsapp contact-toast__wa" href="' + waUrl + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp" aria-hidden="true"></i> Open WhatsApp</a>';
      toastActionEl.classList.remove('hidden');
    }
    toastDismissTimer = setTimeout(hideToast, 10000);
  }

  function setSubmitLoading(loading) {
    if (!submitBtn) return;
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.dataset.defaultLabel = submitBtn.dataset.defaultLabel || submitBtn.textContent.trim();
      submitBtn.textContent = 'Sending…';
    } else {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
      if (submitBtn.dataset.defaultLabel) {
        submitBtn.textContent = submitBtn.dataset.defaultLabel;
      }
    }
  }

  function getEmailConfig() {
    return window.ELEGANT_CONTACT_EMAIL || {};
  }

  function sendEmailEnquiry() {
    var cfg = getEmailConfig();
    var accessKey = (cfg.accessKey || '').trim();
    if (!accessKey) {
      showErrorWithWhatsApp();
      console.warn('Elegant contact form: set js/contact-email-config.js accessKey (https://web3forms.com).');
      return Promise.resolve(false);
    }

    var name = document.getElementById('name').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var email = document.getElementById('email').value.trim();
    var subject = subjectEl.value;
    var message = messageEl.value.trim();
    var body = fillTemplate(subject, { name: name, email: email, phone: phone, message: message });

    var payload = {
      access_key: accessKey,
      subject: subject + ' — Elegant Enterprises (website)',
      from_name: name,
      email: email,
      message: body
    };
    if (phone) payload.phone = phone;
    if (cfg.toEmail) payload.to = cfg.toEmail;

    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok && data && data.success, data: data };
        });
      })
      .catch(function () {
        return { ok: false, data: null };
      });
  }

  function applySubjectStarter() {
    var subject = subjectEl.value;
    var starter = SUBJECT_MESSAGE_STARTERS[subject] || '';
    var current = messageEl.value.trim();
    if (current === '' || current === lastStarter) {
      messageEl.value = starter;
      lastStarter = starter;
    }
  }

  if (subjectEl) {
    lastStarter = SUBJECT_MESSAGE_STARTERS[subjectEl.value] || '';
    subjectEl.addEventListener('change', applySubjectStarter);
    if (!messageEl.value.trim() && lastStarter) {
      messageEl.value = lastStarter;
    }
  }

  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', function () {
      if (!validateWhatsAppEnquiry()) return;
      window.open('https://wa.me/94741008160?text=' + encodeURIComponent(enquiryLines()), '_blank', 'noopener');
      document.getElementById('form-hint').classList.remove('hidden');
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateEmailEnquiry()) return;

    setSubmitLoading(true);
    sendEmailEnquiry()
      .then(function (result) {
        setSubmitLoading(false);
        if (result.ok) {
          showToast(
            'success',
            'Your message was successfully sent to Elegant Enterprises. They will contact you through email or mobile as soon as possible.'
          );
          form.reset();
          lastStarter = SUBJECT_MESSAGE_STARTERS[subjectEl.value] || '';
          if (lastStarter) messageEl.value = lastStarter;
        } else {
          showErrorWithWhatsApp();
        }
      });
  });

  var toastClose = document.getElementById('contact-toast-close');
  if (toastClose) {
    toastClose.addEventListener('click', hideToast);
  }
})();
