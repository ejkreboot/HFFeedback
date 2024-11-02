
import { JSDOM } from 'jsdom';

export async function GET() {
    const residents = await (
    fetch('https://www.spectrumhealth.org/medical-education/residencies/pediatrics-residency-bios')
        .then(response => response.text())
        .then(htmlString => {
            const dom = new JSDOM(htmlString);
            const elements = dom.window.document.querySelectorAll('h5');
            const res = [...elements].map(element => element.innerHTML);
            return(JSON.stringify(res))
        }));
    return(new Response(residents)); 
}