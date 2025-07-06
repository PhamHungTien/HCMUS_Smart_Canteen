function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Expose globally so other inline scripts can use it
window.showToast = showToast;

/** Sanitize username input by removing spaces */
function sanitizeUsernameInput(input) {
  input.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\s+/g, '');
  });
}

/** Validate username string - only letters or numbers */
function isValidUsername(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}

window.sanitizeUsernameInput = sanitizeUsernameInput;
window.isValidUsername = isValidUsername;
