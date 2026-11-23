# Helium balloons by Liubov Ageieva — demo website

A one-page demo site for a small helium-balloon business in Boyarka and Kyiv (Ukraine),
built as a pitch: it shows how the owner could take orders online instead of only via Instagram DMs.

**Stack:** plain HTML + CSS + JS, no frameworks, no build step — ready for GitHub Pages.

## Features
- Soft, photo-first design with a serif display font, arch-framed hero photo and pill buttons
- Gentle animations: hero fade-in, slowly floating balloons, fade-up on scroll, soft hover effects (all disabled by `prefers-reduced-motion`)
- Service cards with real photos; "Order" on a card preselects that service in the form
- Gallery and customer review screenshots with a lightbox (keyboard + swipe)
- Price list taken from the owner's Instagram stories
- Order form with validation; orders go to Telegram via the Bot API (demo mode shows a message preview when the bot is not configured)
- Google Maps embed, floating "Message" button on mobile
- Mobile-first, lazy-loaded WebP images (~1.4 MB total)

## Setup
1. Create a bot with [@BotFather](https://t.me/BotFather), send it a message, then get your chat id from
   `https://api.telegram.org/bot<TOKEN>/getUpdates`.
2. Put `BOT_TOKEN` and `CHAT_ID` into `config.js`.

> The token is visible in client-side code. Fine for a demo; for production, put it behind a small proxy
> (e.g. a Cloudflare Worker) and set `PROXY_URL` in `config.js`.

## Run locally
```bash
python3 -m http.server 8765
```

## Structure
```
index.html
config.js        Telegram settings
css/style.css
js/data.js       gallery and review images
js/main.js       gallery, lightbox, reviews, form, animations
assets/          optimized WebP images
```
