const initSite = () => {
    // --- SELECTORS ---
    const burger = document.querySelector('#burger');
    const nav = document.querySelector('.nav-links');
    const modal = document.querySelector('#estimateModal');
    const openModalBtn = document.querySelector('#openEstimateModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const estimateForm = document.querySelector('#estimateForm');
    
    const callbackCheck = document.querySelector('#callbackRequest');
    const phoneInput = document.querySelector('#custPhone');
    const phoneLabel = document.querySelector('#phoneReqLabel');

    // --- MOBILE NAV ---
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    // --- MODAL OPEN/CLOSE ---
    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', (e) => {
            modal.style.display = "block";
        });
    }

    if (closeModalBtn) {
        closeModalBtn.onclick = () => modal.style.display = "none";
    }

    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

    // --- CLOSE MODAL ON ESC KEY ---
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
        }
    });

    // --- CONDITIONAL PHONE REQUIREMENT ---
    if (callbackCheck && phoneInput) {
        callbackCheck.addEventListener('change', () => {
            if (callbackCheck.checked) {
                phoneInput.required = true;
                if (phoneLabel) phoneLabel.innerText = "* (Required)";
            } else {
                phoneInput.required = false;
                if (phoneLabel) phoneLabel.innerText = "(Optional)";
            }
        });
    }

    // --- EMAILJS SUBMISSION ---
    if (estimateForm) {
        estimateForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Change button text to show progress
            const submitBtn = this.querySelector('button');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            // Prepare parameters (The keys must match the {{variables}} in your EmailJS template)
            const templateParams = {
                custName: document.querySelector('#custName').value,
                custEmail: document.querySelector('#custEmail').value,
                custPhone: phoneInput.value || "Not provided",
                issueDesc: document.querySelector('#issueDesc').value,
                callback: callbackCheck.checked ? "Yes" : "No"
            };

            // Send via EmailJS
            emailjs.send('service_sutnpxr', 'template_rnv20e6', templateParams)
                .then(function() {
                    alert("Thank you! Your estimate request has been sent successfully.");
                    modal.style.display = "none";
                    estimateForm.reset();
                }, function(error) {
                    alert("Oops... something went wrong. Please try calling us instead.");
                    console.log('FAILED...', error);
                })
                .finally(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
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