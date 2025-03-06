import puppeteer from 'puppeteer';

export const scrapeCourses = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.udemy.com/courses/development/');

    const courses = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.course-card--course-title--2f7tE')).map(el => el.innerText);
    });

    await browser.close();
    return courses;
};

