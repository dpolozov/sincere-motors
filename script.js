const initSite = () => {
    // --- SELECTORS ---
    const burger = document.querySelector('#burger');
    const nav = document.querySelector('.nav-links');
    const modal = document.querySelector('#estimateModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const estimateForm = document.querySelector('#estimateForm');
    const closeAlertBtn = document.querySelector('#closeAlertBtn');
    const successAlert = document.querySelector('#successAlert');
    
    // Selectors for dynamic contact fields
    const phoneGroup = document.querySelector('#phone-group');
    const phoneInput = document.querySelector('#custPhone');
    const phoneLabel = document.querySelector('#phoneReqLabel');
    const replyRadios = document.querySelectorAll('input[name="replyTo"]');
    const contactPrefHidden = document.querySelector('#contactPrefHidden');

    // --- MOBILE NAV ---
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    // --- MODAL OPEN/CLOSE ---
    // Select all buttons that should open the estimate modal
    const openModalButtons = document.querySelectorAll('#openEstimateModal, .open-modal-trigger');

    if (openModalButtons.length > 0 && modal) {
        openModalButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = "flex";
            });
        });
    }

    if (closeModalBtn) {
        closeModalBtn.onclick = () => modal.style.display = "none";
    }

    // --- CONDITIONAL PHONE & CONTACT PREFERENCE LOGIC ---
    if (replyRadios.length > 0 && phoneGroup && phoneInput) {
        replyRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const isPhoneRequested = document.querySelector('input[name="replyTo"]:checked').value === 'phone';
                
                if (isPhoneRequested) {
                    phoneGroup.style.display = "block";
                    phoneInput.required = true;
                    if (contactPrefHidden) contactPrefHidden.value = "!!! CALL BACK REQUESTED !!!";
                    if (phoneLabel) {
                        phoneLabel.innerText = "* (Required)";
                        phoneLabel.style.color = "#d9534f";
                    }
                    phoneInput.focus();
                } else {
                    phoneGroup.style.display = "none";
                    phoneInput.required = false;
                    if (contactPrefHidden) contactPrefHidden.value = "Email Only";
                    if (phoneLabel) {
                        phoneLabel.innerText = "(Optional)";
                        phoneLabel.style.color = "#666";
                    }
                    phoneInput.value = ""; 
                }
            });
        });
    }

    // --- FORM SUBMISSION ---
    if (estimateForm) {
        estimateForm.addEventListener('submit', async (e) => {
            e.preventDefault();

        // 1. Get reCAPTCHA response
            const recaptchaResponse = grecaptcha.getResponse();
            
            if (recaptchaResponse.length === 0) {
                alert("Please complete the reCAPTCHA check.");
                return; // Stop submission if not checked
            }

            // 2. Collect checked services (from previous step)
            const checkedServices = [];
            const checkboxes = estimateForm.querySelectorAll('input[name="services[]"]:checked');
            checkboxes.forEach(cb => checkedServices.push(cb.value));

            // 3. Prepare the data object
            const formData = new FormData(estimateForm);
            const data = Object.fromEntries(formData.entries());

            // 4. Add the reCAPTCHA token and services to the data
            data['g-recaptcha-response'] = recaptchaResponse; // StaticForms looks for this key
            data.services_requested = checkedServices.join(', ');
            data.subject = "New Estimate Request - TCF Auto";

            const submitBtn = estimateForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            try {
                submitBtn.innerText = "Sending...";
                submitBtn.disabled = true;

                const response = await fetch('https://api.staticforms.xyz/submit', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                });

                const result = await response.json();

                if (result.success) {
                    // ... rest of your success logic (reset form, show successAlert)
                    estimateForm.reset();
                    phoneGroup.style.display = "none";
                    phoneInput.required = false;

                    if (successAlert) {
                        successAlert.style.display = "flex";
                    }
                    if (closeAlertBtn) {
                    closeAlertBtn.onclick = () => {
                        successAlert.style.display = "none";
                    };
                }
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                alert("Connection error. Please call us at (650) 931-4839.");
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- SMOOTH SCROLLING ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                }
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', initSite);