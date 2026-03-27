const initSite = () => {
    // --- SELECTORS ---
    const burger = document.querySelector('#burger');
    const nav = document.querySelector('.nav-links');
    const modal = document.querySelector('#estimateModal');
    const openModalBtn = document.querySelector('#openEstimateModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const estimateForm = document.querySelector('#estimateForm');
    
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
    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', () => modal.style.display = "flex");
    }

    if (closeModalBtn) {
        closeModalBtn.onclick = () => modal.style.display = "none";
    }

    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modal.style.display === "block") modal.style.display = "none";
    });

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

    // --- FORM SUBMISSION (StaticForms) ---
    if (estimateForm) {
        estimateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = estimateForm.querySelector('button[type="submit"]');
            const successAlert = document.querySelector('#successAlert');
            const closeAlertBtn = document.querySelector('#closeAlertBtn');

            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            const formData = new FormData(estimateForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('https://api.staticforms.xyz/submit', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    modal.style.display = "none";
                    estimateForm.reset();
                    // Reset phone field visibility after reset
                    phoneGroup.style.display = "none";
                    phoneInput.required = false;

                    if (successAlert) {
                        successAlert.style.display = "flex";
                        closeAlertBtn.onclick = () => successAlert.style.display = "none";
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