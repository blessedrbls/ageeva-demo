(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Галерея + lightbox ---------- */
  const masonry = $("#masonry");
  const works = window.WORKS || [];
  works.forEach((w, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "masonry__item" + (w.shape ? " masonry__item--" + w.shape : "");
    b.setAttribute("aria-label", "Відкрити фото: " + w.alt);
    b.innerHTML = '<img loading="lazy" decoding="async" width="900" height="1076" src="' + w.src + '" alt="' + w.alt.replace(/"/g, "&quot;") + '">';
    b.addEventListener("click", () => openLightbox(works, i));
    masonry.appendChild(b);
  });

  /* ---------- Відгуки: ряд скрінів ---------- */
  const reviewsRow = $("#reviews-row");
  const reviewList = window.REVIEWS || [];
  if (reviewsRow) {
    reviewList.forEach((r, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "review";
      b.setAttribute("aria-label", "Відкрити відгук: " + r.alt);
      b.innerHTML = '<img loading="lazy" decoding="async" width="720" height="874" src="' + r.src + '" alt="' + r.alt.replace(/"/g, "&quot;") + '">';
      b.addEventListener("click", () => openLightbox(reviewList, i));
      reviewsRow.appendChild(b);
    });
  }

  /* ---------- Мобільне меню ---------- */
  const burger = $(".burger");
  const nav = $("#site-nav");
  if (burger && nav) {
    const setOpen = (open) => {
      burger.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    };
    burger.addEventListener("click", () => setOpen(burger.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- «Замовити» з картки послуги ---------- */
  document.querySelectorAll("[data-service]").forEach((a) => {
    a.addEventListener("click", () => {
      const sel = $("#f-service");
      if (sel) sel.value = a.dataset.service;
    });
  });

  const lb = $("#lightbox");
  const lbImg = $("img", lb);
  const lbCap = $("figcaption", lb);
  let lbIndex = 0;
  let lbList = works;

  function showLb(i) {
    lbIndex = (i + lbList.length) % lbList.length;
    lbImg.src = lbList[lbIndex].src;
    lbImg.alt = lbList[lbIndex].alt;
    lbCap.textContent = (lbIndex + 1) + " / " + lbList.length;
  }
  function openLightbox(list, i) {
    lbList = list;
    showLb(i);
    lb.showModal();
    document.documentElement.classList.add("no-scroll");
  }
  lb.addEventListener("close", () => document.documentElement.classList.remove("no-scroll"));
  $(".lightbox__close", lb).addEventListener("click", () => lb.close());
  $(".lightbox__nav--prev", lb).addEventListener("click", () => showLb(lbIndex - 1));
  $(".lightbox__nav--next", lb).addEventListener("click", () => showLb(lbIndex + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    if (e.key === "ArrowRight") showLb(lbIndex + 1);
  });
  swipe(lb, () => showLb(lbIndex + 1), () => showLb(lbIndex - 1));

  function swipe(el, onLeft, onRight) {
    let x0 = null, y0 = null;
    el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? onLeft : onRight)();
      x0 = null;
    }, { passive: true });
  }

  /* ---------- Відгуки-сторіз ---------- */
  const stories = $("#stories");
  const reviews = window.REVIEWS || [];
  if (stories && reviews.length) {
    const track = $(".stories__track", stories);
    const bars = $(".stories__bars", stories);
    reviews.forEach((r, i) => {
      const img = document.createElement("img");
      img.src = r.src;
      img.alt = r.alt;
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 720; img.height = 874;
      img.className = "stories__slide";
      track.appendChild(img);
      const bar = document.createElement("span");
      bar.innerHTML = "<i></i>";
      bars.appendChild(bar);
    });
    const slides = track.children;
    const barEls = bars.children;
    const DURATION = 5000;
    let cur = 0, timer = null, paused = false, visible = false;

    function go(i) {
      cur = (i + slides.length) % slides.length;
      for (let k = 0; k < slides.length; k++) {
        slides[k].classList.toggle("is-active", k === cur);
        slides[k].setAttribute("aria-hidden", k === cur ? "false" : "true");
        barEls[k].className = k < cur ? "is-done" : k === cur ? "is-active" : "";
      }
      // перезапуск анімації смужки
      const fill = barEls[cur].firstChild;
      fill.style.animation = "none"; void fill.offsetWidth; fill.style.animation = "";
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (reduce.matches || paused || !visible) { stories.classList.add("is-paused"); return; }
      stories.classList.remove("is-paused");
      timer = setTimeout(() => go(cur + 1), DURATION);
    }
    stories.style.setProperty("--story-dur", DURATION + "ms");
    $(".stories__tap--prev", stories).addEventListener("click", () => go(cur - 1));
    $(".stories__tap--next", stories).addEventListener("click", () => go(cur + 1));
    stories.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { paused = true; schedule(); } });
    stories.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { paused = false; go(cur); } });
    swipe(stories, () => go(cur + 1), () => go(cur - 1));
    new IntersectionObserver((ents) => {
      visible = ents[0].isIntersecting;
      go(cur);
    }, { threshold: 0.4 }).observe(stories);
    go(0);
  }

  /* ---------- Форма ---------- */
  const form = $("#order-form");
  const status = $("#form-status");
  const date = $("#f-date");
  const today = new Date();
  date.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  const colors = $("#f-colors");
  document.querySelectorAll(".swatches button").forEach((b) => {
    b.addEventListener("click", () => {
      const c = b.dataset.color;
      const list = colors.value.split(",").map((s) => s.trim()).filter(Boolean);
      const at = list.indexOf(c);
      if (at === -1) list.push(c); else list.splice(at, 1);
      colors.value = list.join(", ");
      b.setAttribute("aria-pressed", at === -1 ? "true" : "false");
    });
  });

  const phone = $("#f-phone");
  phone.addEventListener("focus", () => { if (!phone.value) phone.value = "+380 "; });
  phone.addEventListener("blur", () => { if (phone.value.trim() === "+380") phone.value = ""; });

  function validPhone(v) {
    const d = v.replace(/\D/g, "");
    return d.length === 12 && d.startsWith("380") || d.length === 10 && d.startsWith("0");
  }

  function setError(input, msg) {
    const field = input.closest(".field");
    let err = $(".field__err", field);
    if (msg) {
      if (!err) { err = document.createElement("p"); err.className = "field__err"; err.id = input.id + "-err"; field.appendChild(err); }
      err.textContent = msg;
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", err.id);
    } else if (err) {
      err.remove();
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  }

  function validate() {
    let first = null;
    const checks = [
      [form.name, form.name.value.trim().length >= 2, "Як до вас звертатися?"],
      [form.phone, validPhone(form.phone.value), "Перевірте номер: +380 XX XXX XX XX"],
      [form.service, !!form.service.value, "Оберіть, що потрібно"],
      [form.date, !!form.date.value && form.date.value >= date.min, "Вкажіть дату свята"]
    ];
    checks.forEach(([input, ok, msg]) => {
      setError(input, ok ? "" : msg);
      if (!ok && !first) first = input;
    });
    if (first) first.focus();
    return !first;
  }
  ["input", "change"].forEach((ev) => form.addEventListener(ev, (e) => {
    if (e.target.getAttribute("aria-invalid")) setError(e.target, "");
  }));

  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  function fmtDate(v) {
    const [y, m, d] = v.split("-");
    return d + "." + m + "." + y;
  }

  function buildMessage(d) {
    return [
      "🎈 <b>Нова заявка з сайту</b>",
      "",
      "<b>Ім'я:</b> " + esc(d.name),
      "<b>Телефон:</b> " + esc(d.phone),
      "<b>Що потрібно:</b> " + esc(d.service),
      "<b>Дата свята:</b> " + esc(fmtDate(d.date)),
      d.colors ? "<b>Кольори:</b> " + esc(d.colors) : "",
      d.comment ? "<b>Коментар:</b> " + esc(d.comment) : ""
    ].filter((l, i) => l !== "" || i === 1).join("\n");
  }

  async function send(text) {
    const cfg = window.SITE_CONFIG || {};
    if (cfg.PROXY_URL) {
      const r = await fetch(cfg.PROXY_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (!r.ok) throw new Error("proxy " + r.status);
      return "sent";
    }
    const configured = cfg.BOT_TOKEN && cfg.CHAT_ID && !/PASTE_/.test(cfg.BOT_TOKEN + cfg.CHAT_ID);
    if (!configured) return "demo";
    const r = await fetch("https://api.telegram.org/bot" + cfg.BOT_TOKEN + "/sendMessage", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: cfg.CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) throw new Error(j.description || "telegram " + r.status);
    return "sent";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.website.value) return; // бот
    if (!validate()) return;
    const data = Object.fromEntries(new FormData(form));
    const text = buildMessage(data);
    const btn = $(".form__submit", form);
    btn.disabled = true;
    btn.textContent = "Надсилаю…";
    status.className = "form__status";
    status.textContent = "";
    try {
      const res = await send(text);
      if (res === "demo") {
        status.className = "form__status is-demo";
        status.innerHTML = "<b>Демо-режим:</b> бот ще не підключений (config.js), тому заявка нікуди не пішла. Ось так вона виглядатиме в Telegram:" +
          '<span class="tg-preview">' + text.replace(/\n/g, "<br>") + "</span>";
      } else {
        status.className = "form__status is-ok";
        status.textContent = "Дякую, " + data.name.trim() + "! Заявку отримала, скоро напишу 💛";
        form.reset();
        document.querySelectorAll(".swatches button").forEach((b) => b.removeAttribute("aria-pressed"));
      }
    } catch (err) {
      console.error(err);
      status.className = "form__status is-err";
      status.innerHTML = 'Не вдалося надіслати 😔 Напишіть мені, будь ласка, в <a href="https://ig.me/m/ageeva7562" target="_blank" rel="noopener">Instagram</a>.';
    } finally {
      btn.disabled = false;
      btn.textContent = "Надіслати заявку";
    }
  });

  /* ---------- Плаваюча кнопка: ховаємо біля форми ---------- */
  const fab = $(".fab");
  const orderSec = $("#order");
  if (fab && orderSec) {
    new IntersectionObserver((ents) => fab.classList.toggle("is-hidden", ents[0].isIntersecting), { threshold: 0.15 }).observe(orderSec);
  }

  /* ---------- М'яка поява блоків при прокрутці ---------- */
  const header = $(".header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!reduce.matches && "IntersectionObserver" in window) {
    const groups = [
      ".section__head", ".about__img", ".about__text", ".price", ".form-card", ".contacts__info", ".map",
      ".cards > *", ".gallery > *", ".reviews > *", ".steps > *"
    ];
    const els = [];
    groups.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add("reveal");
        // невелика затримка для елементів у сітці, щоб з'являлись по черзі
        if (sel.includes(">")) el.style.setProperty("--d", (i % 4) * 80 + "ms");
        els.push(el);
      });
    });
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("is-in");
        io.unobserve(el);
        // після появи прибираємо службові класи, щоб працювали звичайні ефекти наведення
        setTimeout(() => el.classList.remove("reveal", "is-in"), 900 + (parseInt(el.style.getPropertyValue("--d")) || 0));
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  }
})();
