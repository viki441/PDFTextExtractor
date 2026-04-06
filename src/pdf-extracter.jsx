import { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

function TextGenerator() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState("");


  async function generate() {
    if (!file) {
      alert("Select a pdf file!");
      return;
    }
    //if (!fileInput.files.length) return alert("Please select a PDF file");

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let allText = '';

    //const fileInput = document.getElementById('myfile');

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      let pageText = content.items.map(i => i.str).join("").normalize('NFC');

      const latinDiacriticRegex = /[\u0100-\u017F]/;
      const macronRegex = /[ĀāĒēĪīŌōŪū]|[A-Za-z]\u0304/;
      const cyrillicRegex = /[\u0400-\u04FF]/;

      const garbledToCyrillic = {
        'À': 'А', 'Á': 'Б', 'Â': 'В', 'Ã': 'Г', 'Ä': 'Д', 'Å': 'Е', 'Æ': 'Ж', 'Ç': 'З',
        'È': 'И', 'É': 'Й', 'Ê': 'К', 'Ë': 'Л', 'Ì': 'М', 'Í': 'Н', 'Î': 'О', 'Ï': 'П',
        'Ð': 'Р', 'Ñ': 'С', 'Ò': 'Т', 'Ó': 'У', 'Ô': 'Ф', 'Õ': 'Х', 'Ö': 'Ц', '×': 'Ч',
        'Ø': 'Ш', 'Ù': 'Щ', 'Ú': 'Ъ', 'Û': 'Ы', 'Ü': 'Ь', 'Ý': 'Э', 'Þ': 'Ю', 'ß': 'Я',
        'à': 'а', 'á': 'б', 'â': 'в', 'ã': 'г', 'ä': 'д', 'å': 'е', 'æ': 'ж', 'ç': 'з',
        'è': 'и', 'é': 'й', 'ê': 'к', 'ë': 'л', 'ì': 'м', 'í': 'н', 'î': 'о', 'ï': 'п',
        'ð': 'р', 'ñ': 'с', 'ò': 'т', 'ó': 'у', 'ô': 'ф', 'õ': 'х', 'ö': 'ц', '÷': 'ч',
        'ø': 'ш', 'ù': 'щ', 'ú': 'ъ', 'û': 'ы', 'ü': 'ь', 'ý': 'э', 'þ': 'ю', 'ÿ': 'я'
      };
      const fixCyrillic = t => t.split('').map(c => garbledToCyrillic[c] || c).join('');

      const lines = pageText.split(/\r?\n/).map(l => fixCyrillic(l));

      allText += `=== Page ${pageNum} ===\n`;
      lines.forEach(l => {
        if (latinDiacriticRegex.test(l) || cyrillicRegex.test(l)) {
          allText += l + '\n';
        }

        if (macronRegex.test(l)) {
          allText += ' (negative) ' + l;
        }
      });
      allText += '\n';
    }

    allText = allText.replace(/Зад\./g, '\n\nЗад.');
    allText = allText.replace(/^\n/, '');
    //document.getElementById('text').value = allText;
    setOutput(allText);
  }

  async function generateFile()
  {
    if(!output)
    {
      alert("Can't generate from an empty file!");
      return;
    }
    
    const blob = new Blob(["\uFEFF" +output], {type: "text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "extracted.txt";
    a.click();

    URL.revokeObjectURL(url);
  }
  //document.getElementById('generateBtn').addEventListener('click', generate);
  return(
  <div>
    <h1>PDF extractor</h1>
    <p>choose a file that can't be coppied</p>



    <input style={{display:"none"}} type="file" id="pdfFile" onChange={(e) => setFile(e.target.files[0])}></input>
    
    <label htmlFor="pdfFile" className="choose-file">
      <span>choose file</span>
      <div className="transition-bar"></div>
    </label>

    {file && (
        <p style={{ marginLeft: "10px", color: "white" }}>{file.name}</p>
      )}
    <a className="main-btn" onClick={generate}><span>Generate</span><div className="transition-bar"></div></a>
    <a className="main-btn" onClick={generateFile}><span>download txt</span><div className="transition-bar"></div></a>
    <br/><br/>
    <textarea
    placeholder="Extracted text will appear here..."
    readOnly
    value={output}
    ></textarea>

  </div>


);
}

export default TextGenerator;

