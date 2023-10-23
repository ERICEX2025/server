/**
 * repl interface for the functions of the registered commands
 */
export interface REPLFunction {
  (args: Array<string>): Promise<string | string[][]>;
}
