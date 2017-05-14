const id = () =>
  'xxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0
    return (c == 'x' ? r : (r&0x3|0x8)).toString(16)
  })

const worker_id = id()

const log = console.log.bind({}, "Worker["+worker_id+"]", Date.now())

let iteration_count = 0
const processes = [];

const create_process = mfa => ({
  pid: [worker_id, processes.length, id()],
  mfa,
})

onmessage = ({data}) => {
  if(data.type == "spawn") {
    importScripts(data.mfa[0]+'.js')
    const m = this[data.mfa[0]]()
    const f = m[data.mfa[1]]
    const a = data.mfa[2]
    const p = create_process({m,f,a})
    processes.push(p)
  }

  if(data.type == "inspect") {
    log({
      worker_id,
      process_count: processes.length,
      pids: processes.map(p => p.pid)
    })
  }
}

const loop = () => {
  setTimeout(() => {
    processes
      .filter( p => !p.gc_mark)
      .forEach( p => {
        p.mfa.f( () => { p.gc_mark = false }, p.mfa.a)
        p.gc_mark = true
      })
    iteration_count += 1
    loop()
  }, 50)
}

loop()
