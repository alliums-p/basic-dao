import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
// @ts-ignore
import {ethers} from "hardhat"
import { ADDRESS_ZERO } from "../helper-hardhat-config"

const setupContracts: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
) {
    const {getNamedAccounts, deployments} = hre
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const governor = await ethers.getContract("GovernorContract", deployer)
    const timeLock = await ethers.getContract("TimeLock", deployer)

    log("Setting up roles...")
    const proposerRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address)
    await proposerTx.wait(1)

    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
    await executorTx.wait(1)

    const revokeTx = await timeLock.grantRole(adminRole, deployer)
    await revokeTx.wait(1)
}

export default setupContracts