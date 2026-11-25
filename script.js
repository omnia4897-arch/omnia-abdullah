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
        button.textContent = "💌 شوف أول جواب مني";
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

/* ===== الباك إند (Google Apps Script) ===== */
var API_URL = "https://script.google.com/macros/s/AKfycbwoCZuUhumgz6j_UymYYVFUXNsLZjnfVc8In8DLHq4Jcm42Avro8KceD8QzboSpTTLP/exec";
var API_SECRET = "7696d4b2c626ae8b2aa3b595";
function apiPost(o) {
    o.secret = API_SECRET;
    return fetch(API_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(o) })
        .then(function (r) { return r.json(); });
}
var MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
function fmtDate(d) { var p = d.split("-"); return parseInt(p[2], 10) + " " + MONTHS_AR[parseInt(p[1], 10) - 1] + " " + p[0]; }
function todayISO() { var n = new Date(); return n.getFullYear() + "-" + ("0" + (n.getMonth() + 1)).slice(-2) + "-" + ("0" + n.getDate()).slice(-2); }

/* ===== يومياتنا ===== (الإدخالات الجديدة بتيجي من الشيت تلقائيا) */
var JOURNAL_SEED = [
    { id: "seed1", date: "2026-05-30", title: "بداية الحكاية", text: "ومن يومها... بقى في حكاية اسمها أُمـنـيـة وعَبـدُالله. ❤️" }
];
/* ===== رسايل طايرة ===== (بتيجي من الشيت) */
var FLYING_SEED = [];

