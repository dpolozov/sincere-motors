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

    if (estimateForm) {
        estimateForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = estimateForm.querySelector('button[type="submit"]');
            const successAlert = document.querySelector('#successAlert');
            const closeAlertBtn = document.querySelector('#closeAlertBtn');

            // Show loading state on the button
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
                    // 1. Close the estimate modal immediately
                    modal.style.display = "none";
                    estimateForm.reset();

                    // 2. Show the slim success alert
                    successAlert.style.display = "flex"; // Using flex to center content

                    // 3. Close alert logic
                    closeAlertBtn.onclick = () => {
                        successAlert.style.display = "none";
                    };
                } else {
                    throw new Error('Form submission failed');
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