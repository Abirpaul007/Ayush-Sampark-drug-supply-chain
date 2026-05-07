const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const DeliveredOrders = await hre.ethers.getContractFactory("DeliveredOrders");
  const contract = await DeliveredOrders.attach(contractAddress);

  const orders = await contract.getDeliveredOrders();

  console.log("✅ Delivered Orders:");
  orders.forEach((order, index) => {
    console.log(`\n📦 Order #${index + 1}`);
    console.log(`- Order ID: ${order.orderId}`);
    console.log(`- Hospital: ${order.hospitalName}`);
    console.log(`- Medicine ID: ${order.medicineId}`);
    console.log(`- Medicine Name: ${order.medicineName}`);
    console.log(`- Quantity: ${order.quantity.toString()}`);
    console.log(`- Vendor ID: ${order.vendorId}`);
    console.log(`- Vendor Name: ${order.vendorName}`);
    console.log(`- Timestamp: ${new Date(Number(order.timestamp) * 1000).toLocaleString()}`);
  });
}

main().catch((err) => {
  console.error("❌ Error reading data:", err);
  process.exit(1);
});
