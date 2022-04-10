
const log = (consoleLog: () => void) => {
  if (process.env.NODE_ENV === 'development') {
    consoleLog()
    // const line = stacktrace();
    // const lines = line.split("\n");
    // console.log(lines)
    // const originWhere = lines[3]
    // console.log(originWhere.substring(originWhere.indexOf("("), originWhere.lastIndexOf(")") + 1))
    // console.log(anyObject)
  }
}

function stacktrace(): string {
  var err = new Error()
  return err.stack!
}

export {
  log
}
