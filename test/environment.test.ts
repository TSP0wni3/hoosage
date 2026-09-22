import test from "node:test";
import assert from "node:assert/strict";
import { devNull } from "node:os";
import { hasTelemetryEnvironmentConflict as conflict } from "../src/core/environment";

test("Copilot's disabled SDK and owned telemetry mirrors do not block setup", () => {
  assert.equal(conflict({ COPILOT_OTEL_FILE_EXPORTER_PATH: devNull }), false);
  const endpoint = "http://127.0.0.1:54321/project-secret";
  assert.equal(
    conflict(
      {
        COPILOT_OTEL_ENABLED: "true",
        OTEL_EXPORTER_OTLP_ENDPOINT: endpoint,
        OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT: "false",
        COPILOT_OTEL_EXPORTER_TYPE: "otlp-http",
      },
      endpoint,
    ),
    false,
  );
  assert.equal(conflict({ COPILOT_OTEL_ENABLED: "true" }), true);
});

test("foreign endpoints, file capture and content capture remain blocked", () => {
  const endpoint = "http://127.0.0.1:54321/project-secret";
  for (const env of [
    { OTEL_EXPORTER_OTLP_ENDPOINT: "http://127.0.0.1:54322/another-project" },
    { OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: "https://other.example/v1/traces" },
    { COPILOT_OTEL_FILE_EXPORTER_PATH: "/tmp/raw-prompts.jsonl" },
    { OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT: "true" },
    { COPILOT_OTEL_CAPTURE_CONTENT: "true" },
    { COPILOT_OTEL_ENABLED: "false" },
    { COPILOT_OTEL_EXPORTER_TYPE: "file" },
    { OTEL_EXPORTER_OTLP_PROTOCOL: "grpc" },
  ])
    assert.equal(conflict(env, endpoint), true);
});
