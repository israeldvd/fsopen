import { test } from '@playwright/test'

test.describe('Blog app', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const locatorUsername = page.getByTestId('login-username')
        const locatorPassword = page.getByTestId('login-password')
        const locatorBtn = page.getByTestId('login-button')

        await test.expect(locatorUsername).toBeVisible()
        await test.expect(locatorPassword).toBeVisible()
        await test.expect(locatorBtn).toBeVisible()
    })
})