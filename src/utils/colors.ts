export function green (str: string): string {
  return '\x1B[32m' + str + '\x1B[39m';
}

export function cyan (str: string): string {
  return '\x1B[36m' + str + '\x1B[39m';
}

export function red (str: string): string {
  return '\x1B[31m' + str + '\x1B[39m';
}
