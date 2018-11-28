let mask = ''
let maximumNumber = 0
let networkClass = 'No Class'
let divideBit = 0
let allowBits = 0
let numberOfNetwork = 0
let numberOfHost = 0

export const getMask = () => mask
export const getNetworkClass = () => networkClass
export const getNumberOfNetwork = () => numberOfNetwork
export const getNumberOfHost = () => numberOfHost

// Must submit neither networks or hosts
export const createSubnet = (ip, networks, hosts) => {
  let subnetTable = []
  let tempIp = ip.split('.')
  if (!verifyIp(tempIp)) {
    return
  } else {
    networkClass = checkClass(tempIp)
  }

  if (networks === 0 && hosts > 0) {
    divideBit = allowBits - findSubnetBits(hosts)
  } else if (hosts === 0 && networks > 0) {
    divideBit = findSubnetBits(networks)
  }

  numberOfNetwork = Math.pow(2, divideBit)
  numberOfHost = Math.pow(2, (allowBits - divideBit))

  if (!checkNetworks(networks) || !checkHost(hosts)) {
    return 'The number of networks/hosts can not divide the subnet.'
  }

  for (let i = 0; i < tempIp.length; i++) {
    if (tempIp[i] === '0') {
      tempIp[i] = '00000000'
    } else {
      tempIp[i] = parseInt(tempIp[i]).toString(2)
      while (tempIp[i].length !== 8) {
        tempIp[i] = '0' + tempIp[i]
      }
      console.log(tempIp[i])
    }
  }
  // console.log(tempIp)
  let tempBinary = tempIp.join().replace(/,/g, '')
  let tempDecimal = parseInt(tempBinary, 2)
  // console.log(tempDecimal)


  for (let i = 0; i < Math.pow(2, divideBit); i++) {
    let subnetID = (tempDecimal + (i * Math.pow(2, allowBits - divideBit))).toString(2)
    // console.log(subnetID)

    let boardcast = (tempDecimal + ((i + 1) * Math.pow(2, allowBits - divideBit)) - 1).toString(2)
    let lastHost = (tempDecimal + ((i + 1) * Math.pow(2, allowBits - divideBit)) - 2).toString(2)

    subnetID = addZeroUntil32(subnetID)
    boardcast = addZeroUntil32(boardcast)
    lastHost = addZeroUntil32(lastHost)

    let firstHost = findFirstHost(subnetID)
    subnetID = convertBinaryToDecimalAndJoin(subnetID)
    boardcast = convertBinaryToDecimalAndJoin(boardcast)
    lastHost = convertBinaryToDecimalAndJoin(lastHost)

    subnetTable.push({
      subnet: i,
      subnetID,
      firstHost,
      lastHost,
      boardcast
    })

  }
  return subnetTable
}

function addZeroUntil32(subnetID) {
  while (subnetID.length !== 32) {
    subnetID = '0' + subnetID
  }
  return subnetID
}

function convertBinaryToDecimalAndJoin(subnetID) {
  let one = parseInt(subnetID.slice(0, 8), 2).toString()
  let two = parseInt(subnetID.slice(8, 16), 2).toString()
  let three = parseInt(subnetID.slice(16, 24), 2).toString()
  let four = parseInt(subnetID.slice(24), 2).toString()
  return one + '.' + two + '.' + three + '.' + four
}

function findFirstHost(subnetID) {
  let one = parseInt(subnetID.slice(0, 8), 2).toString()
  let two = parseInt(subnetID.slice(8, 16), 2).toString()
  let three = parseInt(subnetID.slice(16, 24), 2).toString()
  let four = parseInt(subnetID.slice(24), 2).toString()
  return one + '.' + two + '.' + three + '.' + (parseInt(four) + 1)
}

function findSubnetBits(numberSubnet) {
  let i = 0
  while (numberSubnet > Math.pow(2, i)) i++
  return i
}

function checkNetworks(networks) {
  return networks >= 0 && networks <= maximumNumber && divideBit <= allowBits
}

function checkHost(hosts) {
  return hosts >= 0 && hosts <= maximumNumber && divideBit <= allowBits
}

function checkClass(ip) {
  let domain = parseInt(ip[0])
  let netClass = ''
  if (isClassA(domain)) {
    mask = '255.0.0.0, /8'
    maximumNumber = Math.pow(2, 23)
    netClass = 'Class A'
    allowBits = 24
  } else if (isClassB(domain)) {
    mask = '255.255.0.0, /16'
    maximumNumber = Math.pow(2, 15)
    netClass = 'Class B'
    allowBits = 16
  } else if (isClassC(domain)) {
    mask = '255.255.255.0, /24'
    maximumNumber = Math.pow(2, 7)
    netClass = 'Class C'
    allowBits = 8
  } else if (isClassD(domain)) {
    mask = 'No Mask'
    netClass = 'Class D'
  } else if (isClassE(domain)) {
    mask = 'No Mask'
    netClass = 'Class E'
  }
  return netClass
}

function verifyIp(ip) {
  let result = true
  ip.forEach(function (subIp) {
    if (parseInt(subIp) > 256 || parseInt(subIp) < 0) {
      result = false
    }
  })
  return result && ip.length === 4
}

function isClassA(firstByte) {
  return firstByte < 128
}

function isClassB(firstByte) {
  return firstByte < 192
}

function isClassC(firstByte) {
  return firstByte < 224
}

function isClassD(firstByte) {
  return firstByte < 240
}

function isClassE(firstByte) {
  return firstByte < 256
}
