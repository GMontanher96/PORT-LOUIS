const puppeteer = require("puppeteer");
require("dotenv").config();

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Defina como `true` para rodar em modo headless
  const page = await browser.newPage();
  const EMAIL = process.env.EMAIL;
  const PASSWORD = process.env.PASSWORD;

  try {
    // Acessando a página inicial do Git.
    await page.goto(
      "https://github.com",
      { waitUntil: "networkidle2" },
      { delay: 100 }
    );

    // Acessando a página de login do git.
    await page.click('a[href="/login"]', { delay: 100 });
    await page.waitForSelector("#login_field");

    // Preenche o form de login
    await page.type("#login_field", EMAIL, { delay: 100 });
    await page.type("#password", PASSWORD, { delay: 100 });

    // Autenticação
    await page.click('input[name="commit"]');
    await page.waitForNavigation();

    // Verificar se o login foi bem-sucedido
    if (page.url().includes("/login")) {
      throw new Error("Autenticação falhou. Verifique suas credenciais.");
    }

    console.log("Login foi um sucesso");

    // Checar se após logado o usuário foi redirecionado para a URL esperada
    const expectedUrlPattern = /^https:\/\/github\.com(\/)?$/; // Regex para verificar a URL
    const currentUrl = page.url();

    if (!expectedUrlPattern.test(currentUrl)) {
      throw new Error(`Redirecionamento falhou. URL atual: ${currentUrl}`);
    }

    console.log("Redirecionamento bem-sucedido para:", currentUrl);

    //Aguardar a visibilidade do menu de perfil
    //await page.click(".AppHeader-user"), {delay: 100 };
    // await page.waitForSelector('a[href$="/GMontanher96"', { delay: 100 });
    // await page.waitForNavigation();

    // Acessando a aba "Repositories".
    await page.goto("https://github.com/GMontanher96?tab=repositories");
    await page.waitForSelector("h3");

    // Obter todos os repositórios e selecionar um aleatoriamente
    const repos = await page.evaluate(() => {
      const repoElements = Array.from(
        document.querySelectorAll('a[itemprop="name codeRepository"]')
      );
      return repoElements.map((repo) => repo.href);
    });

    if (repos.length === 0) {
      throw new Error("Nenhum repositório encontrado.");
    }

    // Selecionar um repositório random
    const randomRepoUrl = repos[Math.floor(Math.random() * repos.length)];
    console.log("Acessando o repositório:", randomRepoUrl);

    // Navegar para o repositório selecionado
    await page.goto(randomRepoUrl, { waitUntil: "networkidle2" });

    // Acessando a aba de Pull Requests
    await page.waitForSelector('a[href$="/pulls"', { delay: 100 });
    await page.click("#pull-requests-tab");
    await page.waitForNavigation();

    // Aumentar o tempo de espera para o seletor 'pull-requests-repo-tab-count'
    await page.waitForSelector(
      "#pull-requests-repo-tab-count",
      { delay: 100 },
      {
        visible: true,
        timeout: 60000,
      }
    );

    // Navegar para a página de criação de novos repositórios
    //await page.goto("https://github.com/new", { delay: 100 });
    //await page.waitForNavigation();

    // Define o nome do repositório
    //const repositoriesName = 'repositório-teste-puppeteer';

    // Preencher o campo de entrada do nome do repositório usando XPath
    //const repoNameInputXPath = '//*[@id="repository-name-input"]';
    //await page.waitForXPath(repoNameInputXPath);
    //const [repoNameInput] = await page.$x(repoNameInputXPath);
    //await repoNameInput.type(repositoriesName);

    // Exibe a tela de repositorio criado com sucesso.
    //await page.goto(`https://github.com/GMontanher96/test-repo-${Date.now()}`);
    //await page.screenshot({ path: "screenshots/new-repo.png" });

    // Desloga do git com sucesso
    await page.click(".AppHeader-user"), { delay: 100 };
    await page.goto("https://github.com/logout", { delay: 100 });

    // Aguardar a navegação após o logout
    await page.click('input[name="commit"]',  { delay: 100 });
    await page.waitForNavigation(), { delay: 100 } ;
    // VAlidação para deslogar do git com sucesso.
    if (page.url() !== "https://github.com/") {
      throw new Error("Falha ao deslogar");
    }

    console.log("Esse teste foi concluído com sucesso!");
  } catch (error) {
    console.error("Ocorreu um erro durante o teste", error.message);
  } finally {
    await browser.close();
  }
})();
