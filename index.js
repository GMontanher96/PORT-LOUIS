const puppeteer = require('puppeteer');

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;


(async () => {
  // Inicia o navegador
  const browser = await puppeteer.launch({ headless: false }); // Defina como true para execução headless
  const page = await browser.newPage();

  // Acessa a página inicial do GitHub
  await page.goto('https://github.com');

  // Clica no botão de login
  await page.click('a[href="/login"]');

  // Espera o formulário de login carregar
  await page.waitForSelector('#login_field');

  // Preenche o formulário de login
  await page.type('#login_field', 'dsdsdsds', { delay: 100 });
  await page.type('#password', 'PASSWORD', { delay: 100 });

  // Clica no botão de autenticação
  await page.click('input[type="submit"]');

  // Valida se a autenticação foi bem-sucedida verificando se o nome de usuário aparece na página
  await page.waitForSelector('.avatar-user');

  const email = await page.$eval('.avatar-user', el => el.alt);
  console.log(`Usuário autenticado: ${email}`);

  // Checa se a URL atual é a esperada
  const url = page.url();
  if (url === 'https://github.com/') {
    console.log('Redirecionado para a URL correta após o login.');
  } else {
    console.error('Redirecionamento após login falhou.');
  }

  // Navega para a aba "Repositories"
  await page.click('a[href="/GMontanher96?tab=repositories"]'); // Substitua `your-username` pelo seu usuário
  await page.waitForNavigation();

  // Acessa um repositório aleatório
  const repos = await page.$$('a[itemprop="name codeRepository"]');
  if (repos.length > 0) {
    await repos[0].click(); // Clica no primeiro repositório
    await page.waitForNavigation();
  } else {
    console.error('Nenhum repositório encontrado.');
  }

  // Navega até a aba "Pull Requests"
  await page.click('a[href$="/pulls"]'); 
  await page.waitForNavigation();

  // Cria um novo repositório
  await page.goto('https://github.com/new');
  await page.type('#repository_name', 'nome-do-repositorio'); // Nome do novo repositório
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  // Verifica se o repositório foi criado e tira um print
  await page.screenshot({ path: 'repositório_criado.png' });

  // Desloga do GitHub
  await page.goto('https://github.com/logout');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  // Valida se foi deslogado
  const logoutUrl = page.url();
  if (logoutUrl === 'https://github.com/') {
    console.log('Logout bem-sucedido.');
  } else {
    console.error('Falha ao deslogar.');
  }

  // Fecha o navegador
  await browser.close();
})();