var journalEntries = JOURNAL_SEED.slice(), flyingEntries = FLYING_SEED.slice();
function renderJournal() {
    var list = document.getElementById("journal-list");
    if (!list) return;
    list.innerHTML = "";
    journalEntries.slice().sort(function (a, b) { return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); }).forEach(function (e) {
        var c = document.createElement("article"); c.className = "journal-card";
        var d = document.createElement("div"); d.className = "journal-date"; d.textContent = "📅 " + fmtDate(e.date);
        c.appendChild(d);
        if (e.title) { var t = document.createElement("h4"); t.textContent = e.title; c.appendChild(t); }
        var x = document.createElement("p"); x.textContent = e.text; c.appendChild(x);
        list.appendChild(c);
    });
}
function renderFlying() {
    var list = document.getElementById("fly-list");
    if (!list) return;
    list.innerHTML = "";
    var modal = document.getElementById("fly-modal");
    function show(e) {
        document.getElementById("fly-pdate").textContent = "📅 " + fmtDate(e.date);
        document.getElementById("fly-ptitle").textContent = e.title || "";
        document.getElementById("fly-ptext").textContent = e.text;
        modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    }
    var items = flyingEntries.slice().sort(function (a, b) { return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); });
    if (!items.length) {
        var ph = document.createElement("div"); ph.className = "fly-empty";
        ph.innerHTML = '<div class="fly-env">✉️</div><p>أول رسالة طايرة جاية قريب ✉️</p>';
        list.appendChild(ph); return;
    }
    items.forEach(function (e, i) {
        var b = document.createElement("button"); b.type = "button"; b.className = "fly-item" + (i === 0 ? " newest" : "");
        var env = document.createElement("span"); env.className = "fly-env"; env.textContent = "✉️";
        var box = document.createElement("span"); box.className = "fly-meta";
        var t = document.createElement("strong"); t.textContent = e.title || "رسالة طايرة";
        var d = document.createElement("small"); d.textContent = fmtDate(e.date);
        box.appendChild(t); box.appendChild(d); b.appendChild(env); b.appendChild(box);
        if (i === 0) { var bd = document.createElement("span"); bd.className = "fly-badge"; bd.textContent = "جديد"; b.appendChild(bd); }
        b.addEventListener("click", function () { show(e); });
        list.appendChild(b);
    });
}
renderJournal(); renderFlying();
(function () {
    var modal = document.getElementById("fly-modal");
    if (modal) {
        function hide() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
        document.getElementById("fly-close").addEventListener("click", hide);
        modal.addEventListener("click", function (ev) { if (ev.target === modal) hide(); });
    }
    /* تحميل الإدخالات من الشيت */
    fetch(API_URL).then(function (r) { return r.json(); }).then(function (j) {
        if (!j || !j.ok) return;
        var ex = {}; journalEntries.forEach(function (e) { ex[e.id] = 1; });
        j.entries.forEach(function (e) {
            if (e.kind === "journal" && !ex[e.id]) journalEntries.push(e);
            if (e.kind === "flying") flyingEntries.push(e);
        });
        renderJournal(); renderFlying();
    }).catch(function () {});

    /* نموذج اكتبي ذكرى */
    var jm = document.getElementById("journal-modal"), ta = document.getElementById("journal-text"), msg = document.getElementById("journal-msg");
    if (jm) {
        function open(v) { jm.classList.toggle("open", v); jm.setAttribute("aria-hidden", v ? "false" : "true"); msg.textContent = ""; if (v) setTimeout(function () { ta.focus(); }, 100); }
        document.getElementById("journal-add").addEventListener("click", function () { open(true); });
        document.getElementById("journal-cancel").addEventListener("click", function () { open(false); });
        jm.addEventListener("click", function (e) { if (e.target === jm) open(false); });
        document.getElementById("journal-form").addEventListener("submit", function (e) {
            e.preventDefault();
            var v = ta.value.trim(); if (!v) return;
            var btn = document.querySelector(".journal-send"); btn.disabled = true; msg.textContent = "بنحفظها... ⏳";
            apiPost({ kind: "journal", date: todayISO(), title: "", text: v }).then(function (r) {
                btn.disabled = false;
                if (r && r.ok) { journalEntries.push({ id: r.id, date: todayISO(), title: "", text: v }); renderJournal(); ta.value = ""; open(false); }
                else { msg.textContent = "حصلت مشكلة، جربي تاني 🙏"; }
            }).catch(function () { btn.disabled = false; msg.textContent = "حصلت مشكلة في النت، جربي تاني 🙏"; });
        });
    }

    /* قصة الشهور: فتح وقفل، واحد بس مفتوح */
    var ms = document.querySelectorAll("#story .milestone");
    ms.forEach(function (m, i) {
        m.classList.add("acc");
        var head = document.createElement("button"); head.type = "button"; head.className = "acc-head";
        var k = m.querySelector(".kicker.small"), dte = m.querySelector(".memory-date"), h3 = m.querySelector("h3");
        var label = document.createElement("span"); label.className = "acc-label";
        if (k) label.appendChild(k);
        if (dte) label.appendChild(dte);
        var chev = document.createElement("span"); chev.className = "acc-chev"; chev.textContent = "⌄";
        head.appendChild(label); head.appendChild(chev);
        var body = m.querySelector(".memory-text"); m.insertBefore(head, body);
        head.addEventListener("click", function () {
            var was = m.classList.contains("open");
            ms.forEach(function (o) { o.classList.remove("open"); });
            if (!was) m.classList.add("open");
        });
        if (i === 0) m.classList.add("open");
    });
    var story = document.querySelector("#story .timeline");
    if (story) {
        var nx = document.createElement("article"); nx.className = "milestone soon reveal";
        nx.innerHTML = '<div class="dot"></div><div class="soon-card"><span class="soon-ico">🌱</span><div>الشهر الجاي...</div><small>الحكاية لسه بتكمل ❤️</small></div>';
        story.appendChild(nx);
    }

    /* كارت السؤال الظريف */
    try {
        var day = todayISO();
        if (localStorage.getItem("qz-day") !== day) {
            var q = document.getElementById("quiz");
            setTimeout(function () { q.classList.add("show"); }, 4000);
            var done = function () { try { localStorage.setItem("qz-day", day); } catch (e) {} q.classList.remove("show"); };
            document.getElementById("quiz-x").addEventListener("click", done);
            document.getElementById("quiz-form").addEventListener("submit", function (e) {
                e.preventDefault();
                var v = document.getElementById("quiz-in").value.trim(); if (!v) return;
                var b = document.getElementById("quiz-send"); b.disabled = true;
                apiPost({ kind: "answer", date: day, title: "بتحب أمنية قد إيه النهارده؟", text: v }).then(function () {
                    document.getElementById("quiz-body").innerHTML = '<div class="quiz-thanks">وصلت! 😂❤️<br><small>أمنية هتعرف على طول</small></div>';
                    try { localStorage.setItem("qz-day", day); } catch (e) {}
                    setTimeout(function () { q.classList.remove("show"); }, 2600);
                }).catch(function () { b.disabled = false; b.textContent = "جرب تاني 😅"; });
            });
        }
    } catch (e) {}
})();
