/**
 * TCF Auto - Website Interaction Script
 * Handles: Navigation, Modals, Conditional Contact Fields, and reCAPTCHA/StaticForms Submission
 */

const initSite = () => {
    // --- SELECTORS ---
    const burger = document.querySelector('#burger');
    const nav = document.querySelector('.nav-links');
    const modal = document.querySelector('#estimateModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const estimateForm = document.querySelector('#estimateForm');
    const successAlert = document.querySelector('#successAlert');
    const closeAlertBtn = document.querySelector('#closeAlertBtn');
    
    // Dynamic contact field selectors
    const phoneGroup = document.querySelector('#phone-group');
    const phoneInput = document.querySelector('#custPhone');
    const phoneLabel = document.querySelector('#phoneReqLabel');
    const replyRadios = document.querySelectorAll('input[name="replyTo"]');
    const contactPrefHidden = document.querySelector('#contactPrefHidden');

    // --- RECAPTCHA UI FIX ---
    // Injects style to lift the "Verify" challenge bubble so it isn't obscured
    const style = document.createElement('style');
    style.innerHTML = `
        iframe[title="recaptcha challenge"] { 
            transform: translateY(-100px) !important; 
            -webkit-transform: translateY(-100px) !important; 
        }
    `;
    document.head.appendChild(style);

    // --- MOBILE NAVIGATION ---
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    // --- MODAL CONTROLS ---
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

    // --- CONDITIONAL PHONE LOGIC ---
    // Toggles phone requirement based on user preference
    if (replyRadios.length > 0 && phoneGroup && phoneInput) {
        replyRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const selected = document.querySelector('input[name="replyTo"]:checked').value;
                
                if (selected === 'phone') {
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

    // --- FORM SUBMISSION (STATICFORMS + FETCH) ---
    if (estimateForm) {
        estimateForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check if reCAPTCHA is actually completed
            const recaptchaResponse = grecaptcha.getResponse();
            if (recaptchaResponse.length === 0) {
                alert("Please complete the reCAPTCHA to verify you are human.");
                return; 
            }

            // Prepare data object for StaticForms
            const formData = new FormData(estimateForm);
            const data = Object.fromEntries(formData.entries());
            data['g-recaptcha-response'] = recaptchaResponse;
            data.subject = "New Estimate Request - TCF Auto"; // Updated branding

            const submitBtn = document.querySelector('button[type="submit"]') || estimateForm.querySelector('button');
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
                    estimateForm.reset();
                    grecaptcha.reset(); 
                    if (phoneGroup) phoneGroup.style.display = "none"; 
                    
                    if (successAlert) successAlert.style.display = "flex";
                    if (closeAlertBtn) {
                        closeAlertBtn.onclick = () => successAlert.style.display = "none";
                    }
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                // Provides your specific business phone for fallback
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
                    // Close mobile nav on click
                    if (nav.classList.contains('nav-active')) {
                        nav.classList.remove('nav-active');
                        burger.classList.remove('toggle');
                    }
                }
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', initSite);