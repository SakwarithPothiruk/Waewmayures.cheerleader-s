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

// เปลี่ยน URL นี้เป็น Web App URL ที่ได้จาก Deploy Google Apps Script
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwN0HhOOpZHjTkNok1T0VGt80jDYCmjT6e466-VaHKDLDlBjk2hWyWP6lwjUJoxm4mi/exec://script.google.com/macros/s/YOUR_WEB_APP_ID/exec";

// 1. ตรวจสอบ Auto-Login
window.addEventListener('DOMContentLoaded', () => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole === 'User') window.location.href = 'dashboard.html';
    else if (savedRole === 'Staff' || savedRole === 'Admin') window.location.href = 'admin.html';
});

// 2. ส่งค่าไปเช็กสิทธิ์ล็อกอิน
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;

    submitBtn.innerText = "VERIFYING...";
    submitBtn.disabled = true;

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'login',
                username: username,
                password: password,
                role: role
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            // เซฟข้อมูลลง localStorage
            localStorage.setItem('username', result.username);
            localStorage.setItem('userRole', result.role);
            localStorage.setItem('userGroup', result.group); // เซฟกลุ่ม เช่น Group A

            // Redirect แยกตาม Role
            if (result.role === 'User') {
                window.location.href = 'dashboard.html';
            } else if (result.role === 'Staff' || result.role === 'Admin') {
                window.location.href = 'admin.html';
            }
        } else {
            alert(result.message || 'ข้อมูลไม่ถูกต้อง!');
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});

// 3. ปุ่มสลับเปิด-ปิดดูรหัสผ่าน
const togglePassword = document.querySelector('#togglePassword');
const passwordInput = document.querySelector('#password');

togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. ระบุ ID ของปุ่ม/ลิงก์สมัครเรียนบนหน้าเว็บ
    const registerBtn = document.getElementById('register-link');

    // ฟังก์ชันเช็กว่าหมดเวลาแล้วหรือยัง (>= 22:00 น.)
    function isExpired() {
        const currentHour = new Date().getHours();
        return currentHour >= 22; // ตั้งแต่ 22:00 น. เป็นต้นไป
    }

    // กรณีที่ 1: ดักจับการกดปุ่มบนหน้าหลัก
    if (registerBtn) {
        if (isExpired()) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'closed.html';
            });
        }
    }

    // กรณีที่ 2: ดักจับถ้าผู้ใช้แอบพิมพ์ URL เข้าหน้าสมัครตรงๆ
    // (นำบรรทัดล่างนี้ไปวางบนสุดของไฟล์ JS ในหน้าฟอร์มสมัคร)
    if (isExpired() && window.location.pathname.includes('form.html')) {
        window.location.href = 'closed.html';
    }
});

/* =========================================================
   5. DEADLINE AUTO-REDIRECT (CLOSES AT 22:00)
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    function isExpired() {
        const currentHour = new Date().getHours();
        return currentHour >= 22; // เช็กเวลาตั้งแต่ 22:00 น. เป็นต้นไป
    }

    // กรณีที่ 1: ดักจับการกดปุ่ม Apply Now บนหน้าหลัก
    const registerBtns = document.querySelectorAll('a[href="apply.html"], #register-link');
    if (isExpired()) {
        registerBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'closed.html';
            });
        });
    }

    // กรณีที่ 2: ถ้าเปิดเข้ามาในหน้าสมัคร (apply.html หรือ form.html) ตรงๆ หลัง 22:00 น. ให้เด้งออกทันที
    const currentPath = window.location.pathname;
    if (isExpired() && (currentPath.includes('apply.html') || currentPath.includes('form.html'))) {
        window.location.href = 'closed.html';
    }
});