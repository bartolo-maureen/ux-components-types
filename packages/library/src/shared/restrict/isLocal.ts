import ipRangeCheck from 'ip-range-check'

/**
 * TODO: discuss better location for this static data.
 * Maybe this can come from a request/config so that
 * if we need to modify, we do not need to redeploy code.
 */
const hosts = {
  static: [ 'localhost', '127.0.0.1', '0.0.0.0' ],
  subnets: [ '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16' ]
}

/**
 * Returns the matched host if the current host is one of the expected static hosts.
 * @param hostname - A string representing the current hostname
 */
const isStaticHost = (hostname = '') => hosts.static.find(host => host === hostname)

/**
 * Returns the matched host if the current host is one of the expected ip range hosts.
 * @param hostname - A string representing the current hostname
 */
const isIpHost = (hostname = '') => ipRangeCheck(hostname, hosts.subnets)

/**
 * Returns a boolean to determine whether the current hostname is valid.
 * @param hostname - A string representing the current hostname
 */
export const isLocal = (hostname = '') => {

  /**
   * We ecpect to receive a hostname, however, we
   * fallback to the location hostname if not received.
   */
  const currentHost = hostname
    ? hostname
    : window.location.hostname

  /**
   * Check if the current host is static.
   * Separated from `isIpHost` check to allow
   * returning earlier without evaluating subnets.
   */
  if (isStaticHost(hostname)) {
    return true
  }

  if (isIpHost(hostname)) {
    return true
  }

  return false
}
