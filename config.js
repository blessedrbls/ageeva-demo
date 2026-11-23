// Налаштування відправки заявок у Telegram.
//
// 1. Створіть бота через @BotFather → отримаєте BOT_TOKEN.
// 2. Напишіть боту будь-яке повідомлення, потім відкрийте
//    https://api.telegram.org/bot<BOT_TOKEN>/getUpdates — там буде "chat":{"id": ...} → це CHAT_ID.
// 3. Вставте обидва значення нижче.
//
// УВАГА: на статичному хостингу (GitHub Pages) токен видно в коді сторінки.
// Для демо це ок. Для «бойового» сайту краще сховати токен за проксі
// (наприклад, безкоштовний Cloudflare Worker) і вказати його адресу в PROXY_URL.

window.SITE_CONFIG = {
  BOT_TOKEN: "PASTE_BOT_TOKEN_HERE",
  CHAT_ID: "PASTE_CHAT_ID_HERE",
  PROXY_URL: "" // необов'язково: якщо заповнено, заявка йде POST-запитом сюди замість api.telegram.org
};
