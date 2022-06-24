// XXX import CometInterface

contract Liquidator {
    /** Custom errors **/

    /** Constants **/
    address public immutable comet;

    constructor(address cometAddress, address _absorber) {
        comet = CometInterface(cometAddress);
        absorber = _absorber;
    }

    // routesForCollateralAsset = collateral->ETH->base or collateral->base
    // in the task, search the paths and pick the most optimal; simulate these

    // path = []
    // paths[]

    function liquidate(address[] calldata accounts, collateralAssetsToBuy[], routesForCollateralAssets[route[]]) public {
        // Absorb the underwater addresses
        comet.absorb(liquidator, accounts);

        // confirm that collateralAssetsToBuy and routesFor... are the same length

        loanAmount = 0;
        buyCalls = [];

        // Loop through all collateral assets; for each asset:
        uint8 numAssets = comet.numAssets();
        for (uint8 i = 0; i < numAssets; i++) {
            // get protocol’s balance of collateral asset

            // Calculate the price that the protocol will charge to
            // buy all the collateral asset balance
            // (mimicking the logic of quoteCollateral)

            // get the asset's amount of collateral for that asset
            // collateralBalanceOf(assets[i].asset, cometAddres)

            // get the reverse price ->
            // 1 / quotecollateral(assetaddress, 1 base or something) = base units per unit of collateral

            // quoteCollateral(address asset, uint baseAmount) override public view returns (uint)

            // loanAmount += amount

            // buyCalls.push([]) // uniswap buy cal format (minAmount, pairAddress, route,...)

            // buy (collateral balance * the per unit of collateral price)
        }

        // take out the flash loan for loanAmount
        profit = 0;

        for (uint8 i = 0; i < buyCalls.length; i++) {
            // buyCollateral(asset, collateralBalance, baseUnitsPerCollateralUnit * collateralBalance, msg.sender)

            // buyCollateral(address asset, uint minAmount, uint baseAmount, address recipient) override external {

            // sell it (pass route for this asset to uniswap)
        }

        // figure out how much debt to repay on the flash loan
        // repay it

        // Revert if this wasn't profitable
        // balanceOf(this) - amount borrowed

        // transfer out at the end (so you don't accidentally spend it in the future)
    }
}