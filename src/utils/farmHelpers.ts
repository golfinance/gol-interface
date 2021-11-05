const ARCHIVED_FARMS_START_PID = 9000
const ARCHIVED_FARMS_END_PID = 9999

const isArchivedPid = (pid: number) => pid >= ARCHIVED_FARMS_START_PID && pid <= ARCHIVED_FARMS_END_PID

export default isArchivedPid
