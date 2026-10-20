import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("主链路包含问题路由、七个诊断维度和证据下钻", () => {
  assert.match(page, /routeQuestion/);
  assert.match(page, /经营质量.*财务趋势.*估值位置.*行情特征.*行业位置.*重要事件.*风险雷达/s);
  assert.match(page, /EVIDENCE TRACE/);
});

test("事实、推断、待验证与四类证据均有明确表达", () => {
  for (const word of ["事实", "推断", "待验证", "positive", "negative", "conflict", "unknown"]) {
    assert.ok(page.includes(word), `missing ${word}`);
  }
});

test("关键证据包含来源、时点、原始字段与计算口径", () => {
  for (const word of ["sourceName", "asOf", "fields", "formula", "打开原文"]) {
    assert.ok(page.includes(word), `missing ${word}`);
  }
  assert.match(page, /midea\.com\.cn/);
});

test("产品包含合规提示与移动端响应规则", () => {
  assert.match(page, /不构成投资建议/);
  assert.match(css, /@media\(max-width:650px\)/);
});
