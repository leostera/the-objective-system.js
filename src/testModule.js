function testModule() {
  return {
    testFunction: (reschedule, {name}) => {
      console.log('testModule:testFunction(', name, ')')
    },

    loopy: (reschedule, {name}) => {
      console.log('testModule:loopy(', name ,')')
      setTimeout(reschedule, 500)
    }
  }
}
