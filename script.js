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

var journalEntries = JOURNAL_SEED.slice(), flyingEntries = FLYING_SEED.slice(), answerEntries = [];
function renderAnswers() {
    var list = document.getElementById("ans-list"); if (!list) return;
    list.innerHTML = "";
    if (!answerEntries.length) { var ph = document.createElement("div"); ph.className = "fly-empty"; ph.innerHTML = "<p>لسه مفيش أجوبة... أول سؤال هيظهر لما حد يجاوب 😄</p>"; list.appendChild(ph); return; }
    answerEntries.slice().sort(function (a, b) { return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); }).reverse().sort(function (a, b) { return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); }).forEach(function (e) {
        var parts = String(e.title || "").split(" | "), who = parts.length > 1 ? parts[0] : "", q = parts.length > 1 ? parts.slice(1).join(" | ") : e.title;
        var c = document.createElement("article"); c.className = "ans-card" + (who === "أمنية" ? " her" : (who === "عبدالله" ? " him" : ""));
        var h = document.createElement("div"); h.className = "ans-head";
        if (who) { var w = document.createElement("span"); w.className = "ans-who"; w.textContent = (who === "أمنية" ? "💜 " : "💙 ") + who; h.appendChild(w); }
        var dt = document.createElement("span"); dt.className = "ans-date"; dt.textContent = fmtDate(e.date); h.appendChild(dt);
        var qq = document.createElement("div"); qq.className = "ans-q"; qq.textContent = q;
        var aa = document.createElement("div"); aa.className = "ans-a"; aa.textContent = e.text;
        c.appendChild(h); c.appendChild(qq); c.appendChild(aa); list.appendChild(c);
    });
}
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
renderJournal(); renderFlying(); renderAnswers();
(function () {
    var modal = document.getElementById("fly-modal");
    if (modal) {
        function hide() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
        document.getElementById("fly-close").addEventListener("click", hide);
        modal.addEventListener("click", function (ev) { if (ev.target === modal) hide(); });
    }
    /* تحميل الإدخالات من الشيت */
    fetch(API_URL + "?key=8ae1ce987dc5acd84dbf").then(function (r) { return r.json(); }).then(function (j) {
        if (!j || !j.ok) return;
        var ex = {}; journalEntries.forEach(function (e) { ex[e.id] = 1; });
        j.entries.forEach(function (e) {
            if (e.kind === "journal" && !ex[e.id]) journalEntries.push(e);
            if (e.kind === "flying") flyingEntries.push(e);
            if (e.kind === "answer") answerEntries.push(e);
            if (e.kind === "month") addMonth(e, false);
        });
        renderJournal(); renderFlying(); renderAnswers();
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
    var story = document.querySelector("#story .timeline"), nx = null;
    function wireAcc(m) {
        m.classList.add("acc");
        var head = document.createElement("button"); head.type = "button"; head.className = "acc-head";
        var k = m.querySelector(".kicker.small"), dte = m.querySelector(".memory-date");
        var label = document.createElement("span"); label.className = "acc-label";
        if (k) label.appendChild(k);
        if (dte) label.appendChild(dte);
        var chev = document.createElement("span"); chev.className = "acc-chev"; chev.textContent = "⌄";
        head.appendChild(label); head.appendChild(chev);
        var body = m.querySelector(".memory-text"); m.insertBefore(head, body);
        head.addEventListener("click", function () {
            var was = m.classList.contains("open");
            document.querySelectorAll("#story .milestone.acc").forEach(function (o) { o.classList.remove("open"); });
            if (!was) m.classList.add("open");
        });
    }
    var monthSeen = {};
    function enDate(iso) { var p = iso.split("-"); var mn = ["January","February","March","April","May","June","July","August","September","October","November","December"]; return parseInt(p[2], 10) + " " + mn[parseInt(p[1], 10) - 1] + " " + p[0]; }
    function addMonth(e, openIt) {
        if (!story || monthSeen[e.id]) return; monthSeen[e.id] = 1;
        var m = document.createElement("article"); m.className = "milestone in";
        m.setAttribute("data-date", e.date);
        var dot = document.createElement("div"); dot.className = "dot"; m.appendChild(dot);
        if (e.title) { var k = document.createElement("div"); k.className = "kicker small"; k.textContent = e.title; m.appendChild(k); }
        var dt = document.createElement("div"); dt.className = "memory-date"; dt.textContent = enDate(e.date); m.appendChild(dt);
        var t = document.createElement("div"); t.className = "memory-text";
        String(e.text).split(/\n+/).forEach(function (line) { if (!line.trim()) return; var p = document.createElement("p"); p.textContent = line; t.appendChild(p); });
        m.appendChild(t);
        wireAcc(m);
        var after = null;
        story.querySelectorAll(".milestone[data-date]").forEach(function (o) { if (o.getAttribute("data-date") > e.date) { if (!after) after = o; } });
        story.insertBefore(m, after || nx);
        if (openIt) { document.querySelectorAll("#story .milestone.acc").forEach(function (o) { o.classList.remove("open"); }); m.classList.add("open"); }
    }
    document.querySelectorAll("#story .milestone").forEach(function (m, i) { wireAcc(m); if (i === 0) m.classList.add("open"); });
    if (story) {
        nx = document.createElement("article"); nx.className = "milestone soon in";
        nx.innerHTML = '<div class="dot"></div><div class="soon-card"><span class="soon-ico">🌱</span><div>الشهر الجاي...</div><small>الحكاية لسه بتكمل ❤️</small></div>';
        story.appendChild(nx);
    }
    var mm = document.getElementById("month-modal");
    if (mm) {
        var mt = document.getElementById("month-title-in"), md = document.getElementById("month-date-in"), mx = document.getElementById("month-text-in"), mg = document.getElementById("month-msg");
        md.value = todayISO();
        function mopen(v) { mm.classList.toggle("open", v); mm.setAttribute("aria-hidden", v ? "false" : "true"); mg.textContent = ""; }
        document.getElementById("month-add").addEventListener("click", function () { mopen(true); });
        document.getElementById("month-cancel").addEventListener("click", function () { mopen(false); });
        mm.addEventListener("click", function (e) { if (e.target === mm) mopen(false); });
        document.getElementById("month-form").addEventListener("submit", function (e) {
            e.preventDefault();
            var v = mx.value.trim(), dv = md.value; if (!v || !dv) return;
            var title = mt.value.trim(), btn = document.querySelector(".month-send"); btn.disabled = true; mg.textContent = "بنحفظه... ⏳";
            apiPost({ kind: "month", date: dv, title: title, text: v }).then(function (r) {
                btn.disabled = false;
                if (r && r.ok) { addMonth({ id: r.id, date: dv, title: title, text: v }, true); mx.value = ""; mt.value = ""; mopen(false); document.getElementById("story").scrollIntoView({ behavior: "smooth" }); }
                else { mg.textContent = "حصلت مشكلة، جربي تاني 🙏"; }
            }).catch(function () { btn.disabled = false; mg.textContent = "حصلت مشكلة في النت، جربي تاني 🙏"; });
        });
    }

    /* كارت السؤال المتغير */
    var Q_HER = ["بتحبي عبدالله قد إيه النهارده؟ 😂", "إيه أكتر حاجة في عبدالله بتخليكي تضحكي من قلبك؟", "إيه أول حاجة لفتت نظرك في عبدالله؟", "لو عبدالله هيطلب منك حاجة واحدة النهارده، تتوقعي تكون إيه؟", "إيه الحاجة اللي عبدالله بيعملها وبتحسسك بالأمان؟", "إيه أحلى جملة عبدالله قالهالك؟", "لو هتوصفي عبدالله في 3 كلمات، هيبقوا إيه؟", "إيه الحاجة اللي نفسك تعمليها مع عبدالله ولسه ماعملتوهاش؟", "إيه اللي عبدالله بيعمله وبيضايقك بس بتحبيه برضه؟ 😂", "إيه أحلى ذكرى ليكي مع عبدالله لحد دلوقتي؟", "لو عبدالله فاكر يوم واحد بس من حكايتكم، تتوقعي يكون يوم إيه؟", "إيه الأكلة اللي لما بتاكليها مع عبدالله بتبقى أحلى؟", "إيه الحاجة اللي اتعلمتيها من عبدالله؟", "إيه الدعوة اللي نفسك تدعيها لعبدالله النهارده؟", "بعد 10 سنين، نفسك تكونوا فين ومع بعض بتعملوا إيه؟", "إيه الحاجة الصغيرة اللي عبدالله بيعملها وانتي مش بتنسيها؟", "تتوقعي عبدالله بيحس بإيه دلوقتي؟", "إيه الأغنية اللي لما بتسمعيها بتفتكري عبدالله؟", "إيه الحاجة اللي نفسك عبدالله يعرفها عنك ولسه ماقولتهاش؟", "قوليلي موقف مع عبدالله لسه بتضحكي لما بتفتكريه 😂"];
    var Q_HIM = ["بتحب أمنية قد إيه النهارده؟ 😂", "إيه أكتر حاجة في أمنية بتخليك تضحك من قلبك؟", "إيه أول حاجة لفتت نظرك في أمنية؟", "لو أمنية هتطلب منك حاجة واحدة النهارده، تتوقع تكون إيه؟", "إيه الحاجة اللي أمنية بتعملها وبتحسسك بالأمان؟", "إيه أحلى جملة أمنية قالتهالك؟", "لو هتوصف أمنية في 3 كلمات، هيبقوا إيه؟", "إيه الحاجة اللي نفسك تعملها مع أمنية ولسه ماعملتوهاش؟", "إيه اللي أمنية بتعمله وبيضايقك بس بتحبها برضه؟ 😂", "إيه أحلى ذكرى ليك مع أمنية لحد دلوقتي؟", "لو أمنية فاكرة يوم واحد بس من حكايتكم، تتوقع يكون يوم إيه؟", "إيه الأكلة اللي لما بتاكلها مع أمنية بتبقى أحلى؟", "إيه الحاجة اللي اتعلمتها من أمنية؟", "إيه الدعوة اللي نفسك تدعيها لأمنية النهارده؟", "بعد 10 سنين، نفسك تكونوا فين ومع بعض بتعملوا إيه؟", "إيه الحاجة الصغيرة اللي أمنية بتعملها وإنت مش بتنساها؟", "تتوقع أمنية بتحس بإيه دلوقتي؟", "إيه الأغنية اللي لما بتسمعها بتفتكر أمنية؟", "إيه الحاجة اللي نفسك أمنية تعرفها عنك ولسه ماقولتهاش؟", "قولي موقف مع أمنية لسه بتضحك لما بتفتكره 😂"];
    var qz = document.getElementById("quiz");
    if (qz) {
        var who = null; try { who = localStorage.getItem("qz-who"); } catch (e) {}
        var curQ = "", body = document.getElementById("quiz-body");
        function qPick() { var bank = who === "omnia" ? Q_HER : Q_HIM; curQ = bank[Math.floor(Math.random() * bank.length)]; }
        function qRender() {
            if (!who) {
                body.innerHTML = '<div class="quiz-q">مين اللي فاتح الموقع؟ 😄</div><div class="quiz-who"><button type="button" data-w="omnia">أمنية 💜</button><button type="button" data-w="abdullah">عبدالله 💙</button></div>';
                body.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { who = b.getAttribute("data-w"); try { localStorage.setItem("qz-who", who); } catch (e) {} qRender(); }); });
                return;
            }
            qPick();
            body.innerHTML = '<div class="quiz-q"></div><form id="quiz-form"><input id="quiz-in" type="text" maxlength="300" autocomplete="off"><button type="submit" id="quiz-send">ابعت 😂</button></form><button type="button" class="quiz-switch" id="quiz-switch">مش أنا؟ غيّر</button>';
            body.querySelector(".quiz-q").textContent = curQ;
            document.getElementById("quiz-in").placeholder = "اكتب بصراحة 😅";
            document.getElementById("quiz-switch").addEventListener("click", function () { who = null; try { localStorage.removeItem("qz-who"); } catch (e) {} qRender(); });
            document.getElementById("quiz-form").addEventListener("submit", function (e) {
                e.preventDefault();
                var v = document.getElementById("quiz-in").value.trim(); if (!v) return;
                var b = document.getElementById("quiz-send"); b.disabled = true;
                var wn = who === "omnia" ? "أمنية" : "عبدالله", asked = curQ;
                apiPost({ kind: "answer", date: todayISO(), title: wn + " | " + asked, text: v }).then(function (r) {
                    if (r && r.ok) { answerEntries.push({ id: r.id, kind: "answer", date: todayISO(), title: wn + " | " + asked, text: v }); renderAnswers(); }
                    body.innerHTML = '<div class="quiz-thanks">وصلت! 😂❤️<br><small><a href="#answers" id="quiz-see">شوف الأجوبة</a></small></div>';
                    document.getElementById("quiz-see").addEventListener("click", function () { qz.classList.remove("show"); });
                    setTimeout(function () { qz.classList.remove("show"); }, 4500);
                }).catch(function () { b.disabled = false; b.textContent = "جرب تاني 😅"; });
            });
        }
        qRender();
        setTimeout(function () { qz.classList.add("show"); }, 3500);
        document.getElementById("quiz-x").addEventListener("click", function () { qz.classList.remove("show"); });
    }
})();

