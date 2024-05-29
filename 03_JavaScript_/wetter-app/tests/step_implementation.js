const { openBrowser, goto, write, click, text, closeBrowser, waitFor, textBox, button, below, into } = require('taiko');
const assert = require('assert');

beforeSuite(async () => {
    await openBrowser();
});

afterSuite(async () => {
    await closeBrowser();
});

step("Öffne die URL <url>", async (url) => {
    await goto(url);
});

step("Gib <address> in das Eingabefeld ein", async (address) => {
    await write(address, into(textBox({ placeholder: "Adresse eingeben" })));
});

step("Klicke auf <buttonText>", async (buttonText) => {
    await click(button(buttonText));
});

step("Überprüfe, ob die Temperatur angezeigt wird", async () => {
    assert.ok(await text('Temperatur').exists());
});

step("Überprüfe, ob der Luftdruck angezeigt wird", async () => {
    assert.ok(await text('Luftdruck').exists());
});

step("Überprüfe, ob die Luftfeuchtigkeit angezeigt wird", async () => {
    assert.ok(await text('Luftfeuchtigkeit').exists());
});

