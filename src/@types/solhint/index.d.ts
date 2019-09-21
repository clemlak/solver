declare module 'solhint/lib' {
  function processStr(
    inputStr: string,
    config?: object,
    fileName?: string,
  ): Reporter;

  interface Reporter {
    messages: Message[],
  }

  interface Message {
    line: number,
    column: number,
    severity: number,
    message: string,
    ruleId: string,
  }
}
