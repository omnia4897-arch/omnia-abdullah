/* الانتقال بين الأقسام */
function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

/* فتح الجواب */
function openLetter() {
    var letter = document.getElementById("love-letter");
    var button = document.querySelector(".letter-open");

    if (!letter || !button) {
        return;
    }

    if (letter.classList.contains("show")) {
        letter.classList.remove("show");
        button.textContent = "💌 افتح رسالتي";
    } else {
        letter.classList.add("show");
        button.textContent = "💌 اقفل الرسالة";
        setTimeout(function () {
            letter.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
    }
}

/* العداد من بداية الحكاية */
function updateCounter() {
    var startDate = new Date("2026-05-30T00:00:00");
    var difference = new Date() - startDate;

    if (difference < 0) {
        return;
    }

    var seconds = Math.floor(difference / 1000);
    var days = Math.floor(seconds / 86400);
    var set = function (id, v) {
        var el = document.getElementById(id);
        if (el) { el.textContent = v; }
    };

    set("days-count", days);
    set("c-d", days);
    set("c-h", Math.floor(seconds / 3600) % 24);
    set("c-m", Math.floor(seconds / 60) % 60);
    set("c-s", seconds % 60);
}

setInterval(updateCounter, 1000);
updateCounter();

/* ظهور تدريجي */
(function () {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        items.forEach(function (el) { el.classList.add("in"); });
        return;
    }
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add("in");
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
})();

/* القائمة: القسم الحالي */
(function () {
    var links = document.querySelectorAll(".nav a");
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    if (!("IntersectionObserver" in window)) { return; }
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                links.forEach(function (a) { a.classList.remove("active"); });
                var a = map[e.target.id];
                if (a) {
                    a.classList.add("active");
                    var nav = document.getElementById("nav");
                    nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" });
                }
            }
        });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) {
        var s = document.getElementById(id);
        if (s) { io.observe(s); }
    });
})();

/* تكبير الصور */
(function () {
    var shots = Array.prototype.slice.call(document.querySelectorAll(".shot img"));
    var lb = document.getElementById("lb");
    if (!lb || !shots.length) { return; }
    var img = lb.querySelector("img");
    var cur = 0;
    function show(i) {
        cur = (i + shots.length) % shots.length;
        img.src = shots[cur].src;
    }
    function open(i) { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); }
    function close() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); }
    shots.forEach(function (s, i) { s.addEventListener("click", function () { open(i); }); });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(cur + 1); });
    lb.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(cur - 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) { close(); } });
    document.addEventListener("keydown", function (e) {
        if (!lb.classList.contains("open")) { return; }
        if (e.key === "Escape") { close(); }
        if (e.key === "ArrowLeft") { show(cur + 1); }
        if (e.key === "ArrowRight") { show(cur - 1); }
    });
})();

/* قلوب طايرة هادية */
(function () {
    var c = document.getElementById("hearts");
    if (!c || !c.getContext || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }
    var ctx = c.getContext("2d");
    var W, H, hs = [];
    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    for (var i = 0; i < 16; i++) {
        hs.push({ x: Math.random() * W, y: Math.random() * H, s: 10 + Math.random() * 14, v: .25 + Math.random() * .45, o: .1 + Math.random() * .22, p: Math.random() * 6 });
    }
    function tick(t) {
        ctx.clearRect(0, 0, W, H);
        hs.forEach(function (h) {
            h.y -= h.v;
            if (h.y < -30) { h.y = H + 30; h.x = Math.random() * W; }
            ctx.globalAlpha = h.o;
            ctx.font = h.s + "px serif";
            ctx.fillText("❤", h.x + Math.sin(t / 1500 + h.p) * 14, h.y);
        });
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
})();
