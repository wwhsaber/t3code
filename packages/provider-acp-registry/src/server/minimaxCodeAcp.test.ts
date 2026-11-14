import { assert, describe, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as EffectAcpErrors from "effect-acp/errors";

import { isMinimaxCodeBusyFailure } from "./minimaxCodeAcp.ts";

const busyError = new EffectAcpErrors.AcpRequestError({
  code: -32603,
  errorMessage:
    "MiniMax Code Runtime failed: Session already has an active Turn. Use queue send to deliver the message after it.",
});

describe("isMinimaxCodeBusyFailure", () => {
  it("recognizes the turn lease rejection", () => {
    assert.isTrue(isMinimaxCodeBusyFailure(Cause.fail(busyError)));
  });

  it.each([
    { code: -32603, errorMessage: "MiniMax Code Runtime failed: the model exploded." },
    { code: -32602, errorMessage: busyError.errorMessage },
    { code: -32603, errorMessage: "Tool failed: session already has an active turn." },
  ])("ignores other request errors ($code, $errorMessage)", (error) => {
    assert.isFalse(
      isMinimaxCodeBusyFailure(Cause.fail(new EffectAcpErrors.AcpRequestError(error))),
    );
  });
});
