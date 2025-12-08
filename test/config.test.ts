import { describe, it } from "node:test";
import assert from "node:assert";
import { ESLint } from "eslint";
import type { Linter } from "eslint";

import config from "../eslint.config.mjs";

/**
 * Helper to serialize config for comparison
 * Replaces functions/objects with their type for readable diffs
 */
function serializeConfig(config: Linter.Config[]): unknown[] {
  return config.map((item) => {
    const serialized: Record<string, unknown> = {};

    // Copy primitive values and arrays
    for (const [key, value] of Object.entries(item)) {
      if (key === "plugins" && value && typeof value === "object") {
        serialized.plugins = Object.keys(value).sort();
      } else if (
        key === "languageOptions" &&
        value &&
        typeof value === "object"
      ) {
        const langOpts = value as Record<string, unknown>;
        serialized.languageOptions = {
          ...langOpts,
          parser: langOpts.parser ? "<TypeScript Parser>" : undefined,
        };
      } else if (typeof value === "function") {
        serialized[key] = "<Function>";
      } else if (value && typeof value === "object" && !Array.isArray(value)) {
        serialized[key] = JSON.parse(JSON.stringify(value));
      } else {
        serialized[key] = value;
      }
    }

    return serialized;
  });
}

describe("ESLint Config Structure", () => {
  it("should match expected config structure", () => {
    const expectedConfig = [
      "SKIP_FIRST_ENTRY",
      {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: [
          "@typescript-eslint",
          "import",
          "jsx-a11y",
          "react",
          "react-hooks",
        ].sort(),
        languageOptions: {
          globals: {
            console: true,
            document: true,
            module: true,
            navigator: true,
            process: true,
            require: true,
            window: true,
            // Jest globals
            afterAll: true,
            afterEach: true,
            beforeAll: true,
            beforeEach: true,
            describe: true,
            expect: true,
            it: true,
            jest: true,
            test: true,
            vi: true, // Vitest
          },
          parser: "<TypeScript Parser>",
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
            ecmaVersion: "latest",
            sourceType: "module",
          },
        },
        settings: {
          "import/resolver": {
            typescript: {
              alwaysTryTypes: true,
            },
          },
          react: {
            version: "detect",
          },
        },
        rules: {
          "@typescript-eslint/ban-ts-comment": "off",
          "@typescript-eslint/no-non-null-assertion": "off",
          "@typescript-eslint/no-use-before-define": "error",
          "jsx-a11y/href-no-hash": "off",
          "no-console": "warn",
          "no-prototype-builtins": "off",
          "no-useless-escape": "off",
          "react-hooks/exhaustive-deps": "warn",
          "react-hooks/rules-of-hooks": "error",
          "react/no-access-state-in-setstate": "error",
          "react/no-direct-mutation-state": "error",
          "react/no-redundant-should-component-update": "error",
          "react/no-typos": "error",
          "react/no-unused-state": "warn",
        },
      },
      // TypeScript-specific overrides
      {
        files: ["**/*.ts", "**/*.tsx"],
        rules: {
          "no-unused-vars": "off",
          "no-undef": "off",
        },
      },
      {
        ignores: [".next/**", "node_modules/**", "dist/**", "coverage/**"],
      },
    ];

    const serialized = serializeConfig(config);

    assert.strictEqual(
      serialized.length,
      expectedConfig.length,
      `Config should have ${expectedConfig.length} entries`
    );

    for (let i = 0; i < expectedConfig.length; i++) {
      const actual = serialized[i] as Record<string, unknown>;
      const expected = expectedConfig[i];

      // Special handling for first entry (eslint.configs.recommended)
      if (i === 0 || expected === "SKIP_FIRST_ENTRY") {
        assert.ok(
          actual.rules,
          "First config should have rules from @eslint/js"
        );
        continue;
      }

      // Compare all keys
      assert.deepStrictEqual(
        actual,
        expected as Record<string, unknown>,
        `Config entry ${i} doesn't match expected structure.\n\n` +
          `Expected:\n${JSON.stringify(expected, null, 2)}\n\n` +
          `Actual:\n${JSON.stringify(actual, null, 2)}`
      );
    }
  });

  it("should export an array", () => {
    assert.ok(Array.isArray(config), "Config should be an array");
    assert.strictEqual(config.length, 4, "Config should have 4 entries");
  });
});

describe("ESLint Integration - React Hooks v7", () => {
  it("should successfully lint valid TypeScript React code with hooks", async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: config as Linter.Config[],
    });

    const code = `
import React, { useState, useEffect } from 'react';

type Props = {
  initialCount: number;
}

export const Counter = ({ initialCount }: Props): React.ReactNode => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
`;

    const results = await eslint.lintText(code, { filePath: "test.tsx" });
    const errors = results[0].messages.filter((m) => m.severity === 2);

    assert.strictEqual(
      errors.length,
      0,
      `Valid hooks code should have no errors, but got:\n${JSON.stringify(
        errors,
        null,
        2
      )}`
    );
  });

  it("should catch rules-of-hooks violations (conditional hooks)", async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: config as Linter.Config[],
    });

    const conditionalHookCode = `
import React, { useState } from 'react';

export const BadComponent = ({ condition }: { condition: boolean }) => {
  if (condition) {
    const [value] = useState(0);  // ❌ Hook called conditionally
  }

  return <div>Bad</div>;
};
`;

    const results = await eslint.lintText(conditionalHookCode, {
      filePath: "test.tsx",
    });

    const errors = results[0].messages.filter((m) => m.severity === 2);
    const hookError = errors.find(
      (e) => e.ruleId === "react-hooks/rules-of-hooks"
    );

    assert.ok(
      hookError,
      "Should catch conditional hook violation with rules-of-hooks rule"
    );
    assert.ok(
      hookError.message.toLowerCase().includes("hook"),
      "Error message should mention hooks"
    );
  });

  it("should catch exhaustive-deps violations (missing dependencies)", async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: config as Linter.Config[],
    });

    const missingDepsCode = `
import React, { useEffect, useState } from 'react';

export const Component = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);  // Uses count but not in deps
  }, []);  // ⚠️ Missing dependency: count

  return <div>{count}</div>;
};
`;

    const results = await eslint.lintText(missingDepsCode, {
      filePath: "test.tsx",
    });

    const warnings = results[0].messages.filter((m) => m.severity === 1);
    const depsWarning = warnings.find(
      (w) => w.ruleId === "react-hooks/exhaustive-deps"
    );

    assert.ok(
      depsWarning,
      "Should warn about missing dependencies with exhaustive-deps rule"
    );
  });

  it("should catch TypeScript errors (use-before-define)", async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: config as Linter.Config[],
    });

    const code = `
import React from 'react';

const Component = () => {
  foo();  // X Used before defined
  const foo = () => {};
  return <div>Test</div>;
};
`;

    const results = await eslint.lintText(code, { filePath: "test.tsx" });
    const errors = results[0].messages.filter((m) => m.severity === 2);

    assert.ok(errors.length > 0, "Should catch use-before-define error");
  });

  it("should respect ignore patterns", async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: config as Linter.Config[],
    });

    assert.strictEqual(
      await eslint.isPathIgnored("node_modules/test.js"),
      true,
      "Should ignore node_modules"
    );
    assert.strictEqual(
      await eslint.isPathIgnored(".next/test.js"),
      true,
      "Should ignore .next"
    );
    assert.strictEqual(
      await eslint.isPathIgnored("dist/test.js"),
      true,
      "Should ignore dist"
    );
    assert.strictEqual(
      await eslint.isPathIgnored("src/test.tsx"),
      false,
      "Should not ignore src files"
    );
  });
});
