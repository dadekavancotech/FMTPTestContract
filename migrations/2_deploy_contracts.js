var DividendDistributor = artifacts.require("DividendDistributor");
var Void = artifacts.require("Void");

module.exports = async function (deployer) {
  await deployer.deploy(
    DividendDistributor,
    "0x10ED43C718714eb63d5aA57B78B54704E256024E"
  );
};
