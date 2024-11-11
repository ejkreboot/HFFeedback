
import { JSDOM } from 'jsdom';

export async function GET() {
    const residents = await (
    fetch('https://www.spectrumhealth.org/medical-education/residencies/pediatrics')
        .then(response => response.text())
        .then(htmlString => {
            const dom = new JSDOM(htmlString);
            const img = dom.window.document.querySelectorAll('.quarter-width img');
            const h5 = dom.window.document.querySelectorAll('.h6');
            const images = [...img].map(element => { return({path: element.src, name: element.alt})});
//            const residents =  [...h5].map(element => element.innerHTML);
//            const res = residents.map((r, i) => { return({name: r, image_path: images[i-3]})});
            const res_csv = images.reduce((a, b) => {return(a + '"' + b.name + '", ' + b.path + "\n")},
            "");
            return(res_csv);
        }));
    return(new Response(residents)); 
}


