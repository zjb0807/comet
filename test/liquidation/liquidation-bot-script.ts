import { expect  } from '../helpers';
import { liquidateUnderwaterBorrowers } from "../../scripts/liquidation_bot/run-liquidation-bot";
import makeLiquidatableProtocol, { forkMainnet, resetHardhatNetwork } from './makeLiquidatableProtocol';

describe('Liquidation Bot', function () {
  before(forkMainnet);
  after(resetHardhatNetwork);

  it('sets up the test', async function () {
    const { comet, liquidator, users: [signer, underwater] } = await makeLiquidatableProtocol();
    expect(await comet.isLiquidatable(underwater.address)).to.be.true;
  });

  describe('liquidateUnderwaterBorrowers', function () {
    it('liquidates underwater borrowers', async function () {
      const { comet, liquidator, users: [signer, underwater] } = await makeLiquidatableProtocol();
      expect(await comet.isLiquidatable(underwater.address)).to.be.true;

      await liquidateUnderwaterBorrowers(
        comet,
        liquidator,
        signer
      );

      expect(await comet.isLiquidatable(underwater.address)).to.be.false;
    });
  });
});