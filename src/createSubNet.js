let mask = ''
let maximumNumber = 0
let networkClass = 'No Class'
let table = []

function createSubNet(ip, networks, hosts) {
  let tempIp = ip.split('.')
  if (!verifyIp(tempIp)) {
    return console.log('This is not ipv4.')
  }

  checkClass(tempIp)

  if (!checkNetworks(networks) || !checkHost(hosts)) {
    return console.log('The number of networks/hosts can not divide the given ip address.')
  }

  findSubnet(300)

  console.log('IP: ' + ip + '\nMask: ' + mask + '\nMaximum number: ' + maximumNumber + '\nNetwork class: ' + networkClass + '\nNetwork: ' + networks + '\nHosts: ' + hosts)


}

function findSubnet(numberSubnet) {
  let i = 0
  while (numberSubnet > Math.pow(2, i)) i++
  console.log(i)
  return i
}

function checkNetworks(networks) {
  return networks >= 0 && networks <= maximumNumber
}

function checkHost(hosts) {
  return hosts >= 0 && hosts <= maximumNumber
}

function checkClass(ip) {
  let domain = parseInt(ip[0])
  console.log(domain)
  if (isClassA(domain)) {
    mask = '255.0.0.0'
    maximumNumber = Math.pow(2, 23)
    networkClass = 'Class A'
  } else if (isClassB(domain)) {
    mask = '255.255.0.0'
    maximumNumber = Math.pow(2, 15)
    networkClass = 'Class B'
  } else if (isClassC(domain)) {
    mask = '255.255.255.0'
    maximumNumber = Math.pow(2, 7)
    networkClass = 'Class C'
  } else if (isClassD(domain)) {
    mask = 'No Mask'
    networkClass = 'Class D'
  } else if (isClassE(domain)) {
    mask = 'No Mask'
    networkClass = 'Class E'
  }
}

function verifyIp(ip) {
  let result = true
  ip.forEach(function (subIp) {
    if (parseInt(subIp) > 256 || parseInt(subIp) < 0) {
      result = false
    }
  })
  return result && ip.length == 4
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

createSubNet('150.11.11.1', 10, 0)


// export default separateIp
