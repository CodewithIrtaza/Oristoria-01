import "@testing-library/jest-dom";
import { Expect } from "vitest";

declare module "vitest" {
  interface Assertion<T> extends jest.Matchers<T> {}
}