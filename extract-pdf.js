import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as fs from 'fs';
import * as path from 'path';

// 프로젝트 루트에서의 상대 경로
const pdfPath1 = "./2026 학교생활기록부 기재요령(고).pdf";
const pdfPath2 = "./교과세특 기재 역량 강화 연수를 위한 교과세특 기재 예시 도움 자료.pdf";

async function extractKeySections(pdfPath, outName, keywords) {
  console.log(`Extracting from ${pdfPath}...`);
  try {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded. Total pages: ${pdf.numPages}`);
    
    let matchedTexts = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      
      const containsKeyword = keywords.some(k => pageText.includes(k));
      if (containsKeyword) {
        matchedTexts.push(`--- Page ${i} ---`);
        matchedTexts.push(pageText);
      }
    }
    
    fs.writeFileSync(outName, matchedTexts.join('\n\n'), 'utf-8');
    console.log(`Done. Saved to ${outName}`);
  } catch (e) {
    console.error(`Error processing ${pdfPath}:`, e);
  }
}

const keywords = ["영어", "외국어", "기재 예시", "기재 금지", "영어과", "수행평가", "기재요령"];
await extractKeySections(pdfPath1, "extracted_rules.txt", keywords);
await extractKeySections(pdfPath2, "extracted_examples.txt", keywords);
