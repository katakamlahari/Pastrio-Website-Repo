// Get form elements
const pasteForm = document.getElementById('pasteForm');
const resultWrapper = document.getElementById('result');
const errorWrapper = document.getElementById('error');
const pasteUrlInput = document.getElementById('pasteUrl');
const copyBtn = document.getElementById('copyBtn');
const pasteLink = document.getElementById('pasteLink');
const errorText = document.getElementById('errorText');
const urlBox = document.getElementById('urlBox');
const copyBurst = document.getElementById('copyBurst');

// Form submission
pasteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const content = document.getElementById('content').value.trim();
  const expirationTime = document.getElementById('expirationTime').value;
  const expirationUnit = document.getElementById('expirationUnit').value;
  const maxViews = document.getElementById('maxViews').value;

  // Validation
  if (!content) {
    showError('Please enter some content');
    return;
  }

  // Check if expiration is valid
  if (expirationTime && !expirationUnit) {
    showError('Please select an expiration unit');
    return;
  }

  if (!expirationTime && expirationUnit) {
    showError('Please enter an expiration time');
    return;
  }

  // Prepare form data
  const formData = {
    content,
    expirationTime: expirationTime ? expirationTime : null,
    expirationUnit: expirationUnit ? expirationUnit : null,
    maxViews: maxViews ? maxViews : null,
  };

  try {
    // Show loading state
    const submitBtn = pasteForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Creating...';

    // Send request
    const response = await fetch('/api/paste/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    if (!data.success) {
      showError(data.message || 'An error occurred');
      return;
    }

    // Show success with animations
    showSuccess(data);
  } catch (error) {
    console.error('Error:', error);
    showError('An error occurred. Please try again.');

    const submitBtn = pasteForm.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Paste';
  }
});

// Show success message with animated reveal
function showSuccess(data) {
  errorWrapper.style.display = 'none';

  // Build full URL
  const fullUrl = `${window.location.origin}${data.url}`;
  pasteUrlInput.value = fullUrl;
  pasteLink.href = data.url;

  // reveal result wrapper with animation class
  resultWrapper.style.display = 'block';
  resultWrapper.classList.remove('reveal');
  // force reflow to restart animation
  void resultWrapper.offsetWidth;
  resultWrapper.classList.add('reveal');

  // reveal url box
  if (urlBox) {
    urlBox.classList.remove('revealed');
    void urlBox.offsetWidth;
    urlBox.classList.add('revealed');
  }

  // subtle focus on the url box
  pasteUrlInput.focus();
  pasteForm.reset();

  // Scroll to result
  resultWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show error message
function showError(message) {
  resultWrapper.style.display = 'none';
  errorText.textContent = message;
  errorWrapper.style.display = 'block';

  // Scroll to error
  errorWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Copy button functionality with micro-animation
copyBtn.addEventListener('click', async () => {
  const url = pasteUrlInput.value;
  try {
    await navigator.clipboard.writeText(url);
    animateCopySuccess();
  } catch (err) {
    // Fallback for older browsers
    pasteUrlInput.select();
    document.execCommand('copy');
    animateCopySuccess();
  }
});

function animateCopySuccess() {
  if (copyBurst) {
    copyBurst.classList.add('show');
    setTimeout(() => copyBurst.classList.remove('show'), 1400);
  }

  const originalText = copyBtn.textContent;
  copyBtn.textContent = '✅ Copied!';
  copyBtn.disabled = true;
  setTimeout(() => {
    copyBtn.textContent = originalText;
    copyBtn.disabled = false;
  }, 1400);
}

// Auto-select expiration unit when user enters time
const expirationTimeEl = document.getElementById('expirationTime');
if (expirationTimeEl) {
  expirationTimeEl.addEventListener('input', function() {
    if (this.value && document.getElementById('expirationUnit').value === '') {
      document.getElementById('expirationUnit').value = 'hours';
    }
  });
}