(function () {
    var m = document.getElementById("fly-compose"); if (!m) return;
    var t = document.getElementById("fly-title-in"), x = document.getElementById("fly-text-in"), msg = document.getElementById("fly-msg");
    function open(v) { m.classList.toggle("open", v); m.setAttribute("aria-hidden", v ? "false" : "true"); msg.textContent = ""; if (v) setTimeout(function () { x.focus(); }, 100); }
    document.getElementById("fly-add").addEventListener("click", function () { open(true); });
    document.getElementById("fly-cancel").addEventListener("click", function () { open(false); });
    m.addEventListener("click", function (e) { if (e.target === m) open(false); });
    document.getElementById("fly-form").addEventListener("submit", function (e) {
        e.preventDefault();
        var v = x.value.trim(); if (!v) return;
        var title = t.value.trim(), btn = document.querySelector(".fly-send"); btn.disabled = true; msg.textContent = "بنطيّرها... ⏳";
        apiPost({ kind: "flying", date: todayISO(), title: title, text: v }).then(function (r) {
            btn.disabled = false;
            if (r && r.ok) { flyingEntries.push({ id: r.id, kind: "flying", date: todayISO(), title: title, text: v }); renderFlying(); x.value = ""; t.value = ""; open(false); }
            else { msg.textContent = "حصلت مشكلة، جربي تاني 🙏"; }
        }).catch(function () { btn.disabled = false; msg.textContent = "حصلت مشكلة في النت، جربي تاني 🙏"; });
    });
})();

/* ===== عداد الفرح ===== غيّر التاريخ هنا: */
var WEDDING_DATE = "2027-10-29T00:00:00";
(function () {
    var ids = ["w-d", "w-h", "w-m", "w-s"], els = ids.map(function (i) { return document.getElementById(i); });
    if (!els[0]) return;
    function tick() {
        var diff = new Date(WEDDING_DATE) - new Date();
        if (diff < 0) diff = 0;
        var d = Math.floor(diff / 86400000), h = Math.floor(diff / 3600000) % 24, m = Math.floor(diff / 60000) % 60, s = Math.floor(diff / 1000) % 60;
        els[0].textContent = d; els[1].textContent = h; els[2].textContent = m; els[3].textContent = s;
    }
    tick(); setInterval(tick, 1000);
})();
