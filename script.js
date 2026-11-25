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
        button.textContent = "💌 افتحي أول جواب مني";
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

/* ===== تفاعل إضافي ===== */
(function () {
    function burst(x, y, set) {
        for (var i = 0; i < 9; i++) {
            var s = document.createElement("span");
            s.className = "pop-emoji";
            s.textContent = set[Math.floor(Math.random() * set.length)];
            s.style.left = (x + (Math.random() * 80 - 40)) + "px";
            s.style.top = (y + (Math.random() * 20 - 10)) + "px";
            s.style.fontSize = (16 + Math.random() * 18) + "px";
            s.style.animationDuration = (1.1 + Math.random() * 1.2) + "s";
            document.body.appendChild(s);
            setTimeout((function (el) { return function () { el.remove(); }; })(s), 2600);
        }
    }
    document.addEventListener("click", function (e) {
        var c = e.target.closest && e.target.closest(".message-card");
        if (c) { burst(e.clientX, e.clientY, ["❤️", "💖", "🤍", "✨", "💕"]); c.classList.add("tapped"); setTimeout(function () { c.classList.remove("tapped"); }, 500); }
        var b = e.target.closest && e.target.closest(".letter-open");
        if (b) { burst(e.clientX, e.clientY, ["💌", "❤️", "🌹", "💖", "✨", "🦋", "🥰"]); }
    });
    /* إيموجي بتطلع في قسم الجواب */
    var sec = document.getElementById("letter"), on = false;
    if (sec && "IntersectionObserver" in window) {
        new IntersectionObserver(function (en) { on = en[0].isIntersecting; }, { threshold: 0.15 }).observe(sec);
        var set = ["💌", "❤️", "🌹", "✨", "🦋", "💖", "🥰", "🌸", "💕", "🕊️"];
        setInterval(function () {
            if (!on || document.hidden) return;
            var s = document.createElement("span");
            s.className = "float-emoji";
            s.textContent = set[Math.floor(Math.random() * set.length)];
            s.style.left = (Math.random() * 90 + 2) + "%";
            s.style.fontSize = (18 + Math.random() * 20) + "px";
            s.style.animationDuration = (5 + Math.random() * 4) + "s";
            sec.appendChild(s);
            setTimeout(function () { s.remove(); }, 9500);
        }, 700);
    }
    /* إخفاء تلميح السحب بعد أول سحب */
    document.querySelectorAll(".gallery,.message-stack").forEach(function (g) {
        g.addEventListener("scroll", function () {
            var h = g.previousElementSibling;
            if (h && h.classList.contains("swipe-hint")) h.classList.add("gone");
        }, { passive: true });
    });
})();

/* ===== يومياتنا =====
   لإضافة ذكرى جديدة: أضف سطرا جديدا في القائمة تحت بنفس الشكل. الترتيب بيتعمل تلقائيا (الأحدث فوق).
   { date: "YYYY-MM-DD", title: "العنوان", text: "النص" } */
var JOURNAL = [
    { date: "2026-05-30", title: "بداية الحكاية", text: "ومن يومها... بقى في حكاية اسمها أُمـنـيـة وعَبـدُالله. ❤️" }
];
(function () {
    var list = document.getElementById("journal-list");
    if (!list) return;
    var months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    JOURNAL.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).forEach(function (e) {
        var p = e.date.split("-"), c = document.createElement("article");
        c.className = "journal-card reveal";
        var d = document.createElement("div"); d.className = "journal-date";
        d.textContent = "📅 " + parseInt(p[2], 10) + " " + months[parseInt(p[1], 10) - 1] + " " + p[0];
        var t = document.createElement("h4"); t.textContent = e.title;
        var x = document.createElement("p"); x.textContent = e.text;
        c.appendChild(d); c.appendChild(t); c.appendChild(x); list.appendChild(c);
        if (window.IntersectionObserver === undefined) c.classList.add("in");
    });
    var modal = document.getElementById("journal-modal"), ta = document.getElementById("journal-text");
    function open(v) { modal.classList.toggle("open", v); modal.setAttribute("aria-hidden", v ? "false" : "true"); if (v) setTimeout(function () { ta.focus(); }, 100); }
    document.getElementById("journal-add").addEventListener("click", function () { open(true); });
    document.getElementById("journal-cancel").addEventListener("click", function () { open(false); });
    modal.addEventListener("click", function (e) { if (e.target === modal) open(false); });
    document.getElementById("journal-form").addEventListener("submit", function (e) {
        e.preventDefault();
        var v = ta.value.trim(); if (!v) return;
        window.open("https://wa.me/16508702892?text=" + encodeURIComponent(v), "_blank");
        ta.value = ""; open(false);
    });
})();

/* ===== رسايل طايرة =====
   لإضافة رسالة جديدة: أضف سطرا في القائمة تحت. الأحدث بيظهر لوحده في الأعلى بشارة "جديد".
   { date: "YYYY-MM-DD", title: "العنوان", text: "النص (سطر جديد = \n)" } */
var FLYING = [
];
(function () {
    var list = document.getElementById("fly-list");
    if (!list) return;
    var months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    function fmt(d) { var p = d.split("-"); return parseInt(p[2], 10) + " " + months[parseInt(p[1], 10) - 1] + " " + p[0]; }
    var modal = document.getElementById("fly-modal");
    function show(e) {
        document.getElementById("fly-pdate").textContent = "📅 " + fmt(e.date);
        document.getElementById("fly-ptitle").textContent = e.title;
        document.getElementById("fly-ptext").textContent = e.text;
        modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    }
    function hide() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
    document.getElementById("fly-close").addEventListener("click", hide);
    modal.addEventListener("click", function (ev) { if (ev.target === modal) hide(); });
    var items = FLYING.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    if (!items.length) {
        var ph = document.createElement("div");
        ph.className = "fly-empty";
        ph.innerHTML = '<div class="fly-env">✉️</div><p>أول رسالة طايرة جاية قريب ✉️</p>';
        list.appendChild(ph);
        return;
    }
    items.forEach(function (e, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "fly-item" + (i === 0 ? " newest" : "");
        var env = document.createElement("span"); env.className = "fly-env"; env.textContent = "✉️";
        var box = document.createElement("span"); box.className = "fly-meta";
        var t = document.createElement("strong"); t.textContent = e.title;
        var d = document.createElement("small"); d.textContent = fmt(e.date);
        box.appendChild(t); box.appendChild(d);
        b.appendChild(env); b.appendChild(box);
        if (i === 0) { var bd = document.createElement("span"); bd.className = "fly-badge"; bd.textContent = "جديد"; b.appendChild(bd); }
        b.addEventListener("click", function () { show(e); });
        list.appendChild(b);
    });
})();
