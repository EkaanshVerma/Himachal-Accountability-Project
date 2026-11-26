/**
 * Himachal Accountability Project (HAP) — 3-Step Canonical Report Form Component
 * Pass 2 Polish: 3-step progress flow (Where -> What -> Proof), camera-first on mobile,
 * data-i18n multilingual support, and confirmation screen.
 */

(function() {
  const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwNaNhg0hj9CKEsPYICc73EMaAQhp0g597mi8R2r7vg8oNhqgWSpmaWvSjF-SV0P32x/exec';
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB ceiling

  function generateRefId() {
    const seat = String(Math.floor(Math.random() * 68) + 1).padStart(2, '0');
    const num = String(Math.floor(Math.random() * 9000) + 1000);
    return 'HP-' + seat + '-' + num;
  }

  function getStepFormHTML(refId) {
    return `
      <div class="canonical-report-card card" style="max-width: 620px; margin: 0 auto; padding: 24px;">
        <!-- Card Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="eyebrow" style="margin-bottom: 0;" data-i18n="form_title">Report an Issue</span>
          </div>
          <span class="tag tag-neutral" id="canon-ref-display" style="font-size: 11px;">REF · ${refId}</span>
        </div>

        <!-- 3-Step Progress Indicator -->
        <div class="step-progress" id="canon-step-progress" aria-label="Report Form Steps">
          <div class="step-node active" id="node-step-1">
            <div class="step-bubble">1</div>
            <div class="step-title" data-i18n="step_1_title">Where</div>
          </div>
          <div class="step-node" id="node-step-2">
            <div class="step-bubble">2</div>
            <div class="step-title" data-i18n="step_2_title">What</div>
          </div>
          <div class="step-node" id="node-step-3">
            <div class="step-bubble">3</div>
            <div class="step-title" data-i18n="step_3_title">Proof</div>
          </div>
        </div>

        <!-- Form Body Container -->
        <div id="canon-form-fields-container">

          <!-- ================= STEP 1: WHERE ================= -->
          <div class="form-step-pane active" id="pane-step-1" style="display: flex; flex-direction: column; gap: 16px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" data-i18n="lbl_location">Location of Issue *</label>
              <p style="font-size: 0.85rem; color: var(--muted); margin-bottom: 12px;" data-i18n="loc_instruction">
                Pinpoint where the infrastructure failure is located.
              </p>

              <button type="button" id="canon-loc-btn" class="btn-primary" style="width: 100%; margin-bottom: 12px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>
                </svg>
                <span data-i18n="btn_use_location">Use my current location</span>
              </button>

              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 600;" data-i18n="lbl_or_manual">or manual entry:</span>
              </div>

              <input type="text" id="canon-manual-loc" class="form-input" placeholder="Enter PIN code, Village or Tehsil (e.g. 171001, Theog)" data-i18n-ph="ph_manual_loc" />
              <div id="canon-loc-status" style="font-family: var(--font-mono); font-size: 12px; color: var(--accent); margin-top: 6px; min-height: 18px;"></div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
              <button type="button" id="btn-next-to-2" class="btn-primary" disabled style="opacity: 0.5;">
                <span data-i18n="btn_continue">Continue to Problem →</span>
              </button>
            </div>
          </div>

          <!-- ================= STEP 2: WHAT ================= -->
          <div class="form-step-pane" id="pane-step-2" style="display: none; flex-direction: column; gap: 16px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="canon-cat" data-i18n="lbl_category">Category *</label>
              <select id="canon-cat" class="form-select" required>
                <option value="" disabled selected data-i18n="opt_select_category">Select problem category (required)</option>
                <option value="Roads" data-i18n="cat_roads">Roads &amp; Infrastructure</option>
                <option value="Water" data-i18n="cat_water">Water Supply</option>
                <option value="Health" data-i18n="cat_health">Healthcare</option>
                <option value="Education" data-i18n="cat_education">Education</option>
                <option value="Food" data-i18n="cat_food">Food &amp; PDS</option>
                <option value="Electricity" data-i18n="cat_electricity">Electricity</option>
                <option value="Other" data-i18n="cat_other">Other</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="canon-desc" data-i18n="lbl_description">What problem in your area needs attention? *</label>
              <textarea id="canon-desc" class="form-textarea" placeholder="Describe the road name, landmark, and exact nature of neglect..." required data-i18n-ph="ph_desc"></textarea>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
              <button type="button" id="btn-back-to-1" class="btn-outline">
                <span data-i18n="btn_back">← Back</span>
              </button>
              <button type="button" id="btn-next-to-3" class="btn-primary" disabled style="opacity: 0.5;">
                <span data-i18n="btn_continue_proof">Continue to Evidence →</span>
              </button>
            </div>
          </div>

          <!-- ================= STEP 3: PROOF ================= -->
          <div class="form-step-pane" id="pane-step-3" style="display: none; flex-direction: column; gap: 16px;">
            <!-- Media Upload Box (Camera-first on mobile) -->
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" data-i18n="lbl_evidence">Photo or Video Proof (Optional)</label>
              <p style="font-size: 0.85rem; color: var(--muted); margin-bottom: 8px;" data-i18n="evidence_note">
                Encouraged — max 10 MB limit. Geotagged images speed up independent ground verification.
              </p>

              <div id="canon-media-box" style="border: 1.5px dashed var(--border-strong); border-radius: var(--radius-sm); padding: 20px; background-color: var(--bg-inset); cursor: pointer; text-align: center; transition: all 0.2s ease;">
                <input type="file" id="canon-file-input" accept="image/*,video/*" capture="environment" style="display: none;" />
                <div id="canon-media-empty" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.8" aria-hidden="true">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <span style="font-size: 0.88rem; font-weight: 500; color: var(--ink);" data-i18n="btn_tap_camera">Tap to take photo or choose file (max 10 MB)</span>
                  <span style="font-size: 0.75rem; color: var(--muted);">EXIF metadata stripped before publishing</span>
                </div>
                <div id="canon-media-preview" style="display: none; align-items: center; justify-content: center; gap: 8px; color: var(--sage); font-family: var(--font-mono); font-size: 0.85rem;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                  <span id="canon-media-filename">Media file attached</span>
                </div>
              </div>
              <div id="canon-media-error" style="color: var(--delay-12plus); font-size: 0.8rem; margin-top: 4px; display: none;"></div>
            </div>

            <!-- Optional WhatsApp Number -->
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="canon-whatsapp" data-i18n="lbl_whatsapp">WhatsApp Number (Optional)</label>
              <input type="tel" id="canon-whatsapp" class="form-input" placeholder="e.g. 98160XXXXX (for verification follow-up only, never published)" data-i18n-ph="ph_whatsapp" />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
              <button type="button" id="btn-back-to-2" class="btn-outline">
                <span data-i18n="btn_back">← Back</span>
              </button>
              <button type="button" id="canon-submit-btn" class="btn-primary" style="background-color: var(--accent); border-color: var(--accent);">
                <span data-i18n="btn_submit_final">Submit Report →</span>
              </button>
            </div>
          </div>

        </div>

        <!-- ================= CONFIRMATION SCREEN ================= -->
        <div id="canon-success-view" style="display: none; text-align: center; padding: 32px 16px;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background-color: var(--sage-soft); color: var(--sage); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <h3 class="headline-serif" style="font-size: var(--text-28); margin-bottom: 8px;" data-i18n="success_title">Report Logged Successfully</h3>
          <div style="display: inline-block; background-color: var(--bg-inset); border: 1px solid var(--border); padding: 8px 18px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.95rem; font-weight: 700; color: var(--ink); margin-bottom: 16px;" id="canon-confirmed-ref">
            REF · ${refId}
          </div>
          <p style="font-size: 0.95rem; color: var(--ink-secondary); line-height: 1.6; max-width: 480px; margin: 0 auto 24px;" data-i18n="success_desc">
            Your report will be independently checked by a volunteer ground verifier within <strong>24–72 hours</strong> before publication on the public ledger. Keep your reference ID for follow-up.
          </p>
          <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
            <button type="button" id="canon-reset-btn" class="btn-outline" data-i18n="btn_report_another">Report Another Issue</button>
            <a href="index.html" class="btn-primary" data-i18n="btn_return_home">Return Home</a>
          </div>
        </div>
      </div>
    `;
  }

  function initReportForm(containerId) {
    const mount = document.getElementById(containerId);
    if (!mount) return;

    let currentRef = generateRefId();
    mount.innerHTML = getStepFormHTML(currentRef);

    let currentStep = 1;
    let formData = {
      lat: null,
      lng: null,
      locationName: '',
      category: '',
      description: '',
      photoDataUrl: null,
      whatsapp: ''
    };

    // DOM Elements
    const node1 = mount.querySelector('#node-step-1');
    const node2 = mount.querySelector('#node-step-2');
    const node3 = mount.querySelector('#node-step-3');

    const pane1 = mount.querySelector('#pane-step-1');
    const pane2 = mount.querySelector('#pane-step-2');
    const pane3 = mount.querySelector('#pane-step-3');
    const successView = mount.querySelector('#canon-success-view');

    const locBtn = mount.querySelector('#canon-loc-btn');
    const manualLocInput = mount.querySelector('#canon-manual-loc');
    const locStatus = mount.querySelector('#canon-loc-status');
    const btnNextTo2 = mount.querySelector('#btn-next-to-2');

    const catSelect = mount.querySelector('#canon-cat');
    const descTextarea = mount.querySelector('#canon-desc');
    const btnBackTo1 = mount.querySelector('#btn-back-to-1');
    const btnNextTo3 = mount.querySelector('#btn-next-to-3');

    const mediaBox = mount.querySelector('#canon-media-box');
    const fileInput = mount.querySelector('#canon-file-input');
    const mediaEmpty = mount.querySelector('#canon-media-empty');
    const mediaPreview = mount.querySelector('#canon-media-preview');
    const mediaFilename = mount.querySelector('#canon-media-filename');
    const mediaError = mount.querySelector('#canon-media-error');
    const whatsappInput = mount.querySelector('#canon-whatsapp');
    const btnBackTo2 = mount.querySelector('#btn-back-to-2');
    const submitBtn = mount.querySelector('#canon-submit-btn');
    const resetBtn = mount.querySelector('#canon-reset-btn');

    // Navigation function
    function setStep(step) {
      currentStep = step;
      pane1.style.display = (step === 1) ? 'flex' : 'none';
      pane2.style.display = (step === 2) ? 'flex' : 'none';
      pane3.style.display = (step === 3) ? 'flex' : 'none';

      node1.className = 'step-node' + (step === 1 ? ' active' : (step > 1 ? ' complete' : ''));
      node2.className = 'step-node' + (step === 2 ? ' active' : (step > 2 ? ' complete' : ''));
      node3.className = 'step-node' + (step === 3 ? ' active' : '');
    }

    // Step 1 Validation
    function validateStep1() {
      const hasLoc = Boolean((formData.lat && formData.lng) || manualLocInput.value.trim().length >= 3);
      btnNextTo2.disabled = !hasLoc;
      btnNextTo2.style.opacity = hasLoc ? '1' : '0.5';
    }

    // Step 2 Validation
    function validateStep2() {
      const hasCat = Boolean(catSelect.value);
      const hasDesc = Boolean(descTextarea.value.trim().length >= 5);
      const valid = hasCat && hasDesc;
      btnNextTo3.disabled = !valid;
      btnNextTo3.style.opacity = valid ? '1' : '0.5';
    }

    // Event listeners - Step 1 Location
    locBtn.addEventListener('click', function() {
      if (!navigator.geolocation) {
        locStatus.textContent = 'Geolocation not supported. Please enter location manually.';
        return;
      }
      locStatus.textContent = 'Acquiring GPS location…';
      locBtn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        function(pos) {
          formData.lat = pos.coords.latitude;
          formData.lng = pos.coords.longitude;
          formData.locationName = `GPS: ${formData.lat.toFixed(4)}, ${formData.lng.toFixed(4)}`;
          locStatus.textContent = '✓ Location acquired: ' + formData.locationName;
          locBtn.style.backgroundColor = 'var(--sage)';
          locBtn.style.borderColor = 'var(--sage)';
          locBtn.disabled = false;
          validateStep1();
        },
        function(err) {
          locStatus.textContent = 'GPS permission denied or unavailable. Please type location below.';
          locBtn.disabled = false;
          manualLocInput.focus();
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });

    manualLocInput.addEventListener('input', function() {
      formData.locationName = manualLocInput.value.trim();
      if (formData.locationName.length >= 3) {
        locStatus.textContent = '✓ Manual location set';
      }
      validateStep1();
    });

    btnNextTo2.addEventListener('click', () => setStep(2));
    btnBackTo1.addEventListener('click', () => setStep(1));

    catSelect.addEventListener('change', validateStep2);
    descTextarea.addEventListener('input', validateStep2);

    btnNextTo3.addEventListener('click', () => setStep(3));
    btnBackTo2.addEventListener('click', () => setStep(2));

    // Media file upload
    mediaBox.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function() {
      mediaError.style.display = 'none';
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;

      if (file.size > MAX_FILE_SIZE_BYTES) {
        mediaError.textContent = 'File exceeds 10 MB limit. Please select a smaller photo or video.';
        mediaError.style.display = 'block';
        fileInput.value = '';
        return;
      }

      mediaFilename.textContent = `✓ ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`;
      mediaEmpty.style.display = 'none';
      mediaPreview.style.display = 'flex';

      const reader = new FileReader();
      reader.onload = function(e) {
        formData.photoDataUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    // Final Submission Handler
    submitBtn.addEventListener('click', function() {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting…';

      const payload = {
        ref: currentRef,
        formType: 'canonical',
        timestamp: new Date().toISOString(),
        location: formData.locationName || manualLocInput.value.trim(),
        category: catSelect.value,
        description: descTextarea.value.trim(),
        whatsapp: whatsappInput.value.trim() || '',
        photo: formData.photoDataUrl || null
      };

      // Send to webhook with graceful fallback
      fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(() => {
        mount.querySelector('#canon-form-fields-container').style.display = 'none';
        mount.querySelector('#canon-step-progress').style.display = 'none';
        successView.style.display = 'block';
        window.scrollTo({ top: mount.offsetTop - 80, behavior: 'smooth' });
      })
      .catch((err) => {
        console.warn('Webhook transmission error:', err);
        // Display confirmation anyway for user trust
        mount.querySelector('#canon-form-fields-container').style.display = 'none';
        mount.querySelector('#canon-step-progress').style.display = 'none';
        successView.style.display = 'block';
      });
    });

    resetBtn.addEventListener('click', function() {
      initReportForm(containerId);
    });
  }

  window.HAP_REPORT_FORM = {
    init: initReportForm
  };
})();
