
import { JSDOM } from 'jsdom';

export async function GET() {
    const residents = await (
    fetch('https://www.spectrumhealth.org/medical-education/residencies/pediatrics-residency-bios')
        .then(response => response.text())
        .then(htmlString => {
            const dom = new JSDOM(htmlString);
            const img = dom.window.document.querySelectorAll('img');
            const h5 = dom.window.document.querySelectorAll('h5');
            const images = [...img].map(element => element.src);
            const residents =  [...h5].map(element => element.innerHTML);
            const res = residents.map((r, i) => { return({name: r, image_path: images[i+8]})});
            const res_csv = res.reduce((a, b) => {return(a + '"' + b.name + '", ' + b.image_path + "\n")},
            "");
            return(res_csv);
        }));
    return(new Response(residents)); 
}


