import { expect, test } from "bun:test";
import fixture from "./bounded-reasoning.fixture.json";

function pathFor(request: {
  sources: number;
  requiresJudgment: boolean;
  targetFilesNamed: boolean;
  literalTransformationNamed: string;
}) {
  return request.sources === 1 &&
    !request.requiresJudgment &&
    request.targetFilesNamed &&
    request.literalTransformationNamed.length > 0
    ? "bounded-mechanical"
    : "component-builder";
}

test("routes named single-source mechanical documentation to bounded path", () => {
  expect(pathFor(fixture.boundedMechanicalRequest)).toBe("bounded-mechanical");
  expect(fixture.boundedMechanicalRequest.wallClockSeconds).toBe(30);
  expect(fixture.boundedMechanicalRequest.targetFilesNamed).toBe(true);
  expect(fixture.boundedMechanicalRequest.literalTransformationNamed).toContain("task:");
});

test("keeps substantive or multi-source work under component authority", () => {
  expect(pathFor(fixture.substantiveRequest)).toBe("component-builder");
});

test("ambiguous requests stay under component authority", () => {
  expect(pathFor({
    sources: 1,
    requiresJudgment: false,
    targetFilesNamed: false,
    literalTransformationNamed: "",
  })).toBe("component-builder");
});

test("bounded deadline failure is non-retrying and recoverable", () => {
  const policy = "on expiry stop without retrying, preserve the current checkpoint";
  expect(policy).toContain("without retrying");
  expect(policy).toContain("checkpoint");
});
