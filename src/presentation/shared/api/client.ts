import { type ZodType } from "zod";

import { ApiErrorSchema, type ApiErrorBody } from "./contracts";

export class ApiError extends Error {
  public constructor(
    public readonly status: number,
    public readonly body: ApiErrorBody
  ) {
    super(body.error);
    this.name = "ApiError";
  }
}

export class ContractError extends Error {
  public constructor(
    public readonly status: number,
    public readonly issues: unknown,
    public readonly raw: unknown
  ) {
    super("Unexpected response format");
    this.name = "ContractError";
  }
}

type BaseOptions = Omit<RequestInit, "body"> & { body?: unknown };

type WithSchema<T> = BaseOptions & { schema: ZodType<T> };
type WithoutSchema = BaseOptions & { schema?: undefined };

export function apiFetch<T>(input: string, options: WithSchema<T>): Promise<T>;
export function apiFetch(input: string, options?: WithoutSchema): Promise<void>;
export async function apiFetch<T>(
  input: string,
  options: WithSchema<T> | WithoutSchema = {}
): Promise<T | void> {
  const { body, schema, headers, ...rest } = options;

  const headersInit = new Headers(headers);
  if (body !== undefined && !headersInit.has("Content-Type")) {
    headersInit.set("Content-Type", "application/json");
  }

  const response = await fetch(input, {
    ...rest,
    headers: headersInit,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorBody(response));
  }

  if (!schema || response.status === 204) {
    return;
  }

  const json: unknown = await response.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    console.error(
      {
        url: input,
        status: response.status,
        issues: parsed.error.issues,
        raw: json,
      },
      "API contract mismatch"
    );
    throw new ContractError(response.status, parsed.error.issues, json);
  }
  return parsed.data;
}

async function parseErrorBody(response: Response): Promise<ApiErrorBody> {
  try {
    const json: unknown = await response.json();
    const parsed = ApiErrorSchema.safeParse(json);
    return parsed.success ? parsed.data : { error: `HTTP ${response.status}` };
  } catch {
    return { error: `HTTP ${response.status}` };
  }
}
