import { describe, it, expect } from "bun:test";
import { Section13BenchmarkRunner, PINNED_BASELINE_COMMIT } from "../../benchmark/section-13-benchmark";

describe("Candidate Section 13 Empirical Comparative Benchmark", () => {
  it("executes 3-iteration comparative benchmark against pinned baseline and verifies all 9 dimensions", async () => {
    const runner = new Section13BenchmarkRunner();
    const evaluation = await runner.runBenchmark(3, "candidate-test-revision");

    expect(evaluation.overallPassed).toBe(true);
    expect(evaluation.baselineCommitSha).toBe(PINNED_BASELINE_COMMIT);
    expect(evaluation.totalIterations).toBe(3);
    expect(evaluation.dimensions.length).toBe(8);

    // Verify all 8 core dimensions passed
    for (const dim of evaluation.dimensions) {
      expect(dim.passed).toBe(true);
    }

    // Verify report formatting
    const md = runner.formatMarkdownReport(evaluation);
    expect(md).toContain("# Section 13 Comparative Benchmark Report");
    expect(md).toContain(PINNED_BASELINE_COMMIT);
    expect(md).toContain("PASSED (100% Criteria Met)");
  });
});
