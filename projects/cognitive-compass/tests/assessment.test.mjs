import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const [dataSource, engineSource] = await Promise.all([
  readFile(new URL("../data.js", import.meta.url), "utf8"),
  readFile(new URL("../engine.js", import.meta.url), "utf8")
]);
const context = vm.createContext({ window: {} });
vm.runInContext(dataSource, context);
vm.runInContext(engineSource, context);

const { domains, bank, practice } = context.window.CC_DATA;
const engine = context.window.CC_ENGINE;

test("the assessment bank contains 80 unique and valid original items", () => {
  assert.equal(engine.validateBank(domains, bank, practice), true);
  assert.equal(domains.length, 8);
  assert.equal(bank.length, 80);
  assert.equal(new Set(bank.map((item) => item.id)).size, 80);
  for (const domain of domains) {
    const items = bank.filter((item) => item.d === domain.id);
    assert.equal(items.length, 10, domain.id + " should contain 10 items");
    assert.ok(items.every((item) => item.o.length === 4));
    assert.ok(items.every((item) => item.a >= 0 && item.a < 4));
  }
});

test("the practice lab contains 16 exercises with valid answer keys", () => {
  assert.equal(practice.length, 16);
  assert.equal(new Set(practice.map((item) => item.t)).size, 16);
  for (const domain of domains) {
    assert.ok(practice.some((item) => item.d === domain.id), "missing practice domain: " + domain.id);
  }
  for (const item of practice) {
    assert.equal(item.o.length, 4);
    assert.ok(item.a >= 0 && item.a < 4);
    assert.ok(item.e.length > 0);
  }
});

test("a complete adaptive run selects 40 unique questions and five per domain", () => {
  const state = engine.createSession(domains, Date.now(), () => 0);
  let question = engine.chooseQuestion(state, bank, 5, () => 0);
  while (question) {
    state.current = question;
    const outcome = engine.recordResponse(state, question.a, bank);
    assert.equal(outcome.correct, true);
    question = engine.chooseQuestion(state, bank, 5, () => 0);
  }
  assert.equal(state.asked.length, 40);
  assert.equal(new Set(state.asked).size, 40);
  for (const domain of domains) {
    assert.equal(state.counts[domain.id], 5, domain.id + " should have five questions");
  }
});

test("correct and incorrect answers adapt the next difficulty target", () => {
  const state = engine.createSession(domains);
  let question = engine.chooseQuestion(state, bank, 5, () => 0);
  state.current = question;
  const correctBefore = state.level[question.d];
  engine.recordResponse(state, question.a, bank);
  assert.equal(state.level[question.d], Math.min(3, correctBefore + 1));

  question = engine.chooseQuestion(state, bank, 5, () => 0);
  state.current = question;
  const incorrectBefore = state.level[question.d];
  engine.recordResponse(state, (question.a + 1) % 4, bank);
  assert.equal(state.level[question.d], Math.max(1, incorrectBefore - 1));
});

test("report calculation uses transparent raw accuracy and equal domain samples", () => {
  const state = engine.createSession(domains);
  let question = engine.chooseQuestion(state, bank, 5, () => 0);
  while (question) {
    state.current = question;
    engine.recordResponse(state, question.a, bank);
    question = engine.chooseQuestion(state, bank, 5, () => 0);
  }
  const result = engine.scoreSession(state, bank, domains);
  assert.equal(result.score, 100);
  assert.equal(result.correct, 40);
  assert.equal(result.total, 40);
  for (const domain of domains) {
    assert.equal(result.domains[domain.id].total, 5);
    assert.equal(result.domains[domain.id].correct, 5);
    assert.equal(result.domains[domain.id].score, 100);
  }
  assert.notEqual(result.speedMedianMs, null);
});

test("every memory assessment item has a separate recall stimulus", () => {
  const memoryItems = bank.filter((item) => item.d === "memory");
  assert.equal(memoryItems.length, 10);
  assert.ok(memoryItems.every((item) => typeof item.v === "string" && item.v.length > 0));
});

test("response validation rejects missing and out-of-range choices", () => {
  const state = engine.createSession(domains);
  const question = engine.chooseQuestion(state, bank, 5);
  state.current = question;
  assert.throws(() => engine.recordResponse(state, undefined, bank));
  assert.throws(() => engine.recordResponse(state, 4, bank));
});
