import fs from 'fs';
import path from 'path';

import enUS from '../src/locales/en-US';
import zhCN from '../src/locales/zh-CN';
import ruRU from '../src/locales/ru-RU';

type LangDict = Record<string, unknown>;

type FlatMap = Record<string, string>;

function flattenLang(obj: LangDict, prefix: string, out: FlatMap) {
  Object.entries(obj).forEach(([key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      out[newKey] = value;
      return;
    }

    if (value && typeof value === 'object') {
      flattenLang(value as LangDict, newKey, out);
    }
  });
}

function escapeCsv(value: string): string {
  const needsQuote = /[",\r\n]/.test(value);
  let result = value.replace(/"/g, '""');
  if (needsQuote) {
    result = `"${result}"`;
  }
  return result;
}

function generate() {
  const locales: Record<string, FlatMap> = {
    'en-US': {},
    'zh-CN': {},
    'ru-RU': {},
  };
  const localeOrder = Object.keys(locales);

  flattenLang(enUS as LangDict, '', locales['en-US']);
  flattenLang(zhCN as LangDict, '', locales['zh-CN']);
  flattenLang(ruRU as LangDict, '', locales['ru-RU']);

  const allKeys = Array.from(
    new Set(localeOrder.flatMap((locale) => Object.keys(locales[locale]))),
  ).sort();

  const lines: string[] = [];
  lines.push(['key', ...localeOrder].join(','));

  allKeys.forEach((key) => {
    const row = [key, ...localeOrder.map((locale) => locales[locale][key] ?? '')];
    lines.push(row.map((value) => escapeCsv(value)).join(','));
  });

  const outDir = path.resolve(process.cwd(), 'locale');
  const outPath = path.join(outDir, 'i18n-doc.csv');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 添加 UTF-8 BOM 以便 Excel 正确识别中文编码
  const content = lines.join('\n');
  const bom = '\uFEFF';
  const buffer = Buffer.from(bom + content, 'utf8');
  fs.writeFileSync(outPath, buffer);
  // eslint-disable-next-line no-console
  console.log(`i18n 文档已生成: ${outPath}`);
}

generate();


