const hre = require("hardhat");

async function main() {
  const DeliveredOrders = await hre.ethers.getContractFactory("DeliveredOrders");
  const deliveredOrders = await DeliveredOrders.deploy(); // deploys the contract
  await deliveredOrders.waitForDeployment(); // wait until mined

  console.log("✅ Contract deployed to:", await deliveredOrders.getAddress());
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
