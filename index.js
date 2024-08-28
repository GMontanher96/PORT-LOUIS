const puppeteer = require("puppeteer");
const url = "https://github.com/";
const urlLogin = "https://github.com/login";
const session = "https://github.com/session";
require("dotenv").config({ path: ".env" });

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false, // abre o navegador
  });
  // abre o navegador
  const page = await browser.newPage();
  // aumenta a resolução da abertura do navegador
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  // acessar meu github
  await page.goto(url);
  // Clica no link [botão] de login
  await page.click(
    '[class="HeaderMenu-link HeaderMenu-link--sign-in HeaderMenu-button flex-shrink-0 no-underline d-none d-lg-inline-flex border border-lg-0 rounded rounded-lg-0 px-2 py-1"]'
  );
  await page.goto(urlLogin); // acessar o login do github
  try {
    await page.goto(urlLogin);
    await page.type('input[name="login"]', EMAIL, { delay: 100 });
    await page.type('input[name="password"]', PASSWORD, { delay: 100 });
    await Promise.all([
      page.click(`input[name="commit"]`),
      page.waitForNavigation(),
    ]);
  } catch (err) {
    console.log(err, 'Incorrect username or password.');
  } finally {
    await page.goto(session)
  }

  //  await page.screenshot({ path: 'git.png'}); // print para testar
  //await browser.close(); // fecha a sessão do meu navegador

  //Screenshot
  //await page.screenshot({path: 'login.png', fullPage: true});
};

main();
