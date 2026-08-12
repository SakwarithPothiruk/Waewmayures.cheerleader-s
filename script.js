document.addEventListener("DOMContentLoaded", function () {
    
    /* =========================================================
       1. Q&A ACCORDION
       ========================================================= */
    const faqArticles = document.querySelectorAll("#faq article");

    faqArticles.forEach((article) => {
        const question = article.querySelector("h3");
        const answer = article.querySelector("p");

        if (question && answer) {
            answer.style.maxHeight = "0px";
            answer.style.overflow = "hidden";
            answer.style.transition = "max-height 0.4s ease, opacity 0.3s ease, margin-top 0.3s ease";
            answer.style.opacity = "0";
            answer.style.marginTop = "0px";

            question.style.cursor = "pointer";
            question.style.display = "flex";
            question.style.justifyContent = "space-between";
            question.style.alignItems = "center";
            
            const icon = document.createElement("span");
            icon.innerHTML = "▾";
            icon.style.transition = "transform 0.3s ease, color 0.3s ease";
            icon.style.fontSize = "18px";
            icon.style.color = "var(--color-gold)";
            question.appendChild(icon);

            question.addEventListener("click", () => {
                const isOpen = article.classList.contains("active");

                faqArticles.forEach((otherArticle) => {
                    if (otherArticle !== article) {
                        otherArticle.classList.remove("active");
                        const otherAnswer = otherArticle.querySelector("p");
                        const otherIcon = otherArticle.querySelector("h3 span");
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = "0px";
                            otherAnswer.style.opacity = "0";
                            otherAnswer.style.marginTop = "0px";
                        }
                        if (otherIcon) {
                            otherIcon.style.transform = "rotate(0deg)";
                        }
                    }
                });

                if (isOpen) {
                    article.classList.remove("active");
                    answer.style.maxHeight = "0px";
                    answer.style.opacity = "0";
                    answer.style.marginTop = "0px";
                    icon.style.transform = "rotate(0deg)";
                } else {
                    article.classList.add("active");
                    answer.style.maxHeight = answer.scrollHeight + 20 + "px";
                    answer.style.opacity = "1";
                    answer.style.marginTop = "12px";
                    icon.style.transform = "rotate(180deg)";
                }
            });
        }
    });

    /* =========================================================
       2. IMAGE SLIDESHOW
       ========================================================= */
    const cheerContainer = document.getElementById("cheer-images");
    if (cheerContainer) {
        const images = cheerContainer.querySelectorAll("img");
        let currentIndex = 0;

        if (images.length > 0) {
            function cycleImages() {
                images[currentIndex].classList.remove("active");
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.add("active");
            }
            setInterval(cycleImages, 3500);
        }
    }

    /* =========================================================
       3. SCROLL FADE-IN ANIMATION
       ========================================================= */
    const fadeElements = document.querySelectorAll(
        "section, .cards-grid article, #process li, fieldset"
    );

    fadeElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
    });

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach((el) => scrollObserver.observe(el));

    /* =========================================================
       4. GOOGLE SHEETS FORM SUBMISSION (FIXED CORS & POPUP)
       ========================================================= */
    const applyForm = document.querySelector("#application form");
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz1yvszUJfRlF7KtaHi0DFXlB-Lz8gD3w0KIFAj6rOoZDqPAzRVqsb1AUmAbQ6lD0E/exec";

    // ฟังก์ชันสร้าง Notification Popup เด้งแจ้งเตือน
    function showCustomNotice(message, isError = false) {
        let noticeBox = document.getElementById("custom-notice");
        if (!noticeBox) {
            noticeBox = document.createElement("div");
            noticeBox.id = "custom-notice";
            document.body.appendChild(noticeBox);
        }
        
        noticeBox.className = isError ? "error" : "success";
        noticeBox.innerText = message;
        noticeBox.classList.add("show");

        setTimeout(() => {
            noticeBox.classList.remove("show");
        }, 4000);
    }

    if (applyForm) {
        applyForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const submitBtn = applyForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            submitBtn.disabled = true;
            submitBtn.innerText = "SENDING...";

            const formData = new FormData(applyForm);

            // ใช้ mode: 'no-cors' เพื่อป้องกันการบล็อกของ Google Apps Script
            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                body: formData,
                mode: "no-cors"
            })
            .then(() => {
                showCustomNotice("บันทึกข้อมูลสำเร็จ! กำลังนำคุณไปหน้าขอบคุณ...");
                setTimeout(() => {
                    window.location.href = "thanks.html";
                }, 1500);
            })
            .catch((error) => {
                console.error("Error!", error.message);
                showCustomNotice("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", true);
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            });
        });
    }
});