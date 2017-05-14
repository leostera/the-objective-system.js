const log = console.log.bind({})

const scheduler = options => {
  const num_cores = window.navigator.hardwareConcurrency

  const workers = new Array(num_cores).fill(true)
    .map((_, id) => ({
      id,
      worker: new Worker('./src/worker.js'),
    }))

  const randomWorker = _ => workers[(Math.random()*10 % num_cores)|0]

  return {
    inspect: () => {
      workers.forEach( ({worker}) => worker.postMessage({
        type: "inspect"
      }))
    },
    spawn: mfa => {
      randomWorker().worker.postMessage({
        type: "spawn",
        mfa,
      })
    }
  }
}

window.sch = scheduler({});

sch.spawn(["testModule", "testFunction", {name: "A"}]);
sch.spawn(["testModule", "testFunction", {name: "B"}]);
sch.spawn(["testModule", "testFunction", {name: "C"}]);
sch.spawn(["testModule", "loopy", {name: "D"}]);
