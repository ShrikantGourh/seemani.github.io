/**
 * Seemani lightweight API starter.
 *
 * Setup:
 * 1. Create a Google Sheet with tabs named Products and Orders.
 * 2. In Products row 1, add headers:
 *    id | title | category | description | priceLabel | badge | emoji | theme | url | status
 * 3. In Orders row 1, add headers:
 *    createdAt | orderId | giftId | senderName | recipientName | senderEmail | message | status
 * 4. Open Extensions > Apps Script and paste this file.
 * 5. Set SPREADSHEET_ID in Project Settings > Script properties.
 * 6. Deploy as a web app. Do not put credentials in the public website.
 *
 * Note: this starter does not process payments. Add server-side validation,
 * spam protection and privacy controls before collecting real customer data.
 */

const PRODUCT_HEADERS = ["id", "title", "category", "description", "priceLabel", "badge", "emoji", "theme", "url", "status"];

function spreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("Missing SPREADSHEET_ID script property");
  return SpreadsheetApp.openById(id);
}

function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : "products";
  if (action !== "products") return json_({ ok: false, error: "Unknown action" });
  try {
    const sheet = spreadsheet_().getSheetByName("Products");
    if (!sheet || sheet.getLastRow() < 2) return json_({ ok: true, products: [] });
    const values = sheet.getDataRange().getDisplayValues();
    const headers = values.shift().map(h => h.trim());
    const products = values.filter(row => row.some(Boolean)).map(row => {
      const item = {};
      headers.forEach((header, i) => item[header] = row[i] || "");
      return item;
    }).filter(item => item.status !== "hidden");
    return json_({ ok: true, products: products });
  } catch (err) {
    return json_({ ok: false, error: "Catalogue temporarily unavailable" });
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (payload.action !== "createOrder") return json_({ ok: false, error: "Unknown action" });
    const giftId = clean_(payload.giftId, 80);
    const senderName = clean_(payload.senderName, 80);
    const recipientName = clean_(payload.recipientName, 80);
    const senderEmail = clean_(payload.senderEmail, 160);
    const message = clean_(payload.message, 1000);
    if (!giftId || !senderName || !recipientName) {
      return json_({ ok: false, error: "Gift, sender and recipient are required" });
    }
    if (senderEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      return json_({ ok: false, error: "Please provide a valid email address" });
    }
    const ss = spreadsheet_();
    const productSheet = ss.getSheetByName("Products");
    const orderSheet = ss.getSheetByName("Orders");
    if (!productSheet || !orderSheet) return json_({ ok: false, error: "Storage is not configured" });
    const productRows = productSheet.getDataRange().getDisplayValues();
    const headers = (productRows.shift() || []).map(h => h.trim());
    const idIndex = headers.indexOf("id");
    const statusIndex = headers.indexOf("status");
    const exists = productRows.some(row => row[idIndex] === giftId && row[statusIndex] !== "hidden");
    if (!exists) return json_({ ok: false, error: "Gift not found" });
    const orderId = Utilities.getUuid();
    orderSheet.appendRow([new Date(), orderId, giftId, senderName, recipientName, senderEmail, message, "received"]);
    return json_({ ok: true, orderId: orderId, status: "received" });
  } catch (err) {
    return json_({ ok: false, error: "Unable to save request" });
  }
}

function clean_(value, maxLength) {
  return String(value == null ? "" : value).replace(/[<>]/g, "").trim().slice(0, maxLength);
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}