const { firefox } = require('playwright');
const { test, expect } = require('@playwright/test');

test.describe('My Test Suite', () => {
    test('My Test Case', async ({}) => {
    const browser = await firefox.launch(); 
    const page =  await browser.newPage();

    await authenticate(page);
 
    await prepareOrder(page);

    await placeOrder(page);

    await browser.close();

    });
});

async function authenticate(page) {
    await page.goto('https://bitheap.tech'); //open the web page using the goto method
    await page.click('#menu-item-1311'); //home screen of the web page click login
    await page.locator("[name='xoo-el-username']").fill(process.env.BITHEAP_USERNAME) //use fill method to retrive and enter username from envir variables
    await page.locator("[name='xoo-el-password']").fill(process.env.BITHEAP_PASSWORD) //use fill method to retrive and enter password from envir variables
    await page.locator('xpath=/html/body/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div[2]/div/form/button').click(); //click login on the login form
    const text = await page.locator('#menu-item-1314 > a').textContent() //assign the text to the message to test against 
    if(text != 'Hello, Thabang')
        console.error("The aunthentication was not successful!") //return this error message id conditions are not met
    await page.screenshot({path: 'screenshot.png'}) //take a screenshot if condition are met

}

async function prepareOrder(page) {
    await page.click('#menu-item-1310 > a');
    await page.locator('xpath=//*[@id="main"]/nav/ul/li[2]/a').click();
    await page.locator('css=#main > ul > li.product.type-product.post-211.status-publish.last.instock.product_cat-uncategorized.purchasable.product-type-simple > a.button.product_type_simple.add_to_cart_button.ajax_add_to_cart').click();
    await page.locator('xpath=/html/body/nav/div[1]/div[3]/div/a').click();
    await page.getByText('Proceed to checkout').click();
    await page.getByPlaceholder('House number and street name').fill("test")

}

async function placeOrder(page) {
    await page.locator("[name='billing_postcode']").fill("1234");
    await page.locator("[name='billing_city']").fill("Mars");
    await page.locator('#place_order').click();

    expect(await page.getByText('Order received').count()).toBe(1);


}