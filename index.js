'use strict';
const puppeteer = require('puppeteer');
const settings = require('./settings.json');
const fs = require('fs');

let tokenSet = false;
let results = [];

function getContentLocal(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    });
  }

async function generateFile(page, browser) {
  const scanner = await getContentLocal('./module-scanner.js');
  const result = await page.evaluate(scanner);
  
  fs.writeFileSync('./webpackModuleNumbers.js', result);
  console.log('Done!');
  await browser.close();

  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({headless: false});
  let page = await browser.newPage();
  
  await page.setRequestInterceptionEnabled(true);
  page.on('request',async interceptedRequest => {
    if (tokenSet) {
      interceptedRequest.continue();
      return;
    }

    if (interceptedRequest.url.endsWith('.svg')) {
      const tokenSetPage = await browser.newPage();
      await tokenSetPage.goto(interceptedRequest.url, { waitUntil: 'load' });
      await tokenSetPage.evaluate(token => {
        localStorage['token'] = token;
      }, settings['token']);
      tokenSetPage.close();
      tokenSet = true;
    }
    
    interceptedRequest.continue();
  });
  
  // Open page to set token
  await page.goto('https://discordapp.com/', { timeout : 0 });
  // Unsubscribe from event after that
  page.close();
  page = await browser.newPage();
  
  // Go to discord page now
  await page.goto('https://discordapp.com/channels/@me', { timeout : 0 });
  await page.waitFor('div.friends-icon');
  
  console.log('Discord loaded. Injecting better-emojis...');
  await page.addScriptTag({url: 'https://rawgit.com/TrueLecter/BetterDiscordEmojis/dist/better-emojis.js'})
  
  console.log('Added script. Waiting for plugin to initialize')
  try {
    await page.waitFor(() => {
      return window.better_emojis && window.better_emojis.initialized;
    }, { timeout: 0 });
    
    console.log('Plugin seems to be initialized, going to chat');
    await page.waitFor(() => {
      document.querySelector('a[href="/channels/@me/369154007027023892"]').click();
      return true;
    })
    await new Promise((resolve) => setTimeout(resolve, 10000));

    console.log('Waiting for textarea to appear...');
    await page.waitFor('div.chat > div > div > form > div > div > textarea');

    console.log('Opening emojiPicker');
    results.push(await page.evaluate(() => {
      // Emoji button near textarea
      try {
        document.querySelector('div[class*="emojiButton"]').click();
      } catch (e) {
        return false;
      } 
      return true;
    }));
    await new Promise((resolve) => setTimeout(resolve, 3000));

    /*
    console.log('Verifying that there are no gray emojis...')
    results.push(await page.evaluate(() => {
      try {
       return document.querySelector('div.emoji-item.disabled') == void 0; 
      } catch (e) {
        return false;
      }
    }));
    await new Promise((resolve) => setTimeout(resolve, 3000));
    */

    console.log('Clicking first available emoji...');
    results.push(await page.evaluate(() => {
      // First emoji
      try {
        document.querySelector('div[data-emoji]').click();
      } catch (e) {
        return false;
      } 
      return true;
    }));
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log('Veryfing that emojis successfully added to textarea...');
    results.push(await page.evaluate(() => {
      // Channel textarea
      const val = document.querySelector('div.chat > div > div > form > div > div > textarea');
      return !(val == null || val.length === 0);
    }));

    console.log('Closing emoji picker...');
    await page.waitFor(() => {
        document.querySelector('div[class*="emojiButton"]').click();
        return true;
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Opening reaction emoji picker...');
    results.push(await page.evaluate(() => {
      try {
        // Last for this channel message's reaction button
        document.querySelector('div.chat.flex-vertical.flex-spacer.private > div.content.flex-spacer.flex-horizontal > div > div > div > div > div:last-child > div.comment > div.message:last-child > div.body > div.message-text > div.btn-reaction')
          .click();
      } catch (e) {
        return false;
      } 
      return true;
    }));
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('Clicking first available emoji...');
    results.push(await page.evaluate(() => {
      try {
        // First emoji
        document.querySelector('div[data-emoji]').click();
      } catch (e) {
        return false;
      } 
      return true;
    }));

    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log('Veryfing that reaction successfully added...');
    results.push(await page.evaluate(() => {
      // Channel textarea
      let reactions = document.querySelectorAll('div.chat.flex-vertical.flex-spacer.private > div.content.flex-spacer.flex-horizontal > div > div > div > div > div:last-child > div.comment > div.message:last-child > div.accessory > .reactions > div.reaction');
      if (reactions.length == 0) {
        return false;
      }
      for (const reaction of reactions) {
        reaction.click();
      }
      return true;
    }));

    console.log(`All results: ${results.every(t => t)}`);
    console.log(results);

    if (!results.every(t => t)) {
      await generateFile(page, browser);
    }

  } catch (e){
    console.log('Error during testing. Generating file...');
    await generateFile(page, browser);
  }

  await browser.close();
  process.exit(0);
})();
