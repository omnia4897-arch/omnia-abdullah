/* =========================
   الانتقال بين الأقسام
========================= */

function scrollToSection(sectionId) {

    const section = document.getElementById(sectionId);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }
}


/* =========================
   فتح الجواب
========================= */

function openLetter() {

    const letter =
        document.getElementById("love-letter");

    const button =
        document.querySelector(".letter-open");

    if (!letter) {
        return;
    }

    if (letter.classList.contains("show")) {

        letter.classList.remove("show");

        button.textContent =
            "💌 افتح رسالتي";

    } else {

        letter.classList.add("show");

        button.textContent =
            "💌 اقفل الرسالة";

        setTimeout(() => {

            letter.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 300);

    }
}


/* =========================
   عداد بسيط من بداية الحكاية
========================= */

function updateCounter() {

    const startDate =
        new Date("2026-05-30T00:00:00");

    const now =
        new Date();

    const difference =
        now - startDate;

    if (difference < 0) {
        return;
    }

    const seconds =
        Math.floor(difference / 1000);

    const days =
        Math.floor(seconds / 86400);

}


/* تشغيل العداد */

setInterval(updateCounter, 1000);

updateCounter();