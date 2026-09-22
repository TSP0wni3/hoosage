import { devNull } from "node:os";

/** Copilot's bundled SDK mirrors its resolved settings into the shared host env. */
export function hasTelemetryEnvironmentConflict(
  env: NodeJS.ProcessEnv,
  ownedEndpoint?: string,
): boolean {
  const expected: Record<string, readonly string[]> = {
    COPILOT_OTEL_FILE_EXPORTER_PATH: ["", devNull],
    COPILOT_OTEL_CAPTURE_CONTENT: ["false", "0"],
    OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT: ["false", "0"],
    COPILOT_OTEL_EXPORTER_TYPE: ["otlp-http"],
    OTEL_EXPORTER_OTLP_PROTOCOL: ["http/json", "http/protobuf"],
    COPILOT_OTEL_PROTOCOL: ["http/json", "http/protobuf"],
    COPILOT_OTEL_ENABLED: ownedEndpoint ? ["true", "1"] : [],
    COPILOT_OTEL_ENDPOINT: ownedEndpoint ? [ownedEndpoint] : [],
    OTEL_EXPORTER_OTLP_ENDPOINT: ownedEndpoint ? [ownedEndpoint] : [],
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: ownedEndpoint
      ? [`${ownedEndpoint}/v1/traces`]
      : [],
  };
  return Object.entries(expected).some(
    ([key, allowed]) => env[key] !== undefined && !allowed.includes(env[key]!),
  );
}
