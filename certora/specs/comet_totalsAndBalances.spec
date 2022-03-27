import "comet.spec"    

/**
 * @title Certora's Comet 
 * @notice A contract that holds summarizations and simplifications of methods and components of comet 
 * @author Certora
 */




////////////////////////////////////////////////////////////////////////////////
//////////////////////////   Total Assets and Balances  ////////////////////////
////////////////////////////////////////////////////////////////////////////////


/*
    @Rule

    @Description:
        The sum of collateral per asset over all users is equal to total collateral of asset:

    @Formula : 
        sum(userCollateral[u][asset].balance) == totalsCollateral[asset].totalSupplyAsset

    
    @Link: https://vaas-stg.certora.com/output/23658/01cae74fe43232e6e6c5/?anonymousKey=9f050514a528f70e110a2a9f2dde24ffb85f39da

*/
invariant total_collateral_per_asset(address asset) 
    sumBalancePerAsset[asset] == getTotalsSupplyAsset(asset)     
    filtered { f-> !similarFunctions(f) && !f.isView }
    {
        preserved {
            simplifiedAssumptions();
        }
    }

/*
    @Rule

    @Description:
        For each asset, the contract's balance is at least as the total supply 

    @Formula: 
        totalsCollateral[asset].totalSupplyAsset <= asset.balanceOf(this)

    @Notes: 
        Safely assume that comet is not the msg.sender, this is a safe assumption since there is no call statement from Comet to itself. 
        Also assume that no address can supply from Comet, as comet does not give allowance
    @Link: https://vaas-stg.certora.com/output/23658/01cae74fe43232e6e6c5/?anonymousKey=9f050514a528f70e110a2a9f2dde24ffb85f39da
*/

invariant total_asset_collateral_vs_asset_balance(address asset) 
    asset != _baseToken => 
        (getTotalsSupplyAsset(asset)  <= tokenBalanceOf(asset, currentContract) ) 
    filtered { f-> !similarFunctions(f) && !f.isView }
    {
        preserved with (env e){
            simplifiedAssumptions();
            require e.msg.sender != currentContract;
        }
        preserved supplyFrom(address from, address dst, address asset_, uint amount) with (env e) {
            simplifiedAssumptions();
            require e.msg.sender != currentContract;
            require from != currentContract;
        }
    }

/*
    @Rule

    @Description:
        The base token balance of the system, is at least the supplied minus the borrowed

    @Formula: 
        baseToken.balanceOf(currentContract) == getTotalSupplyBase() - getTotalBorrowBase()

    @Note: This invariant does not hold on absorb.  
     Safely assume that comet is not the msg.sender, this is a safe assumption since there is no call statement from Comet to itself. 
        Also assume that no address can supply from Comet, as comet does not give allowance
    @Link: https://vaas-stg.certora.com/output/23658/01cae74fe43232e6e6c5/?anonymousKey=9f050514a528f70e110a2a9f2dde24ffb85f39da     
         
*/
invariant base_balance_vs_totals()
    _baseToken.balanceOf(currentContract) >= getTotalSupplyBase() - getTotalBorrowBase()
    filtered { f-> !similarFunctions(f) && !f.isView && f.selector!=absorb(address, address[]).selector }
    {
        preserved with (env e){
            simplifiedAssumptions();
            require e.msg.sender != currentContract;
        }
        preserved buyCollateral(address asset, uint minAmount, uint baseAmount, address recipient) with (env e) {
            simplifiedAssumptions();
            require asset != _baseToken;
            require recipient != currentContract;
        }
        preserved supplyFrom(address from, address dst, address asset, uint amount) with (env e) {
            simplifiedAssumptions();
            require e.msg.sender != currentContract;
            require from != currentContract;
        }
    }

/*
    @Rule

    @Description:
        The total supply of an asset is not greater than it's supply cap

    @Formula: 
        baseToken.balanceOf(currentContract) == getTotalSupplyBase() - getTotalBorrowBase()
`
    @Link: https://vaas-stg.certora.com/output/23658/01cae74fe43232e6e6c5/?anonymousKey=9f050514a528f70e110a2a9f2dde24ffb85f39da     
         
*/
invariant collateral_totalSupply_LE_supplyCap(address asset)
    getTotalsSupplyAsset(asset) <= getAssetSupplyCapByAddress(asset)



/*
    @Rule

    @Description:
        Summary of principle balances equals the totalS
    @Formula: 
        sum(userBasic[u].principal) == totalsBasic.totalSupplyBase - totalsBasic.totalBorrowBase
status:

*/
invariant totalBaseToken() 
	sumUserBasicPrinciple == to_mathint(getTotalSupplyBase()) - to_mathint(getTotalBorrowBase()) filtered { f-> !similarFunctions(f) && !f.isView }
{
    preserved {
        simplifiedAssumptions();
    }
}


/*
    @Rule

    @Description:
        User principal balance may decrease only by a call from them or from a permissioned manager

    @Formula:
        {
             userBasic[user].principal = x
        }
        < op >
        {
            userBasic[user].principal = y
            y < x => user = msg.sender || hasPermission[user][msg.sender] == true; 
        }

    @Notes:
        
    @Link:
        https://vaas-stg.certora.com/output/67509/8b70e8c3633a54cfc7ba?anonymousKey=d2c319cb2734c3978e15fa3833f55b19c48f8fda
*/

rule balance_change_by_allowed_only(method f, address user)
filtered { f-> !similarFunctions(f) && !f.isView }
{
    env e;
    calldataarg args;
    address asset;
    require asset != _baseToken;
    require user != currentContract;
    simplifiedAssumptions();

    int104 balanceBefore = getUserPrincipal(user);
    uint128 colBalanceBefore = getUserCollateralBalance(user, asset);

    f(e, args);

    int104 balanceAfter = getUserPrincipal(user);
    uint128 colBalanceAfter = getUserCollateralBalance(user, asset);
    bool permission = call_hasPermission(user, e.msg.sender);

    assert balanceAfter < balanceBefore => 
        ((e.msg.sender == user) || permission);
    assert colBalanceAfter < colBalanceBefore =>  (e.msg.sender == user || permission || f.selector == absorb(address,address[]).selector) ;
}


/*
    @Rule

    @Description:
        Any operation on a collateralized account leaves the account collateralized

    @Formula:
        {
             isBorrowCollateralized(e, user)
        }
        < op >
        {
            isBorrowCollateralized(e, user)
        }

    @Notes:
        
*/

rule collateralized_after_operation(address user, address asset, method f) filtered {f -> !similarFunctions(f) && !f.isView && !f.isFallback} {
    env e;
    simplifiedAssumptions();
    require(getAssetOffsetByAsset(e,asset) == 0);
    require(isBorrowCollateralized(e, user));
    call_functions_with_specific_asset(f, e, asset);
    assert isBorrowCollateralized(e, user);
}